"use client";

import { useAuthInitializer } from "@/hooks/useAuthInitializer";
import useInitializeRegistry from "@/hooks/useInitializeRegistry";

export default function DataLoader() {
  const {} = useInitializeRegistry();
  useAuthInitializer();

  return <div></div>;
}
