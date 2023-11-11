import React from "react";
import { Button, Avatar } from "@nextui-org/react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Image,
} from "@nextui-org/react";
import { Progress } from "@nextui-org/react";

export const Page = () => {
  // You can put state management here if needed.

  return (
    <div className="flex h-screen">
      {/* Left section - Avatar footage */}
      <div className="w-3/5 p-4">
        <div className="text-2xl font-bold my-2">
          English Conversation with Nikki
        </div>
        <div className="relative">
          <video className="rounded-lg w-full" controls>
            <source src="path-to-your-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div>
          <Button color="danger" className="mt-4 w-full font-bold text-lg">
            Press space to speak
          </Button>
        </div>
        {/* Timer or session info can go here */}
      </div>

      {/* Right section - Chat history */}
      <div className="w-2/5 p-4 bg-white rounded-lg shadow">
        <div className="overflow-y-auto h-[80%]">
          <Card radius="lg" className="my-4 px-1 py-1 bg-blue-500">
            <CardBody className="font-bold text-lg text-white">
              <div>Time Left</div>
              <div className="pb-2">8m:3s</div>
              <Progress
                color="warning"
                aria-label="Loading..."
                value={60}
                className="max-w-md"
              />
            </CardBody>
          </Card>
          <div className="flex items-center gap-3 mb-3">
            <Avatar
              src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
              size="lg"
            />
            <Card>
              <CardBody>
                <p>Hi, my name is Kyle! How are you.</p>
              </CardBody>
            </Card>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <Avatar name="AI" size="lg" />
            <Card className="bg-blue-500">
              <CardBody className="text-white">
                <p>Hi Kyle, nice to meet you. Feel free to ask me anything.</p>
              </CardBody>
            </Card>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <Avatar
              src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
              size="lg"
            />
            <Card>
              <CardBody>
                <p>How to improve my english speaking skill?</p>
              </CardBody>
            </Card>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <Avatar name="AI" size="lg" />
            <Card className="bg-blue-500">
              <CardBody className="text-white">
                <p>Use Fluentli, an AI language learning platform.</p>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
