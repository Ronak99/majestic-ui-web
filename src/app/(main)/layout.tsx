import Navbar from "@/app/components/navbar";
import React from "react";
import { useAuthInitializer } from "@/hooks/useAuthInitializer";
import NotFound from "./(pages)/registry/_component/not-found";

type Props = {
  children: React.ReactElement;
};

export default function Layout({ children }: Props) {
  return (
    <>
      <main className="m-auto lg:max-w-[1536px] border-l border-r flex flex-grow w-full items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10 px-4">
        <Navbar />
        <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px] w-full h-full">
          <div className="mx-auto max-w-2xl h-full w-full">{children}</div>
        </main>
      </main>
    </>
  );
}
