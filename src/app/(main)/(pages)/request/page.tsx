import Link from "next/link";
import Heading from "../../_component/heading";
import DetailSectionView from "../[type]/[id]/_component/detail-section-view";

export default function InstallationPage() {
  return (
    <>
      <Heading
        title={"Request a widget"}
        subtitle={
          "Reach out to me and share a widget idea that you would like me to host on this platform."
        }
      />
      <DetailSectionView heading="How can I reach out?">
        <p className="max-w-[750px]">
          Hit me up on{" "}
          <Link
            href={"https://x.com/The_RonakPunase"}
            target="_blank"
            className="underline underline-offset-4 text-muted-foreground"
          >
            Twitter
          </Link>{" "}
          ,{" "}
          <Link
            href={"https://www.linkedin.com/in/ronak-punase/"}
            target="_blank"
            className="inline-flex gap-1 items-center underline underline-offset-4 text-muted-foreground"
          >
            LinkedIn
          </Link>
          {" or "}
          <Link
            href={"https://discord.com/invite/Kze5FUa6fx"}
            target="_blank"
            className="inline-flex gap-1 items-center underline underline-offset-4 text-muted-foreground"
          >
            Discord
          </Link>{" "}
          and share your thoughts about this website or an idea of a widget that
          you would want to see on here.
        </p>
      </DetailSectionView>
    </>
  );
}
