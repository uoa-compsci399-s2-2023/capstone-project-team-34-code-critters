import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { MutableRefObject } from 'react';
import {
  addDoc,
  collection,
  getFirestore,
} from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
} from 'firebase/auth';
import { auth } from '../enviroments/firebase';

interface SignUpModalProps {
  signUpModalRef: MutableRefObject<HTMLDialogElement | null>
  loginModalRef: MutableRefObject<HTMLDialogElement | null>
}

function SignUpModal({ signUpModalRef, loginModalRef }: SignUpModalProps) {
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
    // Implement Google sign-in logic using Firebase
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      const user = result.user;
      const email = user.email;
      console.log(`Signed in with email: ${email}`);
    } catch (error: any) {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      switch (errorCode) {
        case 'auth/invalid-email':
          // Handle invalid email error
          break;
        case 'auth/user-not-found':
          // Handle user not found error
          break;
        case 'auth/wrong-password':
          // Handle wrong password error
          break;
        case 'auth/email-already-in-use':
          // Handle email already in use error
          break;
        case 'auth/weak-password':
          // Handle weak password error
          break;
        default:
          // Handle other unexpected errors
          console.error(`Sign-in error: ${errorMessage}`);
          break;
      }
    }
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

  const createAccount = async () => {
    const emailInput = document.getElementById('email') as HTMLInputElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;

    const email = emailInput.value;
    const password = passwordInput.value;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;
      const db = getFirestore();
      const usersCollection = collection(db, 'users');
      await addDoc(usersCollection, { userId, email }).then(() => {
        closeModal();
      });
    } catch (error) {
      // console.log(`There was an error: ${error}`);
    }
  };

  return (
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
          <button className="font-varela normal-case btn btn-ghost w-full text-neutral-600 border-neutral-300" type="button" onClick={signInWithFacebook}>
            <img
              className="h-3/4"
              alt="facebook icon"
              src="/logos/facebook.svg"
            />
            Sign Up with Facebook
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
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <input id="username" type="text" placeholder="Enter your username" className="font-varela input w-full bg-neutral-200  text-neutral-500 focus:text-neutral-600" />
          </div>
          <div className="w-full">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <input id="email" type="text" placeholder="Enter your email" className="font-varela input w-full bg-neutral-200  text-neutral-500 focus:text-neutral-600" />
          </div>
          <div className="w-full">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <input id="password" type="text" placeholder="Enter your pasword" className="font-varela input w-full bg-neutral-200  text-neutral-500 focus:text-neutral-600" />
          </div>
          <button className="relative font-varela normal-case btn w-full text-white text-lg bg-gradient-to-r from-primary to-secondary" type="button" onClick={createAccount}>
            <div className="opacity-0 hover:opacity-100 transition duration-500 absolute inset-0 h-full w-full bg-gradient-to-l from-primary to-secondary rounded-md flex justify-center items-center">Create Account</div>
            Create Account
          </button>
          <div className="text-neutral-500 font-varela cursor-default">
            {/* eslint-disable-next-line react/no-unescaped-entities */}
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
  );
}

export default SignUpModal;
