import React from "react";
import { NavbarWrapper } from "../components/landingpage/navbar/navbar";

interface Props {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: Props) => {
  return (
    <section className="flex">
      <NavbarWrapper>{children}</NavbarWrapper>
    </section>
  );
};
