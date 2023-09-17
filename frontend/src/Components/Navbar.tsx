import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDoorClosed,
  faDoorOpen,
  faBurger,
} from '@fortawesome/free-solid-svg-icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../enviroments/firebase';
import 'firebase/auth';

interface NavbarProps {
  loginModalRef: React.MutableRefObject<HTMLDialogElement | null>;
  setToastMessage: (message: string, type: 'success' | 'error') => void;
}

function Navbar({ loginModalRef, setToastMessage }: NavbarProps) {
  const [isLoginButtonHovered, setIsLoginButtonHovered] = useState(false);
  const [title, setTitle] = useState('Home');
  const openLoginModal = () => {
    if (loginModalRef.current) {
      loginModalRef.current.showModal();
    }
  };

  const location = useLocation();
  const navigate = useNavigate();

  const [user] = useAuthState(auth);

  useEffect(() => {
    switch (location.pathname) {
      case '/':
        setTitle('Home');
        break;
      case '/upload':
        setTitle('Upload');
        break;
      default:
        break;
    }
  }, [location.pathname]);

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
      <div className="navbar max-w-4xl rounded-xl w-11/12 fixed z-10 left-1/2 -translate-x-1/2 top-4 shadow backdrop-blur-sm">
        <div className="navbar-start">
          <div className="dropdown dropdown-hover">
            {/* eslint-disable-next-line max-len */}
            {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex,jsx-a11y/label-has-associated-control */}
            <label tabIndex={0} className="btn btn-ghost"><FontAwesomeIcon size="2xl" icon={faBurger} /></label>
            {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
            <ul tabIndex={0} className="dropdown-content z-10 menu p-2 bg-base-100 rounded-lg shadow">
              <li>
                <button type="button" onClick={() => navigate('/')}>
                  Home
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('/upload')}>
                  Detect
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="navbar-center">
          <h1 className="font-varela text-lg font-bold">{title}</h1>
        </div>
        <div className="navbar-end gap-2">
          {user ? (
            <div className="dropdown dropdown-hover">
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label className="btn btn-ghost avatar placeholder p-0 rounded-full border-none w-fit aspect-square">
                {user.photoURL ? (
                  <div className="bg-neutral-focus text-neutral-content w-10 aspect-square rounded-full placeholder">
                    <img className="w-10 rounded-full" src={user.photoURL} alt="User avatar" />
                  </div>
                ) : (
                  <div className="bg-neutral-focus text-neutral-content w-10 aspect-square rounded-full placeholder">
                    <span>{user.email ? user.email.charAt(0).toUpperCase() : 'A'}</span>
                  </div>
                )}
              </label>
              <ul className="dropdown-content z-10 menu p-2 bg-base-100 rounded-lg shadow">
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
            <button
              onMouseEnter={() => setIsLoginButtonHovered(!isLoginButtonHovered)}
              onMouseLeave={() => setIsLoginButtonHovered(!isLoginButtonHovered)}
              onClick={openLoginModal}
              className="btn btn-ghost"
              type="button"
            >
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label className="swap">
                <input type="checkbox" checked={isLoginButtonHovered} />
                <FontAwesomeIcon className="swap-on" icon={faDoorOpen} size="2xl" />
                <FontAwesomeIcon className="swap-off" icon={faDoorClosed} size="2xl" />
              </label>
            </button>
          )}
        </div>
      </div>
    );
  }
  return null;
}

export default Navbar;
