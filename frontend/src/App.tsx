import { Route, Routes } from 'react-router-dom';
import React, { useRef } from 'react';
import Detection from './Pages/detection/Detection';
import Navbar from './Components/Navbar';
import SignUpModal from './Components/SignUpModal';
import LoginModal from './Components/LoginModal';
import Home from './Pages/home/Home';

function App() {
  const loginModalRef = useRef<HTMLDialogElement | null>(null);
  const signUpModalRef = useRef<HTMLDialogElement | null>(null);
  return (
    <div className="w-full h-screen">
      <Navbar loginModalRef={loginModalRef} />
      <div className="pt-28 h-full w-full">
        <Routes>
          <Route path="/upload" element={<Detection />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
      <SignUpModal signUpModalRef={signUpModalRef} loginModalRef={loginModalRef} />
      <LoginModal loginModalRef={loginModalRef} signUpModalRef={signUpModalRef} />
    </div>
  );
}


export default App;
