import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { Layers } from "lucide-react";

export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <div className="flex items-center gap-2">
        <Layers className="size-4" />
        <span>majestic-ui</span>
      </div>
    ),
    url: "/",
  },
  links: [
    {
      text: "Home",
      url: "/",
    },
    {
      text: "GitHub",
      url: "https://github.com/Ronak99/majestic-ui-flutter/",
      external: true,
    },
  ],
};
