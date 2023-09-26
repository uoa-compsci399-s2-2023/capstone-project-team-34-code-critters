// import React from 'react';

// function WaveSVG() {
//   return (
//     <svg
//       width="100%"
//       height="100%"
//       id="svg"
//       viewBox="0 0 1440 590"
//       xmlns="http://www.w3.org/2000/svg"
//       className="transition duration-300 ease-in-out delay-150"
//     >
//       <style>
//         {`.path-0 {
//           animation: pathAnim-0 4s;
//           animation-timing-function: linear;
//           animation-iteration-count: infinite;
//         }
//         @keyframes pathAnim-0 {
//           0% {
//             d: path("M 0,600 C 0,600 0,200 0,200 C 205.71428571428572,257.14285714285717 822.8571428571429,228.57142857142858 1440,200 C 1440,200 1440,600 1440,600 Z");
//           }
//           25% {
//             d: path("M 0,600 C 0,600 0,200 0,200 C 205.71428571428572,257.14285714285717 822.8571428571429,228.57142857142858 1440,200 C 1440,200 1440,600 1440,600 Z");
//           }
//           50% {
//             d: path("M 0,600 C 0,600 0,200 0,200 C 205.71428571428572,257.14285714285717 822.8571428571429,228.57142857142858 1440,200 C 1440,200 1440,600 1440,600 Z");
//           }
//           75% {
//             d: path("M 0,600 C 0,600 0,200 0,200 C 205.71428571428572,257.14285714285717 822.8571428571429,228.57142857142858 1440,200 C 1440,200 1440,600 1440,600 Z");
//           }
//           100% {
//             d: path("M 0,600 C 0,600 0,200 0,200 C 205.71428571428572,257.14285714285717 822.8571428571429,228.57142857142858 1440,200 C 1440,200 1440,600 1440,600 Z");
//           }
//         }`}
//       </style>
//       <defs>
//         <linearGradient id="gradient" x1="0%" y1="50%" x2="100%" y2="50%">
//           <stop offset="5%" stop-color="#c020ff"></stop>
//           <stop offset="95%" stop-color="#21d3ff"></stop>
//         </linearGradient>
//       </defs>
//       <path
//         d="M 0,600 C 0,600 0,200 0,200 C 205.71428571428572,257.14285714285717 822.8571428571429,228.57142857142858 1440,200 C 1440,200 1440,600 1440,600 Z"
//         stroke="none"
//         stroke-width="0"
//         fill="url(#gradient)"
//         fill-opacity="0.53"
//         className="transition-all duration-300 ease-in-out delay-150 path-0"
//       ></path>
//       <style>
//         {`.path-1 {
//           animation: pathAnim-1 4s;
//           animation-timing-function: linear;
//           animation-iteration-count: infinite;
//         }
//         @keyframes pathAnim-1 {
//           0% {
//             d: path("M 0,600 C 0,600 0,400 0,400 C 205.71428571428572,514.2857142857143 822.8571428571429,457.14285714285717 1440,400 C 1440,400 1440,600 1440,600 Z");
//           }
//           25% {
//             d: path("M 0,600 C 0,600 0,400 0,400 C 205.71428571428572,514.2857142857143 822.8571428571429,457.14285714285717 1440,400 C 1440,400 1440,600 1440,600 Z");
//           }
//           50% {
//             d: path("M 0,600 C 0,600 0,400 0,400 C 205.71428571428572,514.2857142857143 822.8571428571429,457.14285714285717 1440,400 C 1440,400 1440,600 1440,600 Z");
//           }
//           75% {
//             d: path("M 0,600 C 0,600 0,400 0,400 C 205.71428571428572,514.2857142857143 822.8571428571429,457.14285714285717 1440,400 C 1440,400 1440,600 1440,600 Z");
//           }
//           100% {
//             d: path("M 0,600 C 0,600 0,400 0,400 C 205.71428571428572,514.2857142857143 822.8571428571429,457.14285714285717 1440,400 C 1440,400 1440,600 1440,600 Z");
//           }
//         }`}
//       </style>
//       <path
//         d="M 0,600 C 0,600 0,400 0,400 C 205.71428571428572,514.2857142857143 822.8571428571429,457.14285714285717 1440,400 C 1440,400 1440,600 1440,600 Z"
//         stroke="none"
//         stroke-width="0"
//         fill="url(#gradient)"
//         fill-opacity="1"
//         className="transition-all duration-300 ease-in-out delay-150 path-1"
//       ></path>
//     </svg>
//   );
// }

// export default WaveSVG;


import React from 'react';

function WaveSVG() {
  return (
    <svg
      width="100%"
      height="100%"
      id="svg"
      viewBox="0 250 1440 390"
      xmlns="http://www.w3.org/2000/svg"
      className="transition duration-300 ease-in-out delay-150"
    >
      <defs>
        <linearGradient id="gradient" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="5%" stopColor="#c020ff" />
          <stop offset="95%" stopColor="#21d3ff" />
        </linearGradient>
      </defs>
      <path
        d="M 0,600 C 0,600 0,300 0,300 C 205.71428571428572,385.7142857142857 822.8571428571429,342.8571428571429 1440,300 C 1440,300 1440,600 1440,600 Z"
        stroke="none"
        strokeWidth="0"
        fill="url(#gradient)"
        fillOpacity="1"
        className="transition-all duration-300 ease-in-out delay-150 path-0"
      ></path>
    </svg>
  );
}

export default WaveSVG;

