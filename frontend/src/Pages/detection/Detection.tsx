import React, {
  useEffect, useRef, useState, MouseEvent,
} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartBar, faCloudArrowUp, faXmark, faTrash, faFileCsv, faFileExcel,
} from '@fortawesome/free-solid-svg-icons';
import {
  collection, doc, increment, setDoc, updateDoc,
} from 'firebase/firestore';
import { User } from '@firebase/auth';
import { auth, db } from '../../enviroments/firebase';
import {
  getCSV, getXLSX, getModels, getPredictions as getPredictionsAPI,
} from '../../services/apiService';
import { Prediction } from '../../models/Prediction';

function Detection() {
  const inputFile = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean[]>([]);
  const [predictions, setPredictions] = useState<(Prediction | undefined)[]>([]);
  const [numToShow, setNumToShow] = useState(5);
  const [isChecked, setIsChecked] = useState<boolean[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const handleShowMore = (pred: string[][]) => {
    setNumToShow(pred.length); // Show all predictions
  };

  const handleShowLess = () => {
    setNumToShow(5); // Show 5 predictions
  };

  const addImages = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.target instanceof HTMLSelectElement) return;
    inputFile.current!.value = '';
    inputFile.current!.click();
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImages([...images, ...Array.from(event.target.files!)]);
    setIsLoading([...isLoading, ...Array.from(event.target.files!)
      .map(() => true)]);
    setPredictions([...predictions, ...Array.from(event.target.files!).map(() => undefined)]);
    setIsChecked([...isChecked, ...Array.from(event.target.files!)
      .map(() => false)]);
  };

  const handleCheckbox = (index: number) => {
    const newCheck = [...isChecked];
    newCheck[index] = !newCheck[index];
    setIsChecked(newCheck);
  };

  useEffect(() => {
    (async () => {
      const res = await getModels();
      setModels(res.data);
      setSelectedModel(res.data[0]);
    })();
  }, []);

  const addPredictionToUserHistory = async (
    user: User,
    newPredictions: Prediction[],
  ) => {
    const userDoc = doc(db, 'user', user.uid);
    const predictionsCollectionRef = collection(userDoc, 'predictions');
    const predictionsFirestoreFormat = newPredictions.map((prediction) => (
      {
        name: prediction.name,
        date: new Date(),
        prediction: JSON.stringify(prediction.pred),
        imageHash: prediction.hash,
      }
    ));
    predictionsFirestoreFormat.forEach(async (prediction) => {
      const predictionDoc = doc(predictionsCollectionRef);
      await setDoc(predictionDoc, prediction);
    });
  };

  const getPredictions = async () => {
    const predictionsArray: Prediction[] = [];
    const imageFileNames: string[] = [];

    await Promise.all(
      images.map(async (image, i) => {
        if (predictions[i] !== undefined) return;
        const formData = new FormData();
        formData.append('files', image);
        const response = await getPredictionsAPI(formData, selectedModel);

        setIsLoading((prev) => {
          const newPrev = [...prev];
          newPrev[i] = true;
          return newPrev;
        });

        [predictionsArray[i]] = response.data;
        imageFileNames.push(image.name);

        setPredictions((prev) => {
          const newPrev = [...prev];
          [newPrev[i]] = response.data;
          return newPrev;
        });

        setIsLoading((prev) => {
          const newPrev = [...prev];
          newPrev[i] = false;
          return newPrev;
        });
      }),
    );

    const newPredictions = predictionsArray.filter(async (prediction) => {
      if (prediction !== undefined) {
        const counterDoc = doc(db, 'predictionsCounter', 'counter');
        await updateDoc(counterDoc, {
          count: increment(1),
        });
      }

      return prediction !== undefined;
    });

    if (auth.currentUser) {
      await addPredictionToUserHistory(auth.currentUser, newPredictions);
    }
  };

  useEffect(() => {
    if (images.length < 1) return;
    const newImageUrls: string[] = [];
    images.forEach((image: any) => newImageUrls.push(URL.createObjectURL(image)));
    setImageUrls(newImageUrls);
    getPredictions();
  }, [selectedModel]);

  // for prediction
  useEffect(() => {
    if (images.length < 1) return;
    const newImageUrls: string[] = [];
    images.forEach((image: any) => newImageUrls.push(URL.createObjectURL(image)));
    setImageUrls(newImageUrls);
    (async () => {
      await getPredictions();
    })();
  }, [images]);

  const deleteImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newImageUrls = [...imageUrls];
    newImageUrls.splice(index, 1);
    setImageUrls(newImageUrls);

    const newPredictions = [...predictions];
    newPredictions.splice(index, 1);
    setPredictions(newPredictions);

    const newCheck = [...isChecked];
    newCheck.splice(index, 1);
    setIsChecked(newCheck);

    const newLoading = [...isLoading];
    newLoading.splice(index, 1);
    setIsLoading(newLoading);
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

  const downloadPredictionsCSV = async () => {
    const selectedPredictions = predictions.filter((_, index) => isChecked[index]);
    try {
      const response = await getCSV(selectedPredictions as Prediction[]);
      const { data } = response;
      const blob = new Blob([data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'predictions.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error fetching CSV data:', error);
    }
  };

  const downloadPredictionsXLSX = async () => {
    const selectedPredictions = predictions.filter((_, index) => isChecked[index]);
    try {
      const response = await getXLSX(selectedPredictions as Prediction[]);
      const { data } = response;
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'predictions.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error fetching XLSX data:', error);
    }
  };

  const selectAll = () => {
    const newCheck = [...isChecked];
    if (newCheck.every((check) => check)) {
      newCheck.forEach((_, index) => {
        newCheck[index] = false;
      });
    } else {
      newCheck.forEach((_, index) => {
        newCheck[index] = true;
      });
    }
    setIsChecked(newCheck);
  };

  const deleteAll = () => {
    setImages([]);
    setImageUrls([]);
    setIsLoading([]);
    setPredictions([]);
    setIsChecked([]);
  };

  const selectModel = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModel(event.target.value);
  };
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    // eslint-disable-next-line no-param-reassign
    event.dataTransfer.dropEffect = 'copy';
  };
  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDraggingOver(true); // Add a style change when drag enters the div
  };
  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDraggingOver(false); // Remove the style change when drag leaves the div
  };
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDraggingOver(false);

    const droppedFiles = Array.from(event.dataTransfer.files);

    setImages([...images, ...droppedFiles]);
    setIsLoading([...isLoading, ...droppedFiles
      .map(() => true)]);
    setPredictions([...predictions, ...Array.from(event.dataTransfer.files!).map(() => undefined)]);

    setIsChecked([...isChecked, ...droppedFiles
      .map(() => false)]);
  };
  return (
    <div className="w-full h-full flex justify-center overflow-y-auto pt-28 pb-4">
      <div className="max-w-4xl w-11/12 flex flex-col items-center h-fit">
        <h1 className="p-4 font-varela text-xl font-bold">Upload</h1>
        <h1 className="text-xl font-varela text-center">
          Drag and Drop or Browse to Upload
          Image
        </h1>
        <p className="text-gray-500 mt-4 font-varela text-center">
          Upload up to 40 images at
          once
        </p>
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
          className={`transition-all cursor-pointer card w-full border-2 border-dashed border-gray-300 mt-10 ${images.length > 0
            ? 'flex flex-col sm:flex-row justify-around items-center p-4'
            : 'aspect-video flex items-center justify-center p-4'
          } ${isDraggingOver ? 'bg-green-200' : 'bg-white'}`}
          onClick={(e) => addImages(e)}
          onDragOver={(e) => handleDragOver(e)} // code needs to the changed later
          onDrop={(e) => handleDrop(e)} // code needs to be changed later
          onDragEnter={(e) => handleDragEnter(e)}
          onDragLeave={(e) => handleDragLeave(e)}
        >
          <FontAwesomeIcon className="text-primary" icon={faCloudArrowUp} size={images.length > 0 ? '3x' : '5x'} />
          <div className="md:flex flex-col hidden">
            <h2 className={` text-lg font-varela ${images.length === 0 && 'mt-8'} text-center`}>
              Select a file or drag and drop here
            </h2>
            <p className="text-gray-500 mt-4 font-varela text-center">
              JPG, PNG, file size no more than 10MB
            </p>
          </div>
          {models.length > 0 && (
            <div className={`flex items-end gap-4 ${images.length === 0 && 'mt-10'}`}>
              <div className="form-control">
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label className="label">
                  <span className="label-text">Pick a model</span>
                </label>
                <select onChange={selectModel} className="select select-primary w-full max-w-xs">
                  {models.map((model, i) => (
                    <option key={i} value={model}>{model}</option>))}
                </select>
              </div>
              <button
                className="btn btn-outline hover:!text-white btn-primary font-varela"
                type="button"
              >
                {images.length > 0 ? 'Add images' : 'Upload images'}
              </button>
            </div>
          )}
        </div>
        {(images.length > 0 && predictions.length > 0) && (
          <div className="mt-4 flex gap-4 flex-wrap justify-center">
            <button
              className="btn btn-primary btn-outline hover:!text-white font-varela"
              type="button"
              onClick={() => selectAll()}
            >
              Select All
            </button>
            <div className="join">
              <div className="tooltip font-varela " data-tip="Download predictions as CSV">
                <button
                  type="button"
                  className="btn btn-secondary btn-outline hover:!text-white join-item"
                  onClick={downloadPredictionsCSV}
                  disabled={isChecked.every((value) => !value)}
                >
                  <FontAwesomeIcon icon={faFileCsv} />
                </button>
              </div>
              <div className="tooltip font-varela " data-tip="Download predictions as XLSX">
                <button
                  type="button"
                  className="btn btn-secondary btn-outline hover:!text-white aspect-square join-item"
                  onClick={downloadPredictionsXLSX}
                  disabled={isChecked.every((value) => !value)}
                >
                  <FontAwesomeIcon icon={faFileExcel} />
                </button>
              </div>
            </div>
            <div className="tooltip font-varela" data-tip="Remove all images">
              <button
                className="btn btn-error btn-outline font-varela hover:!text-white"
                type="button"
                onClick={deleteAll}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </div>
        )}

        <div className="mt-4 w-full flex flex-col gap-4">
          {imageUrls.map((imageUrl, index) => (
            <div
              className="flex w-full items-center justify-between px-4 gap-4"
              key={index}
            >
              <div className="flex gap-4 items-center">
                <img
                  src={imageUrl}
                  alt={`Selected ${index + 1}`}
                  className="w-32 rounded-md"
                />
                <div className="truncate hidden md:flex">
                  {images[index].name}
                </div>
              </div>
              <div />

              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={isChecked[index] || false}
                  onChange={() => handleCheckbox(index)}
                  className="checkbox checkbox-lg checkbox-primary"
                  disabled={isLoading[index]}
                />
                <div className="tooltip font-varela" data-tip="Show predictions">
                  <button
                    type="button"
                    className="btn btn-secondary btn-outline hover:!text-white btn-square"
                    onClick={() => openModel(index)}
                    disabled={isLoading[index]}
                  >
                    {isLoading[index] ? <span className="loading loading-spinner" />
                      : <FontAwesomeIcon icon={faChartBar} />}
                  </button>
                </div>
                <div className="tooltip font-varela" data-tip="Delte this prediction">
                  <button
                    className="btn btn-square btn-outline hover:!text-white btn-error"
                    type="button"
                    onClick={() => deleteImage(index)}
                    disabled={isLoading[index]}
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {predictions.map((prediction, index) => (
        <dialog
          id={`prediction-${index}`}
          className="modal  modal-bottom sm:modal-middle"
          key={index}
        >
          <form method="dialog" className="modal-box sm:w-11/12 sm:max-w-4xl">
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
                prediction?.pred.sort((a, b) => Number(b[0]) - Number(a[0]))
                  .slice(0, numToShow)
                  .map((pred, i) => (
                    <div key={i} className="w-full">
                      <div className="flex justify-between">
                        <p className="font-varela ">{pred[1]}</p>
                        <p className="font-varela text-primary">
                          {Number(pred[0])
                            .toFixed(4)}
                        </p>
                      </div>
                      <progress
                        className="progress progress-primary w-full"
                        value={Number(pred[0]) * 100}
                        max="100"
                      />
                    </div>
                  ))
              }
              {
                prediction?.pred.length! > numToShow ? (
                  <button
                    type="button"
                    className="btn btn-primary hover:!text-white font-varela btn-outline"
                    onClick={() => handleShowMore(prediction!.pred)}
                  >
                    Show more
                  </button>
                )
                  : (
                    <button
                      type="button"
                      className="btn btn-primary hover:!text-white font-varela btn-outline"
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
