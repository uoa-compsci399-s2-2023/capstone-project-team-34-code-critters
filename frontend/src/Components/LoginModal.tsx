import React, { MutableRefObject } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { auth } from '../enviroments/firebase';
import { FacebookAuthProvider, GithubAuthProvider, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

interface LoginModalRef {
  loginModalRef: MutableRefObject<HTMLDialogElement | null>
  signUpModalRef: MutableRefObject<HTMLDialogElement | null>
}

function LoginModal({ loginModalRef, signUpModalRef }: LoginModalRef) {
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
    // Implement Google sign-in logic using Firebase
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };

  const signInWithFacebook = async () => {
    // Implement Facebook sign-in logic using Firebase
    const provider = new FacebookAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // The signed-in user info.
        const user = result.user;

        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        const credential = FacebookAuthProvider.credentialFromResult(result);
        const accessToken = credential?.accessToken;

        // IdP data available using getAdditionalUserInfo(result)
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = FacebookAuthProvider.credentialFromError(error);

        // ...
      });
  };

  const signInWithGithub = async () => {
    // Implement GitHub sign-in logic using Firebase
    const provider = new GithubAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a GitHub Access Token. You can use it to access the GitHub API.
        const credential = GithubAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;

        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GithubAuthProvider.credentialFromError(error);
        // ...
      });
  };

  const loginEmailPassword = async () => {
    const emailInput = document.getElementById('email') as HTMLInputElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;

    const email = emailInput.value;
    const password = passwordInput.value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.log(`There was an error: ${error}`);
    }
  };
  return (
    <dialog ref={loginModalRef} className="modal modal-bottom sm:modal-middle">
      <form method="dialog" className="modal-box grid md:grid-cols-[1fr_1.5fr] p-0 w-full  md:w-11/12 sm:max-w-5xl bg-white md:bg-gradient-to-br md:from-green-400 md:to-cyan-500 md:to-60%">
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
            onClick={closeModal}
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
          <div className="text-3xl sm:text-4xl font-black text-green-500 font-varela cursor-default">
            Login
          </div>
          <button className="font-varela btn btn-ghost w-full text-neutral-600 border-neutral-300" type="button" onClick={signInWithGoogle}>
            <img
              alt="google icon"
              src="/logos/google.svg"
              className="h-3/4"
            />
            Login with Google
          </button>
          <button className="font-varela btn btn-ghost w-full text-neutral-600 border-neutral-300" type="button" onClick={signInWithFacebook}>
            <img
              className="h-3/4"
              alt="facebook icon"
              src="/logos/facebook.svg"
            />
            Login with Facebook
          </button>
          <button className="font-varela btn btn-ghost w-full text-neutral-600 border-neutral-300" type="button" onClick={signInWithGithub}>
            <img
              className="h-3/4"
              alt="github icon"
              src="/logos/github.svg"
            />
            Login with Github
          </button>
          <div className="font-varela divider text-neutral-400 before:bg-neutral-200 after:bg-neutral-200 cursor-default">OR</div>
          <div className="w-full">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <input id="email" type="text" placeholder="Enter your email" className="font-varela input w-full bg-neutral-200  text-neutral-500 focus:text-neutral-600" />
          </div>
          <div className="w-full">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <input id="password" type="text" placeholder="Enter your password" className="font-varela input w-full bg-neutral-200  text-neutral-500 focus:text-neutral-600" />
          </div>
          <button className="relative font-varela btn w-full text-white text-lg bg-gradient-to-r from-green-400 to-cyan-500" type="button" onClick={loginEmailPassword}>
            <div className="opacity-0 hover:opacity-100 transition duration-500 absolute inset-0 h-full w-full bg-gradient-to-l from-green-400 to-cyan-500 rounded-md flex justify-center items-center">Login</div>
            Login
          </button>
          <div className="text-neutral-500 font-varela cursor-default">
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            Don't have an account?
            {' '}
            <button type="button" className="relative font-varela cursor-pointer text-green-500" onClick={openSignUpModal}>Sign up</button>
          </div>
        </div>
      </form>
      <form method="dialog" className="modal-backdrop">
        <button type="button" onClick={closeModal}>close</button>
      </form>
    </dialog>
  );
}

export default LoginModal;
