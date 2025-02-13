"use client";

import { CodeBlock } from "@/components/ui/code-block";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Loading from "@/app/components/loading";
import {
  ComponentNotFoundError,
  InvalidComponentNameError,
  useRegistryContent,
} from "@/hooks/useRegistryContent";
import { ContentFile, RegistryContent } from "@/util/types";
import Heading from "@/app/(main)/_component/heading";
import PreviewAndCodeView from "../../_component/preview-and-code-view";
import DetailSectionView from "../../_component/detail-section-view";

export default function WidgetDetail() {
  const { status, data: component, error } = useRegistryContent();

  if (status === "error" && !component) {
    if (error instanceof ComponentNotFoundError) {
      return <div>Component not found. Please check the URL.</div>;
    }
    if (error instanceof InvalidComponentNameError) {
      return <div>Invalid component URL.</div>;
    }
    return <div>An error occurred while loading the component.</div>;
  }

  if (status == "loading") {
    return <Loading size="lg" variant="light" />;
  }

  if (status === "success")
    return component && <RenderComponent component={component} />;
}

function RenderComponent({ component }: { component: RegistryContent }) {
  return (
    <>
      <Heading
        currentTitle={component?.label ?? ""}
        previousTitle=""
        subtitle={component?.description ?? ""}
      />

      <PreviewAndCodeView registryContent={component} />

      {/* Installation */}
      <DetailSectionView heading="Installation">
        <div className="flex flex-col gap-4">
          <CodeBlock
            language="bash"
            filename=""
            code={"dart pub global activate majestic_ui"}
          />
          <CodeBlock
            language="bash"
            filename=""
            code={`majestic_ui add ${component?.name}`}
          />
        </div>
      </DetailSectionView>

      {/* Usage */}
      <DetailSectionView heading="Setup Manually">
        <CodeBlock
          language="dart"
          filename=""
          tabs={
            (component.files as ContentFile[]).map((file) => {
              return {
                name: file.name,
                code: file.content,
                language: "dart",
              };
            }) ?? []
          }
        />
      </DetailSectionView>

      {/* Dependencies */}
      <DetailSectionView heading="Dependencies">
        <>
          {component?.dependencies &&
          (component?.dependencies as string[]).length ? (
            <div className="flex flex-col gap-4">
              <div className="flex flex-row gap-4">
                {(component?.dependencies as string[]).map((dep) => (
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
    </>
  );
}
