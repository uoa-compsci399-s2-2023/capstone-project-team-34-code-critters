import React, {
  useEffect, useRef, useState, MouseEvent,
} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartBar, faCloudArrowUp, faXmark, faDownload, faFileCsv, faFileExcel,
} from '@fortawesome/free-solid-svg-icons';
import {
  getCSV, getXLSX, getModels, getPredictions,
} from '../../services/apiService';
import { Prediction } from '../../models/Prediction';

function Detection() {
  const inputFile = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [numToShow, setNumToShow] = useState(5);
  const [isChecked, setIsChecked] = useState<boolean[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('');
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
      .map(() => false)]);
    setIsChecked([...isChecked, ...Array.from(event.target.files!)
      .map(() => false)]);
  };

  const handleCheckbox = (index: number) => {
    const newCheck = [...isChecked];
    newCheck[index] = !newCheck[index];
    setIsChecked(newCheck);
  };

  const removeCheckboxState = (index: number) => {
    const newCheck = [...isChecked];
    newCheck.splice(index, 1);
    setIsChecked(newCheck);
  };

  useEffect(() => {
    (async () => {
      const res = await getModels();
      setModels(res.data);
      setModels(res.data);
      setSelectedModel(res.data[0]);
    })();
  }, []);

  useEffect(() => {
    if (images.length < 1) return;
    const newImageUrls: string[] = [];
    images.forEach((image: any) => newImageUrls.push(URL.createObjectURL(image)));
    setImageUrls(newImageUrls);
    const loadingIndexes: number[] = [];
    (async () => {
      const formData = new FormData();
      images.forEach((imageUrl, i) => {
        formData.append('files', imageUrl);
        setIsLoading((prev) => {
          const newPrev = [...prev];
          newPrev[i] = true;
          return newPrev;
        });
        loadingIndexes.push(i);
      });
      const response = await getPredictions(formData, selectedModel);
      setPredictions([...response.data]);
      setIsLoading((prev) => {
        const newPrev = [...prev];
        loadingIndexes.forEach((i) => {
          newPrev[i] = false;
        });
        return newPrev;
      });
    })();
  }, [selectedModel]);

  useEffect(() => {
    if (images.length < 1 || images.length === predictions.length) return;
    const newImageUrls: string[] = [];
    images.forEach((image: any) => newImageUrls.push(URL.createObjectURL(image)));
    setImageUrls(newImageUrls);
    const loadingIndexes: number[] = [];
    (async () => {
      const formData = new FormData();
      images.forEach((imageUrl, i) => {
        if (predictions[i] !== undefined) return;
        formData.append('files', imageUrl);
        setIsLoading((prev) => {
          const newPrev = [...prev];
          newPrev[i] = true;
          return newPrev;
        });
        loadingIndexes.push(i);
      });
      const response = await getPredictions(formData, selectedModel);
      setPredictions((prev) => [...prev, ...response.data]);
      setIsLoading((prev) => {
        const newPrev = [...prev];
        loadingIndexes.forEach((i) => {
          newPrev[i] = false;
        });
        return newPrev;
      });
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

    removeCheckboxState(index);
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
      const response = await getCSV(selectedPredictions);
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
      const response = await getXLSX(selectedPredictions);
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

  const toggleAll = () => {
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

  const selectModel = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModel(event.target.value);
  };

  return (
    <div className="w-full h-full flex justify-center overflow-y-auto">
      <div className="max-w-4xl w-11/12 flex flex-col items-center px-4 py-10 my-10 h-fit">
        <h1 className=" text-xl font-varela text-center">
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
          className={images.length > 0 ? 'cursor-pointer card w-full border-2 border-dashed border-gray-300 mt-10 flex flex-col sm:flex-row justify-around items-center p-4' : 'cursor-pointer card w-full max-w-4xl border-2 border-dashed border-gray-300 mt-10 aspect-video flex items-center justify-center cursor-pointer p-4'}
          onClick={(event) => addImages(event)}
        >
          <FontAwesomeIcon icon={faCloudArrowUp} size={images.length > 0 ? '3x' : '5x'} />
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
                className="btn btn-outline btn-primary font-varela"
                type="button"
              >
                {images.length > 0 ? 'Add images' : 'Upload images'}
              </button>
            </div>
          )}
        </div>
        {(images.length > 0 && predictions.length > 0) && (
        <div className="mt-4 flex gap-4">
          <button
            className="btn btn-secondary"
            type="button"
            onClick={() => toggleAll()}
          >
            Toggle All
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={downloadPredictionsCSV}
            disabled={isChecked.every((value) => !value)}
          >
            <FontAwesomeIcon icon={faDownload} className="mr-2" />
            <FontAwesomeIcon icon={faFileCsv} />
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={downloadPredictionsXLSX}
            disabled={isChecked.every((value) => !value)}
          >
            <FontAwesomeIcon icon={faDownload} className="mr-2" />
            <FontAwesomeIcon icon={faFileExcel} />
          </button>
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
                  className="checkbox checkbox-lg checkbox-secondary"
                  disabled={isLoading[index]}
                />
                <button
                  type="button"
                  className="btn btn-primary btn-square"
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
        <dialog
          id={`prediction-${index}`}
          className="modal  modal-bottom sm:modal-middle"
          key={index}
        >
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
                                prediction.pred.sort((a, b) => Number(b[0]) - Number(a[0]))
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
                                prediction.pred.length > numToShow ? (
                                  <button
                                    type="button"
                                    className="btn btn-primary w-fit"
                                    onClick={() => handleShowMore(prediction.pred)}
                                  >
                                    Show more
                                  </button>
                                )
                                  : (
                                    <button
                                      type="button"
                                      className="btn btn-primary w-fit"
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
