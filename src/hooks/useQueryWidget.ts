import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import useRegistry from "@/store/useRegistry";
import useTitleHistory from "@/store/useTitleHistory";

// Define possible states for the component fetch
type ComponentState = {
  status: "idle" | "loading" | "success" | "error";
  data: Component | null;
  error: Error | null;
};

// Custom error types for better error handling
export class ComponentNotFoundError extends Error {
  constructor(componentName: string) {
    super(`Component "${componentName}" not found`);
    this.name = "ComponentNotFoundError";
  }
}

export class InvalidComponentNameError extends Error {
  constructor() {
    super("Invalid component name in URL");
    this.name = "InvalidComponentNameError";
  }
}

export const useGetComponent = () => {
  const pathname = usePathname();
  const { currentTitle, prevTitle, addToTitleHistory } = useTitleHistory();
  const { getComponent, addToComponentCache } = useRegistry();

  const [state, setState] = useState<ComponentState>({
    status: "idle",
    data: null,
    error: null,
  });

  useEffect(() => {
    console.log("RUNNING USE EFFECT");
    const componentName = pathname.split("/").pop();

    if (!componentName) {
      setState({
        status: "error",
        data: null,
        error: new InvalidComponentNameError(),
      });
      return;
    }

    const fetchComponent = async () => {
      try {
        // First check cache
        const cachedComponent = getComponent(componentName);
        if (cachedComponent) {
          addToTitleHistory(cachedComponent.label);
          //   previousDataRef.current = cachedComponent;
          setState({
            status: "success",
            data: cachedComponent,
            error: null,
          });
          return;
        }

        // If not in cache, set loading state
        setState((prev) => ({ ...prev, status: "loading" }));

        // Construct URL
        const COMPONENT_URL = `https://raw.githubusercontent.com/Ronak99/majestic-ui-flutter/refs/heads/master/registry/${componentName}.json`;

        const abortController = new AbortController();
        const response = await fetch(COMPONENT_URL, {
          signal: abortController.signal,
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new ComponentNotFoundError(componentName);
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: Component = await response.json();

        // Validate the component data
        if (!isValidComponent(data)) {
          throw new Error("Invalid component data received");
        }

        // Add to cache and update state
        addToComponentCache(data);
        setState({
          status: "success",
          data,
          error: null,
        });

        return () => {
          abortController.abort();
        };
      } catch (error) {
        setState({
          status: "error",
          data: null,
          error:
            error instanceof Error
              ? error
              : new Error("An unknown error occurred"),
        });
      }
    };

    fetchComponent();
  }, [pathname]);

  return {
    ...state,
    currentTitle: currentTitle,
    prevTitle: prevTitle,
  };
};

// Type guard to validate component data
function isValidComponent(data: any): data is Component {
  return (
    typeof data === "object" &&
    data !== null &&
    typeof data.name === "string" &&
    Array.isArray(data.dependencies) &&
    typeof data.demo === "string" &&
    Array.isArray(data.files)
  );
}
