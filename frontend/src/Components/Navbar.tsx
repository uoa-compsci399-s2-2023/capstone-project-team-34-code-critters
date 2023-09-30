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
      <div className="navbar rounded-xl w-11/12 fixed z-10 left-1/2 -translate-x-1/2 top-4 shadow backdrop-blur-sm max-w-4xl">
        <div className="navbar-start gap-2">
          <div className="cursor-pointer" onClick={() => navigate('/')}>
            <img className="pl-3" src="/logos/logoV2.svg" alt="logo" />
          </div>
          <div className="cursor-pointer" onClick={() => navigate('/')}>
            <h1 className="font-varela text-2xl font-bold">
              Code
              <span className="bg-clip-text from-primary to-secondary bg-gradient-to-r text-transparent">Critters</span>
            </h1>
          </div>
        </div>
        <div className="navbar-center">
          {/* <h1 className="font-varela text-lg font-bold">{title}</h1> */}
        </div>
        <div className="navbar-end gap-2">
          <button
            className="font-varela btn hover:bg-transparent btn-ghost transition-all border-none relative before:content-[''] before:absolute before:left-0 before:top-0 before:w-0 before:h-full before:bg-gradient-to-br before:from-primary before:to-secondary hover:before:w-full before:-z-10 before:transition-all before:duration-300 duration-300 before:rounded-lg hover:text-white"
            type="button"
            onClick={() => navigate('/')}
          >
            Home
          </button>
          <button
            className="font-varela btn hover:bg-transparent btn-ghost transition-all border-none relative before:content-[''] before:absolute before:left-0 before:top-0 before:w-0 before:h-full before:bg-gradient-to-br before:from-primary before:to-secondary hover:before:w-full before:-z-10 before:transition-all before:duration-300 duration-300 before:rounded-lg hover:text-white"
            type="button"
            onClick={() => navigate('/upload')}
          >
            Detect
          </button>
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
                    className="text-black"
                  >
                    User History
                  </button>
                </li>
                <li>
                  <button type="button" className="text-black" onClick={handleLogout}>
                    Log Out
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={openLoginModal}
                className="font-varela btn hover:bg-transparent btn-ghost transition-all border-none relative before:content-[''] before:absolute before:left-0 before:top-0 before:w-0 before:h-full before:bg-gradient-to-br before:from-primary before:to-secondary hover:before:w-full before:-z-10 before:transition-all before:duration-300 duration-300 before:rounded-lg hover:text-white"
                type="button"
              >
                Login
              </button>
              <button
                type="submit"
                className="font-varela relative border-none btn text-white bg-gradient-to-tl from-primary to-secondary"
                onClick={openSignUpModal}
              >
                <div className="font-varela opacity-0 hover:opacity-100 transition duration-500 absolute inset-0 h-full rounded-lg flex justify-center items-center bg-gradient-to-br from-primary to-secondary">
                  Sign Up
                </div>
                Sign Up
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
