import { Route, Routes } from 'react-router-dom';
import Detection from './Pages/detection/Detection';
import Navbar from './Components/Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="w-full h-screen">
      <Navbar />
      <Routes>
        <Route path="/upload" element={<Detection />} />
      </Routes>
      {/* Add ToastContainer to display toasts */}
      <ToastContainer />
    </div>
  );
}

export default App;
