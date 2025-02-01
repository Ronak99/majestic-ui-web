"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layers } from "lucide-react";
import MenuButton from "./menu-button";

type Props = {
  showSideBorder: boolean;
};

export default function Header({ showSideBorder = true }: Props) {
  const pathname = usePathname();

  return (
    <header className="border-grid sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div
        className={`w-full m-auto lg:max-w-[1536px] py-3 px-5 border-l border-r flex justify-between ${
          showSideBorder ? "xl:border-zinc-800" : "border-transparent"
        }`}
      >
        <div className="flex w-full items-center gap-8">
          <div className="absolute block md:hidden z-10">
            <MenuButton />
          </div>
          <Link
            className="flex max-md:flex-grow justify-center items-center  gap-2"
            href={"/"}
          >
            <Layers width={18} height={18} />
            <span className="tracking-tight text-lg font-bold">
              majestic-ui
            </span>
          </Link>
          <div className="flex gap-4 hidden md:flex">
            {[
              { label: "Docs", value: "introduction" },
              { label: "Widgets", value: "widgets" },
            ].map((e) => (
              <Link
                href={`/${e.value}`}
                key={e.value}
                className={`text-muted-foreground hover:text-white text-sm ${
                  pathname.includes(e.value) ? "text-white" : ""
                }`}
              >
                {e.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
