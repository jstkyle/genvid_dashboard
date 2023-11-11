export const About_2 = () => {
  const avatars = [
    "/images/ai_avatar/asian_male.png",
    "/images/ai_avatar/german_female.png",
    "/images/ai_avatar/indian_female.png",
    "/images/ai_avatar/hispanic_female.png",
    "/images/ai_avatar/african_male.png",
    "/images/ai_avatar/japanese_female.png",
  ];

  return (
    <div className="flex flex-col lg:flex-row justify-between items-center">
      <div className="w-full lg:w-1/2 px-20 mb-8 lg:mb-0">
        <h1 className="text-4xl font-bold mb-6">Meet our AI Tutors</h1>
        <p className="text-lg mb-4">
          Dive into a diverse world of AI tutors tailored to a wide range of
          appearances. Whether you connect with an AI that resembles your
          background or one from a different culture, each one is proficient in
          any supported language. This ensures they can guide you in your
          learning journey through your mother tongue or any language of your
          preference.
        </p>
      </div>

      <div className="lg:w-1/2 px-4 my-8 lg:mb-0 flex flex-wrap justify-center">
        {avatars.map((avatar, index) => (
          <div
            key={index}
            className="m-2 rounded-lg overflow-hidden"
            style={{ width: "210px", height: "280px" }}
          >
            <img
              alt={`AI Tutor ${index}`}
              src={avatar}
              className="transition-transform duration-300 hover:scale-110 w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
