import React, { useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

function LoginModal() {
  const modalRef = useRef<HTMLDialogElement | null>(null);

  const openModal = () => {
    if (modalRef.current) {
      modalRef.current.showModal();
    }
  };

  const closeModal = () => {
    if (modalRef.current) {
      modalRef.current.close();
    }
  };

  return (
    <div>
      {/* Button to open the modal */}
      <button className="btn btn-primary" onClick={openModal} type="button">
        Log In
      </button>
      {/* Modal content */}
      <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
        <form method="dialog" className="modal-box grid lg:grid-cols-[1fr_1.5fr] p-0 w-full  sm:w-11/12 sm:max-w-6xl bg-white lg:bg-gradient-to-br lg:from-green-400 lg:to-cyan-500 lg:to-60%">
          <div className="relative hidden lg:flex flex-col items-start justify-center px-14">
            <div className="text-3xl text-white mb-52 font-varela">
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
            <div className="text-4xl font-black text-green-500 font-varela">
              Login
            </div>
            <button className="font-varela btn btn-outline w-full text-neutral-600  border-neutral-300 hover:bg-neutral-200 hover:text-neutral-600 hover:border-neutral-300" type="button">
              <img
                alt="google icon"
                src="/logos/google.svg"
                className="h-3/4"
              />
              Login with Google
            </button>
            <button className="font-varela btn btn-outline w-full text-neutral-600  border-neutral-300 hover:bg-neutral-200 hover:text-neutral-600 hover:border-neutral-300" type="button">
              <img
                className="h-3/4"
                alt="facebook icon"
                src="/logos/facebook.svg"
              />

              Login with Facebook
            </button>
            <button className="font-varela btn btn-outline w-full text-neutral-600  border-neutral-300 hover:bg-neutral-200 hover:text-neutral-600 hover:border-neutral-300" type="button">
              <img
                className="h-3/4"
                alt="github icon"
                src="/logos/github.svg"
              />
              Login with Github
            </button>
            <div className="font-varela divider text-neutral-400 before:bg-neutral-200 after:bg-neutral-200">OR</div>
            <div className="w-full">
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <input type="text" placeholder="Enter your email" className="font-varela input input-ghost w-full bg-neutral-100  text-neutral-500 focus:text-neutral-600" />
            </div>
            <div className="w-full">
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <input type="text" placeholder="Enter your pasword" className="font-varela input input-ghost w-full bg-neutral-100  text-neutral-500 focus:text-neutral-600" />
            </div>
            <button className="font-varela btn w-full text-white text-lg bg-gradient-to-r from-green-400 to-cyan-500 mt-4" type="button">
              Login
            </button>
            <div className="text-neutral-500 font-varela">
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              Don't have an account?
              {' '}
              <button type="button" className="font-varela cursor-pointer text-green-500">Sign up</button>
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
