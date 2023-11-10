import React from 'react';
import { Card, CardBody, CardHeader, Image } from "@nextui-org/react";
import { users } from "./data";
import { RenderCard } from "./render-card";

export const CardWrapper = () => {
  return (
    <div className="gap-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {users.map((user, index) => (
        <Card shadow="sm" key={index} isPressable onPress={() => console.log("User card pressed")}>
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
            <h4 className="font-bold text-large">{user.name}</h4>
          </CardHeader>
          <CardBody className="overflow-visible p-4">
            <Image
                shadow="sm"
                radius="lg"
                width="100%"
                className="w-full object-cover h-[140px]"
                src={user.avatar}
            />
          </CardBody>
        </Card>
      ))}
    </div>
  );
};
