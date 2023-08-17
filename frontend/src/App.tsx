import { Route, Routes } from 'react-router-dom';
import Detection from './Pages/detection/Detection';
import Navbar from './Components/Navbar';

function App() {
  return (
    <div className="w-full h-screen bg-white">
      <Navbar />
      <Routes>
        <Route path="/upload" element={<Detection />} />
      </Routes>
    </div>
  );
}

export default App;
