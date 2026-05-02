import Link from "next/link";

type WidgetFile = {
  name: string;
  path: string;
  language?: string;
  code: string;
};

type WidgetOverviewProps = {
  name: string;
  previewUrl?: string;
  cli?: string;
  dependencies?: string[];
  files?: WidgetFile[];
};

export function WidgetOverview({
  name,
  previewUrl,
  cli,
  dependencies = [],
  files = [],
}: WidgetOverviewProps) {
  if (!previewUrl && !cli && dependencies.length === 0 && files.length === 0) {
    return null;
  }

  return (
    <div className="my-8 flex flex-col gap-8">
      {previewUrl ? (
        <section>
          <h2 className="mb-3 text-xl font-semibold">Preview</h2>
          <div className="overflow-hidden rounded-xl border bg-card">
            <iframe
              src={previewUrl}
              title={`${name} preview`}
              className="h-[520px] w-full bg-background"
              loading="lazy"
            />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Open the preview directly at{" "}
            <Link className="underline" href={previewUrl} target="_blank">
              {previewUrl}
            </Link>
            .
          </p>
        </section>
      ) : null}

      {cli ? (
        <section>
          <h2 className="mb-3 text-xl font-semibold">Add With CLI</h2>
          <pre className="overflow-x-auto rounded-xl border bg-zinc-950 p-4 text-sm text-zinc-50">
            <code>{cli}</code>
          </pre>
        </section>
      ) : null}

      <section>
        <h2 className="mb-3 text-xl font-semibold">Dependencies</h2>
        {dependencies.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {dependencies.map((dependency) => (
              <Link
                key={dependency}
                href={`https://pub.dev/packages/${dependency}`}
                target="_blank"
                className="rounded-full border bg-muted px-3 py-1 text-sm font-medium"
              >
                {dependency}
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">This widget has no dependencies.</p>
        )}
      </section>

      {files.length > 0 ? (
        <section>
          <h2 className="mb-3 text-xl font-semibold">Files</h2>
          <div className="flex flex-col gap-4">
            {files.map((file) => (
              <div key={file.path} className="overflow-hidden rounded-xl border">
                <div className="border-b bg-muted px-4 py-2 text-sm font-medium">
                  {file.path}
                </div>
                <pre className="overflow-x-auto bg-zinc-950 p-4 text-sm text-zinc-50">
                  <code>{file.code}</code>
                </pre>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
