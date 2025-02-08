import { create } from "zustand";

interface RegistryState {
  registry: RegistryItem[];
  setAllRegitryItems: (data: RegistryItem[]) => void;

  componentCache: Record<string, Component>;
  getComponent: (name: string) => Component | undefined;
  addToComponentCache: (component: Component) => void;
}

const useRegistry = create<RegistryState>()((set, get) => ({
  registry: [],
  componentCache: {},

  setAllRegitryItems: (data: RegistryItem[]) => set({ registry: data }),

  getComponent: (name: string) => get().componentCache[name],

  addToComponentCache: (component: Component) =>
    set((state) => ({
      componentCache: {
        ...state.componentCache,
        [component.name]: component,
      },
    })),
}));

export default useRegistry;
