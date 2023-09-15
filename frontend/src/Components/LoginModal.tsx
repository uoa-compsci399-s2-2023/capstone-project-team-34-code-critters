import React, { MutableRefObject, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import {
  GithubAuthProvider, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup,
} from 'firebase/auth';
import { useForm, SubmitHandler } from 'react-hook-form';
import { FirebaseError } from '@firebase/util';
import { auth } from '../enviroments/firebase';
import Toast, { ToastMessage } from './Toast';

interface LoginModalRef {
  loginModalRef: MutableRefObject<HTMLDialogElement | null>
  signUpModalRef: MutableRefObject<HTMLDialogElement | null>
  // setUser: (user: any) => void;
}

interface FormData {
  email: string;
  password: string;
}

function LoginModal({ loginModalRef, signUpModalRef }: LoginModalRef) {
  const [toast, setToast] = useState<ToastMessage>({ message: '', type: 'success' });
  const setToastMessage = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  const {
    register, handleSubmit, formState: { errors, isValid, isSubmitting }, reset,
  } = useForm<FormData>({
    mode: 'onChange',
  });

  const closeModal = () => {
    if (loginModalRef.current) {
      loginModalRef.current.close();
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
      // const result = await signInWithPopup(auth, provider);
      // setUser(result.user);
      await signInWithPopup(auth, provider);
      setToastMessage('Logged in with Google', 'success');
    } catch (e: unknown) {
      if (e instanceof FirebaseError) {
        if (e.code === 'auth/account-exists-with-different-credential') {
          setToastMessage('Email already exists', 'error');
        } else {
          loginModalRef.current?.close();
          setToastMessage('Google login failed', 'error');
        }
      } else {
        loginModalRef.current?.close();
        setToastMessage('Google login failed', 'error');
      }
    } finally {
      closeModal();
    }
  };

  const signInWithGithub = async () => {
    try {
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
      setToastMessage('Logged in with Github', 'success');
      closeModal();
    } catch (e: unknown) {
      if (e instanceof FirebaseError) {
        if (e.code === 'auth/account-exists-with-different-credential') {
          setToastMessage('Email already exists', 'error');
        } else {
          loginModalRef.current?.close();
          setToastMessage('Github login failed', 'error');
        }
      } else {
        loginModalRef.current?.close();
        setToastMessage('Github login failed', 'error');
      }
    } finally {
      closeModal();
    }
  };

  const loginEmailPassword: SubmitHandler<FormData> = async (data) => {
    if (isValid) {
      try {
        await signInWithEmailAndPassword(auth, data.email, data.password);
        setToastMessage('Logged in with Email', 'success');
        reset();
      } catch (e) {
        if (e instanceof FirebaseError) {
          switch (e.code) {
            case 'auth/invalid-email':
              setToastMessage('Invalid email address', 'error');
              break;
            case 'auth/wrong-password':
              setToastMessage('Wrong password', 'error');
              break;
            case 'auth/user-not-found':
              setToastMessage('Email not found', 'error');
              break;
            default:
              break;
          }
        }
      } finally {
        closeModal();
      }
    }
  };

  return (
    <div>
      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: '', type: 'success' })}
        />
      )}
      <dialog ref={loginModalRef} className="modal modal-bottom sm:modal-middle">
        <form onSubmit={handleSubmit(loginEmailPassword)} className="modal-box grid md:grid-cols-[1fr_1.5fr] p-0 w-full  md:w-11/12 sm:max-w-5xl bg-white md:bg-gradient-to-br md:from-green-400 md:to-cyan-500 md:to-60%">
          <div className="relative hidden md:flex flex-col px-14 py-24">
            <div className="text-4xl font-black text-white font-varela cursor-default">
              Welcome back!
              <br />
              Let&apos;s continue.
            </div>
            <img className="absolute top-6 left-6" src="/logos/logo.svg" alt="logo" />
          </div>
          <div className="relative bg-white flex flex-col items-center justify-center rounded-l-3xl py-5 sm:py-10 px-6 sm:px-20 gap-4 form-control ">
            <button
              className="btn btn-circle btn-ghost absolute top-4 right-4"
              type="button"
              onClick={() => closeModal()}
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
            <div className="text-3xl sm:text-4xl font-black text-green-500 font-varela cursor-default">
              Login
            </div>
            <button className="font-varela btn btn-ghost w-full normal-case text-neutral-600 border-neutral-300" type="button" onClick={signInWithGoogle}>
              <img
                alt="google icon"
                src="/logos/google.svg"
                className="h-3/4"
              />
              Login with Google
            </button>
            <button className="font-varela btn btn-ghost w-full normal-case text-neutral-600 border-neutral-300" type="button" onClick={signInWithGithub}>
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
                id="email"
                type="email"
                placeholder="Enter your email"
                className={`font-varela input w-full text-neutral-500 focus:text-neutral-600 ${
                  errors.email && 'input-error'
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
                id="password"
                type="password"
                placeholder="Enter your password"
                className={`font-varela input w-full text-neutral-500 focus:text-neutral-600 ${(errors.password) && 'input-error'}`}
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
              className={`relative font-varela normal-case btn w-full text-white text-lg ${
                (!isValid)
                  ? 'cursor-not-allowed'
                  : 'bg-gradient-to-r from-primary to-secondary'
              }`}
              disabled={!isValid}
            >
              <div className={`opacity-0 hover:opacity-100 transition duration-500 absolute inset-0 h-full w-full rounded-md flex justify-center items-center ${isSubmitting ? 'cursor-default' : 'bg-gradient-to-l from-primary to-secondary'}`}>
                Login
              </div>
              Login
            </button>
            <div className="text-neutral-500 font-varela cursor-default">
              Don`&apos;`t have an account?
              {' '}
              <button type="button" className="relative font-varela cursor-pointer text-green-500" onClick={openSignUpModal}>Sign up</button>
            </div>
          </div>
        </form>
        <form method="dialog" className="modal-backdrop">
          <button type="button" onClick={() => closeModal()}>close</button>
        </form>
      </dialog>
    </div>
  );
}

export default LoginModal;
