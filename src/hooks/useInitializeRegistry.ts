import useRegistry from "@/store/useRegistry";
import { useEffect, useState } from "react";

const useInitializeRegistry = () => {
  const { registry, setAllRegitryItems } = useRegistry();

  const MAIN_REGISTRY_URL =
    "https://raw.githubusercontent.com/Ronak99/majestic-ui-flutter/refs/heads/master/registry/all/main.json";

  useEffect(() => {
    // const abortController = new AbortController();

    const init = async () => {
      if (registry.length) return;
      try {
        const response = await fetch(MAIN_REGISTRY_URL);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: RegistryItem[] = await response.json();
        setAllRegitryItems(data);
      } catch (err) {
        if (err instanceof Error) {
        } else {
        }
        console.error("Failed to fetch widgets:", err);
      } finally {
      }
    };

    init();

    return () => {};
  }, []); // Empty dependency array since we only want to fetch once

  return {};
};

export default useInitializeRegistry;
