"use client";

import Heading from "../../../_component/heading";
import DetailSectionView from "../_component/detail-section-view";
import { CodeBlock } from "@/components/ui/code-block";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import PreviewAndCodeView from "../_component/preview-and-code-view";
import { ContentFile, RegistryContent, RegistryItem } from "@/util/types";
import { redirect, usePathname } from "next/navigation";
import useRegistry from "@/store/useRegistry";
import { toast } from "sonner";
import NotFound from "../_component/not-found";
import { Button } from "@/components/ui/button";
import CodeEditor from "@/components/ui/code-editor";

export default function WidgetDetail() {
  const pathname = usePathname();
  const componentName = pathname.split("registry/")[1];
  const { registry } = useRegistry();

  const component = registry.find((r) => r.name == componentName);

  if (!component) {
    return <NotFound componentName={componentName} />;
  }

  return <RenderComponent registry={component} />;
}

function RenderComponent({ registry }: { registry: RegistryItem }) {
  return (
    <>
      <Heading
        currentTitle={registry.label}
        previousTitle=""
        subtitle={registry.content?.description}
      />

      {registry.type !== "architecture" && (
        <PreviewAndCodeView
          previewUrl={registry.content?.preview_url}
          demo={registry.content?.demo}
        />
      )}

      {registry.type === "architecture" && (
        <DetailSectionView heading="Architecture">
          <CodeEditor
            language="dart"
            highlightLines={[]}
            architectureName={registry.name}
            files={
              (registry.content?.files as ContentFile[]).map((file) => {
                return {
                  name: file.name,
                  file_path: file.file_path,
                  content: file.content,
                  language: "dart",
                };
              }) ?? []
            }
          />
        </DetailSectionView>
      )}

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
            code={`majestic_ui add ${registry.content?.name}`}
          />
        </div>
      </DetailSectionView>

      {/* Usage */}
      {registry.type !== "architecture" && (
        <DetailSectionView heading="Setup Manually">
          <CodeBlock
            language="dart"
            filename=""
            tabs={
              (registry.content?.files as ContentFile[]).map((file) => {
                return {
                  name: file.name,
                  code: file.content,
                  language: "dart",
                };
              }) ?? []
            }
          />
        </DetailSectionView>
      )}

      {/* Dependencies */}
      <DetailSectionView heading="Dependencies">
        <>
          {registry.content?.dependencies &&
          (registry.content?.dependencies as string[]).length ? (
            <div className="flex flex-col gap-4">
              <div className="flex flex-row gap-4">
                {(registry.content?.dependencies as string[]).map((dep) => (
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
