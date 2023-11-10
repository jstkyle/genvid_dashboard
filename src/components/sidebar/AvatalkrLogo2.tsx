import React from "react";

interface AvatalkrLogoProps {
  size?: string; // This prop will control the size
  className?: string;
}

const AvatalkrLogo: React.FC<AvatalkrLogoProps> = ({
  size = "w-32",
  className = "my-4",
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 220 230"
      className={`${size} ${className} text-[#231f20]`} // Apply the size to width or height
    >
      <g>
        <path
          d="M45.45,176.27c-18.7-16.95-30.45-41.43-30.45-68.65C15,56.47,56.47,15,107.62,15s92.62,41.47,92.62,92.62c0,27.22-11.75,51.7-30.45,68.65"
          fill="none"
          stroke="#231f20"
          strokeMiterlimit="10"
          strokeWidth="30"
        />
        <rect
          x="63.45"
          y="158.65"
          width="24.17"
          height="48.56"
          rx="12.09"
          ry="12.09"
          fill="#231f20"
        />
        <rect
          x="95.53"
          y="139.58"
          width="24.17"
          height="86.69"
          rx="12.09"
          ry="12.09"
          fill="#231f20"
        />
        <rect
          x="128.12"
          y="158.65"
          width="24.17"
          height="48.56"
          rx="12.09"
          ry="12.09"
          fill="#231f20"
        />
        <path
          d="M99.06,101.85c0,3.01-.48,5.89-1.37,8.56-3.13-8.68-11.94-14.96-22.31-14.96s-18.86,6.04-22.14,14.5c-.8-2.54-1.24-5.26-1.24-8.1,0-13.98,10.53-25.3,23.53-25.3s23.53,11.32,23.53,25.3Z"
          fill="#231f20"
        />
        <path
          d="M163.74,101.85c0,3.01-.48,5.89-1.37,8.56-3.13-8.68-11.94-14.96-22.31-14.96s-18.86,6.04-22.14,14.5c-.8-2.54-1.24-5.26-1.24-8.1,0-13.98,10.53-25.3,23.53-25.3s23.53,11.32,23.53,25.3Z"
          fill="#231f20"
        />
      </g>
    </svg>
  );
};

export default AvatalkrLogo;
