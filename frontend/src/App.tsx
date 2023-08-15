import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Detection from './Pages/detection/Detection';
import Navbar from './Components/Navbar';
import LoginModal from './Components/LoginModal';

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <button type="button" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={openModal}>
        Login
      </button>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <LoginModal onClose={closeModal} />
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <div className="w-full h-screen bg-white">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Detection />} />
        <Route path="/login" element={<LoginModal />} />
      </Routes>
    </div>
  );
}

export default App;

// import { Route, Routes } from 'react-router-dom';
// import Detection from './Pages/detection/Detection';
// import Navbar from './Components/Navbar';

// function App() {
//   return (
//     <div className="w-full h-screen bg-white">
//       <Navbar />
//       <Routes>
//         <Route path="/upload" element={<Detection />} />
//       </Routes>
//     </div>
//   );
// }

// export default App;
