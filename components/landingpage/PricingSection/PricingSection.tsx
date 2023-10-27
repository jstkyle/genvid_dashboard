import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
} from "@nextui-org/react";

export const PricingSection = () => {
  return (
    <div className="py-12 px-6">
      <div className="text-center mb-12">
        <h2 className="text-lg font-semibold text-blue-600 mb-4">
          PRICING & PLANS
        </h2>
        <h1 className="text-4xl font-bold mb-4">Choose The Perfect Plan</h1>
        <p className="text-lg text-gray-600 mb-8">
          Dive into immersive language learning sessions with our conversational
          avatars.
        </p>
        <Button className="mx-4" size="lg" color="primary">
          Explore All Features
        </Button>
        <Button className="mx-4" size="lg" color="primary" variant="ghost">
          Contact Support
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="bg-white px-3 py-3">
          <CardBody className="flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-semibold pb-3">Basic</h3>
              <div className="flex items-center mb-3 pb-4">
                Foundation for beginners with 5-language support and minimum
                session time.
              </div>
              <div className="flex items-center mb-3">
                - AI-driven language learning sessions
              </div>
              <div className="flex items-center mb-3">
                - 500 minutes of real-time conversation/month
              </div>
              <div className="flex items-center mb-3">
                - Access to basic vocabulary & grammar modules
              </div>
              <div className="flex items-center mb-3">
                - Support in 5 languages
              </div>
            </div>
            <div className="mt-6">
              <span className="text-3xl font-bold">$99.00</span>/month
            </div>
          </CardBody>
          <CardFooter>
            <Button
              color="primary"
              size="lg"
              variant="ghost"
              className="w-full"
            >
              Start Now
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-blue-600 text-white px-3 py-3">
          <CardBody className="flex flex-col justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold pb-3">Advanced</h3>
              <div className="flex items-center mb-3 pb-4">
                Extended sessions with specialized learning modules.
              </div>
              <div className="flex items-center mb-3">- All Basic features</div>
              <div className="flex items-center mb-3">
                - 1,000 minutes of real-time conversation/month
              </div>
              <div className="flex items-center mb-3">
                - Advanced vocabulary & grammar modules
              </div>
              <div className="flex items-center mb-3">
                - Cultural context lessons
              </div>
              <div className="flex items-center mb-3">- Priority support</div>
            </div>
            <div className="mt-6">
              <span className="text-3xl font-bold">$199.00</span>/month
            </div>
          </CardBody>
          <CardFooter>
            <Button size="lg" className="w-full bg-white">
              Get Started
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-white px-3 py-3">
          <CardBody className="flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-semibold pb-3">Enterprise</h3>
              <div className="flex items-center mb-3 pb-4">
                Extended sessions with specialized learning modules.
              </div>
              <div className="flex items-center mb-3">
                - All Advanced features
              </div>
              <div className="flex items-center mb-3">
                - Unlimited minutes of real-time conversation
              </div>
              <div className="flex items-center mb-3">
                - Customizable learning paths
              </div>
              <div className="flex items-center mb-3">
                - Support in 20+ languages
              </div>
              <div className="flex items-center mb-3">
                - Dedicated success manager
              </div>
            </div>
            <div className="mt-6">
              <span className="text-3xl font-bold">$399.00</span>/month
            </div>
          </CardBody>
          <CardFooter>
            <Button
              color="primary"
              size="lg"
              variant="ghost"
              className="w-full"
            >
              Contact Sales
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
