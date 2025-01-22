"use client";

import useWidgetsInitialization from "@/hooks/useWidgetsInitialization";
import Heading from "./_component/heading";
import { Suspense } from "react";
import Loading from "@/app/components/loading";

export default function Page() {
  const { isLoading, error } = useWidgetsInitialization();

  if (error) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p className="text-destructive">
          Failed to load widgets: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-svh flex-col bg-background gap-3">
      <Suspense fallback={<Loading />}>
        <Heading
          title="Accordion"
          subtitle="A vertically set of interactive heading that each reveal a section of content."
        />
        {isLoading ? (
          <Loading />
        ) : // Your widgets content here
        null}
      </Suspense>
    </div>
  );
}
