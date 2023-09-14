import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { MutableRefObject, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from 'firebase/auth';
import { useForm, SubmitHandler } from 'react-hook-form';
import { auth } from '../enviroments/firebase';
import Toast, { ToastMessage } from './Toast';

interface SignUpModalProps {
  signUpModalRef: MutableRefObject<HTMLDialogElement | null>;
  loginModalRef: MutableRefObject<HTMLDialogElement | null>;
}

interface FormData {
  email: string;
  password: string;
}

function SignUpModal({ signUpModalRef, loginModalRef }: SignUpModalProps) {
  const [toast, setToast] = useState<ToastMessage>({ message: '', type: 'success' });
  const setToastMessage = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  const {
    register, handleSubmit, formState: { errors, isValid }, reset,
  } = useForm<FormData>({
    mode: 'onChange',
  });

  const closeModal = () => {
    if (signUpModalRef.current) {
      signUpModalRef.current.close();
    }
  };

  const openLoginModal = () => {
    if (signUpModalRef.current) {
      signUpModalRef.current.close();
    }
    if (loginModalRef.current) {
      loginModalRef.current.showModal();
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setToastMessage('Account created with Google', 'success');
      signUpModalRef.current?.close();
    } catch (e: any) {
      setToastMessage('Google sign up failed', 'error');
      signUpModalRef.current?.close();
    }
  };

  const signInWithGithub = async () => {
    try {
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
      setToastMessage('Account created with Github', 'success');
      signUpModalRef.current?.close();
    } catch (e: any) {
      setToastMessage('Github sign up failed', 'error');
      signUpModalRef.current?.close();
    }
  };

  const [emailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInputClicked, setIsInputClicked] = useState(false);

  const handleInputClick = () => {
    setIsInputClicked(true);
  };

  const createAccount: SubmitHandler<FormData> = async (data) => {
    setIsSubmitting(true);

    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password);
      setToastMessage('Account created with Google', 'success');
      signUpModalRef.current?.close();
      reset(); // Clear the form on success
    } catch (error) {
      setToastMessage('Email sign up failed', 'error');
    }
    setIsSubmitting(false);
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
      <dialog ref={signUpModalRef} className="modal modal-bottom sm:modal-middle">
        <form onSubmit={handleSubmit(createAccount)} className="modal-box grid md:grid-cols-[1fr_1.5fr] p-0 w-full  md:w-11/12 sm:max-w-5xl bg-white md:bg-gradient-to-br md:from-green-400 md:to-cyan-500 md:to-60%">
          <div className="relative hidden md:flex flex-col px-14 py-24">
            <div className="text-4xl font-black text-white font-varela cursor-default">
              Unlock more features with an account!
              <br />
              <br />
              Get started today.
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
              Create Account
            </div>
            <button className="font-varela normal-case btn btn-ghost w-full text-neutral-600 border-neutral-300" type="button" onClick={signInWithGoogle}>
              <img
                alt="google icon"
                src="/logos/google.svg"
                className="h-3/4"
              />
              Sign Up with Google
            </button>
            <button className="font-varela normal-case btn btn-ghost w-full text-neutral-600 border-neutral-300" type="button" onClick={signInWithGithub}>
              <img
                className="h-3/4"
                alt="github icon"
                src="/logos/github.svg"
              />
              Sign Up with Github
            </button>
            <div className="font-varela divider text-neutral-400 before:bg-neutral-200 after:bg-neutral-200 cursor-default">OR</div>
            <div className="w-full">
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                className={`font-varela input w-full bg-neutral-200 text-neutral-500 focus:text-neutral-600 ${
                  (errors.email || emailError) ? 'border-red-500' : ''
                }`}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                onClick={handleInputClick}
              />
              {errors.email && (
                <div className="text-red-500 font-varela text-sm">{errors.email.message}</div>
              )}
              {emailError && (
                <div className="text-red-500 font-varela text-sm">{emailError}</div>
              )}
            </div>
            <div className="w-full">
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                className={`font-varela input w-full bg-neutral-200 text-neutral-500 focus:text-neutral-600 ${errors.password ? 'border-red-500' : ''}`}
                {...register('password', {
                  required: true,
                  minLength: 6,
                })}
                onClick={handleInputClick}
              />
              {errors.password && (
                <div className="text-red-500 font-varela text-sm">
                  {errors.password.type === 'required' ? 'Password is required' : 'Password must be at least 6 characters long'}
                </div>
              )}
            </div>
            <button
              type="submit"
              className={`relative font-varela normal-case btn w-full text-white text-lg ${isSubmitting || (isInputClicked && !isValid) ? 'cursor-not-allowed' : 'bg-gradient-to-r from-primary to-secondary'}`}
              disabled={isSubmitting || (isInputClicked && !isValid)}
            >
              <div className={`opacity-0 hover:opacity-100 transition duration-500 absolute inset-0 h-full w-full rounded-md flex justify-center items-center ${isSubmitting ? 'cursor-default' : 'bg-gradient-to-l from-primary to-secondary'}`}>
                Create Account
              </div>
              Create Account
            </button>
            <div className="text-neutral-500 font-varela cursor-default">
              Already have an account?
              {' '}
              <button type="button" className="relative font-varela cursor-pointer text-green-500" onClick={openLoginModal}>Log In</button>
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

export default SignUpModal;
