import React from 'react';
import { FunctionComponent } from "react";

function Home() {
  // const topDiagonalCutStyle = {
  //   clipPath: 'polygon(0 0, 100% 0, 100% 40%, 0 60%)', // Lower on the left
  // };

  // const bottomDiagonalCutStyle = {
  //   clipPath: 'polygon(100% 100%, 0 100%, 0 60%, 100% 40%)', // Lower on the left
  // };

  return (
    <div className="w-full h-full flex justify-center items-center pt-28">
      <h1 className="text-lg font-varela">Not implemented</h1>
    </div>
  );

  // return (
  //   <div className="relative bg-frame-foreground-light w-full h-[119.13rem] overflow-hidden text-left text-[1.56rem] text-frame-foreground-light font-roboto">
      
  //     <div className="absolute top-[55.44rem] left-[0.06rem] w-[90rem] h-[48.13rem] text-[0.94rem] text-black font-roboto-slab">
  //       <div className="absolute top-[0rem] left-[0rem] bg-frame-foreground-light w-[90rem] h-[48.13rem]" />
  //       <div className="absolute top-[21rem] left-[9.5rem] bg-frame-foreground-light box-border w-[34.38rem] h-[9.19rem] hidden border-[1px] border-solid border-black" />
  //       <div className="absolute top-[25.69rem] left-[21.38rem] leading-[140.63%] inline-block w-[20.38rem] h-[3.81rem]">
  //         Users can drag and drop images for scanning, significantly increasing
  //         flexibility.
  //       </div>
  //       <div className="absolute top-[21rem] left-[47.13rem] bg-frame-foreground-light box-border w-[34.38rem] h-[9.19rem] hidden border-[1px] border-solid border-black" />
  //       <img
  //         className="absolute top-[21.63rem] left-[47.88rem] w-[8.06rem] h-[8.06rem] overflow-hidden"
  //         alt=""
  //         src="/grommeticonsmultiple.svg"
  //       />
  //       <div className="absolute top-[33.63rem] left-[9.5rem] rounded-xl bg-mediumspringgreen-200 box-border w-[34.38rem] h-[9.63rem] hidden border-[1px] border-solid border-frame-foreground-light" />
  //       <b className="absolute top-[35.13rem] left-[21rem] text-[1.56rem] leading-[140.63%] text-mediumspringgreen-300">
  //         Download predictions
  //       </b>
  //       <b className="absolute top-[15.31rem] left-[38.38rem] text-[2.5rem] leading-[140.63%] text-mediumspringgreen-300">
  //         Features
  //       </b>
  //       <div className="absolute top-[38.44rem] left-[21rem] leading-[140.63%] inline-block w-[20.38rem] h-[3.81rem]">
  //         Users can download predictions in a CSV or an XLSX file for convenient
  //         viewing.
  //       </div>
  //       <div className="absolute top-[33.63rem] left-[47.06rem] rounded-xl bg-frame-foreground-light box-border w-[34.38rem] h-[9.63rem] border-[1px] border-solid border-gray-100" />
  //       <b className="absolute top-[34.88rem] left-[59.25rem] text-[1.56rem] leading-[140.63%] text-mediumspringgreen-300">
  //         User history
  //       </b>
  //       <img
  //         className="absolute top-[21rem] left-[9.5rem] w-[9.19rem] h-[9.19rem] overflow-hidden"
  //         alt=""
  //         src="/pixelarticonsdraganddrop.svg"
  //       />
  //       <img
  //         className="absolute top-[34.44rem] left-[9.5rem] w-[8.5rem] h-[8.5rem] overflow-hidden"
  //         alt=""
  //         src="/bxsfile.svg"
  //       />
  //       <div className="absolute top-[25.31rem] left-[59.25rem] leading-[140.63%] inline-block w-[20.38rem] h-[3.81rem]">{`Users can upload multiple images, up to 40 at one time, providing efficiency. `}</div>
  //       <div className="absolute top-[38.44rem] left-[59.38rem] leading-[140.63%] inline-block w-[20.38rem] h-[3.81rem]">
  //         Users who are logged in can view previous predictions which are stored
  //         on a database
  //       </div>
  //       <b className="absolute top-[22.13rem] left-[21rem] text-[1.56rem] leading-[140.63%] text-mediumspringgreen-300">
  //         Drag and drop
  //       </b>
  //       <img
  //         className="absolute top-[33.63rem] left-[47.38rem] w-[10.13rem] h-[10.13rem] overflow-hidden"
  //         alt=""
  //         src="/materialsymbolshistory.svg"
  //       />
  //       <b className="absolute top-[22.13rem] left-[59.25rem] text-[1.56rem] leading-[140.63%] text-mediumspringgreen-300">
  //         Multiple images
  //       </b>
  //       <div className="absolute top-[9.38rem] left-[18.25rem] text-[1.25rem] leading-[140.63%] font-roboto inline-block w-[53.5rem] h-[3.69rem]">
  //         Our pest insect identification interface uses machine learning methods
  //         to quickly and accurately identify insects. The user must upload an
  //         image of the insect's wing.
  //       </div>
  //       <div className="absolute top-[5rem] left-[12.81rem] text-[2.81rem] uppercase font-secular-one">
  //         Having a problem identifying winged pests?
  //       </div>
  //     </div>
  //     <img
  //       className="absolute top-[6.81rem] left-[0rem] w-[90.19rem] h-[47.47rem] object-cover"
  //       alt=""
  //       src="/background-tamp@2x.png"
  //     />
  //     <img
  //       className="absolute top-[25.5rem] left-[44.37rem] w-[44.43rem] h-[26.79rem]"
  //       alt=""
  //       src="/apple-computers.svg"
  //     />
  //     <div className="absolute top-[20.13rem] left-[3.56rem] text-[3rem] uppercase font-concert-one flex items-center w-[47.75rem] h-[6.5rem] mix-blend-normal">
  //       <span className="w-full">
  //         <p className="[margin-block-start:0] [margin-block-end:25px]">
  //           DECODE WINGED INSECTS
  //         </p>
  //         <p className="[margin-block-start:0] [margin-block-end:25px]">{`USING ARTIFICIAL INTELLIGENCE`}</p>
  //         <p className="m-0">INTELLIGENCE</p>
  //       </span>
  //     </div>
  //     <div className="btn-primary normal-case btn absolute top-[48.25rem] left-[3.56rem] text-[1.25rem] leading-[130%] font-varela">{`Start Now >`}</div>
      
  //     <div className="absolute top-[48.25rem] left-[15.13rem] text-[1.25rem] leading-[130%] font-varela text-black text-center flex items-center justify-center w-[9.44rem] h-[2.19rem] [-webkit-text-stroke:1px_#000]">{`Learn more >`}</div>
  //     <div className="absolute top-[36.75rem] left-[3.56rem] text-[1.25rem] leading-[140.63%] text-black inline-block w-[40.19rem] h-[5.69rem]">{`CodeCritters is a team of university students who have created a platform for identifying unknown-winged insects utilizing AI methodologies. The sole purpose of this application is to provide bio-hazard protection for local government entities. `}</div>
  //   </div>
  // );

}

export default Home;
