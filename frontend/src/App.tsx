import { Route, Routes } from 'react-router-dom';
import Detection from './Pages/detection/Detection';
import Navbar from './Components/Navbar';
import LoginModal from './Components/LoginModal';
import SignUpModal from './Components/SignUpModal';

function App() {
  return (
    <div className="w-full h-screen bg-white">
      <Navbar />
      <LoginModal />
      <SignUpModal />
      <Routes>
        <Route path="/upload" element={<Detection />} />
      </Routes>
    </div>
  );
}

export default App;
