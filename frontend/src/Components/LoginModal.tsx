import React, { MutableRefObject, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  User,
} from 'firebase/auth';
import { useForm, SubmitHandler } from 'react-hook-form';
import { FirebaseError } from '@firebase/util';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../enviroments/firebase';
import Toast, { ToastMessage } from './Toast';

interface LoginModalRef {
  loginModalRef: MutableRefObject<HTMLDialogElement | null>
  signUpModalRef: MutableRefObject<HTMLDialogElement | null>
  toast: ToastMessage;
  setToastMessage: (message: string, type: 'success' | 'error') => void;
}

interface FormData {
  email: string;
  password: string;
}

function LoginModal({
  loginModalRef, signUpModalRef, setToastMessage,
}: LoginModalRef) {
  const [errorToast, setErrorToast] = useState<ToastMessage>({ message: '', type: 'success' });
  const setErrorToastMessage = (message: string, type: 'success' | 'error') => {
    setErrorToast({ message, type });
  };

  const {
    register, handleSubmit, formState: { errors, isValid, isSubmitting }, reset,
  } = useForm<FormData>({
    mode: 'onChange',
  });

  const createUserCollection = async (user: User) => {
    const docRef = doc(db, 'user', user.uid);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      await setDoc(doc(db, 'user', user.uid), {
        email: user.email,
      });
    }
  };

  const openSignUpModal = () => {
    if (loginModalRef.current) {
      loginModalRef.current.close();
    }
    if (signUpModalRef.current) {
      signUpModalRef.current.showModal();
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      await createUserCollection(auth.currentUser as User);
      setToastMessage('Logged in with Google', 'success');
      loginModalRef.current?.close();
    } catch (e: unknown) {
      if (e instanceof FirebaseError) {
        if (e.code === 'auth/account-exists-with-different-credential') {
          setErrorToastMessage('Email already exists', 'error');
        } else {
          loginModalRef.current?.close();
          setErrorToastMessage('Google login failed', 'error');
        }
      } else {
        loginModalRef.current?.close();
        setErrorToastMessage('Google login failed', 'error');
      }
    }
  };

  const signInWithGithub = async () => {
    try {
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
      await createUserCollection(auth.currentUser as User);
      loginModalRef.current?.close();
      setToastMessage('Logged in with Github', 'success');
    } catch (e: unknown) {
      if (e instanceof FirebaseError) {
        if (e.code === 'auth/account-exists-with-different-credential') {
          setErrorToastMessage('Email already exists', 'error');
        } else {
          loginModalRef.current?.close();
          setErrorToastMessage('Github login failed', 'error');
        }
      } else {
        loginModalRef.current?.close();
        setErrorToastMessage('Github login failed', 'error');
      }
    }
  };

  const loginEmailPassword: SubmitHandler<FormData> = async (data) => {
    if (isValid) {
      try {
        await signInWithEmailAndPassword(auth, data.email, data.password);
        await createUserCollection(auth.currentUser as User);
        setToastMessage('Logged in with Email', 'success');
        loginModalRef.current?.close();
        reset();
      } catch (e) {
        if (e instanceof FirebaseError) {
          switch (e.code) {
            case 'auth/invalid-email':
              setErrorToastMessage('Invalid email address', 'error');
              break;
            case 'auth/wrong-password':
              setErrorToastMessage('Wrong password', 'error');
              break;
            case 'auth/user-not-found':
              setErrorToastMessage('Email not found', 'error');
              break;
            default:
              break;
          }
        }
      }
    }
  };

  return (
    <div>
      <dialog ref={loginModalRef} className="modal modal-bottom sm:modal-middle">
        {errorToast.message && (
          <Toast
            message={errorToast.message}
            type={errorToast.type}
            onClose={() => setErrorToast({ message: '', type: 'success' })}
          />
        )}
        <form onSubmit={handleSubmit(loginEmailPassword)} className="modal-box grid md:grid-cols-[1fr_1.5fr] p-0 md:w-11/12 sm:max-w-4xl bg-white md:bg-gradient-to-br md:from-primary md:to-secondary md:to-60%">
          <div className="relative hidden md:flex flex-col px-14 py-24">
            <div className="text-4xl font-black text-white font-varela cursor-default">
              Welcome back!
              <br />
              Let&apos;s continue.
            </div>
            <img className="absolute top-6 left-6" src="/logos/logo.svg" alt="logo" />
          </div>
          <div className="relative bg-white dark:bg-neutral-900 flex flex-col items-center justify-center rounded-none md:rounded-l-2xl p-6 sm:py-10 px-6 sm:px-20 gap-4 form-control">
            <button
              className="btn btn-circle btn-ghost absolute top-4 right-4 dark:text-neutral-100"
              type="button"
              onClick={() => loginModalRef.current?.close()}
            >
              <FontAwesomeIcon icon={faXmark} size="lg" />
            </button>
            <div className="text-3xl sm:text-4xl text-primary font-black font-varela cursor-default">
              Login
            </div>
            <button className="dark:border-neutral-700 dark:hover:bg-neutral-700 dark:text-neutral-200 font-varela btn btn-ghost w-full normal-case text-neutral-600 border-neutral-300" type="button" onClick={signInWithGoogle}>
              <img
                alt="google icon"
                src="/logos/google.svg"
                className="h-3/4"
              />
              Login with Google
            </button>
            <button className="dark:border-neutral-700 dark:hover:bg-neutral-700 dark:text-neutral-200 font-varela btn btn-ghost w-full normal-case text-neutral-600 border-neutral-300" type="button" onClick={signInWithGithub}>
              <img
                className="h-3/4"
                alt="github icon"
                src="/logos/github.svg"
              />
              Login with Github
            </button>
            <div className="font-varela divider text-neutral-400 before:bg-neutral-200 after:bg-neutral-200 cursor-default">OR</div>
            <div className="w-full">
              {/* eslint-disable react/jsx-props-no-spreading */}
              <input
                id="login-email"
                type="email"
                placeholder="Enter your email"
                className={`dark:bg-neutral-800 dark:text-neutral-200 dark:focus:text-white font-varela input bg-neutral-200 w-full text-neutral-500 focus:text-neutral-600 ${errors.email && 'input-error'
                }`}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
              />
              {errors.email && (
                // eslint-disable-next-line jsx-a11y/label-has-associated-control
                <label className="label">
                  <div className="text-error font-varela label-text-alt">{errors.email.message}</div>
                </label>
              )}
            </div>
            <div className="w-full">
              <input
                id="login-password"
                type="password"
                placeholder="Enter your password"
                className={`dark:bg-neutral-800 dark:text-neutral-200 dark:focus:text-white font-varela input bg-neutral-200 w-full text-neutral-500 focus:text-neutral-600 ${(errors.password) && 'input-error'}`}
                {...register('password', {
                  required: true,
                  minLength: 6,
                })}
              />
              {errors.password && (
                // eslint-disable-next-line jsx-a11y/label-has-associated-control
                <label className="label">
                  <div className="text-error font-varela label-text-alt">
                    {errors.password.type === 'required' ? 'Password is required' : 'Password must be at least 6 characters long'}
                  </div>
                </label>
              )}
            </div>
            <button
              type="submit"
              className={`dark:disabled:bg-neutral-800 border-none relative font-varela normal-case btn w-full text-white text-lg ${(!isValid)
                ? 'cursor-not-allowed'
                : 'bg-gradient-to-r from-primary to-secondary'
              }`}
              disabled={!isValid || isSubmitting}
            >
              {
                !isSubmitting ? (
                  <>
                    <div className={`border-none opacity-0 hover:opacity-100 transition duration-500 absolute inset-0 h-full w-full rounded-lg flex justify-center items-center ${isSubmitting ? 'cursor-default' : 'bg-gradient-to-l from-primary to-secondary'}`}>
                      Login
                    </div>
                    <div className={`font-varela cursor-default ${(!isValid)
                      ? 'dark:text-neutral-500'
                      : 'text-white dark:text-neutral-100'}`}
                    >
                      Login
                    </div>
                  </>
                ) : (
                  <span className="loading loading-spinner text-white loading-md" />
                )
              }

            </button>

            <div className="dark:text-neutral-200 text-neutral-500 font-varela cursor-default">
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              Don't have an account?
              {' '}
              <button type="button" className="relative font-varela cursor-pointer text-primary" onClick={openSignUpModal}>Sign up</button>
            </div>
          </div>
        </form>
        <form method="dialog" className="modal-backdrop">
          <button
            type="button"
            onClick={() => loginModalRef.current?.close()}
          >
            close
          </button>
        </form>
      </dialog>
    </div>
  );
}

export default LoginModal;
