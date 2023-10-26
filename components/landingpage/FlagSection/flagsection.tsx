// components/LanguageFlags.tsx

import Image from "next/image";

const languages = [
  { name: "English", flag: "/images/flags/united-states.png" },
  { name: "Spanish", flag: "/images/flags/spain.png" },
  { name: "Chinese", flag: "/images/flags/taiwan.png" },
  { name: "French", flag: "/images/flags/france.png" },
  { name: "Japanese", flag: "/images/flags/japan.png" },
  { name: "Korean", flag: "/images/flags/south-korea.png" },
  { name: "German", flag: "/images/flags/germany.png" },
  // ... add more languages and flags as needed
];

export const LanguageFlags = () => {
  return (
    <div className="flex flex-wrap justify-center">
      {languages.map((lang) => (
        <div
          key={lang.name}
          className="group relative flex flex-col items-center"
        >
          <div className="transform transition-transform duration-300 group-hover:scale-110 flex items-center justify-center mx-6 h-24 w-24">
            <Image
              src={lang.flag}
              alt={lang.name}
              width={100}
              height={100}
              layout="fixed"
            />
          </div>
          <p className="text-center mt-2">{lang.name}</p>
        </div>
      ))}
    </div>
  );
};
