"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layers } from "lucide-react";
import MenuButton from "./menu-button";
import AuthButton from "./auth-button";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="border-grid sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 h-[60px]">
      <div
        className={`w-full h-full m-auto lg:max-w-[1536px] py-3 px-5 border-l border-r flex justify-between items-center ${
          pathname.split("/").pop()?.length
            ? "xl:border-zinc-800"
            : "border-transparent"
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
              {
                label: "Introduction",
                root: "introduction",
                link: "introduction",
              },
              { label: "Docs", root: "installation", link: "installation" },
              { label: "Publish", root: "publish", link: "publish" },
            ].map((e) => (
              <Link
                href={`/${e.link}`}
                key={e.root}
                className={`text-muted-foreground hover:text-white text-sm ${
                  pathname.includes(e.root) ? "text-white" : ""
                }`}
              >
                {e.label}
              </Link>
            ))}
          </div>
        </div>
        <div className={`hidden md:flex gap-2 items-center`}>
          <AuthButton />
          <Link
            href="https://github.com/Ronak99/majestic-ui-flutter/"
            target="_blank"
            className="hidden md:block"
          >
            <Button onClick={() => {}} variant={"ghost"}>
              <Image
                src="/github.svg"
                height={20}
                width={20}
                alt={"Contribute"}
              />
              <span className="text-white font-semibold">Contribute</span>
            </Button>
          </Link>
        </div>
        <div className={`absolute right-4 md:hidden items-center`}>
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
