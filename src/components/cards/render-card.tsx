import { User, Tooltip, Chip, Card, CardBody, CardFooter } from "@nextui-org/react";
import React from "react";
import { DeleteIcon } from "../icons/table/delete-icon";
import { EditIcon } from "../icons/table/edit-icon";
import { EyeIcon } from "../icons/table/eye-icon";
import { users } from "./data";

interface Props {
  user: (typeof users)[number];
}

export const RenderCard = ({ user }: Props) => {
  return (
    <Card>
      <CardBody className="flex items-center gap-4">
        <User
          avatarProps={{
            src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
          }}
          name={user.name}
        />
        <div>
          <Chip
            size="sm"
            variant="flat"
            color={
              user.status === "active"
                ? "success"
                : user.status === "paused"
                ? "danger"
                : "warning"
            }
          >
            <span className="capitalize text-xs">{user.status}</span>
          </Chip>
        </div>
      </CardBody>
    </Card>
  );
};
