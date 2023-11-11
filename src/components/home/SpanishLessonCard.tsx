import { Card, CardBody, Progress } from "@nextui-org/react";
import React from "react";

export const SpanishLessonCard = () => {
  return (
    <Card className="xl:max-w-sm bg-primary rounded-xl shadow-md overflow-hidden w-full">
      <CardBody className="py-5 space-y-3">
        <div className="flex gap-2.5 items-center">
          <div style={{ height: "4.5rem" }}>
            {" "}
            {/* Fixed height to accommodate two lines */}
            <span className="text-white text-lg font-bold block overflow-hidden">
              Spanish for Beginners
            </span>
            <span className="text-white text-xs block">
              Lesson 8: Dining and Cuisine
            </span>
          </div>
        </div>
        <Progress value={50} color="secondary" className="h-1.5 rounded" />
        <div className="text-white">
          <span className="text-xs block">Progress: 50%</span>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-white text-xs">Average Rating</span>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-warning text-xs">
                {"⭐ 4.5"}
              </span>
            </div>
          </div>
          <div>
            <span className="text-white text-xs">Feedback</span>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-white text-xs">
                {"📝 95"}
              </span>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
