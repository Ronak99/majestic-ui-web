import { create } from "zustand";
import { PrismaClient, Prisma } from "@prisma/client";
import { RegistryContent, RegistryItem } from "@/util/types";

interface RegistryState {
  registry: RegistryItem[];
  setAllRegitryItems: (data: RegistryItem[]) => void;

  // registryContentCache: Record<string, RegistryContent>;
  getRegistryContent: (name: string) => RegistryItem | undefined;
  // addToRegistryContentCache: (content: RegistryContent) => void;
}

const useRegistry = create<RegistryState>()((set, get) => ({
  registry: [],
  // registryContentCache: {},

  setAllRegitryItems: (data: RegistryItem[]) => set({ registry: data }),

  getRegistryContent: (name: string) => get().registry.find((e) => e.name),

  // addToRegistryContentCache: (content: RegistryContent) =>
  //   set((state) => ({
  //     registryContentCache: {
  //       ...state.registryContentCache,
  //       [content.name]: content,
  //     },
  //   })),
}));

export default useRegistry;
