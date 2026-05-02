import { getMDXComponents } from "@/mdx-components";
import { source } from "@/lib/source";
import { WidgetOverview } from "@/components/widget-overview";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    slug?: string[];
  }>;
};

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const page = source.getPage(slug);

  if (!page) {
    notFound();
  }

  const MDX = page.data.body;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <WidgetOverview
        name={page.data.title}
        previewUrl={page.data.preview_url}
        cli={page.data.cli}
        dependencies={page.data.dependencies}
        files={page.data.files}
      />
      <DocsBody>
        <MDX components={getMDXComponents()} />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = source.getPage(slug);

  if (!page) {
    notFound();
  }

  return {
    title: `${page.data.title} | Majestic UI`,
    description: page.data.description,
  };
}

export function generateStaticParams() {
  return source.generateParams();
}
