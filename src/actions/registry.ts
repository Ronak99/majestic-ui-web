"use server";

import { db } from "@/lib/db";

export async function getAllRegistryItems() {
  return await db.registry.findMany({
    select: {
      label: true,
      name: true,
      type: true,
    },
  });
}

export async function getContent(name: string) {
  try {
    return await db.content.findFirst({
      where: { name: name },
      select: {
        created_at: true,
        demo: true,
        dependencies: true,
        files: true,
        id: true,
        label: true,
        name: true,
        description: true,
      },
    });
  } catch (e) {
    throw new Error(`An error occurred: ${e}`);
  }
}

export async function getContentForCli(names: string[]) {
  return db.content.findMany({
    where: {
      name: {
        in: names,
      },
    },
    select: {
      name: true,
      dependencies: true,
      files: true,
    },
  });
}
