import React, {
  useEffect, useState,
} from 'react';
import 'firebase/auth';
import {
  doc, collection, getDocs,
} from 'firebase/firestore';
import { User } from '@firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../enviroments/firebase';
import { PredictionTable } from '../../models/Prediction';
import { getImage } from '../../services/apiService';

function History() {
  const [predictions, setPredictions] = useState<PredictionTable[]>([]);
  const [user] = useAuthState(auth);
  const [itemsPerPage, setItemsPerPage] = useState(5); 
  const [currentPage, setCurrentPage] = useState(1);
  const getTopThree = (prediction: string[][]) => prediction.sort((a, b) => parseFloat(b[0]) - parseFloat(a[0])).slice(0, 3);

  const loadPredictionAndImages = async (currentUser: User) => {
    setPredictions([]);
    const userDocRef = doc(db, 'user', currentUser?.uid);
    const predictionsCollectionRef = collection(userDocRef, 'predictions');
    try {
      const predictionsSnapshot = await getDocs(predictionsCollectionRef);
      const predictionsList: PredictionTable[] = [];
      predictionsSnapshot.forEach((predictionDoc) => {
        const prediction: PredictionTable = {
          name: predictionDoc.data().name,
          date: predictionDoc.data().date.toDate(),
          prediction: JSON.parse(predictionDoc.data().prediction),
          imageHash: predictionDoc.data().imageHash,
          imageUrl: null,
        };
        predictionsList.push(prediction);
      });

      predictionsList.sort((a, b) => b.date.getTime() - a.date.getTime());

      await Promise.all(predictionsList.map(async (prediction, i) => {
        const image = await getImage(prediction.name, prediction.imageHash);
        predictionsList[i].imageUrl = URL.createObjectURL(image.data);
      }));
      setPredictions(predictionsList);
    } catch (e) {
      console.error('Error getting predictions:', e);
    }
  };

  useEffect(() => {
    if (user) {
      (async () => {
        await loadPredictionAndImages(user);
      })();
    }
  }, [user]);
  const totalPages = Math.ceil(predictions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedPredictions = predictions.slice(startIndex, endIndex);
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };
  return (
    <div className="flex  justify-center overflow-y-auto pt-28 pb-4 h-full">
      {predictions.length === 0 ? (
        <span className="loading loading-spinner text-primary loading-lg" />
      ) : (
        <div className="max-w-4xl w-11/12 overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Image </th>
                <th className="hidden md:flex">Model</th>
                <th>Predictions</th>
              </tr>
            </thead>
            <tbody>

              {displayedPredictions && (
                displayedPredictions.map((prediction, index)=> {
                  const topThreePredictions = getTopThree(prediction.prediction);
                  return (
                    <tr key={index} className="hover:bg-neutral-100 transition-all ease-in-out duration-300 cursor-pointer">
                      <td>{prediction.date.toLocaleString()}</td>

                      <td>
                        <div className="flex gap-4">
                          {prediction.imageUrl ? (
                            <img className="w-24 rounded-md" src={prediction.imageUrl} alt={prediction.name} />
                          ) : (
                            <p>Loading image...</p>
                          )}

                          <span className="hidden truncate lg:flex items-center">
                            {prediction.name}
                          </span>
                        </div>
                      </td>
                      <td className="hidden md:table-cell">
                        model_name
                      </td>
                      <td>
                        <div className="flex flex-col gap-2">
                          {topThreePredictions.map((pred, i) => (
                            <span
                              key={i}
                              className={`badge badge-outline ${i === 0 && 'badge-primary hover:bg-primary hover:text-white'} ${i === 1 && 'badge-secondary hover:bg-secondary hover:text-white'} ${i === 2 && 'badge-warning hover:bg-warning hover:text-white'}`}
                            >
                              {pred[1]}
                              :
                              {(parseFloat(pred[0]) * 100).toFixed(0)}
                              %
                            </span>

                          ))}
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
          <div className="flex justify-between">
          <div className="join">
          <button
                className={`join-item btn ${currentPage === 1 ? 'cursor-not-allowed' : ''}`}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                «
              </button>
              <select className="select select-bordered join-item" onChange={(e) => setCurrentPage(Number(e.target.value))} value={currentPage}>
                {Array.from({ length: totalPages }, (_, i) => (
                  <option key={i} value={i + 1}>
                    Page {i + 1}
                  </option>
                ))}
              </select>
              <button
                className={`join-item btn ${currentPage === totalPages ? 'cursor-not-allowed' : ''}`}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                »
              </button>           
              </div>

            <div className="flex items-center">
              <span className="mr-2">Items per page:</span> 
              <select
                className="select select-bordered join-item"
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                value={itemsPerPage}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

export default History;
