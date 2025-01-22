import { create } from "zustand";

interface WidgetState {
  allWidgets: Widget[];
  setAllWidgets: (data: Widget[]) => void;
}

const useWidgetStore = create<WidgetState>()((set) => ({
  allWidgets: [],
  setAllWidgets: (data: Widget[]) => set({ allWidgets: data }),
}));

export default useWidgetStore;
