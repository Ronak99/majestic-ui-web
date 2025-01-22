import useWidgetStore from "@/store/useWidgetStore";
import { useEffect, useState } from "react";

const WIDGETS_URL =
  "https://raw.githubusercontent.com/Ronak99/majestic-ui-flutter/refs/heads/master/all_widgets.json";

const useWidgetsInitialization = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { setAllWidgets } = useWidgetStore();

  useEffect(() => {
    const abortController = new AbortController();

    const fetchWidgets = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(WIDGETS_URL, {
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: Widget[] = await response.json();
        setAllWidgets(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error("An unknown error occurred"));
        }
        console.error("Failed to fetch widgets:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWidgets();

    return () => {
      abortController.abort();
    };
  }, []); // Empty dependency array since we only want to fetch once

  return { isLoading, error };
};

export default useWidgetsInitialization;
