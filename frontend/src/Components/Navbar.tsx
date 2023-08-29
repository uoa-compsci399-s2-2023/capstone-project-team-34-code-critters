// import React, { useState } from 'react';

import React, { useRef } from 'react';
import SignUpModal from './SignUpModal';
import LoginModal from './LoginModal';

function Navbar() {
  const loginModalRef = useRef<HTMLDialogElement | null>(null);
  const signUpModalRef = useRef<HTMLDialogElement | null>(null);

  const openLoginModal = () => {
    if (loginModalRef.current) {
      loginModalRef.current.showModal();
    }
  };

  const openSignUpModal = () => {
    if (signUpModalRef.current) {
      signUpModalRef.current.showModal();
    }
  };
  const navbarEnabled = process.env.REACT_APP_DISABLE_NAVBAR !== 'true';
  if (navbarEnabled) {
    return (
      <div>
        <button onClick={openSignUpModal} className="btn btn-primary" type="button">
          Sign Up
        </button>
        <button onClick={openLoginModal} className="btn btn-primary" type="button">
          Log In
        </button>
        <SignUpModal signUpModalRef={signUpModalRef} loginModalRef={loginModalRef} />
        <LoginModal loginModalRef={loginModalRef} signUpModalRef={signUpModalRef} />
      </div>
    );
  }
  return null;
}

export default Navbar;
