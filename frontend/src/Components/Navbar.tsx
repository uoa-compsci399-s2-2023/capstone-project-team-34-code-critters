import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome, faMagnifyingGlass, faUserAlt, faRightToBracket, faBars,
} from '@fortawesome/free-solid-svg-icons';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../enviroments/firebase';
import 'firebase/auth';

interface NavbarProps {
  loginModalRef: React.MutableRefObject<HTMLDialogElement | null>;
  signUpModalRef: React.MutableRefObject<HTMLDialogElement | null>;
  setToastMessage: (message: string, type: 'success' | 'error') => void;
}

function Navbar({ loginModalRef, signUpModalRef, setToastMessage }: NavbarProps) {
  const [user] = useAuthState(auth);
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

  const navbarEnabled = process.env.REACT_APP_DISABLE_NAVBAR !== 'true';
  let loginEnabled;

  const userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.indexOf('client_app') > -1) {
    loginEnabled = false;
  } else {
    loginEnabled = true;
  }

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setToastMessage('Logged out successfully', 'success');
    } catch (error) {
      setToastMessage('Failed to log out', 'error');
    }
  };

  if (navbarEnabled) {
    if (loginEnabled) {
      return (
        <div className="navbar z-10 rounded-xl w-11/12 fixed left-1/2 -translate-x-1/2 top-4 shadow backdrop-blur-sm max-w-4xl">
          <div className="flex-1 flex gap-2">
            <div className="cursor-pointer" onClick={() => navigate('/')}>
              <img src="/logos/logoV2.svg" alt="logo" />
            </div>
            <div className="cursor-pointer" onClick={() => navigate('/')}>
              <h1 className="font-varela text-2xl font-bold">
                Code
                <span className="bg-clip-text from-primary to-secondary bg-gradient-to-r text-transparent">Critters</span>
              </h1>
            </div>
          </div>
          <div className="flex md:hidden">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="drawer" aria-label="open sidebar" className="btn btn-square btn-ghost">
              <FontAwesomeIcon icon={faBars} size="2x" />
            </label>
          </div>
          <div className="md:flex gap-2 hidden">
            <button
              className="font-varela btn hover:bg-transparent btn-ghost transition-all border-none relative before:content-[''] before:absolute before:left-0 before:top-0 before:w-0 before:h-full before:bg-gradient-to-br before:from-primary before:to-secondary hover:before:w-full before:-z-10 before:transition-all before:duration-300 duration-300 before:rounded-lg hover:text-white"
              type="button"
              onClick={() => navigate('/')}
            >
              Home
              <FontAwesomeIcon icon={faHome} className="-mt-[0.2rem]" />

            </button>
            <button
              className="font-varela btn hover:bg-transparent btn-ghost transition-all border-none relative before:content-[''] before:absolute before:left-0 before:top-0 before:w-0 before:h-full before:bg-gradient-to-br before:from-primary before:to-secondary hover:before:w-full before:-z-10 before:transition-all before:duration-300 duration-300 before:rounded-lg hover:text-white"
              type="button"
              onClick={() => navigate('/upload')}
            >
              Detect
              <FontAwesomeIcon icon={faMagnifyingGlass} />

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
                <div className="pt-4 dropdown-content text-primary z-10 menu">
                  <ul className="rounded-lg shadow p-2 bg-white">
                    <li>
                      <div
                        className="text-black font-varela whitespace-nowrap"
                        onClick={() => {
                          navigate('/history');
                        }}
                      >
                        User History
                      </div>
                    </li>
                    <li>
                      <div onClick={handleLogout} className="text-black font-varela whitespace-nowrap">
                        Log Out
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={openLoginModal}
                  className="font-varela btn hover:bg-transparent btn-ghost transition-all border-none relative before:content-[''] before:absolute before:left-0 before:top-0 before:w-0 before:h-full before:bg-gradient-to-br before:from-primary before:to-secondary hover:before:w-full before:-z-10 before:transition-all before:duration-300 duration-300 before:rounded-lg hover:text-white"
                  type="button"
                >
                  Login
                  <FontAwesomeIcon icon={faRightToBracket} />

                </button>
                <button
                  type="submit"
                  className="font-varela relative border-none btn text-white bg-gradient-to-tl from-primary to-secondary"
                  onClick={openSignUpModal}
                >
                  <div className="font-varela opacity-0 hover:opacity-100 transition duration-500 absolute inset-0 h-full rounded-lg flex justify-center items-center bg-gradient-to-br from-primary to-secondary">
                    Sign Up
                    <FontAwesomeIcon icon={faUserAlt} className="pl-2" />
                  </div>
                  Sign Up
                  <FontAwesomeIcon icon={faUserAlt} />
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }
    return (
      <div className="navbar z-10 rounded-xl w-11/12 fixed left-1/2 -translate-x-1/2 top-4 shadow backdrop-blur-sm max-w-4xl">
        <div className="flex-1 flex gap-2">
          <div className="cursor-pointer" onClick={() => navigate('/')}>
            <img src="/logos/logoV2.svg" alt="logo" />
          </div>
          <div className="cursor-pointer" onClick={() => navigate('/')}>
            <h1 className="font-varela text-2xl font-bold">
              Code
              <span className="bg-clip-text from-primary to-secondary bg-gradient-to-r text-transparent">Critters</span>
            </h1>
          </div>
        </div>
        <div className="flex md:hidden">
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label htmlFor="drawer" aria-label="open sidebar" className="btn btn-square btn-ghost">
            <FontAwesomeIcon icon={faBars} size="2x" />
          </label>
        </div>
        <div className="md:flex gap-2 hidden">
          <button
            className="font-varela btn hover:bg-transparent btn-ghost transition-all border-none relative before:content-[''] before:absolute before:left-0 before:top-0 before:w-0 before:h-full before:bg-gradient-to-br before:from-primary before:to-secondary hover:before:w-full before:-z-10 before:transition-all before:duration-300 duration-300 before:rounded-lg hover:text-white"
            type="button"
            onClick={() => navigate('/')}
          >
            Home
            <FontAwesomeIcon icon={faHome} className="-mt-[0.2rem]" />
          </button>
          <button
            className="font-varela btn hover:bg-transparent btn-ghost transition-all border-none relative before:content-[''] before:absolute before:left-0 before:top-0 before:w-0 before:h-full before:bg-gradient-to-br before:from-primary before:to-secondary hover:before:w-full before:-z-10 before:transition-all before:duration-300 duration-300 before:rounded-lg hover:text-white"
            type="button"
            onClick={() => navigate('/upload')}
          >
            Detect
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </div>
      </div>
    );
  }
  return null;
}

export default Navbar;
