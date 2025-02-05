import Link from "next/link";
import Heading from "../../_component/heading";
import { Button } from "@/components/ui/button";
import { IconChevronRight } from "@tabler/icons-react";

export default function IntroductionPage() {
  return (
    <>
      <Heading
        title={"Introduction"}
        subtitle={
          "Beautifully designed Flutter widgets that you can copy and paste into your apps. Accessible. Customizable. Open Source."
        }
      />
      <p className="pt-12 max-w-[750px]">
        Majestic UI is a collection regularly used pages or complex widgets that
        can help beautify your applicaition.
      </p>
      <p className="pt-4 max-w-[750px]">
        The idea is simple, instead of adding everything as a package, what if
        you could{" "}
        <span className="bg-amber-800/50 font-semibold">
          import Flutter code directly in your project
        </span>
        . The code you import from majestic ui is yours to modify, that is why
        the implementation is quite simple and the documentation will improve
        over time.
      </p>
      <iframe
        width="100%"
        height="315"
        className="mt-12 border rounded-3xl"
        src="https://www.youtube.com/embed/tYcU0XjLBHI?si=PlUyPgVW3bEZ36SW&rel=0"
        title="YouTube video player"
        // @ts-ignore
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
        allowFullScreen={true}
      ></iframe>
    </>
  );
}
