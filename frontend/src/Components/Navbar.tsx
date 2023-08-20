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
  return (
    <div>
      <button onClick={openSignUpModal} className="btn btn-primary" type="button">
        Sign Up
      </button>
      <button onClick={openLoginModal} className="btn btn-primary" type="button">
        Log In
      </button>

      <SignUpModal signUpModalRef={signUpModalRef} />
      <LoginModal loginModalRef={loginModalRef} />
    </div>
  );
}

export default Navbar;
