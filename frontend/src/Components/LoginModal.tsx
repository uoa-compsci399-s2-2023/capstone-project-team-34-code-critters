import React, { FunctionComponent } from 'react';

type LoginModalProps = {
  onClose?: () => void;
};

const LoginModal: FunctionComponent<LoginModalProps> = function LoginModal({ onClose }) {
  return (
    <div className="relative rounded-[31px] w-[1110px] flex flex-row items-center justify-center max-w-full max-h-full overflow-auto text-left text-[36px] text-white font-roboto">
      <div className="flex-1 rounded-11xl flex flex-row items-center justify-end gap-[10px] bg-[url(/public/frame-1@3x.png)] bg-cover bg-no-repeat bg-[top]">
        <div className="self-stretch flex flex-col items-start justify-center">
          <div className="self-stretch flex flex-col p-[25px] items-start justify-center">
            <img
              className="relative w-[45px] h-[45px] object-cover"
              alt=""
              src="/00c261@2x.png"
            />
          </div>
          <div className="self-stretch flex-1 flex flex-row py-2.5 px-[50px] items-center justify-start">
            <div className="flex-1 relative tracking-[0.08em] leading-[120%]">
              Welcome back! Let&apos;s continue.
            </div>
          </div>
          <div className="self-stretch flex-1 flex flex-row p-[30px] items-end justify-start">
            <button
              type="button"
              className="cursor-pointer border-none p-0 bg-transparent relative text-[18px] tracking-[0.08em] leading-[120%] font-roboto text-white text-left inline-block"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
        <div className="rounded-11xl bg-white w-[641px] flex flex-col py-[50px] px-[100px] box-border items-center justify-center text-sm text-gray">
          <div className="self-stretch flex flex-col items-center justify-center gap-[15px]">
            <b className="relative text-[32px] tracking-[0.08em] leading-[35px] text-mediumseagreen">
              Login
            </b>
            <div className="self-stretch flex flex-col items-center justify-center gap-[14px]">
              <button className="cursor-pointer py-1.5 px-4 bg-transparent self-stretch rounded-8xs flex flex-row items-center justify-center gap-[12px] border-[1.4px] border-solid border-lightgray" type="button">
                <img
                  className="relative w-[30px] h-[30px] object-cover"
                  alt=""
                  src="/google@2x.png"
                />
                <div className="relative text-sm leading-[35px] font-medium font-poppins text-darkslategray text-center">
                  Login with Google
                </div>
              </button>
              <button className="cursor-pointer py-1.5 px-4 bg-transparent self-stretch rounded-8xs flex flex-row items-center justify-center gap-[12px] border-[1.4px] border-solid border-lightgray" type="button">
                <img
                  className="relative w-[30px] h-[30px] object-cover"
                  alt=""
                  src="/facebook@2x.png"
                />
                <div className="relative text-sm leading-[35px] font-medium font-poppins text-darkslategray text-left">
                  Login with Facebook
                </div>
              </button>
              <button className="cursor-pointer py-1.5 px-4 bg-transparent self-stretch rounded-8xs flex flex-row items-center justify-center gap-[12px] border-[1.4px] border-solid border-lightgray" type="button">
                <img
                  className="relative w-[30px] h-[30px] object-cover"
                  alt=""
                  src="/github-1@2x.png"
                />
                <div className="relative text-sm leading-[35px] font-medium font-poppins text-darkslategray text-left">
                  Login with Github
                </div>
              </button>
            </div>
            <div className="self-stretch flex flex-row items-center justify-center gap-[5px] text-center">
              <img
                className="self-stretch flex-1 relative max-w-full overflow-hidden max-h-full"
                alt=""
                src="/line-2.svg"
              />
              <div className="text-gray relative tracking-[0.08em] leading-[35px] font-medium">OR</div>
              <img
                className="self-stretch flex-1 relative max-w-full overflow-hidden max-h-full"
                alt=""
                src="/line-2.svg"
              />
            </div>
            <div className="self-stretch flex flex-col pt-0 px-0 pb-[0.00000762939453125px] items-center justify-start gap-[10px] text-mid text-dimgray font-poppins">
              <div className="w-[441px] h-[76.78px] flex flex-col items-start justify-start gap-[5px]">
                <div className="relative font-medium inline-block w-[87.54px] h-[27.42px] shrink-0">
                  Email
                </div>
                <input
                  className="border-none font-poppins text-mini bg-whitesmoke self-stretch rounded-8xs flex flex-col py-1 px-[21px] items-start justify-center"
                  type="text"
                  placeholder="Enter your Email here"
                />
              </div>
              <div className="w-[441px] h-[76.78px] flex flex-col items-start justify-start gap-[5px]">
                <div className="relative font-medium inline-block w-[87.54px] h-[27.42px] shrink-0">
                  Password
                </div>
                <input
                  className="border-none font-poppins text-mini bg-whitesmoke self-stretch rounded-8xs flex flex-col py-1 px-[21px] items-start justify-center"
                  type="text"
                  placeholder="Enter your Password"
                />
              </div>
            </div>
            <button className="cursor-pointer border-none py-1 px-0 bg-transparent self-stretch rounded-8xs flex flex-col items-center justify-center bg-[url(/public/frame-login-button@3x.png)] bg-cover bg-no-repeat bg-[top]" type="button">
              <b className="relative text-[22px] tracking-[0.08em] leading-[35px] font-roboto text-white text-center">
                Login
              </b>
            </button>
            <div className="w-[441px] flex flex-row items-center justify-center gap-[10px] text-center">
              <div className="text-gray relative tracking-[0.08em] leading-[35px] font-medium">
                Don’t have an account?
              </div>
              <button className="cursor-pointer border-none p-0 bg-transparent relative text-sm tracking-[0.08em] leading-[35px] font-medium font-roboto text-mediumseagreen text-center inline-block" type="button">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

LoginModal.defaultProps = {
  onClose: () => {},
};

export default LoginModal;
