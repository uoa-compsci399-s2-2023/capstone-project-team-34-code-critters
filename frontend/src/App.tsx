import React, { useEffect, useRef, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome, faMagnifyingGlass, faBook, faDoorOpen, faRightToBracket, faUserAlt,
} from '@fortawesome/free-solid-svg-icons';
import Detection from './Pages/detection/Detection';
import Navbar from './Components/Navbar';
import SignUpModal from './Components/SignUpModal';
import LoginModal from './Components/LoginModal';
import Home from './Pages/home/Home';
import Toast, { ToastMessage } from './Components/Toast';
import { auth } from './enviroments/firebase';
// Import the Toast component
function App() {
  const loginModalRef = useRef<HTMLDialogElement | null>(null);
  const signUpModalRef = useRef<HTMLDialogElement | null>(null);

  const [toast, setToast] = useState<ToastMessage>({ message: '', type: 'success' });
  const navigate = useNavigate();
  const [user, setUser] = useState(auth.currentUser);

  const setToastMessage = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setToastMessage('Logged out successfully', 'success');
    } catch (error) {
      setToastMessage('Failed to log out', 'error');
    }
  };

  useEffect(() => {
    auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
  }, []);

  const closeDrawer = () => {
    const drawer = document.getElementById('drawer') as HTMLInputElement;
    drawer.checked = false;
  };

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
    <div className="w-full h-screen drawer drawer-end">
      <Navbar
        loginModalRef={loginModalRef}
        signUpModalRef={signUpModalRef}
        setToastMessage={setToastMessage}
      />
      <div className="h-full w-full">
        <Routes>
          <Route path="/upload" element={<Detection />} />
          <Route path="/" element={<Home />} />
        </Routes>
        <input id="drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-side">
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label htmlFor="drawer" aria-label="close sidebar" className="drawer-overlay" />
          <div className="p-4">
            <ul className="menu w-80  bg-base-200 rounded-lg">
              <button
                className="font-varela btn"
                type="button"
                onClick={() => {
                  closeDrawer();
                  navigate('/');
                }}
              >
                Home
                <FontAwesomeIcon icon={faHome} className="-mt-[0.2rem]" />

              </button>
              <button
                className="font-varela btn"
                type="button"
                onClick={() => {
                  closeDrawer();
                  navigate('/upload');
                }}
              >
                Detect
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </button>

              { user ? (
                <div className="flex flex-col">
                  <button
                    type="button"
                    onClick={() => {
                      closeDrawer();
                    }}
                    className="font-varela btn"
                  >
                    User History
                    <FontAwesomeIcon icon={faBook} />
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      closeDrawer();
                      await handleLogout();
                    }}
                    className="font-varela btn"
                  >
                    Log Out
                    <FontAwesomeIcon icon={faDoorOpen} />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col">
                  <button
                    className="font-varela btn"
                    type="button"
                    onClick={() => {
                      closeDrawer();
                      openLoginModal();
                    }}
                  >
                    Login
                    <FontAwesomeIcon icon={faRightToBracket} />
                  </button>
                  <button
                    className="font-varela btn"
                    type="button"
                    onClick={() => {
                      closeDrawer();
                      openSignUpModal();
                    }}
                  >
                    Sign Up
                    <FontAwesomeIcon icon={faUserAlt} />
                  </button>
                </div>
              )}
            </ul>
          </div>
        </div>
        <SignUpModal
          signUpModalRef={signUpModalRef}
          loginModalRef={loginModalRef}
          toast={toast}
          setToastMessage={setToastMessage}
        />
        <LoginModal
          loginModalRef={loginModalRef}
          signUpModalRef={signUpModalRef}
          toast={toast}
          setToastMessage={setToastMessage}
        />
        {toast.message && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ message: '', type: 'success' })}
          />
        )}
      </div>
    </div>
  );
}

export default App;
