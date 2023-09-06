import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faCloudArrowUp, faXmark } from '@fortawesome/free-solid-svg-icons';
import { getPredictions } from '../../services/apiService';
import { Prediction } from '../../models/Prediction';

function Detection() {
  const inputFile = useRef<HTMLInputElement>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedImageUrls, setSelectedImageUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [numToShow, setNumToShow] = useState(5);
  const [isChecked, setIsChecked] = useState<boolean[]>(new Array(selectedImages.length).fill(false));

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

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedImages([...selectedImages, ...Array.from(event.target.files!)]);
    setIsLoading([...isLoading, ...Array.from(event.target.files!).map(() => false)]);
  };

  const handleCheckbox = (index: number) => {
    const newCheck = [...isChecked];
    newCheck[index] = !newCheck[index];
    setIsChecked(newCheck);
  };

  useEffect(() => {
    if (selectedImages.length < 1) return;
    const newImageUrls: string[] = [];
    selectedImages.forEach((image:any) => newImageUrls.push(URL.createObjectURL(image)));
    setSelectedImageUrls(newImageUrls);
    const loadingIndexes: number[] = [];
    (async () => {
      const formData = new FormData();
      selectedImages.forEach((imageUrl, i) => {
        if (predictions[i] !== undefined) return;
        formData.append('files', imageUrl);
        setIsLoading((prev) => {
          const newPrev = [...prev];
          newPrev[i] = true;
          return newPrev;
        });
        loadingIndexes.push(i);
      });

      const response = await getPredictions(formData); // Assuming getPredictions is defined
      setPredictions((prev) => [...prev, ...response.data]);
      setIsLoading((prev) => {
        const newPrev = [...prev];
        loadingIndexes.forEach((i) => {
          newPrev[i] = false;
        });
        return newPrev;
      });
    })();
  }, [selectedImages]);

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

  const downloadPredictions = async () => {
    const selectedPredictions = predictions.filter((_, index) => isChecked[index]);
    try {
      let apiUrl = '';
      if (process.env.REACT_APP_BACKEND_URL) {
        apiUrl = process.env.REACT_APP_BACKEND_URL;
      } else {
        apiUrl = 'http://code-critters.onrender.com';
      }
      const response = await fetch(`${apiUrl}/api/v1/create_csv`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(selectedPredictions),
      });
      if (response.ok){
        const data = await response.text();
        const blob = new Blob([data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'predictions.csv';
        a.click();
        window.URL.revokeObjectURL(url);
      } else{
        console.error('Failed to fetch CSV data');
      }
    } catch (error) {
      console.error('Error fetching CSV data:', error);
    }
  };

  return (
    <div className="w-full h-full flex justify-center overflow-y-auto">
      <div className="max-w-4xl w-11/12 flex flex-col items-center px-4 py-10 my-10 h-fit">
        <h1 className=" text-xl font-varela text-center">Drag and Drop or Browse to Upload Image</h1>
        <p className="text-gray-500 mt-4 font-varela text-center">Upload up to 40 images at once</p>
        <input
          alt="file"
          type="file"
          id="file"
          ref={inputFile}
          className="hidden"
          onChange={onFileChange}
          multiple
          accept="image/png, image/jpeg"
        />
        <div
          onClick={addImages}
          className={selectedImages.length > 0 ? 'cursor-pointer card w-full border-2 border-dashed border-gray-300 mt-10 flex flex-row justify-around items-center p-4' : 'card w-full max-w-4xl border-2 border-dashed border-gray-300 mt-10 aspect-video flex items-center justify-center cursor-pointer p-4'}
        >
          <FontAwesomeIcon icon={faCloudArrowUp} size={selectedImages.length > 0 ? '3x' : '5x'} />
          <div className="md:flex flex-col hidden">
            <h2 className={` text-lg font-varela ${selectedImages.length === 0 && 'mt-8'} text-center`}>
              Select a file or drag and drop here
            </h2>
            <p className="text-gray-500 mt-4 font-varela text-center">
              JPG, PNG, file size no more than 10MB
            </p>
          </div>
          <button
            className={`btn btn-outline btn-secondary ${selectedImages.length === 0 && 'mt-10'} font-varela`}
            type="button"
          >
            {selectedImages.length > 0 ? 'Add more images' : 'Upload images'}
          </button>
        </div>
        <div className="mt-4 w-full flex flex-col gap-4">
          {selectedImageUrls.map((imageUrl, index) => (
            <div className="flex w-full items-center justify-between px-4 gap-4" key={index} onClick={() => handleCheckbox(index)}>
              <div className="flex gap-4 items-center">
                <input
                  type='checkbox'
                  checked = {isChecked[index]}
                  onChange={() => handleCheckbox(index)}
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '7px',
                    cursor: 'pointer',
                  }}
                />
                <img
                  src={imageUrl}
                  alt={`Selected ${index + 1}`}
                  className="w-32 rounded-md"
                />
                {/* replace .jpg and .png */}
                <div className="truncate hidden sm:flex">
                  {selectedImages[index].name.replace(/\.jpg|\.png/, '')}
                </div>
              </div>
              <div />

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  className="btn btn-secondary btn-square"
                  onClick={() => openModel(index)}
                  disabled={isLoading[index]}
                >
                  {isLoading[index] ? <span className="loading loading-spinner" />
                    : <FontAwesomeIcon icon={faChartBar} />}
                </button>

                <button
                  className="btn btn-square btn-outline btn-accent"
                  type="button"
                  onClick={() => deleteImage(index)}
                  disabled={isLoading[index]}
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>

              </div>
            </div>
          ))}
        </div>
      </div>

      {predictions.map((prediction, index) => (
        <dialog id={`prediction-${index}`} className="modal  modal-bottom sm:modal-middle" key={index}>
          <form method="dialog" className="modal-box sm:w-11/12 sm:max-w-3xl">
            <button
              onClick={() => closeModel(index)}
              type="button"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              <FontAwesomeIcon
                icon={faXmark}
              />
            </button>
            <h3 className="font-bold text-lg font-varela ">
              Results:
            </h3>

            <div className="flex flex-col gap-4 mt-4 items-center">
              {
                // eslint-disable-next-line max-len
                  prediction.pred.sort((a, b) => Number(b[0]) - Number(a[0])).slice(0, numToShow).map((pred, i) => (
                    <div key={i} className="w-full">
                      <div className="flex justify-between">
                        <p className="font-varela ">{pred[1]}</p>
                        <p className="font-varela text-secondary">{Number(pred[0]).toFixed(4)}</p>
                      </div>
                      <progress
                        className="progress progress-secondary w-full"
                        value={Number(pred[0]) * 100}
                        max="100"
                      />
                    </div>
                  ))
              }
              <div>
              <button className="relative px-8 py-4 text-white font-semibold rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 shadow-2xl transform hover:scale-110 transition-all duration-300">
                  <span className="relative z-10"
                  onClick={downloadPredictions}
                  >Download </span>
              </button>
              </div>
              {
                                prediction.pred.length > numToShow ? (
                                  <button
                                    type="button"
                                    className="btn btn-secondary w-fit"
                                    onClick={() => handleShowMore(prediction.pred)}
                                  >
                                    Show more
                                  </button>
                                )
                                  : (
                                    <button
                                      type="button"
                                      className="btn btn-secondary w-fit"
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

export default Detection;
