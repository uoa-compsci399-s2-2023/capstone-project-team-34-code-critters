import React, {
  MouseEvent,
  useEffect, useState,
} from 'react';
import 'firebase/auth';
import {
  doc, collection, getDocs, deleteDoc,
} from 'firebase/firestore';
import { User } from '@firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight, faArrowLeft, faTrash, faFileCsv, faFileExcel,
} from '@fortawesome/free-solid-svg-icons';
import { auth, db } from '../../enviroments/firebase';
import { PredictionTable, Prediction } from '../../models/Prediction';
import { getCSV, getImage, getXLSX } from '../../services/apiService';
import PredictionDialog from '../../Components/PredictionDialog';

function History() {
  const [tablePredictions, setTablePredictions] = useState<
  PredictionTable[]
  >([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [user] = useAuthState(auth);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('name');
  const [isChecked, setIsChecked] = useState<boolean[]>([]);

  const getTopThree = (prediction: string[][]) => prediction
    .sort((a, b) => parseFloat(b[0]) - parseFloat(a[0]))
    .slice(0, 3);
  const loadPredictionAndImages = async (currentUser: User) => {
    setIsLoading(true);
    setTablePredictions([]);
    setPredictions([]);
    setIsChecked([]);
    const userDocRef = doc(db, 'user', currentUser?.uid);
    const predictionsCollectionRef = collection(userDocRef, 'predictions');
    try {
      const predictionsSnapshot = await getDocs(predictionsCollectionRef);
      const predictionsList: PredictionTable[] = [];
      predictionsSnapshot.forEach((predictionDoc) => {
        const predictionTable: PredictionTable = {
          id: predictionDoc.id,
          name: predictionDoc.data().name,
          date: predictionDoc.data().date.toDate(),
          prediction: JSON.parse(predictionDoc.data().prediction),
          imageHash: predictionDoc.data().imageHash,
          imageUrl: null,
          model: predictionDoc.data().model ? predictionDoc.data().model : 'N/A',
        };
        predictionsList.push(predictionTable);
      });

      predictionsList.sort((a, b) => b.date.getTime() - a.date.getTime());

      const prediction: Prediction[] = predictionsList.map((predictionTable) => ({
        name: predictionTable.name,
        pred: predictionTable.prediction,
        hash: predictionTable.imageHash,
        model: predictionTable.model,
      }));

      await Promise.all(predictionsList.map(async (predictionTable, i) => {
        const image = await getImage(predictionTable.name, predictionTable.imageHash);
        predictionsList[i].imageUrl = URL.createObjectURL(image.data);
      }));

      setPredictions(prediction);
      setIsChecked(Array(prediction.length).fill(false));
      setTablePredictions(predictionsList);
    } catch (e) {
      console.error('Error getting predictions:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      (async () => {
        try {
          setIsLoading(true);
          await loadPredictionAndImages(user);
        } finally {
          setIsLoading(false);
        }
      })();
    }
  }, [user]);
  const filteredPredictions = tablePredictions.filter((prediction) => {
    switch (filterCategory) {
      case 'name':
        return prediction.name.toLowerCase().includes(filter.toLowerCase());
      case 'date':
        return prediction.date.toLocaleString().toLowerCase().includes(filter.toLowerCase());
      case 'model':
        return prediction.model?.toLowerCase().includes(filter.toLowerCase());
      default:
        return prediction.name.toLowerCase().includes(filter.toLowerCase());
    }
  });

  const totalPages = Math.ceil(filteredPredictions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const deletePrediction = async (prediction: PredictionTable) => {
    if (!user) return;
    const updatedTablePredictions = tablePredictions.filter(
      (p) => p.id !== prediction.id,
    );

    setTablePredictions(updatedTablePredictions);

    const updatedPredictions = predictions.filter((p) => p.name !== prediction.name);
    setPredictions(updatedPredictions);

    const userDocRef = doc(db, 'user', user?.uid);
    const predictionsCollectionRef = collection(userDocRef, 'predictions');
    const predictionDocRef = doc(predictionsCollectionRef, prediction.id);

    try {
      await deleteDoc(predictionDocRef);
    } catch (e) {
      console.error('Error deleting prediction:', e);
    }
  };

  const openModal = (event: MouseEvent<HTMLTableRowElement>, index: number) => {
    // eslint-disable-next-line max-len
    if (event.target instanceof HTMLButtonElement || event.target instanceof SVGElement || event.target instanceof SVGPathElement || event.target instanceof HTMLInputElement) return;
    const modal = document.getElementById(`prediction-${index}`)! as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  };

  const handleCheckbox = (index: number) => {
    const newCheck = [...isChecked];
    newCheck[index] = !newCheck[index];
    setIsChecked(newCheck);
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

  // eslint-disable-next-line max-len
  const getOriginalIndex = (prediction: PredictionTable) => tablePredictions.findIndex((pred) => pred.id === prediction.id);

  return (
    <div className="flex justify-center overflow-x-hidden pt-24 pb-4 h-fit w-full">
      {isLoading ? (
        <span className="loading loading-spinner text-primary loading-lg absolute -translate-y-1/2 top-1/2 -translate-x-1/2 left-1/2" />
      ) : (
        <div className="max-w-5xl xl:max-w-6xl w-11/12">
          <div className="sm:px-2 pb-2 flex items-center justify-between">
            <div className="join">
              <div className="tooltip tooltip-bottom" data-tip="Filter by">
                <select
                  className="dark:bg-neutral-900 dark:text-neutral-100 dark:border-white select select-bordered join-item !rounded-l-lg"
                  value={filterCategory}
                  onChange={(e) => {
                    setFilterCategory(e.target.value);
                  }}
                >
                  <option value="name">Image name</option>
                  <option value="date">Date</option>
                  <option value="model">Model Name</option>
                </select>
              </div>
              <input
                placeholder="Filter"
                className="dark:bg-neutral-900 dark:text-neutral-100 dark:border-white input input-bordered join-item w-full"
                onChange={(e) => {
                  e.preventDefault();
                  setFilter(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div className="hidden sm:flex gap-4 items-center">
              <button
                disabled={isLoading}
                className="btn btn-primary btn-outline hover:!text-white font-varela"
                type="button"
                onClick={() => {
                  const newCheck = [...isChecked];
                  if (newCheck.some((check) => check)) {
                    newCheck.forEach((_, index) => {
                      newCheck[index] = false;
                    });
                  } else {
                    newCheck.forEach((_, index) => {
                      newCheck[index] = true;
                    });
                  }
                  setIsChecked(newCheck);
                }}
              >
                {isChecked.some((value) => value) ? 'Deselect All' : 'Select All'}
              </button>

              <div className="join">
                <div className="tooltip tooltip-bottom font-varela " data-tip="Download predictions as CSV">
                  <button
                    type="button"
                    className="btn btn-secondary btn-outline hover:!text-white join-item dark:disabled:bg-neutral-800 dark:disabled:text-neutral-100 dark:disabled:border-none"
                    disabled={isChecked.every((value) => !value)}
                    onClick={downloadPredictionsCSV}
                  >
                    <FontAwesomeIcon icon={faFileCsv} />
                  </button>
                </div>
                <div className="tooltip tooltip-bottom font-varela " data-tip="Download predictions as XLSX">
                  <button
                    type="button"
                    className="btn btn-secondary btn-outline hover:!text-white aspect-square join-item dark:disabled:bg-neutral-800 dark:disabled:text-neutral-100 dark:disabled:border-none"
                    onClick={downloadPredictionsXLSX}
                    disabled={isChecked.every((value) => !value)}
                  >
                    <FontAwesomeIcon icon={faFileExcel} />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full">
            <table className="table table-auto dark:text-neutral-100">
              <thead>
                <tr>
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  <th className="p-2 hidden sm:table-cell" />
                  <th className="p-2 dark:text-neutral-100">Date</th>
                  <th className="p-2 dark:text-neutral-100">Image </th>
                  <th className="p-2 hidden md:table-cell dark:text-neutral-100">Model</th>
                  <th className="p-2 dark:text-neutral-100">Predictions</th>
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  <th className="p-2 hidden md:table-cell" />
                </tr>
              </thead>
              <tbody>
                {!isLoading && (
                  filteredPredictions.slice(startIndex, endIndex).map((prediction, index) => {
                    const topThreePredictions = getTopThree(prediction.prediction);
                    return (
                      <tr
                        key={index}
                        className="hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all ease-in-out duration-300 cursor-pointer"
                        onClick={(e) => {
                          openModal(e, getOriginalIndex(prediction));
                        }}
                      >
                        <td className="p-2 hidden sm:table-cell">
                          <input
                            type="checkbox"
                            checked={isChecked[getOriginalIndex(prediction)] || false}
                            onChange={() => {
                              handleCheckbox(getOriginalIndex(prediction));
                            }}
                            className="checkbox checkbox-lg checkbox-primary"
                          />
                        </td>
                        <td className="p-2">{prediction.date.toLocaleString()}</td>

                        <td className="p-2">
                          <div className="flex gap-4">
                            {prediction.imageUrl ? (
                              <div className="w-32 h-16 flex items-center justify-center">
                                <img className="max-w-32 max-h-16 rounded-md" src={prediction.imageUrl} alt={prediction.name} />
                              </div>
                            ) : (
                              <p>Loading image...</p>
                            )}

                            <span className="hidden truncate lg:flex items-center">
                              {prediction.name}
                            </span>
                          </div>
                        </td>
                        <td className="p-2 hidden md:table-cell">
                          {prediction.model}
                        </td>
                        <td className="p-2">
                          <div className="flex flex-col gap-2">
                            {topThreePredictions.map((pred, i) => (
                              <span
                                key={i}
                                className={`badge badge-outline truncate ${i === 0 && 'badge-primary hover:bg-primary hover:text-white hover:border-primary'} ${i === 1 && 'badge-secondary hover:bg-secondary hover:text-white hover:border-secondary'} ${i === 2 && 'badge-warning hover:bg-warning hover:text-white hover:border-warning'}`}
                              >
                                {pred[1]}
                                :
                                {(parseFloat(pred[0]) * 100).toFixed(2)}
                                %
                              </span>

                            ))}
                          </div>
                        </td>

                        <td className="p-2 hidden sm:table-cell">
                          <div className="tooltip" data-tip="Delete prediction">
                            <button
                              type="button"
                              className="btn btn-squre btn-outline btn-error hover:!text-white"
                              onClick={() => deletePrediction(prediction)}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end sm:justify-start xl:justify-end px-2 pt-4">
            <div className="join items-center">
              <div className="tooltip" data-tip="item per page">
                <select
                  className="select dark:bg-neutral-900 dark:text-neutral-100 dark:border-white select-bordered join-item rounded-lg !rounded-l-lg"
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  value={itemsPerPage}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
              <button
                type="button"
                className={`join-item btn dark:disabled:bg-neutral-800 ${currentPage === 1 ? 'cursor-not-allowed ' : 'dark:bg-neutral-900'}`}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <div className="dark:text-neutral-100">
                  <FontAwesomeIcon icon={faArrowLeft} />
                </div>

              </button>
              <select className="dark:bg-neutral-900 dark:text-neutral-100 dark:border-white select select-bordered join-item" onChange={(e) => setCurrentPage(Number(e.target.value))} value={currentPage}>
                {Array.from({ length: totalPages }, (_, i) => (
                  <option key={i} value={i + 1}>
                    Page
                    {' '}
                    {i + 1}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className={`join-item btn dark:disabled:bg-neutral-800 ${currentPage === totalPages ? 'cursor-not-allowed' : 'dark:bg-neutral-900'}`}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <div className="dark:text-neutral-100">
                  <FontAwesomeIcon icon={faArrowRight} />
                </div>
              </button>
            </div>
          </div>
          {predictions.map((prediction, index) => (
            <PredictionDialog
              key={index}
              index={index}
              prediction={prediction}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default History;
