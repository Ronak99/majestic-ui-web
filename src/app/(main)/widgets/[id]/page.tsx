"use client";

import { usePathname } from "next/navigation";
import Heading from "../_component/heading";
import useWidgetStore from "@/store/useWidgetStore";
import DetailSectionView from "./_component/detail-section-view";
import { CodeBlock } from "@/components/ui/code-block";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Card } from "@/components/ui/card";

export default function WidgetDetail() {
  const pathname = usePathname();
  const widgetId = pathname.split("/").pop();

  const { allWidgets } = useWidgetStore();

  const selectedWidget = allWidgets.find((e) => e.name == widgetId);

  return (
    <div className="pb-16">
      <Heading
        title={selectedWidget?.label ?? ""}
        subtitle={selectedWidget?.description ?? ""}
      />

      {/* Preview vs code section */}
      <DetailSectionView heading="Preview">
        <div className="flex flex-col gap-4">
          <Card className=" h-[350px]">
            <iframe
              className="h-full w-full rounded-lg"
              src={`https://majestic-flutter-web.web.app/#/${selectedWidget?.name}`}
            />
          </Card>
        </div>
      </DetailSectionView>

      {/* Installation */}
      <DetailSectionView heading="Installation">
        <div className="flex flex-col gap-4">
          <CodeBlock
            language="bash"
            filename=""
            code={"dart pub global activate magestic_cli"}
          />
          <CodeBlock
            language="bash"
            filename=""
            code={`magestic_cli add ${selectedWidget?.name}`}
          />
        </div>
      </DetailSectionView>

      {/* Usage */}
      <DetailSectionView heading="Usage">
        <CodeBlock
          language="dart"
          filename=""
          code={selectedWidget?.usage ?? ""}
        />
      </DetailSectionView>

      {/* Dependencies */}
      <DetailSectionView heading="Dependencies">
        <>
          {selectedWidget?.dependencies &&
          selectedWidget?.dependencies.length ? (
            <div className="flex flex-col gap-4">
              <div className="flex flex-row gap-4">
                {selectedWidget?.dependencies.map((dep) => (
                  <Link
                    key={dep}
                    href={`https://pub.dev/packages/${dep}`}
                    target="_blank"
                  >
                    <Badge className="font-medium bg-zinc-700 hover:bg-zinc-600 transition-colors text-white border-2 px-4 py-1 text-sm rounded-lg">
                      {dep}
                    </Badge>
                  </Link>
                ))}
              </div>
              <p className="text-muted-foreground text-sm">
                These dependencies will be auto-installed when the widget is
                installed.
              </p>
            </div>
          ) : (
            <p className="text-muted-foreground">
              This widget has no dependencies.
            </p>
          )}
        </>
      </DetailSectionView>
    </div>
  );
}
