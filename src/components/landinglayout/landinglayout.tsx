import React from 'react';

interface Props {
    children: React.ReactNode;
}

export const LandingLayout = ({ children }: Props) => {

  return (
    <div>
      {children}
    </div>
  );
};