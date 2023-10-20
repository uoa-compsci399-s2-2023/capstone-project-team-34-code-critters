import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Prediction } from '../models/Prediction';
import '../styles/scrollbar.css';

interface PredictionDialogProps {
  index: number;
  prediction?: Prediction;
}

const PredictionDialog: React.FC<PredictionDialogProps> = ({
  index,
  prediction,
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [numToShow, setNumToShow] = useState(5);
  const [insectInfoCard0, setInsectInfoCard0] = useState<any>(null);
  const [insectInfoCard1, setInsectInfoCard1] = useState<any>(null);
  const [insectInfoCard2, setInsectInfoCard2] = useState<any>(null);
  const [showInsectInfoCard0, setShowInsectInfoCard0] = useState(false);
  const [showInsectInfoCard1, setShowInsectInfoCard1] = useState(false);
  const [showInsectInfoCard2, setShowInsectInfoCard2] = useState(false);
  const [insectCount, setInsectCount] = useState<number | null>(null);

  const handleShowLess = () => {
    setNumToShow(5);
    setShowInsectInfoCard0(false);
    setShowInsectInfoCard1(false);
    setShowInsectInfoCard2(false);
  };

  const handleShowMore = (pred: string[][]) => {
    setNumToShow(pred.length);
    setShowInsectInfoCard0(false);
    setShowInsectInfoCard1(false);
    setShowInsectInfoCard2(false);
  };

  const closeModel = () => {
    const modal = document.getElementById(`prediction-${index}`) as HTMLDialogElement;
    if (modal) {
      setNumToShow(5);
      setShowInsectInfoCard0(false);
      setShowInsectInfoCard1(false);
      setShowInsectInfoCard2(false);
      modal.close();
    }
  };

  const closeInsectInfo = (cardIndex: number) => {
    if (cardIndex === 0) {
      setShowInsectInfoCard0(false);
    } else if (cardIndex === 1) {
      setShowInsectInfoCard1(false);
    } else if (cardIndex === 2) {
      setShowInsectInfoCard2(false);
    }
  };

  const fetchInsectInfo = async (name: string, cardIndex: number) => {
    try {
      const response = await fetch(`https://crittersleuthbackend.keshuac.com/api/v1/get_insect_info?name=${name}`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (cardIndex === 0) {
          setInsectInfoCard0(data);
        } else if (cardIndex === 1) {
          setInsectInfoCard1(data);
        } else if (cardIndex === 2) {
          setInsectInfoCard2(data);
        }
        fetchInsectCount(data.genus_key);
      } else {
        if (cardIndex === 0) {
          setInsectInfoCard0({ message: 'No extra information available' });
        } else if (cardIndex === 1) {
          setInsectInfoCard1({ message: 'No extra information available' });
        } else if (cardIndex === 2) {
          setInsectInfoCard2({ message: 'No extra information available' });
        }
      }
      if (cardIndex === 0) {
        setShowInsectInfoCard0(true);
      } else if (cardIndex === 1) {
        setShowInsectInfoCard1(true);
      } else if (cardIndex === 2) {
        setShowInsectInfoCard2(true);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  const fetchInsectCount = async (genusKey: string) => {
    try {
      const response = await fetch(`https://crittersleuthbackend.keshuac.com/api/v1/get_insect_occurances_count?genusKey=${genusKey}`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setInsectCount(data.count);
      } else {
        setInsectCount(0);
        console.error('Failed to fetch insect count');
      }
    } catch (error) {
      console.error('Network error:', error);
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
          className="w-12 h-12 dark:text-neutral-100 btn btn-sm btn-circle btn-ghost absolute top-4 right-4"
        >
          <FontAwesomeIcon icon={faXmark} size="lg" />
        </button>
        <h1 className="dark:text-neutral-100 text-xl font-varela">Predictions:</h1>
        <div className="hidden sm:grid grid-cols-3 gap-4">
          {/* Card 1 */}
          {showInsectInfoCard0 ? (
            <div className={`insect-info`}>
              <div
                className={`card border-4 border-secondary flex flex-col justify-between items-center p-4 gap-4 h-80 mt-8 transition-all hover:scale-105 ${showInsectInfoCard0 ? 'show-insect-info' : ''}`}
              >
                {insectInfoCard0 && insectInfoCard0.message ? (
                  <p className="text-secondary">{insectInfoCard0.message}</p>
                ) : (
                  <>
                    <p className="text-secondary">scientific_name: {insectInfoCard0.scientific_name}
                      <br></br>kingdom: {insectInfoCard0.kingdom}
                      <br></br>phylum: {insectInfoCard0.phylum}
                      <br></br>order: {insectInfoCard0.order}
                      <br></br>family: {insectInfoCard0.family}
                      <br></br>genus_name: {insectInfoCard0.genus_name}
                      <br></br>class: {insectInfoCard0._class}
                      <br></br>count: {insectCount}
                    </p>
                  </>
                )}
                <button type="button" className="btn text-white font-varela btn-secondary" onClick={() => closeInsectInfo(0)}>
                  Close
                </button>
              </div>
            </div>
          ) : (
            <div className="insect-info">
              <div
                className={`card border-4 border-secondary flex flex-col justify-between items-center p-4 gap-4 h-80 mt-8 transition-all hover:scale-105 ${showInsectInfoCard0 ? 'show-insect-info' : ''}`}
              >
                <h2 className="font-varela text-xl text-center text-secondary">{prediction?.pred.sort((a, b) => Number(b[0]) - Number(a[0]))[1][1]}</h2>
                <div className="radial-progress font-varela text-secondary text-xl" style={{ '--value': prediction?.pred.sort((a, b) => Number(b[0]) - Number(a[0]))[1][0] ? parseFloat(prediction?.pred.sort((a, b) => Number(b[0]) - Number(a[0]))[1][0]) * 100 : '0', '--size': '8rem', '--thickness': '0.75em' } as React.CSSProperties}>
                  {prediction?.pred.sort((a, b) => Number(b[0]) - Number(a[0]))[1][0] ? (parseFloat(prediction?.pred.sort((a, b) => Number(b[0]) - Number(a[0]))[1][0]) * 100).toFixed(2) + '%' : 'N/A'}
                </div>
                <button
                  type="button"
                  className="btn text-white font-varela btn-secondary"
                  onClick={() => {
                    if (prediction) {
                      const insectName = prediction.pred.sort((a, b) => Number(b[0]) - Number(a[0]))[1][1];
                      fetchInsectInfo(insectName, 0);
                    }
                  }}
                >
                  More info
                </button>
              </div>
            </div>
          )}

          {/* Card 2 */}
          {showInsectInfoCard1 ? (
            <div className="insect-info">
              <div
                className={`card border-4 border-primary flex flex-col justify-between items-center p-4 gap-4 h-[22rem] transition-all hover:scale-105 ${showInsectInfoCard1 ? 'show-insect-info' : ''}`}
              >
                {insectInfoCard1 && insectInfoCard1.message ? (
                  <p className="text-primary">{insectInfoCard1.message}</p>
                ) : (
                  <>
                    <p className="text-primary">scientific_name: {insectInfoCard1.scientific_name}
                      <br></br>kingdom: {insectInfoCard1.kingdom}
                      <br></br>phylum: {insectInfoCard1.phylum}
                      <br></br>order: {insectInfoCard1.order}
                      <br></br>family: {insectInfoCard1.family}
                      <br></br>genus_name: {insectInfoCard1.genus_name}
                      <br></br>class: {insectInfoCard1._class}
                      <br></br>count: {insectInfoCard1}
                    </p>
                  </>
                )}
                <button type="button" className="btn text-white font-varela btn-primary" onClick={() => closeInsectInfo(1)}>
                  Close
                </button>
              </div>
            </div>
          ) : (
            <div className="insect-info">
              <div
                className={`card border-4 border-primary flex flex-col justify-between items-center p-4 gap-4 h-[22rem] transition-all hover:scale-105 ${showInsectInfoCard1 ? 'show-insect-info' : ''}`}
              >
                <h2 className="font-varela text-xl text-center font-bold text-primary">{prediction?.pred.sort((a, b) => Number(b[0]) - Number(a[0]))[0][1]}</h2>
                <div className="radial-progress font-varela text-primary text-xl" style={{ '--value': prediction?.pred.sort((a, b) => Number(b[0]) - Number(a[0]))[0][0] ? parseFloat(prediction?.pred.sort((a, b) => Number(b[0]) - Number(a[0]))[0][0]) * 100 : '0', '--size': '8rem', '--thickness': '0.75em' } as React.CSSProperties}>
                  {prediction?.pred.sort((a, b) => Number(b[0]) - Number(a[0]))[0][0] ? (parseFloat(prediction?.pred.sort((a, b) => Number(b[0]) - Number(a[0]))[0][0]) * 100).toFixed(2) + '%' : 'N/A'}
                </div>
                <button
                  type="button"
                  className="btn text-white font-varela btn-primary"
                  onClick={() => {
                    if (prediction) {
                      const insectName = prediction.pred.sort((a, b) => Number(b[0]) - Number(a[0]))[0][1];
                      fetchInsectInfo(insectName, 1);
                    }
                  }}
                >
                  More info
                </button>
              </div>
            </div>
          )}

          {/* Card 3 */}
          {showInsectInfoCard2 ? (
            <div className="insect-info">
              <div
                className={`card border-warning border-4 flex flex-col justify-between items-center p-4 gap-4 h-72 mt-12 transition-all hover:scale-105 ${showInsectInfoCard2 ? 'show-insect-info' : ''}`}
              >
                {insectInfoCard2 && insectInfoCard2.message ? (
                  <p className="text-warning">{insectInfoCard2.message}</p>
                ) : (
                  <>
                    <p className="text-warning">scientific_name: {insectInfoCard2.scientific_name}
                      <br></br>kingdom: {insectInfoCard2.kingdom}
                      <br></br>phylum: {insectInfoCard2.phylum}
                      <br></br>order: {insectInfoCard2.order}
                      <br></br>family: {insectInfoCard2.family}
                      <br></br>genus_name: {insectInfoCard2.genus_name}
                      <br></br>class: {insectInfoCard2._class}
                      <br></br>count: {insectInfoCard2}
                    </p>
                  </>
                )}
                <button type="button" className="btn text-white font-varela btn-warning" onClick={() => closeInsectInfo(2)}>
                  Close
                </button>
              </div>
            </div>
          ) : (
            <div className="insect-info">
              <div
                className={`card border-warning border-4 flex flex-col justify-between items-center p-4 gap-4 h-72 mt-16 transition-all hover:scale-105 ${showInsectInfoCard2 ? 'show-insect-info' : ''}`}
              >
                <h2 className="font-varela text-xl text-center text-warning">{prediction?.pred.sort((a, b) => Number(b[0]) - Number(a[0]))[2][1]}</h2>
                <div className="radial-progress font-varela text-warning text-xl" style={{ '--value': prediction?.pred.sort((a, b) => Number(b[0]) - Number(a[0]))[2][0] ? parseFloat(prediction?.pred.sort((a, b) => Number(b[0]) - Number(a[0]))[2][0]) * 100 : '0', '--size': '8rem', '--thickness': '0.75em' } as React.CSSProperties}>
                  {prediction?.pred.sort((a, b) => Number(b[0]) - Number(a[0]))[2][0] ? (parseFloat(prediction?.pred.sort((a, b) => Number(b[0]) - Number(a[0]))[2][0]) * 100).toFixed(2) + '%' : 'N/A'}
                </div>
                <button
                  type="button"
                  className="btn text-white font-varela btn-warning"
                  onClick={() => {
                    if (prediction) {
                      const insectName = prediction.pred.sort((a, b) => Number(b[0]) - Number(a[0]))[2][1];
                      fetchInsectInfo(insectName, 2);
                    }
                  }}
                >
                  More info
                </button>
              </div>
            </div>
          )}
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
