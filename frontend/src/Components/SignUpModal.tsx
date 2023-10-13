import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { MutableRefObject, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider, User,
} from 'firebase/auth';
import { useForm, SubmitHandler } from 'react-hook-form';
import { FirebaseError } from '@firebase/util';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../enviroments/firebase';
import Toast, { ToastMessage } from './Toast';

interface SignUpModalProps {
  signUpModalRef: MutableRefObject<HTMLDialogElement | null>;
  loginModalRef: MutableRefObject<HTMLDialogElement | null>;
  toast: ToastMessage;
  setToastMessage: (message: string, type: 'success' | 'error') => void;
}

interface FormData {
  email: string;
  password: string;
}

function SignUpModal({
  signUpModalRef, loginModalRef, setToastMessage,
}: SignUpModalProps) {
  const [errorToast, setErrorToast] = useState<ToastMessage>({ message: '', type: 'success' });
  const setErrorToastMessage = (message: string, type: 'success' | 'error') => {
    setErrorToast({ message, type });
  };

  const {
    register, handleSubmit, formState: { errors, isValid, isSubmitting }, reset,
  } = useForm<FormData>({
    mode: 'onChange',
  });
  const openLoginModal = () => {
    if (signUpModalRef.current) {
      signUpModalRef.current.close();
    }
    if (loginModalRef.current) {
      loginModalRef.current.showModal();
    }
  };

  const createUserCollection = async (user: User) => {
    const docRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      await setDoc(doc(db, 'user', user.uid), {
        email: user.email,
      });
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      await createUserCollection(auth.currentUser as User);
      setToastMessage('Account created with Google', 'success');
      signUpModalRef.current?.close();
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
      setToastMessage('Account created with Github', 'success');
      signUpModalRef.current?.close();
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

  const createAccount: SubmitHandler<FormData> = async (data) => {
    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password);
      await createUserCollection(auth.currentUser as User);
      setToastMessage('Account created with Google', 'success');
      reset();
      signUpModalRef.current?.close();
    } catch (e) {
      if (e instanceof FirebaseError) {
        switch (e.code) {
          case 'auth/invalid-email':
            setErrorToastMessage('Invalid email address', 'error');
            break;
          case 'auth/wrong-password':
            setErrorToastMessage('Invalid password', 'error');
            break;
          case 'auth/email-already-in-use':
            setErrorToastMessage('Email already in use', 'error');
            break;
          default:
            setErrorToastMessage('Email login failed', 'error');
            break;
        }
      }
    }
  };

  return (
    <div>
      <dialog ref={signUpModalRef} className="modal modal-bottom sm:modal-middle">
        {errorToast.message && (
          <Toast
            message={errorToast.message}
            type={errorToast.type}
            onClose={() => setErrorToast({ message: '', type: 'success' })}
          />
        )}
        <form onSubmit={handleSubmit(createAccount)} className="modal-box grid md:grid-cols-[1fr_1.5fr] p-0 w-full  md:w-11/12 sm:max-w-4xl bg-white md:bg-gradient-to-br md:from-primary md:to-secondary md:to-60%">
          <div className="relative hidden md:flex flex-col px-14 py-24">
            <div className="text-4xl font-black text-white font-varela cursor-default">
              Unlock more features with an account!
              <br />
              <br />
              Get started today.
            </div>
            <img className="absolute top-6 left-6" src="/logos/logo.svg" alt="logo" />
          </div>
          <div className="relative bg-white dark:bg-neutral-900 flex flex-col items-center justify-center rounded-l-3xl py-5 sm:py-10 px-6 sm:px-20 gap-4 form-control ">
            <button
              className="btn btn-circle btn-ghost absolute top-4 right-4"
              type="button"
              onClick={() => signUpModalRef.current?.close()}
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
            <div className="text-3xl sm:text-4xl font-black text-primary font-varela cursor-default">
              Create Account
            </div>
            <button className="font-varela dark:hover:bg-neutral-700 dark:border-neutral-700 dark:text-neutral-100 normal-case btn btn-ghost w-full text-neutral-600 border-neutral-300" type="button" onClick={signInWithGoogle}>
              <img
                alt="google icon"
                src="/logos/google.svg"
                className="h-3/4"
              />
              Sign Up with Google
            </button>
            <button className="font-varela dark:hover:bg-neutral-700 dark:border-neutral-700 dark:text-neutral-100 normal-case btn btn-ghost w-full text-neutral-600 border-neutral-300" type="button" onClick={signInWithGithub}>
              <img
                className="h-3/4"
                alt="github icon"
                src="/logos/github.svg"
              />
              Sign Up with Github
            </button>
            <div className="font-varela divider text-neutral-400 before:bg-neutral-200 after:bg-neutral-200 cursor-default">OR</div>
            <div className="w-full">
              {/* eslint-disable react/jsx-props-no-spreading */}
              <input
                id="signup-email"
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
                id="signup-password"
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
              disabled={!isValid}
            >
              <div className={`border-none opacity-0 hover:opacity-100 transition duration-500 absolute inset-0 h-full w-full rounded-lg flex justify-center items-center ${isSubmitting ? 'cursor-default' : 'bg-gradient-to-l from-primary to-secondary'}`}>
                Create Account
              </div>
              <div className={`text-neutral-500 font-varela cursor-default ${(!isValid)
                && 'dark:text-neutral-100'}`}
              >
                Create Account
              </div>

            </button>
            <div className="text-neutral-500 font-varela cursor-default">
              Already have an account?
              {' '}
              <button type="button" className="relative font-varela cursor-pointer text-primary" onClick={openLoginModal}>Log In</button>
            </div>
          </div>
        </form>
        <form method="dialog" className="modal-backdrop">

          <button type="button" onClick={() => signUpModalRef.current?.close()}>close</button>
        </form>
      </dialog>
    </div>
  );
}

export default SignUpModal;
