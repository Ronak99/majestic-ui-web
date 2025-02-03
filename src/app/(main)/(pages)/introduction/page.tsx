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
        Majestic UI consists of widgets that are either regularly used but their
        implementation is tedious or some complex widgets such as the{" "}
        <Link href="/widgets/user_feed" className="underline">
          user_feed
        </Link>
        .
      </p>
      <p className="pt-4 max-w-[750px]">
        The idea is simple, instead of adding everything as a package, what if
        these widgets can be added to the package on your own. The code you
        import from majestic ui is yours to modify, that is why the
        implementation is quite simple and the documentation will improve over
        time.
      </p>
    </>
  );
}
