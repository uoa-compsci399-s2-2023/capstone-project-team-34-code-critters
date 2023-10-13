import React, {
  MutableRefObject, useEffect, useRef, useState,
} from 'react';
import {
  doc, getDoc,
} from 'firebase/firestore';
import CountUp from 'react-countup';
import { db } from '../../enviroments/firebase';

function Home() {
  const [counter, setCounter] = useState(0);
  const counterDocRef = doc(db, 'predictionsCounter', 'counter');
  const featuresRef: MutableRefObject<HTMLDivElement | null> = useRef(null);
  useEffect(() => {
    (async () => {
      const counterDoc = await getDoc(counterDocRef);
      setCounter(counterDoc.data()?.count);
    })();
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="max-w-5xl w-11/12 flex flex-col items-center">
        <div className="min-h-screen pt-20 pb-4 flex items-center justify-center">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-4 justify-items-center justify-center z-10">
            <div className="flex flex-col gap-6 justify-center">
              <h2 className="font-varela text-3xl font-bold uppercase text-center">
                Pest
                {' '}
                <span className="">Detection</span>
              </h2>
              <p className="font-varela text-center">
                {/* eslint-disable-next-line max-len */}
                CodeCritters, a university team, developed an AI platform to identify unknown-winged insects for local government bio-hazard protection.
              </p>
              <div className="flex justify-center items-center gap-4">
                <button
                  type="button"
                  className="bg-gradient-to-r from-primary to-secondary border-none relative font-varela normal-case btn text-white text-lg"
                >
                  <div className="border-none opacity-0 hover:opacity-100 transition duration-500 absolute inset-0 h-full rounded-lg flex justify-center items-center bg-gradient-to-l from-primary to-secondary">
                    Start now
                  </div>
                  Start now
                </button>
                <button
                  type="button"
                  onClick={() => featuresRef.current?.scrollIntoView({ behavior: 'smooth' })}
                  className="font-bold underline text-black font-varela"
                >
                  Learn More
                </button>
              </div>
              <div className="font-varela text-lg text-center">
                Pests identified:
                {' '}
                <CountUp end={counter} duration={3} />
              </div>
            </div>
            <div className="relative w-[20rem] h-[18rem] md:w-[28rem] md:h-[28rem] lg:w-[34rem] lg:h-[30rem]">
              <img alt="mobile" src="/home/mobile.png" className="h-4/5 absolute" />
              <img alt="tablet" src="/home/tablet.png" className="w-4/5 absolute bottom-0 right-0" />
            </div>
          </div>
        </div>
        <div ref={featuresRef} className="min-h-screen flex flex-col items-center justify-center gap-8 pb-4">
          <h2 className="text-4xl font-bold font-varela">Having a problem identifying winged pests?</h2>
          <p className="max-w-prose font-varela">
            Our pest insect identification interface uses machine learning methods
            to quickly and accurately identify insects. All you need to do is
            insert an image on our detect page, where you will receive
            information about the insect.
          </p>
          <h2 className="flex items-center text-4xl font-bold bg-gradient-to-br from-primary to-secondary text-transparent bg-clip-text font-varela">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid grid-cols-[1fr_5fr] gap-4 items-center">
              <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-24 h-24 text-primary">
                <path d="M5 3H3v2h2V3zm14 4h2v6h-2V9H9v10h4v2H7V7h12zM7 3h2v2H7V3zM5 7H3v2h2V7zm-2 4h2v2H3v-2zm2 4H3v2h2v-2zm6-12h2v2h-2V3zm6 0h-2v2h2V3zm-2 14v-2h6v2h-2v2h-2v2h-2v-4zm4 2v2h2v-2h-2z" fill="currentColor" />
              </svg>
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-bold bg-gradient-to-br from-primary to-secondary text-transparent bg-clip-text font-varela">Drag and drop</h3>
                <p className="font-varela">Users can drag and drop images for scanning, significantly increasing flexibility.</p>
              </div>
            </div>
            <div className="grid grid-cols-[1fr_5fr] gap-4 items-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-24 h-24 text-primary">
                <path d="M1.99219 19H4.99219M7.99219 19H4.99219M4.99219 19V16M4.99219 19V22" stroke="currentColor" />
                <path d="M7 2L16.5 2L21 6.5V19" stroke="currentColor" />
                <path d="M11 22H16.5C17.3284 22 18 21.3284 18 20.5V8.74853C18 8.5894 17.9368 8.43679 17.8243 8.32426L14.6757 5.17574C14.5632 5.06321 14.4106 5 14.2515 5H4.5C3.67157 5 3 5.67157 3 6.5V13" stroke="currentColor" />
                <path d="M14 8.4V5.35355C14 5.15829 14.1583 5 14.3536 5C14.4473 5 14.5372 5.03725 14.6036 5.10355L17.8964 8.39645C17.9628 8.46275 18 8.55268 18 8.64645C18 8.84171 17.8417 9 17.6464 9H14.6C14.2686 9 14 8.73137 14 8.4Z" fill="currentColor" stroke="currentColor" />
              </svg>
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-bold bg-gradient-to-br from-primary to-secondary text-transparent bg-clip-text font-varela">Multiple images</h3>
                <p className="font-varela">Users can upload multiple images with no limits providing efficiency. </p>
              </div>
            </div>
            <div className="grid grid-cols-[1fr_5fr] gap-4 items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="w-24 h-24 text-primary">
                <rect width="256" height="256" fill="none" />
                <path d="M200,224H56a8,8,0,0,1-8-8V40a8,8,0,0,1,8-8h96l56,56V216A8,8,0,0,1,200,224Z" fill="none" stroke="currentColor" strokeWidth="12" />
                <polyline points="152 32 152 88 208 88" fill="none" stroke="currentColor" strokeWidth="12" />
                <polyline points="100 156 128 184 156 156" fill="none" stroke="currentColor" strokeWidth="12" />
                <line x1="128" y1="120" x2="128" y2="184" fill="none" stroke="currentColor" strokeWidth="12" />
              </svg>
              <div className="ml-3 text-left max-w-xs">
                <h3 className="text-2xl font-bold bg-gradient-to-br from-primary to-secondary text-transparent bg-clip-text font-varela">Download predictions</h3>
                <p className="font-varela">Users can drag and drop images for scanning, significantly increasing flexibility.</p>
              </div>
            </div>
            <div className="grid grid-cols-[1fr_5fr] gap-4 items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-24 h-24 text-primary">
                <path fill="currentColor" d="M16.4,3.3C12.5,1.1,7.7,1.8,4.6,4.8V3c0-0.6-0.4-1-1-1s-1,0.4-1,1v4.5c0,0.6,0.4,1,1,1h4.5c0.6,0,1-0.4,1-1s-0.4-1-1-1H5.7C7.1,4.9,9.2,4,11.5,4c4.4,0,8,3.6,8,8s-3.6,8-8,8c-0.6,0-1,0.4-1,1s0.4,1,1,1c3.6,0,6.9-1.9,8.7-5C22.9,12.2,21.2,6.1,16.4,3.3z M11.4,8c-0.6,0-1,0.4-1,1v3c0,0.6,0.4,1,1,1h2c0.6,0,1-0.4,1-1s-0.4-1-1-1h-1V9C12.4,8.4,12,8,11.4,8z" />
              </svg>
              <div className="ml-3 text-left max-w-xs">
                <h3 className="text-2xl font-bold bg-gradient-to-br from-primary to-secondary text-transparent bg-clip-text font-varela">User history</h3>
                <p className="font-varela">Users who are logged in can view previous predictions which are stored on a database. </p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute -translate-y-1/2 top-[70%] -translate-x-1/2 left-[40%] md:translate-x-0 md:left-0 md:top-[60%] w-full">
          <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 800 450">
            <defs>
              <filter id="bbblurry-filter" x="-100%" y="-100%" width="400%" height="400%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feGaussianBlur stdDeviation="51" x="0%" y="0%" width="100%" height="100%" in="SourceGraphic" edgeMode="none" result="blur" />
              </filter>
            </defs>
            <g filter="url(#bbblurry-filter)">
              <ellipse rx="85.5" ry="86.5" cx="600.0426691228693" cy="189.86029052734375" fill="hsl(142, 69%, 70%)" />
              <ellipse rx="85.5" ry="86.5" cx="454.11448530717325" cy="271.272402676669" fill="hsl(198, 93%, 40%)" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

export default Home;
