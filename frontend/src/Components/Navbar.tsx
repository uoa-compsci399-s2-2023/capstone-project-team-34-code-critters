import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDoorClosed,
  faDoorOpen,
  faBurger,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../enviroments/firebase';
import 'firebase/auth';

interface NavbarProps {
  loginModalRef: React.MutableRefObject<HTMLDialogElement | null>;
}

function Navbar({ loginModalRef }: NavbarProps) {
  const [isLoginButtonHovered, setIsLoginButtonHovered] = useState(false);
  const [title, setTitle] = useState('Home');
  const openLoginModal = () => {
    if (loginModalRef.current) {
      loginModalRef.current.showModal();
    }
  };

  const location = useLocation();
  const navigate = useNavigate();

  // Use the useAuthState hook to get the user's authentication status
  const [user] = useAuthState(auth);
  // const userEmail = user ? user.email : '';

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

  if (navbarEnabled) {
    return (
      <div className="navbar max-w-4xl rounded-xl w-11/12 fixed z-10 left-1/2 -translate-x-1/2 top-4 shadow backdrop-blur-sm">
        <div className="navbar-start">
          <div className="dropdown dropdown-hover">
            <label tabIndex={0} className="btn btn-ghost">
              <FontAwesomeIcon size="2xl" icon={faBurger} />
            </label>
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
              <label className="btn btn-ghost">
                <FontAwesomeIcon size="2x" icon={faUser} />
              </label>
              <ul className="dropdown-content z-10 menu p-2 bg-base-100 rounded-lg shadow">
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      // Handle user history click
                    }}
                  >
                    User History
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      auth.signOut();
                    }}
                  >
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
