import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faCloudArrowUp, faXmark } from '@fortawesome/free-solid-svg-icons';
import { getPredictions } from '../services/apiService';
import { Prediction } from '../models/Prediction';

function Upload() {
  const inputFile = useRef<HTMLInputElement>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedImageUrls, setSelectedImageUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [numToShow, setNumToShow] = useState(5);

  const handleShowMore = (pred: string[][]) => {
    setNumToShow(pred.length); // Show all predictions
  };

  const handleShowLess = () => {
    setNumToShow(5); // Show 5 predictions
  };

  const addImages = () => {
    inputFile.current!.value = '';
    inputFile.current!.click();
  };

  useEffect(() => {
    if (selectedImages.length < 1) return;
    const newImageUrls: string[] = [];
    selectedImages.forEach((image:any) => newImageUrls.push(URL.createObjectURL(image)));
    setSelectedImageUrls(newImageUrls);
  }, [selectedImages]);

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedImages([...selectedImages, ...Array.from(event.target.files!)]);
  };

  const onPredictionClick = async () => {
    setIsLoading(true);
    const formData = new FormData();
    selectedImages.forEach((imageUrl) => {
      formData.append('file[]', imageUrl);
    });

    const response = await getPredictions(formData); // Assuming getPredictions is defined
    setPredictions(response.data);
    setIsLoading(false);
  };

  const deleteImage = (index: number) => {
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    setSelectedImages(newImages);

    const newImageUrls = [...selectedImageUrls];
    newImageUrls.splice(index, 1);
    setSelectedImageUrls(newImageUrls);

    const newPredictions = [...predictions];
    newPredictions.splice(index, 1);
    setPredictions(newPredictions);
  };

  const openModel = (index: number) => {
    const modal = document.getElementById(`prediction-${index}`)! as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  };

  const closeModel = (index: number) => {
    const modal = document.getElementById(`prediction-${index}`)! as HTMLDialogElement;
    if (modal) {
      setNumToShow(5);
      modal.close();
    }
  };

  return (
    <div className="bg-gray-200 w-full h-full flex justify-center overflow-y-auto">
      <div className="card max-w-6xl w-11/12 bg-white flex items-center px-4 py-10 my-10 h-fit">
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
          className={selectedImages.length > 0 ? 'card w-full max-w-4xl border-2 border-dashed border-gray-300 mt-10 flex flex-row justify-around items-center p-4' : 'card w-full max-w-4xl border-2 border-dashed border-gray-300 mt-10 aspect-video flex items-center justify-center cursor-pointer p-4'}
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
            className={`btn btn-outline btn-accent ${selectedImages.length === 0 && 'mt-10'} font-varela`}
            type="button"
          >
            {selectedImages.length > 0 ? 'Add more images' : 'Upload images'}
          </button>
        </div>
        <div className="mt-4 w-full flex flex-col gap-4">
          {selectedImageUrls.map((imageUrl, index) => (
            <div className="flex w-full items-center justify-around" key={index}>
              <img
                src={imageUrl}
                alt={`Selected ${index + 1}`}
                className="w-32 rounded-md"
              />
              <div />

              <div className="flex items-center gap-4">
                {(predictions[index]) ? (
                  <button
                    type="button"
                    className="btn btn-accent btn-square"
                    onClick={() => openModel(index)}
                    disabled={isLoading}
                  >
                    <FontAwesomeIcon icon={faChartBar} />
                  </button>
                ) : <div className="w-12" />}

                <button
                  className="btn btn-square btn-outline btn-accent"
                  type="button"
                  onClick={() => deleteImage(index)}
                  disabled={isLoading}
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>

              </div>
            </div>
          ))}
        </div>
        {
                    selectedImages.length > 0 && (
                    <button
                      onClick={() => onPredictionClick()}
                      type="button"
                      className={`btn btn-outline btn-accent ${isLoading && 'btn-active'} mt-4`}
                      disabled={isLoading}
                    >
                      Get Predictions

                      {isLoading && (
                      <span className="loading loading-spinner" />
                      )}
                    </button>
                    )
                }
      </div>

      {predictions.map((prediction, index) => (
        <dialog id={`prediction-${index}`} className="modal  modal-bottom sm:modal-middle" key={index}>
          <form method="dialog" className="modal-box bg-white sm:w-11/12 sm:max-w-3xl">
            <button
              onClick={() => closeModel(index)}
              type="button"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              <FontAwesomeIcon
                icon={faXmark}
              />
            </button>
            <h3 className="font-bold text-lg font-varela text-black">
              Results:
            </h3>

            <div className="flex flex-col gap-4 mt-4 items-center">
              {
                // eslint-disable-next-line max-len
                  prediction.pred.sort((a, b) => Number(b[0]) - Number(a[0])).slice(0, numToShow).map((pred, i) => (
                    <div key={i} className="w-full">
                      <div className="flex justify-between">
                        <p className="font-varela text-black">{pred[1]}</p>
                        <p className="font-varela text-accent">{Number(pred[0]).toFixed(4)}</p>
                      </div>
                      <progress
                        className="progress progress-accent w-full"
                        value={Number(pred[0]) * 100}
                        max="100"
                      />
                    </div>
                  ))
              }
              {
                                prediction.pred.length > numToShow ? (
                                  <button
                                    type="button"
                                    className="btn btn-accent w-fit"
                                    onClick={() => handleShowMore(prediction.pred)}
                                  >
                                    Show more
                                  </button>
                                )
                                  : (
                                    <button
                                      type="button"
                                      className="btn btn-accent w-fit"
                                      onClick={() => handleShowLess()}
                                    >
                                      Show less
                                    </button>
                                  )
                            }

            </div>
          </form>
          <form method="dialog" className="modal-backdrop">
            <button type="button" onClick={() => closeModel(index)}>close</button>
          </form>
        </dialog>
      ))}
    </div>
  );
}

export default Upload;
