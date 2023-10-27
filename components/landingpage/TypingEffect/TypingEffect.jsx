import React from "react";
import Typewriter from "typewriter-effect";

export const TypingEffect = () => {
  const languages = [
    "Any Language",
    "English",
    "Spanish",
    "Chinese",
    "French",
    "Japanese",
    "Korean",
    "German",
  ];

  return (
    <div>
      <div className="inline-flex items-center">
        <h1 className="font-bold text-3xl lg:text-6xl mt-6 mb-2">
          Master&nbsp;
        </h1>
        <h1 className="font-bold text-blue-600 text-3xl lg:text-6xl mt-6 mb-2">
          <Typewriter
            options={{
              strings: languages,
              autoStart: true,
              loop: true,
              delay: 75,
              deleteSpeed: 50,
              pauseFor: 2500,
            }}
          />
        </h1>
      </div>
      <h1 className="font-bold text-3xl lg:text-6xl mt-2 mb-4">with AI</h1>
    </div>
  );
};
