import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Prediction } from '../models/Prediction';

interface PredictionDialogProps {
  index: number;
  // eslint-disable-next-line react/require-default-props
  prediction?: Prediction;
}

// eslint-disable-next-line react/function-component-definition
const PredictionDialog: React.FC<PredictionDialogProps> = ({
  index,
  prediction,
}) => {
  const [numToShow, setNumToShow] = useState(5);
  const handleShowLess = () => {
    setNumToShow(5); // Show 5 predictions
  };
  const handleShowMore = (pred: string[][]) => {
    setNumToShow(pred.length); // Show all predictions
  };

  const closeModel = () => {
    const modal = document.getElementById(`prediction-${index}`)! as HTMLDialogElement;
    if (modal) {
      setNumToShow(5);
      modal.close();
    }
  };

  const isMobile = window.innerWidth < 640;
  return (
    <dialog id={`prediction-${index}`} className="modal  modal-bottom sm:modal-middle">
      <form method="dialog" className="modal-box sm:w-11/12 sm:max-w-4xl p-8">
        <button
          onClick={() => closeModel()}
          type="button"
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
        <h1 className="text-xl font-varela">Predictions:</h1>
        <div className="hidden sm:grid grid-cols-3 gap-4">
          <div className="card border-4 border-secondary flex flex-col justify-between items-center p-4 gap-4 h-80 mt-auto">
            <h2 className="font-varela text-xl text-center text-secondary">{prediction?.pred[1][1]}</h2>
            <div className="radial-progress font-varela text-secondary text-xl" style={{ '--value': prediction?.pred[1][0] ? parseFloat(prediction.pred[1][0]) * 100 : '0', '--size': '8rem', '--thickness': '0.75em' } as React.CSSProperties}>
              {/* eslint-disable-next-line prefer-template */}
              {prediction?.pred[1][0] ? (parseFloat(prediction.pred[1][0]) * 100).toFixed(2) + '%' : 'N/A'}
            </div>
            <button type="button" className="btn text-white font-varela btn-secondary">More info</button>
          </div>

          <div className="card border-4 border-primary flex flex-col justify-between items-center p-4 gap-4 h-[22rem]">
            <h2 className="font-varela text-xl text-center font-bold text-primary">{prediction?.pred[0][1]}</h2>
            <div className="items-center">
              <div className="radial-progress font-varela text-primary text-xl" style={{ '--value': prediction?.pred[0][0] ? parseFloat(prediction.pred[0][0]) * 100 : '0', '--size': '8rem', '--thickness': '0.75rem' } as React.CSSProperties}>
                {/* eslint-disable-next-line prefer-template */}
                {prediction?.pred[0][0] ? (parseFloat(prediction.pred[0][0]) * 100).toFixed(2) + '%' : 'N/A'}
              </div>
            </div>
            <button type="button" className="btn text-white font-varela btn-primary">More info</button>
          </div>

          {/* Shortest Card (Right) */}
          <div className="card border-warning border-4 flex flex-col justify-between items-center p-4 gap-4 h-fit mt-auto">
            <h2 className="font-varela text-xl text-center text-warning">{prediction?.pred[2][1]}</h2>
            <div className="items-center">
              <div className="radial-progress font-varela text-warning text-xl" style={{ '--value': prediction?.pred[2][0] ? parseFloat(prediction.pred[2][0]) * 100 : '0', '--size': '8rem', '--thickness': '0.75rem' } as React.CSSProperties}>
                {/* eslint-disable-next-line prefer-template */}
                {prediction?.pred[2][0] ? (parseFloat(prediction.pred[2][0]) * 100).toFixed(2) + '%' : 'N/A'}
              </div>
            </div>
            <button type="button" className="btn text-white font-varela btn-warning">More info</button>
          </div>
        </div>
        <div className="hidden sm:divider" />
        <div className="flex flex-col gap-4 mt-4 items-center">
          {prediction?.pred
            .sort((a, b) => Number(b[0]) - Number(a[0]))
            .slice(isMobile ? 0 : 3, numToShow)
            .map((pred, i) => (
              <div key={i} className="w-full">
                <div className="flex justify-between">
                  <p className="font-varela">{pred[1]}</p>
                  <p className="font-varela">
                    {(Number(pred[0]) * 100).toFixed(2)}
                    %
                  </p>
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
              className="btn btn-primary hover:!text-white font-varela btn-outline"
              onClick={() => handleShowLess()}
            >
              Show less
            </button>
          )}
        </div>
      </form>
      <form method="dialog" className="modal-backdrop">
        <button type="button" onClick={() => closeModel()}>
          close
        </button>
      </form>
    </dialog>
  );
};
export default PredictionDialog;
