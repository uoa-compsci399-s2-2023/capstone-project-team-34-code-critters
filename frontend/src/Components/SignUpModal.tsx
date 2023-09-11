import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { MutableRefObject, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from 'firebase/auth';
import { auth } from '../enviroments/firebase';
import Toast, { ToastMessage } from './Toast';

interface SignUpModalProps {
  signUpModalRef: MutableRefObject<HTMLDialogElement | null>
  loginModalRef: MutableRefObject<HTMLDialogElement | null>
}

function SignUpModal({ signUpModalRef, loginModalRef }: SignUpModalProps) {
  const [toast, setToast] = useState<ToastMessage>({ message: '', type: 'success' });
  const setToastMessage = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };
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

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createAccount = async () => {
    const emailInput = document.getElementById('email') as HTMLInputElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;

    const inputemail = emailInput.value;
    const inputpassword = passwordInput.value;

    setIsSubmitting(true);

    try {
      await createUserWithEmailAndPassword(auth, inputemail, inputpassword);
      setToastMessage('Account created with Google', 'success');
      signUpModalRef.current?.close();
      setIsSubmitting(false);
    } catch (error) {
      const errorCode = (error as { code: string }).code;
      setIsSubmitting(false);

      if (inputemail.trim() === '' && inputpassword.trim() === '') {
        setEmailError('Please enter an Email');
        setPasswordError('Please enter a Password');
      } else if (inputemail.trim() === '') {
        setEmailError('Please enter an Email');
      } else if (inputpassword.trim() === '') {
        setPasswordError('Please enter a Password');
      } else {
        switch (errorCode) {
          case 'auth/email-already-in-use':
            setEmailError('Email already in use.');
            break;
          case 'auth/invalid-email':
            setEmailError('Invalid email address.');
            break;
          case 'auth/weak-password':
            setPasswordError('Password must be at least 6 characters long.');
            break;
          default:
            break;
        }
        setToastMessage('Email sign up failed', 'error');
      }
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError('');
    setIsSubmitting(false);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordError('');
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
        <form method="dialog" className="modal-box grid md:grid-cols-[1fr_1.5fr] p-0 w-full  md:w-11/12 sm:max-w-5xl bg-white md:bg-gradient-to-br md:from-green-400 md:to-cyan-500 md:to-60%">
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
                className={`font-varela input w-full bg-neutral-200 text-neutral-500 focus:text-neutral-600 ${emailError ? 'border-red-500' : ''}`}
                value={email}
                onChange={handleEmailChange}
              />
              {emailError && (
                <div className="text-red-500 font-varela text-sm">{emailError}</div>
              )}
            </div>
            <div className="w-full">
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                className={`font-varela input w-full bg-neutral-200 text-neutral-500 focus:text-neutral-600 ${passwordError ? 'border-red-500' : ''}`}
                value={password}
                onChange={handlePasswordChange}
              />
              {passwordError && (
                <div className="text-red-500 font-varela text-sm">{passwordError}</div>
              )}
            </div>
            <button
              className={`relative font-varela normal-case btn w-full text-white text-lg ${(emailError || passwordError || isSubmitting) ? 'cursor-not-allowed' : 'bg-gradient-to-r from-primary to-secondary'}`}
              type="button"
              onClick={createAccount}
              disabled={emailError || passwordError || isSubmitting ? true : undefined}
            >
              <div className={`opacity-0 hover:opacity-100 transition duration-500 absolute inset-0 h-full w-full rounded-md flex justify-center items-center ${(emailError || passwordError || isSubmitting) ? 'cursor-default' : 'bg-gradient-to-l from-primary to-secondary'}`}>
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
