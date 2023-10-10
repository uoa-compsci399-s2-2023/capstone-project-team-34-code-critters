import React from 'react';
import { useNavigate } from 'react-router-dom';
import laptopImage from '../../Images/Laptop.png';
import logo from '../../Images/logo main.svg';
import bg_logo from '../../Images/background logo.svg';

function Home() {
  const navigate = useNavigate();
  return (
    <div className="w-full h-full flex flex-col items-center pt-28">
      <div
        className="bg-gradient-to-br from-primary to-secondary"
        style={{
          clipPath: 'polygon(0 0%, 100% 0, 100% 40%, 0 60%)',
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
        }}
      />
      <main className="flex flex-row justify-between items-start space-x-4 p-4 text-white relative z-10">
        <div className="flex flex-row">
          <div className="flex flex-col mt-24">
            <div className="relative">
              <img src={bg_logo} alt="Background Logo" className="absolute scale-150 -mt-9 ml-8" />
              <img src={logo} alt="Logo" className="scale-150 origin-left" />
            </div>
            <p className="text-black mt-24 max-w-xs font-sans">CodeCritters is a team of university students who have created a platform for identifying unknown-winged
              insects utilizing AI methodologies. The sole purpose of
              this application is to provide bio-hazard protection
              for local government entities.
            </p>
            <div className="flex items-center">
              <button
                className="font-varela btn bg-gradient-to-br from-secondary to-primary mt-8"
                type="button"
                onClick={() => navigate('/upload')}
              >
                Start Now
              </button>
              <a href="#features" className="font-bold underline ml-4 text-black mt-8">
                <p>Learn More
                  {'>'}
                </p>
              </a>
            </div>
          </div>
        </div>
        <div className="relative left-40 mt-12">
          <img src={laptopImage} alt="Laptop" style={{ width: '650px' }} />
        </div>
      </main>
      <div className="w-full bg-white text-black p-8 mx-auto text-center mt-24">
        <h2 className="flex items-center text-4xl font-bold mb-4 justify-center">Having a problem identifying winged pests?</h2>
        <div className="mx-auto max-w-prose">
          <p>Our pest insect identification interface uses machine learning methods
            to quickly and accurately identify insects. All you need to do is
            insert an image on our detect page, where you will receive
            information about the insect.
          </p>
        </div>
        <h2 id="features" className="flex items-center text-4xl font-bold mb-4 justify-center mt-12 bg-gradient-to-br from-primary to-secondary text-transparent bg-clip-text">Features</h2>
        <div className="flex flex-row items-start justify-center mt-16">
          <div className="flex items-start mr-20">
            <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-24 h-24 text-primary">
              <path d="M5 3H3v2h2V3zm14 4h2v6h-2V9H9v10h4v2H7V7h12zM7 3h2v2H7V3zM5 7H3v2h2V7zm-2 4h2v2H3v-2zm2 4H3v2h2v-2zm6-12h2v2h-2V3zm6 0h-2v2h2V3zm-2 14v-2h6v2h-2v2h-2v2h-2v-4zm4 2v2h2v-2h-2z" fill="currentColor" />
            </svg>
            <div className="ml-3 text-left max-w-xs">
              <h3 className="text-2xl font-bold bg-gradient-to-br from-primary to-secondary text-transparent bg-clip-text">Drag and drop</h3>
              <p className="max-w-lg">Users can drag and drop images for scanning, significantly increasing flexibility.</p>
            </div>
          </div>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-24 h-24 text-primary">
            <path d="M1.99219 19H4.99219M7.99219 19H4.99219M4.99219 19V16M4.99219 19V22" stroke="currentColor" />
            <path d="M7 2L16.5 2L21 6.5V19" stroke="currentColor" />
            <path d="M11 22H16.5C17.3284 22 18 21.3284 18 20.5V8.74853C18 8.5894 17.9368 8.43679 17.8243 8.32426L14.6757 5.17574C14.5632 5.06321 14.4106 5 14.2515 5H4.5C3.67157 5 3 5.67157 3 6.5V13" stroke="currentColor" />
            <path d="M14 8.4V5.35355C14 5.15829 14.1583 5 14.3536 5C14.4473 5 14.5372 5.03725 14.6036 5.10355L17.8964 8.39645C17.9628 8.46275 18 8.55268 18 8.64645C18 8.84171 17.8417 9 17.6464 9H14.6C14.2686 9 14 8.73137 14 8.4Z" fill="currentColor" stroke="currentColor" />
          </svg>
          <div className="ml-3 text-left max-w-xs">
            <h3 className="text-2xl font-bold bg-gradient-to-br from-primary to-secondary text-transparent bg-clip-text">Multiple images</h3>
            <p className="max-w-lg">Users can upload multiple images with no limits providing efficiency. </p>
          </div>
        </div>
        <div className="flex flex-row items-center justify-center mt-16">
          <div className="flex items-start mr-20">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="w-24 h-24 text-primary">
              <rect width="256" height="256" fill="none" />
              <path d="M200,224H56a8,8,0,0,1-8-8V40a8,8,0,0,1,8-8h96l56,56V216A8,8,0,0,1,200,224Z" fill="none" stroke="currentColor" stroke-width="12" />
              <polyline points="152 32 152 88 208 88" fill="none" stroke="currentColor" stroke-width="12" />
              <polyline points="100 156 128 184 156 156" fill="none" stroke="currentColor" stroke-width="12" />
              <line x1="128" y1="120" x2="128" y2="184" fill="none" stroke="currentColor"stroke-width="12" />
            </svg>
            <div className="ml-3 text-left max-w-xs">
              <h3 className="text-2xl font-bold bg-gradient-to-br from-primary to-secondary text-transparent bg-clip-text">Download predictions</h3>
              <p className="max-w-lg">Users can drag and drop images for scanning, significantly increasing flexibility.</p>
            </div>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-24 h-24 text-primary">
            <path fill="currentColor" d="M16.4,3.3C12.5,1.1,7.7,1.8,4.6,4.8V3c0-0.6-0.4-1-1-1s-1,0.4-1,1v4.5c0,0.6,0.4,1,1,1h4.5c0.6,0,1-0.4,1-1s-0.4-1-1-1H5.7C7.1,4.9,9.2,4,11.5,4c4.4,0,8,3.6,8,8s-3.6,8-8,8c-0.6,0-1,0.4-1,1s0.4,1,1,1c3.6,0,6.9-1.9,8.7-5C22.9,12.2,21.2,6.1,16.4,3.3z M11.4,8c-0.6,0-1,0.4-1,1v3c0,0.6,0.4,1,1,1h2c0.6,0,1-0.4,1-1s-0.4-1-1-1h-1V9C12.4,8.4,12,8,11.4,8z" />
          </svg>
          <div className="ml-3 text-left max-w-xs">
            <h3 className="text-2xl font-bold bg-gradient-to-br from-primary to-secondary text-transparent bg-clip-text">Multiple images</h3>
            <p className="max-w-lg">Users can upload multiple images with no limits providing efficiency. </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
