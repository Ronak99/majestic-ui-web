import { Prisma } from "@prisma/client";
// type Content = {
//   name: string;
//   dir: string;
//   content: string;
// };

// type Component = {
//   name: string;
//   label: string;
//   description: string;
//   dependencies: string[];
//   demo: string;
//   files: Content[];
// };

// type RegistryItem = {
//   name: string;
//   label: string;
//   type: string;
//   author: string;
//   github: string;
// };

export type RegistryItem = Prisma.registryGetPayload<{
  select: {
    name: true;
    label: true;
    type: true;
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
  };
}>;

export type ContentFile = {
  name: string;
  filepath: string;
  content: string;
};
