import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import useRegistry from "@/store/useRegistry";
import useTitleHistory from "@/store/useTitleHistory";
import { RegistryContent } from "@/util/types";
import { getContent } from "@/actions/registry";

// Define possible states for the component fetch
type RegistryContentState = {
  status: "idle" | "loading" | "success" | "error";
  data: RegistryContent | null;
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

export const useRegistryContent = () => {
  const pathname = usePathname();
  const { currentTitle, prevTitle, addToTitleHistory } = useTitleHistory();
  const { getRegistryContent, addToRegistryContentCache } = useRegistry();

  const [state, setState] = useState<RegistryContentState>({
    status: "idle",
    data: null,
    error: null,
  });

  useEffect(() => {
    // get the trailing value
    let componentName = pathname.split("registry/")[1];

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
        const cachedComponent = getRegistryContent(componentName);
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

        const registryContent = await getContent(componentName);
        addToRegistryContentCache(registryContent!);

        setState({
          status: "success",
          data: registryContent!,
          error: null,
        });

        return;
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
// function isValidComponent(data: any): data is Component {
//   return (
//     typeof data === "object" &&
//     data !== null &&
//     typeof data.name === "string" &&
//     Array.isArray(data.dependencies) &&
//     typeof data.demo === "string" &&
//     Array.isArray(data.files)
//   );
// }
