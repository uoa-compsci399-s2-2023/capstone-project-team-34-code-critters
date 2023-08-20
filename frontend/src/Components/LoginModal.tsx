import React, { MutableRefObject } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

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

  return (
    <dialog ref={loginModalRef} className="modal modal-bottom sm:modal-middle">
      <form method="dialog" className="modal-box grid md:grid-cols-[1fr_1.5fr] p-0 w-full  md:w-11/12 sm:max-w-5xl bg-white md:bg-gradient-to-br md:from-primary md:to-secondary md:to-70%">
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
          <div className="text-4xl font-black text-primary font-varela cursor-default">
            Login
          </div>
          <button className="font-varela btn btn-ghost normal-case w-full text-neutral-600 border-neutral-300" type="button">
            <img
              alt="google icon"
              src="/logos/google.svg"
              className="h-3/4"
            />
            Login with Google
          </button>
          <button className="font-varela btn btn-ghost normal-case w-full text-neutral-600 border-neutral-300" type="button">
            <img
              className="h-3/4"
              alt="facebook icon"
              src="/logos/facebook.svg"
            />
            Login with Facebook
          </button>
          <button className="font-varela btn btn-ghost normal-case w-full text-neutral-600 border-neutral-300" type="button">
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
            <input type="text" placeholder="Enter your email" className="font-varela input w-full bg-neutral-200  text-neutral-500 focus:text-neutral-600" />
          </div>
          <div className="w-full">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <input type="text" placeholder="Enter your pasword" className="font-varela input w-full bg-neutral-200  text-neutral-500 focus:text-neutral-600" />
          </div>
          <button className="relative font-varela btn normal-case w-full text-white text-lg bg-gradient-to-r from-primary to-secondary" type="button">
            <div className="opacity-0 hover:opacity-100 transition duration-500 absolute inset-0 h-full w-full bg-gradient-to-l from-primary to-secondary rounded-md flex justify-center items-center">Login</div>
            Login
          </button>
          <div className="text-neutral-500 font-varela cursor-default">
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            Don't have an account?
            {' '}
            <button type="button" className="relative font-varela cursor-pointer text-primary" onClick={openSignUpModal}>Sign up</button>
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
