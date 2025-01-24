import React from "react";

type Props = {
  children: React.ReactElement;
  heading: string;
};

export default function DetailSectionView({ children, heading }: Props) {
  return (
    <div className="flex flex-col mt-12">
      <h2 className="text-white font-bold text-xl border-b mb-4 pb-1">
        {heading}
      </h2>
      {children}
    </div>
  );
}
