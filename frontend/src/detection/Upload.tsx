import React, { useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudArrowUp } from '@fortawesome/free-solid-svg-icons';

function Upload() {
  const inputFile = useRef<HTMLInputElement>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const addImages = () => {
    inputFile.current!.value = '';
    inputFile.current!.click();
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (files && files.length > 0) {
      const imageUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onloadend = () => {
          imageUrls.push(reader.result as string);
          if (imageUrls.length === files.length) {
            setSelectedImages([...selectedImages, ...imageUrls]);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };
  return (
    <div className="bg-gray-200 w-full h-screen flex justify-center items-center overflow-y-auto">
      <div className="card max-w-6xl w-11/12 bg-white flex items-center justify-center md:p-20 sm:p-10 p-4 my-4">
        <h1 className="text-black text-xl font-varela text-center">Drag and Drop or Browse to Upload Image</h1>
        <p className="text-gray-500 mt-4 font-varela text-center">Upload up to 40 images at once</p>
        <input
          alt="file"
          type="file"
          id="file"
          ref={inputFile}
          className="hidden"
          onChange={onFileChange}
          multiple
        />
        <div
          onClick={addImages}
          className={selectedImages.length > 0 ? 'card w-full max-w-4xl border-2 border-dashed border-gray-300 mt-10 flex flex-row justify-around items-center py-4' : 'card w-full max-w-4xl border-2 border-dashed border-gray-300 mt-10 aspect-video flex items-center justify-center cursor-pointer p-4"'}
        >
          <FontAwesomeIcon icon={faCloudArrowUp} size={selectedImages.length > 0 ? '3x' : '5x'} />
          <div className="md:flex flex-col hidden">
            <h2 className={`text-black text-lg font-varela ${selectedImages.length === 0 && 'mt-8'} text-center`}>
              Select a file or drag and drop here
            </h2>
            <p className="text-gray-500 mt-4 font-varela text-center">
              JPG, PNG or PDF, file size no more than 10MB
            </p>
          </div>
          <button
            className={`btn btn-outline btn-accent ${selectedImages.length === 0 && 'mt-10'}`}
            type="button"
          >
            {selectedImages.length > 0 ? 'Add more images' : 'Upload images'}
          </button>
        </div>
        {selectedImages.length > 0 && (
        <div className="mt-4 w-full flex flex-col gap-4">
          {selectedImages.map((imageUrl, index) => (
            <div className="flex w-full items-center justify-around">
              <img
                key={index}
                src={imageUrl}
                alt={`Selected ${index + 1}`}
                className="w-32"
              />
              <button className="btn btn-outline btn-accent">
                Detect
              </button>
            </div>
          ))}
        </div>
        )}
      </div>
    </div>
  );
}

export default Upload;
