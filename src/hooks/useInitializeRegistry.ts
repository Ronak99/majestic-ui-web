import { getAllRegistryItems } from "@/actions/registry";
import { db } from "@/lib/db";
import useRegistry from "@/store/useRegistry";
import { useEffect, useState } from "react";

const useInitializeRegistry = () => {
  const { registry, setAllRegitryItems } = useRegistry();

  useEffect(() => {
    // const abortController = new AbortController();

    const init = async () => {
      if (registry.length) return;
      try {
        const response = await getAllRegistryItems();
        setAllRegitryItems(response);
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
