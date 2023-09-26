import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../enviroments/firebase';
import 'firebase/auth';

interface NavbarProps {
  loginModalRef: React.MutableRefObject<HTMLDialogElement | null>;
  signUpModalRef: React.MutableRefObject<HTMLDialogElement | null>;
  setToastMessage: (message: string, type: 'success' | 'error') => void;
}

function Navbar({ loginModalRef, signUpModalRef, setToastMessage }: NavbarProps) {
  const [isLoginButtonHovered, setIsLoginButtonHovered] = useState(false);
  const [isSignUpButtonHovered, setIsSignUpButtonHovered] = useState(false);
  const [user, setUser] = useState(auth.currentUser);
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

  const navigate = useNavigate();

  useEffect(() => {
    auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
  }, []);

  const navbarEnabled = process.env.REACT_APP_DISABLE_NAVBAR !== 'true';

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setToastMessage('Logged out successfully', 'success');
    } catch (error) {
      setToastMessage('Failed to log out', 'error');
    }
  };

  if (navbarEnabled) {
    return (
      <div className="navbar rounded-xl w-11/12 fixed z-10 left-1/2 -translate-x-1/2 top-4 shadow bg-white backdrop-blur-sm">
        <div className="navbar-start gap-2">
          <div>
            <img className="pl-3" src="/logos/logoV2.svg" alt="logo" style={{ fill: 'green', width: '95%' }} />
          </div>
          <div>
            <h1 className="font-varela text-2xl font-bold">
              Code
              <span style={{ background: 'linear-gradient(to bottom right, #4ade80, #38bdf8)', WebkitBackgroundClip: 'text', color: 'transparent' }}>Critters</span>
            </h1>
          </div>
        </div>
        <div className="navbar-center">
          {/* <h1 className="font-varela text-lg font-bold">{title}</h1> */}
        </div>
        <div className="navbar-end gap-2">
          <div className="space-x-2">
            <button
              className="btn btn-ghost navbar-button hover:text-black hover:border-none"
              type="button"
              onClick={() => navigate('/')}
            >
              Home
            </button>
            <button
              className="btn btn-ghost navbar-button  hover:text-black hover:border-none"
              type="button"
              onClick={() => navigate('/upload')}
            >
              Detect
            </button>
          </div>
          {user ? (
            <div className="dropdown dropdown-hover dropdown-bottom dropdown-end">
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label className="btn btn-ghost">
                {user.photoURL ? (
                  <img className="w-10 rounded-full" src={user.photoURL} alt="User avatar" />
                ) : (
                  <div className="bg-neutral-focus text-neutral-content w-10 aspect-square rounded-full flex justify-center items-center">
                    <span>{user.email ? user.email.charAt(0).toUpperCase() : 'A'}</span>
                  </div>
                )}
              </label>
              <ul className="dropdown-content text-primary z-10 menu p-2 bg-base-100 rounded-lg shadow">
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      // Handle user history
                    }}
                  >
                    User History
                  </button>
                </li>
                <li>
                  <button type="button" onClick={handleLogout}>
                    Log Out
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="space-x-2">
              <button
                onMouseEnter={() => setIsLoginButtonHovered(!isLoginButtonHovered)}
                onMouseLeave={() => setIsLoginButtonHovered(!isLoginButtonHovered)}
                onClick={openLoginModal}
                className="btn btn-ghost navbar-button  hover:text-black hover:border-none"
                type="button"
              >
                Login
              </button>
              <button
                onMouseEnter={() => setIsSignUpButtonHovered(!isSignUpButtonHovered)}
                onMouseLeave={() => setIsSignUpButtonHovered(!isSignUpButtonHovered)}
                onClick={openSignUpModal}
                className="btn btn-ghost bg-primary text-white hover:text-black"
                type="button"
              >
                Sign up
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
}

export default Navbar;
