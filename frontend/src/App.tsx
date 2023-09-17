import React, { useRef, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Detection from './Pages/detection/Detection';
import Navbar from './Components/Navbar';
import SignUpModal from './Components/SignUpModal';
import LoginModal from './Components/LoginModal';
import Home from './Pages/home/Home';
import Toast, { ToastMessage } from './Components/Toast'; // Import the Toast component

function App() {
  const loginModalRef = useRef<HTMLDialogElement | null>(null);
  const signUpModalRef = useRef<HTMLDialogElement | null>(null);

  const [toast, setToast] = useState<ToastMessage>({ message: '', type: 'success' });

  const setToastMessage = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  return (
    <div className="w-full h-screen">
      <Navbar
        loginModalRef={loginModalRef}
        setToastMessage={setToastMessage}
      />
      <div className="pt-28 h-full w-full">
        <Routes>
          <Route path="/upload" element={<Detection />} />
          <Route path="/" element={<Home />} />
        </Routes>
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
  );
}

export default App;
