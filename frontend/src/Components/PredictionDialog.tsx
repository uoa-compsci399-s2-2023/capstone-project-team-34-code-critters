import React, { useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faChartBar } from '@fortawesome/free-solid-svg-icons';
import { Prediction } from '../../src/models/Prediction';
import Chart from 'chart.js/auto';

interface PredictionDialogProps {
  index: number;
  prediction?: Prediction;
  numToShow: number;
  closeModel: (index: number) => void;
  handleShowMore: (pred: string[][]) => void;
  handleShowLess: () => void;
}

const PredictionDialog: React.FC<PredictionDialogProps> = ({
  index,
  prediction,
  numToShow,
  closeModel,
  handleShowMore,
  handleShowLess,
}) => {
  const doughnutChartRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (prediction) {
      const allPredictions = prediction.pred;
  
      // Sort the predictions by probability in descending order
      const sortedPredictions = allPredictions.sort((a, b) => Number(b[0]) - Number(a[0]));
  
      // Select the top 3 predictions and calculate the total probability of the rest
      const top3Predictions = sortedPredictions.slice(0, 3);
      const otherPredictions = sortedPredictions.slice(3);
  
      const top3Probabilities = top3Predictions.map((pred) => Number(pred[0]));
  
      // Calculate the probability of the 'Other' category
      const otherProbability = otherPredictions.reduce(
        (sum, pred) => sum + Number(pred[0]),
        0
      );
  
      // Create labels and data for the chart, including 'Other'
      const labels = [...top3Predictions.map((pred) => pred[1]), 'other'];
      const data = [...top3Probabilities, otherProbability];
  
      if (doughnutChartRef.current) {
        new Chart(doughnutChartRef.current, {
          type: 'doughnut',
          data: {
            labels,
            datasets: [
              {
                data,
                backgroundColor: ['#4ade80', '#42CEBE', '#3DC5E3', '#38bdf8'], // Add colors for 'Other' and additional categories here
              },
            ],
          },
          options: {
            plugins: {
              legend: {
                position: 'bottom', // Position the legend at the bottom
                labels: {
                  font: {
                    size: 17, // Adjust the font size for legend labels
                  },
                },
              },
            },
          },
        });
      }
    }
  }, [prediction]);
  

  return (
    <dialog id={`prediction-${index}`} className="modal  modal-bottom sm:modal-middle">
      <form method="dialog" className="modal-box sm:w-11/12 sm:max-w-4xl">
        <button
          onClick={() => closeModel(index)}
          type="button"
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
        <div className="grid grid-cols-3 gap-4">
  {/* Second Tallest Card (Left) */}
  <div className="col-span-1 bg-primary text-primary-content card h-56" style={{ marginTop: 'auto' }}>
    <div className="card-body">
      <h2 className="card-title">Second Place</h2>
      <p>If a dog chews shoes whose shoes does he choose?</p>
      <div className="card-actions justify-center">
        <button className="btn">More info</button>
      </div>
    </div>
  </div>

  {/* Tallest Card (Middle) */}
  <div className="col-span-1 bg-primary text-primary-content card h-80" style={{ marginTop: 'auto' }}>
    <div className="card-body">
      <h2 className="card-title">First Place</h2>
      <p>If a dog chews shoes whose shoes does he choose?</p>
      <div className="card-actions justify-center">
        <button className="btn">More info</button>
      </div>
    </div>
  </div>

  {/* Shortest Card (Right) */}
  <div className="col-span-1 bg-primary text-primary-content card h-48" style={{ marginTop: 'auto' }}>
    <div className="card-body">
      <h2 className="card-title">Third Place</h2>
      <p>If a dog chews shoes whose shoes does he choose?</p>
      <div className="card-actions justify-center">
        <button className="btn">More info</button>
      </div>
    </div>
  </div>
</div>

        <h3 className="font-bold text-lg font-varela">Results:</h3>
        <div className="flex flex-col items-center">
          <div className="mt-4 flex justify-center" style={{ width: '65%', height: '65%' }}>
            <canvas ref={doughnutChartRef} />
          </div>
        </div>
        <div className="flex flex-col gap-4 mt-4 items-center">
          {prediction?.pred
            .sort((a, b) => Number(b[0]) - Number(a[0]))
            .slice(0, numToShow)
            .map((pred, i) => (
              <div key={i} className="w-full">
                <div className="flex justify-between">
                  <p className="font-varela">{pred[1]}</p>
                  <p className="font-varela text-primary">{Number(pred[0]).toFixed(4)}</p>
                </div>
                <progress
                  className="progress progress-primary w-full"
                  value={Number(pred[0]) * 100}
                  max="100"
                />
              </div>
            ))}
          {prediction?.pred.length! > numToShow ? (
            <button
              type="button"
              className="btn btn-primary hover:!text-white font-varela btn-outline"
              onClick={() => handleShowMore(prediction!.pred)}
            >
              Show more
            </button>
          ) : (
            <button
              type="button"
              className="btn btnd-primary hover:!text-white font-varela btn-outline"
              onClick={() => handleShowLess()}
            >
              Show less
            </button>
          )}
        </div>
      </form>
      <form method="dialog" className="modal-backdrop">
        <button type="button" onClick={() => closeModel(index)}>
          close
        </button>
      </form>
    </dialog>
  );
};

export default PredictionDialog;
