import React, { MutableRefObject, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import {
  GithubAuthProvider, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup,
} from 'firebase/auth';
import { useForm, SubmitHandler } from 'react-hook-form';
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
    register, handleSubmit, formState: { errors, isValid }, reset, trigger, 
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
      closeModal();
    } catch (e: any) {
      setToastMessage('Google login failed', 'error');
      loginModalRef.current?.close();
    }
  };

  const signInWithGithub = async () => {
    try {
      const provider = new GithubAuthProvider();
      // const result = await signInWithPopup(auth, provider);
      // setUser(result.user);
      await signInWithPopup(auth, provider);
      setToastMessage('Logged in with Github', 'success');
      closeModal();
    } catch (e: any) {
      setToastMessage('Github login failed', 'error');
      loginModalRef.current?.close();
    }
  };

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInputClicked, setIsInputClicked] = useState(false);

  const handleInputClick = () => {
    setIsInputClicked(true);
    trigger(['email', 'password']);
    setIsSubmitting(false);
  };

  const loginEmailPassword: SubmitHandler<FormData> = async (data) => {
    const inputemail = data.email.trim();
    const inputpassword = data.password.trim();

    let hasError = false;

    if (inputemail === '') {
      setEmailError('Please enter an Email');
      hasError = true;
      setIsSubmitting(false);
    } else {
      setEmailError('');
    }

    if (inputpassword === '') {
      setPasswordError('Please enter a Password');
      hasError = true;
      setIsSubmitting(false);
    } else {
      setPasswordError('');
    }

    if (!hasError) {
      setIsSubmitting(false);
      try {
        await signInWithEmailAndPassword(auth, data.email, data.password);
        setToastMessage('Logged in with Email', 'success');
        closeModal();
        reset();
      } catch (error) {
        const errorCode = (error as { code: string }).code;
        setIsSubmitting(true);

        switch (errorCode) {
          case 'auth/invalid-email':
            setEmailError('Invalid email address');
            break;
          case 'auth/wrong-password':
            setPasswordError('Invalid password');
            break;
          case 'auth/user-not-found':
            setEmailError('Email not found');
            break;
          default:
            break;
        }
        setToastMessage('Email log in failed', 'error');
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
                className={`font-varela input w-full bg-neutral-200 text-neutral-500 focus:text-neutral-600 ${(errors.password || passwordError) ? 'border-red-500' : ''}`}
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
              {passwordError && (
                <div className="text-red-500 font-varela text-sm">{passwordError}</div>
              )}
            </div>
            <button
              type="submit"
              className={`relative font-varela normal-case btn w-full text-white text-lg ${
                (isInputClicked && isSubmitting) || (isInputClicked && !isValid) 
                  ? 'cursor-not-allowed' 
                  : 'bg-gradient-to-r from-primary to-secondary'
              }`}
              disabled={(isInputClicked && isSubmitting) || (isInputClicked && !isValid)}
              onClick={handleInputClick}
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
