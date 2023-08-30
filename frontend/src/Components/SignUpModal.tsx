import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { MutableRefObject } from 'react';

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
          <button className="font-varela normal-case btn btn-ghost w-full text-neutral-600 border-neutral-300" type="button">
            <img
              alt="google icon"
              src="/logos/google.svg"
              className="h-3/4"
            />
            Sign Up with Google
          </button>
          <button className="font-varela normal-case btn btn-ghost w-full text-neutral-600 border-neutral-300" type="button">
            <img
              className="h-3/4"
              alt="facebook icon"
              src="/logos/facebook.svg"
            />
            Sign Up with Facebook
          </button>
          <button className="font-varela normal-case btn btn-ghost w-full text-neutral-600 border-neutral-300" type="button">
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
            <input type="text" placeholder="Enter your username" className="font-varela input w-full bg-neutral-200  text-neutral-500 focus:text-neutral-600" />
          </div>
          <div className="w-full">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <input type="text" placeholder="Enter your email" className="font-varela input w-full bg-neutral-200  text-neutral-500 focus:text-neutral-600" />
          </div>
          <div className="w-full">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <input type="text" placeholder="Enter your pasword" className="font-varela input w-full bg-neutral-200  text-neutral-500 focus:text-neutral-600" />
          </div>
          <button className="relative font-varela normal-case btn w-full text-white text-lg bg-gradient-to-r from-green-400 to-cyan-500" type="button">
            <div className="opacity-0 hover:opacity-100 transition duration-500 absolute inset-0 h-full w-full bg-gradient-to-l from-green-400 to-cyan-500 rounded-md flex justify-center items-center">Create Account</div>
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