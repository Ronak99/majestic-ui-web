import { create } from "zustand";

interface TitleHistoryState {
  titleHistory: string[];
  addToTitleHistory: (title: string) => void;
  currentTitle: string;
  prevTitle: string;
}

const useTitleHistory = create<TitleHistoryState>()((set, get) => ({
  titleHistory: [],
  currentTitle: "",
  prevTitle: "",
  addToTitleHistory: (title: string) => {
    const currentHistory = get().titleHistory;

    if (currentHistory[currentHistory.length - 1] == title) {
      return;
    }

    set({
      titleHistory: [...currentHistory, title],
      currentTitle: title,
      prevTitle: currentHistory[currentHistory.length - 1] || "",
    });
  },
}));

export default useTitleHistory;
