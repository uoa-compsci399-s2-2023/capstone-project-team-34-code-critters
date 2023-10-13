import React, { useEffect, useRef, useState } from 'react';
import {
  Navigate, Route, Routes, useNavigate,
} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome, faMagnifyingGlass, faBook, faDoorOpen, faRightToBracket, faUserAlt, faMoon, faSun,
} from '@fortawesome/free-solid-svg-icons';
import { useAuthState } from 'react-firebase-hooks/auth';
import History from './Pages/history/History';
import Detection from './Pages/detection/Detection';
import Navbar from './Components/Navbar';
import SignUpModal from './Components/SignUpModal';
import LoginModal from './Components/LoginModal';
import Home from './Pages/home/Home';
import Toast, { ToastMessage } from './Components/Toast';
import { auth } from './enviroments/firebase';
import './styles/scrollbar.css';

type ProtectedRouteProps = {
  children: React.ReactNode;
};

// eslint-disable-next-line react/function-component-definition
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [user] = useAuthState(auth);
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
};

// eslint-disable-next-line react/function-component-definition
const ProtectedHomeRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [user] = useAuthState(auth);

  if (user) {
    return <Navigate to="/upload" replace />;
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
};

function App() {
  const loginModalRef = useRef<HTMLDialogElement | null>(null);
  const signUpModalRef = useRef<HTMLDialogElement | null>(null);
  const [isDark, setIsDark] = useState(false);

  const [toast, setToast] = useState<ToastMessage>({ message: '', type: 'success' });
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

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

  const toggleTheme = (): void => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDark(true);
    }
  };

  useEffect(() => {
    if (localStorage.theme === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);
  return (
    <div className="w-full h-screen drawer drawer-end">
      <Navbar
        loginModalRef={loginModalRef}
        signUpModalRef={signUpModalRef}
        setToastMessage={setToastMessage}
      />
      <div className="h-full w-full dark:bg-neutral-900 scrollbar overflow-y-auto">
        <Routes>
          <Route path="/upload" element={<Detection />} />
          <Route
            path="/"
            element={(
              <ProtectedHomeRoute>
                <Home />
                {' '}
              </ProtectedHomeRoute>
)}
          />
          <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
        </Routes>
        <input id="drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-side z-20">
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label htmlFor="drawer" aria-label="close sidebar" className="drawer-overlay" />
          <div className="p-4">
            <ul className="menu w-80 rounded-lg dark:bg-neutral-800 bg-white">
              <button
                className="font-varela btn btn-ghost dark:text-neutral-100 dark:hover:bg-neutral-700"
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
                className="font-varela btn btn-ghost dark:text-neutral-100 dark:hover:bg-neutral-700"
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
                      navigate('/history');
                      closeDrawer();
                    }}
                    className="font-varela btn btn-ghost dark:text-neutral-100 dark:hover:bg-neutral-700"
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
                    className="font-varela btn btn-ghost dark:text-neutral-100 dark:hover:bg-neutral-700"
                  >
                    Log Out
                    <FontAwesomeIcon icon={faDoorOpen} />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col">
                  <button
                    className="font-varela btn btn-ghost dark:text-neutral-100 dark:hover:bg-neutral-700"
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
                    className="font-varela btn btn-ghost dark:text-neutral-100 dark:hover:bg-neutral-700"
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
              <button
                className="font-varela btn btn-ghost dark:text-neutral-100 dark:hover:bg-neutral-700"
                type="button"
                onClick={() => {
                  toggleTheme();
                }}
              >
                {
                  isDark ? (
                    <>
                      Light Mode
                      <FontAwesomeIcon icon={faSun} />
                    </>
                  ) : (
                    <>
                      Dark Mode
                      <FontAwesomeIcon icon={faMoon} />
                    </>
                  )
                }
              </button>
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
      <div className="hidden sm:flex">
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className="btn btn-circle border-none bg-orange-400 hover:bg-orange-500 dark:bg-purple-500 dark:hover:bg-purple-600 w-14 h-14 text-white swap fixed bottom-4 right-4 sm:bottom-8 sm:right-8">
          <input type="checkbox" onChange={() => toggleTheme()} checked={isDark} />
          <div className="swap-on">
            <FontAwesomeIcon icon={faMoon} size="2x" />
          </div>
          <div className="swap-off">
            <FontAwesomeIcon icon={faSun} size="2x" />
          </div>
        </label>
      </div>
    </div>
  );
}

export default App;
