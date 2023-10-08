import React, { useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import Chart from 'chart.js/auto';
import { Prediction } from '../models/Prediction';

interface PredictionDialogProps {
  index: number;
  // eslint-disable-next-line react/require-default-props
  prediction?: Prediction;
  numToShow: number;
  closeModel: (index: number) => void;
  handleShowMore: (pred: string[][]) => void;
  handleShowLess: () => void;
}

// eslint-disable-next-line react/function-component-definition
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

      const sortedPredictions = allPredictions.sort((a, b) => Number(b[0]) - Number(a[0]));

      const top3Predictions = sortedPredictions.slice(0, 3);
      const otherPredictions = sortedPredictions.slice(3);

      const top3Probabilities = top3Predictions.map((pred) => Number(pred[0]));

      const otherProbability = otherPredictions.reduce((sum, pred) => sum + Number(pred[0]), 0);

      const labels = [...top3Predictions.map((pred) => pred[1]), 'other'];
      const data = [...top3Probabilities, otherProbability];

      if (doughnutChartRef.current) {
        // eslint-disable-next-line no-new
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
        <h3 className="font-bold text-lg font-varela">Results:</h3>
        <div className="grid grid-cols-3 gap-4 px-12 py-12">
          {/* Second Tallest Card (Left) */}
          <div className="col-span-1 flex flex-col justify-center" style={{ marginTop: 'auto' }}>
            <div className="text-center mb-6 ">
              <h2 className="font-varela text-xl">{prediction?.pred[1][1]}</h2>
            </div>
            <div className="bg-primary text-primary-content card outline outline-4 h-64 flex flex-col justify-center" style={{ backgroundColor: '#38bdf8', outlineColor: '#38bdf8' }}>
              <div className="card-body flex flex-col items-center bg-white">
                <div className="radial-progress text-secondary text-xl" style={{ '--value': prediction?.pred[1][0] ? parseFloat(prediction.pred[1][0]) * 100 : '0', '--size': '8rem', '--thickness': '1.3rem' } as React.CSSProperties}>
                  {/* eslint-disable-next-line prefer-template */}
                  {prediction?.pred[1][0] ? (parseFloat(prediction.pred[1][0]) * 100).toFixed(1) + '%' : 'N/A'}
                </div>
                <button type="button" className="btn text-white btn-secondary mt-auto" style={{ width: '100%' }}>More info</button>
              </div>
            </div>
          </div>

          {/* Tallest Card (Middle) */}
          <div className="col-span-1 flex flex-col justify-center" style={{ marginTop: 'auto' }}>
            <div className="text-center mb-6 ">
              <h2 className="font-varela text-xl font-bold">{prediction?.pred[0][1]}</h2>
            </div>
            <div className="bg-primary text-primary-content card outline outline-4 h-80 flex flex-col justify-center" style={{ backgroundColor: '#4ade80', outlineColor: '#4ade80' }}>
              <div className="card-body flex flex-col items-center bg-white">
                <div className="items-center">
                  <div className="radial-progress text-primary text-xl" style={{ '--value': prediction?.pred[0][0] ? parseFloat(prediction.pred[0][0]) * 100 : '0', '--size': '9rem', '--thickness': '1.3rem' } as React.CSSProperties}>
                    {/* eslint-disable-next-line prefer-template */}
                    {prediction?.pred[0][0] ? (parseFloat(prediction.pred[0][0]) * 100).toFixed(1) + '%' : 'N/A'}
                  </div>
                </div>
                <button type="button" className="btn text-white btn-primary mt-auto" style={{ width: '100%' }}>More info</button>
              </div>
            </div>
          </div>

          {/* Shortest Card (Right) */}
          <div className="col-span-1 flex flex-col justify-center" style={{ marginTop: 'auto' }}>
            <div className="text-center mb-6 ">
              <h2 className="font-varela text-xl">{prediction?.pred[2][1]}</h2>
            </div>
            <div className="bg-primary text-primary-content card outline outline-4 flex flex-col justify-center" style={{ backgroundColor: '#fbbf24', outlineColor: '#fbbf24' }}>
              <div className="card-body flex flex-col items-center bg-white">
                <div className="items-center">
                  <div className="radial-progress text-warning text-xl" style={{ '--value': prediction?.pred[2][0] ? parseFloat(prediction.pred[2][0]) * 100 : '0', '--size': '7rem', '--thickness': '1.3rem' } as React.CSSProperties}>
                    {/* eslint-disable-next-line prefer-template */}
                    {prediction?.pred[2][0] ? (parseFloat(prediction.pred[2][0]) * 100).toFixed(1) + '%' : 'N/A'}
                  </div>
                </div>
                <button type="button" className="btn text-white btn-warning mt-auto" style={{ width: '100%' }}>More info</button>
              </div>
            </div>
          </div>
        </div>
        {/* <h3 className="font-bold text-lg font-varela">Results:</h3>
        <div className="flex flex-col items-center">
          <div className="mt-4 flex justify-center" style={{ width: '65%', height: '65%' }}>
            <canvas ref={doughnutChartRef} />
          </div>
        </div> */}
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
