import { faCloudArrowUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function App() {
  return (
    <div className="bg-gray-200 w-full h-screen flex justify-center items-center">
      <div className="card max-w-6xl w-11/12 bg-white flex items-center justify-center md:p-20 sm:p-10 p-4">
        <h1 className="text-black text-xl font-varela text-center">Drag and Drop or Browse to Upload Image</h1>
        <p className="text-gray-500 mt-4 font-varela text-center">Upload up to 50 images at once</p>

        <div className="card w-full max-w-4xl border-2 border-dashed border-gray-300 mt-10 aspect-video flex items-center justify-center cursor-pointer p-4">
          <FontAwesomeIcon icon={faCloudArrowUp} size="5x" />
          <h2 className="text-black text-lg font-varela mt-8 text-center">Select a file or drag and drop here</h2>
          <p className="text-gray-500 mt-4 font-varela text-center">JPG, PNG or PDF, file size no more than 10MB</p>
          <button className="btn btn-outline btn-accent mt-10" type="button">Select file</button>
        </div>
      </div>
    </div>
  );
}

export default App;
