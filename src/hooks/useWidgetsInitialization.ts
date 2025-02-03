import useWidgetStore from "@/store/useWidgetStore";
import { useEffect, useState } from "react";

const WIDGETS_URL =
  "https://raw.githubusercontent.com/Ronak99/majestic-ui-flutter/refs/heads/master/all_widgets.json";

const useWidgetsInitialization = () => {
  const { allWidgets, setAllWidgets } = useWidgetStore();

  useEffect(() => {
    // const abortController = new AbortController();

    const fetchWidgets = async () => {
      if (allWidgets.length) return;
      try {
        const response = await fetch(WIDGETS_URL);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: Widget[] = await response.json();

        setAllWidgets(data);
      } catch (err) {
        if (err instanceof Error) {
        } else {
        }
        console.error("Failed to fetch widgets:", err);
      } finally {
      }
    };

    fetchWidgets();

    return () => {
      // abortController.abort();
    };
  }, []); // Empty dependency array since we only want to fetch once

  return {};
};

export default useWidgetsInitialization;
