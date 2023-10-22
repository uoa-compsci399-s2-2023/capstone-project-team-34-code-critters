import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Prediction } from '../models/Prediction';
import '../styles/scrollbar.css';
import { getInsectCount, getInsectInfo } from '../services/apiService';

interface InsectInfoProps {
  name: string,
  textColor: string
}

// eslint-disable-next-line react/function-component-definition
const InsectInfo: React.FC<InsectInfoProps> = ({ name, textColor }) => {
  const [insectInfo, setInsectInfo] = useState<any>();
  const [insectCount, setInsectCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchInsectCount = async (genusKey: string) => {
    setIsLoading(true);
    try {
      const res = await getInsectCount(genusKey);
      if (res.status === 200) {
        const { data } = res;
        setInsectCount(data.count);
      }
    } catch (error) {
      console.error('Network error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchInsectInfo = async () => {
    setIsLoading(true);
    try {
      const res = await getInsectInfo(name);
      if (res.status === 200) {
        const { data } = res;
        setInsectInfo(data);
        fetchInsectCount(res.data.genus_key);
      }
    } catch (error) {
      console.error('Network error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInsectInfo();
  }, []);
  return (
    <div className={`max-h-[216px] overflow-y-auto scrollbar flex items-center h-[100%] ${isLoading ? `loading text-${textColor} loading-spinner` : ''}`}>
      {
        insectInfo ? (
          <p className={`text-${textColor}`}>
            scientific name:
            {' '}
            {insectInfo?.scientific_name}
            <br />
            canonical name:
            {' '}
            {insectInfo?.canonical_name}
            <br />
            genus name:
            {' '}
            {insectInfo?.genus_name}
            <br />
            kingdom:
            {' '}
            {insectInfo?.kingdom}
            <br />
            phylum:
            {' '}
            {insectInfo?.phylum}
            <br />
            order:
            {' '}
            {insectInfo?.order}
            <br />
            family:
            {' '}
            {insectInfo?.family}
            <br />
            class:
            {' '}
            {/* eslint-disable-next-line no-underscore-dangle */}
            {insectInfo?._class}
            <br />
            Occurance count:
            {' '}
            {insectCount}
          </p>
        ) : (
          <p className={`text-${textColor}`}>
            No information found
          </p>
        )
      }
    </div>
  );
};

interface PredictionDialogProps {
  index: number;
  prediction: Prediction;
}

// eslint-disable-next-line react/function-component-definition
const PredictionDialog: React.FC<PredictionDialogProps> = ({
  index,
  prediction,
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [numToShow, setNumToShow] = useState(5);
  const [showInsectInfoCards, setShowInsectInfoCards] = useState<boolean[]>([false, false, false]);
  const [isLoading, setIsLoading] = useState(true);

  const handleShowLess = () => {
    setNumToShow(5);
  };

  const handleShowMore = (pred: string[][]) => {
    setNumToShow(pred.length);
  };

  const closeModel = () => {
    const modal = document.getElementById(`prediction-${index}`) as HTMLDialogElement;
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

  const toggleInfo = (cardIndex: number) => {
    setShowInsectInfoCards((prev) => {
      const newShowInsectInfoCards = [...prev];
      newShowInsectInfoCards[cardIndex] = !prev[cardIndex];
      return newShowInsectInfoCards;
    });
  };

  return (
    <dialog id={`prediction-${index}`} className="modal modal-bottom sm:modal-middle">
      <form method="dialog" className="dark:bg-neutral-900 modal-box sm:w-11/12 sm:max-w-4xl p-8 scrollbar">
        <button
          onClick={() => closeModel()}
          type="button"
          className="w-12 h-12 dark:text-neutral-100 btn btn-sm btn-circle btn-ghost absolute top-4 right-4"
        >
          <FontAwesomeIcon icon={faXmark} size="lg" />
        </button>
        <h1 className="dark:text-neutral-100 text-xl font-varela">Predictions:</h1>
        <div className="hidden sm:grid grid-cols-3 gap-4">

          <div className="insect-info">
            <div
              className="card border-4 border-secondary flex flex-col justify-between items-center p-4 gap-4 h-[20rem] mt-8 transition-all hover:scale-105"
            >
              {
                showInsectInfoCards[0] ? (
                  <InsectInfo
                    name={prediction?.pred.sort((a, b) => Number(b[0]) - Number(a[0]))[1][1]}
                    textColor="secondary"
                  />
                ) : (
                  <>
                    <h2 className="font-varela text-xl text-center text-secondary">{prediction?.pred.sort((a, b) => Number(b[0]) - Number(a[0]))[1][1]}</h2>
                    <div className="radial-progress font-varela text-secondary text-xl" style={{ '--value': prediction?.pred.sort((a, b) => Number(b[0]) - Number(a[0]))[1][0] ? parseFloat(prediction?.pred.sort((a, b) => Number(b[0]) - Number(a[0]))[1][0]) * 100 : '0', '--size': '8rem', '--thickness': '0.75em' } as React.CSSProperties}>
                      {prediction?.pred.sort((a, b) => Number(b[0]) - Number(a[0]))[1][0] ? `${(parseFloat(prediction?.pred.sort((a, b) => Number(b[0]) - Number(a[0]))[1][0]) * 100).toFixed(2)}%` : 'N/A'}
                    </div>
                  </>
                )
              }
              <button
                type="button"
                className="btn text-white font-varela btn-secondary"
                onClick={() => toggleInfo(0)}
              >
                {
                  showInsectInfoCards[0] ? 'Close' : 'More info'
                }
              </button>
            </div>
          </div>

          <div className="insect-info">
            <div
              className="card border-4 border-primary flex flex-col justify-between items-center p-4 gap-4 h-[22rem] transition-all hover:scale-105"
            >
              {
                showInsectInfoCards[1] ? (
                  <InsectInfo
                    name={prediction?.pred.sort((a, b) => Number(b[0]) - Number(a[0]))[0][1]}
                    textColor="primary"
                  />
                ) : (
                  <>
                    <h2 className="font-varela text-xl text-center font-bold text-primary">{prediction?.pred.sort((a, b) => Number(b[0]) - Number(a[0]))[0][1]}</h2>
                    <div className="radial-progress font-varela text-primary text-xl" style={{ '--value': prediction?.pred.sort((a, b) => Number(b[0]) - Number(a[0]))[0][0] ? parseFloat(prediction?.pred.sort((a, b) => Number(b[0]) - Number(a[0]))[0][0]) * 100 : '0', '--size': '8rem', '--thickness': '0.75em' } as React.CSSProperties}>
                      {prediction?.pred.sort((a, b) => Number(b[0]) - Number(a[0]))[0][0] ? `${(parseFloat(prediction?.pred.sort((a, b) => Number(b[0]) - Number(a[0]))[0][0]) * 100).toFixed(2)}%` : 'N/A'}
                    </div>
                  </>
                )
              }
              <button
                type="button"
                className="btn text-white font-varela btn-primary"
                onClick={() => toggleInfo(1)}
              >
                {
                  showInsectInfoCards[1] ? 'Close' : 'More info'
                }
              </button>
            </div>
          </div>

          <div className="insect-info">
            <div
              className="card border-warning border-4 flex flex-col justify-between items-center p-4 gap-4 h-[19rem] mt-12 transition-all hover:scale-105"
            >
              {
                showInsectInfoCards[2] ? (
                  <InsectInfo
                    name={prediction?.pred.sort((a, b) => Number(b[0]) - Number(a[0]))[2][1]}
                    textColor="warning"
                  />
                ) : (
                  <>
                    <h2 className="font-varela text-xl text-center text-warning">{prediction?.pred.sort((a, b) => Number(b[0]) - Number(a[0]))[2][1]}</h2>
                    <div className="radial-progress font-varela text-warning text-xl" style={{ '--value': prediction?.pred.sort((a, b) => Number(b[0]) - Number(a[0]))[2][0] ? parseFloat(prediction?.pred.sort((a, b) => Number(b[0]) - Number(a[0]))[2][0]) * 100 : '0', '--size': '8rem', '--thickness': '0.75rem' } as React.CSSProperties}>
                      {/* eslint-disable-next-line prefer-template */}
                      {prediction?.pred.sort((a, b) => Number(b[0]) - Number(a[0]))[2][0] ? (parseFloat(prediction?.pred.sort((a, b) => Number(b[0]) - Number(a[0]))[2][0]) * 100).toFixed(2) + '%' : 'N/A'}
                    </div>
                  </>
                )
              }
              <button
                type="button"
                className="btn text-white font-varela btn-warning"
                onClick={() => toggleInfo(2)}
              >
                {
                  showInsectInfoCards[2] ? 'Close' : 'More info'
                }
              </button>
            </div>
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
                  className="progress progress-primary w-full dark:bg-neutral-700"
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
