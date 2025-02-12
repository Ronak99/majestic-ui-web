"use client";

import { redirect, usePathname } from "next/navigation";

export default function Page() {
  const pathname = usePathname();

  if (pathname.includes("pages")) {
    redirect("/pages/profile_page");
  } else {
    redirect("/widgets/star_rush_background");
  }
}
