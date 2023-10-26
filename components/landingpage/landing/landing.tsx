import React from "react";
import { NavbarWrapper } from "../navbar/navbar";

interface Props {
  children: React.ReactNode;
}

export const LandingPage = ({ children }: Props) => {
  return (
    <section className="flex">
      <NavbarWrapper>
        <div className="px-8">hello</div>
      </NavbarWrapper>
    </section>
  );
};
