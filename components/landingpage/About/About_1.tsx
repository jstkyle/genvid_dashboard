import Image from "next/image";

export const About_1 = () => {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-center">
      <div className="lg:w-1/2 px-4 mb-8 lg:mb-0 overflow-hidden relative">
        <Image
          src="/images/conversation.png"
          alt="conversation"
          width={1000}
          height={1000}
        />
      </div>

      <div className="w-full lg:w-1/2 px-20 mb-8 lg:mb-0">
        <h1 className="text-4xl font-bold mb-6">
          Enhance Your Speaking Skills with Realistic Conversations
        </h1>
        <p className="text-lg mb-4">
          Our platform offers an on-demand AI multi-language Conversation tutor
          that provides a realistic conversational experience, closely mimicking
          interactions with native speakers. Improve your speaking skills in
          non-native languages with ease.
        </p>
      </div>
    </div>
  );
};
