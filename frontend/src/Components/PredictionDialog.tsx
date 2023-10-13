import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Prediction } from '../models/Prediction';
import '../styles/scrollbar.css';

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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
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

  useEffect(() => {
    setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', () => {
      setIsMobile(window.innerWidth < 640);
    });
  }, []);
  return (
    <dialog id={`prediction-${index}`} className="modal modal-bottom sm:modal-middle">
      <form method="dialog" className="dark:bg-neutral-900 modal-box sm:w-11/12 sm:max-w-4xl p-8 scrollbar">
        <button
          onClick={() => closeModel()}
          type="button"
          className="dark:text-neutral-100 btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
        <h1 className="dark:text-neutral-100 text-xl font-varela">Predictions:</h1>
        <div className="hidden sm:grid grid-cols-3 gap-4">
          <div className="card border-4 border-secondary flex flex-col justify-between items-center p-4 gap-4 h-80 mt-auto">
            <h2 className="font-varela text-xl text-center text-secondary">{prediction?.pred.sort((a, b) => Number(b[0]) - Number(a[0]))[1][1]}</h2>
            <div className="radial-progress font-varela text-secondary text-xl" style={{ '--value': prediction?.pred.sort((a, b) => Number(b[0]) - Number(a[0]))[1][0] ? parseFloat(prediction?.pred.sort((a, b) => Number(b[0]) - Number(a[0]))[1][0]) * 100 : '0', '--size': '8rem', '--thickness': '0.75em' } as React.CSSProperties}>
              {/* eslint-disable-next-line prefer-template */}
              {prediction?.pred.sort((a, b) => Number(b[0]) - Number(a[0]))[1][0] ? (parseFloat(prediction?.pred.sort((a, b) => Number(b[0]) - Number(a[0]))[1][0]) * 100).toFixed(2) + '%' : 'N/A'}
            </div>
            <button type="button" className="btn text-white font-varela btn-secondary">More info</button>
          </div>

          <div className="card border-4 border-primary flex flex-col justify-between items-center p-4 gap-4 h-[22rem]">
            <h2 className="font-varela text-xl text-center font-bold text-primary">{prediction?.pred.sort((a, b) => Number(b[0]) - Number(a[0]))[0][1]}</h2>
            <div className="items-center">
              <div className="radial-progress font-varela text-primary text-xl" style={{ '--value': prediction?.pred.sort((a, b) => Number(b[0]) - Number(a[0]))[0][0] ? parseFloat(prediction?.pred.sort((a, b) => Number(b[0]) - Number(a[0]))[0][0]) * 100 : '0', '--size': '8rem', '--thickness': '0.75rem' } as React.CSSProperties}>
                {/* eslint-disable-next-line prefer-template */}
                {prediction?.pred.sort((a, b) => Number(b[0]) - Number(a[0]))[0][0] ? (parseFloat(prediction?.pred.sort((a, b) => Number(b[0]) - Number(a[0]))[0][0]) * 100).toFixed(2) + '%' : 'N/A'}
              </div>
            </div>
            <button type="button" className="btn text-white font-varela btn-primary">More info</button>
          </div>

          {/* Shortest Card (Right) */}
          <div className="card border-warning border-4 flex flex-col justify-between items-center p-4 gap-4 h-fit mt-auto">
            <h2 className="font-varela text-xl text-center text-warning">{prediction?.pred.sort((a, b) => Number(b[0]) - Number(a[0]))[2][1]}</h2>
            <div className="items-center">
              <div className="radial-progress font-varela text-warning text-xl" style={{ '--value': prediction?.pred.sort((a, b) => Number(b[0]) - Number(a[0]))[2][0] ? parseFloat(prediction?.pred.sort((a, b) => Number(b[0]) - Number(a[0]))[2][0]) * 100 : '0', '--size': '8rem', '--thickness': '0.75rem' } as React.CSSProperties}>
                {/* eslint-disable-next-line prefer-template */}
                {prediction?.pred.sort((a, b) => Number(b[0]) - Number(a[0]))[2][0] ? (parseFloat(prediction?.pred.sort((a, b) => Number(b[0]) - Number(a[0]))[2][0]) * 100).toFixed(2) + '%' : 'N/A'}
              </div>
            </div>
            <button type="button" className="btn text-white font-varela btn-warning">More info</button>
          </div>
        </div>
        <div className="hidden sm:divider" />
        <div className="dark:text-neutral-100 flex flex-col gap-4 mt-4 items-center">
          {prediction?.pred.sort((a, b) => Number(b[0]) - Number(a[0]))
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
