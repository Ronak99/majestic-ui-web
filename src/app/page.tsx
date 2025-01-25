"use client";

import { AuroraBackground } from "@/components/ui/aurora-background";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Button } from "@/components/ui/button";
import ColourfulText from "@/components/ui/colourful-text";
import { FlipWords } from "@/components/ui/flip-words";
import { motion } from "framer-motion";
import Link from "next/link";
import Header from "./components/header";

export default function Home() {
  const words = ["reliable", "beautiful", "functional", "tested"];
  return (
    <>
      <BackgroundBeams />

      <Header showSideBorder={false} />

      <motion.div
        initial={{ opacity: 0.0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 1,
          ease: "easeInOut",
        }}
        className="flex flex-col gap-2 w-full h-screen justify-center items-center z-10 p-8"
      >
        <h1 className="z-10 text-5xl md:text-6xl text-center font-sans font-bold mb-4">
          Majestic UI
        </h1>
        <div className="max-w-2xl text-lg font-light text-muted-foreground text-center">
          Beautifully designed widgets that you can copy and paste into flutter
          projects.
          <br />
        </div>
        <Link href="/introduction" className="mt-12">
          <Button className="md:p-6 px-24 py-6 rounded-xl bg-white/90 text-black border border-black text-md font-semibold">
            Get Started
          </Button>
        </Link>
      </motion.div>
    </>
  );
}
