import Link from "next/link";
import Heading from "../../_component/heading";
import { CodeBlock } from "@/components/ui/code-block";
import DetailSectionView from "../widgets/[id]/_component/detail-section-view";

export default function InstallationPage() {
  return (
    <div className="pb-16">
      <Heading
        title={"Installation"}
        subtitle={
          "Get started by installing the majestic_ui command line interface."
        }
      />
      <DetailSectionView heading="Add majestic_ui">
        <div className="flex flex-col gap-4">
          <CodeBlock
            language="bash"
            filename=""
            code={"dart pub global activate majestic_ui"}
          />
          <p className="text-green-500">✅ You're all set!</p>
        </div>
      </DetailSectionView>
      <DetailSectionView heading="Add your first widget">
        <div className="flex flex-col gap-4">
          <CodeBlock
            language="bash"
            filename=""
            code={"majestic_ui add star_rush_background"}
          />
          <p className="text-muted-foreground">
            Checkout the documentation for the Star Rush Background{" "}
            <Link
              href="/widgets/star_rush_background"
              className="underline underline-offset-4"
            >
              here.
            </Link>
          </p>
        </div>
      </DetailSectionView>
    </div>
  );
}
