import type { NextPage } from "next";
import Image from "next/image";
import { Button } from "@nextui-org/react";
import { LandingPage } from "../components/landingpage/landing/landing";
import { MainLayout } from "../layout/mainlayout";
import { LanguageFlags } from "../components/landingpage/FlagSection/flagsection";

const landing: NextPage = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4">
        <section>
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col lg:flex-row justify-between items-center">
              <div className="w-full lg:w-1/2 px-4 mb-8 lg:mb-0">
                <div className="text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start mb-3 space-x-2">
                    <div className="w-10 h-10 border-2 border-white rounded-full overflow-hidden relative">
                      <Image
                        src="/images/avatar/a.jpg"
                        alt="Banner Cover"
                        fill={true}
                        objectFit="cover"
                      />
                    </div>
                    <div className="w-10 h-10 border-2 border-white rounded-full overflow-hidden relative">
                      <Image
                        src="/images/avatar/b.jpg"
                        alt="Avatar"
                        fill={true}
                        objectFit="cover"
                      />
                    </div>
                    <div className="w-10 h-10 border-2 border-white rounded-full overflow-hidden relative">
                      <Image
                        src="/images/avatar/c.jpg"
                        alt="Avatar"
                        fill={true}
                        objectFit="cover"
                      />
                    </div>
                    <div className="w-10 h-10 border-2 border-white rounded-full overflow-hidden relative">
                      <Image
                        src="/images/avatar/d.jpg"
                        alt="Avatar"
                        fill={true}
                        objectFit="cover"
                      />
                    </div>
                    <p className="font-semibold ml-4">
                      <span className="text-red-500">5k+</span> Enrollment
                    </p>
                  </div>
                  <h1 className="font-bold text-3xl lg:text-6xl mt-6 mb-4">
                    Master Any Language with AI
                  </h1>
                  <p className="text-gray-600 text-md lg:text-lg mb-6">
                    Discover the future of language learning. Our AI avatar
                    tutor adapts to your pace, ensuring you converse like a
                    native in no time.
                  </p>
                  <div className="flex justify-center lg:justify-start mt-5 mb-5 space-x-4">
                    <Button className="bg-red-500 text-white py-2 px-4 rounded-lg">
                      <p className="text-medium font-bold">Sign Up Now</p>
                    </Button>
                    <Button
                      color="primary"
                      className="text-white py-2 px-4 rounded-lg"
                    >
                      <p className="text-medium font-bold">Try Our Demo</p>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-1/2 px-4">
                <div className="relative w-full h-64 lg:h-auto">
                  <Image
                    src="/images/banner-cover-1.png"
                    alt="Banner Cover"
                    layout="responsive"
                    width={1000}
                    height={1000}
                    objectFit="cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="py-8">
          <LanguageFlags />
        </section>
      </div>
    </MainLayout>
  );
};

export default landing;
