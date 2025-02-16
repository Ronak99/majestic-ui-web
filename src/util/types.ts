import { Prisma } from "@prisma/client";
import { z } from "zod";

export type RegistryItem = Prisma.registryGetPayload<{
  select: {
    name: true;
    label: true;
    type: true;
    content: {
      select: {
        created_at: true;
        demo: true;
        dependencies: true;
        description: true;
        files: true;
        id: true;
        label: true;
        name: true;
        preview_url: true;
      };
    };
  };
}>;

export type RegistryContent = Prisma.contentGetPayload<{
  select: {
    created_at: true;
    demo: true;
    dependencies: true;
    description: true;
    files: true;
    id: true;
    label: true;
    name: true;
    preview_url: true;
  };
}>;

export type ContentFile = {
  name: string;
  filepath: string;
  content: string;
};

export type GithubRepository = {
  name: string;
  url: string;
  owner: {
    login: string;
    node_id: string;
  };
};

export type GithubRepositoryContent = {
  name: string;
  type: "file" | "dir";
  path: string;
  size: number;
  sha: string;
  url: string;
  download_url: string | null;
};

export type ScannedFile = {
  name: string;
  file_path: string;
  content: string;
};

export type GithubScanResult = {
  name: string;
  label: string | undefined;
  description: string;
  dependencies: string[];
  files: ScannedFile[];
  previewUrl: string | undefined;
};

export type PublishWidgetProps = {
  name: string;
  label: string;
  preview_url: string;
  type: "widget" | "page";
  authorId: string;
  demo: string;
  dependencies: string[];
  description: string;
  files: ScannedFile[];
};

export const WIDGET_TYPE = ["widget", "page"] as const;

export const PublishFormSchema = z.object({
  name: z.string().min(1, "Required"),
  label: z
    .string()
    .min(1, "Please provide an appropriate name for your widget"),
  type: z.enum(WIDGET_TYPE),
  preview_url: z.string().url("Please provide a valid url."),
});
