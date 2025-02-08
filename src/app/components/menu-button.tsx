import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import useRegistry from "@/store/useRegistry";
import useWidgetStore from "@/store/useRegistry";
import { NavSection } from "@/util/constants";
import Image from "next/image";
import Link from "next/link";

export default function MenuButton() {
  const { registry } = useRegistry();

  // Compute sections by combining static and dynamic data
  const navSections: NavSection[] = [
    {
      title: "Getting Started",
      options: [
        {
          label: "Introduction",
          value: "/introduction",
        },
        {
          label: "Installation",
          value: "/installation",
        },
      ],
    },
    ...Array.from(new Set(registry.map((widget) => widget.type))).map(
      (type) => ({
        title: type.charAt(0).toUpperCase() + type.slice(1) + "s",
        options: registry
          .filter((widget) => widget.type === type)
          .map((widget) => ({
            label: widget.label || "",
            value: `/${type + "s"}/${widget.name?.toLowerCase()}` || "",
          })),
      })
    ),
    {
      title: "More",
      options: [
        {
          label: "Request a widget",
          value: "/request",
        },
      ],
    },
  ];
  return (
    <Drawer>
      <DrawerTrigger className="flex items-center">
        <div className="cursor-pointer hover:bg-neutral-800 py-1 px-2 rounded-lg">
          <Image
            src="/menu.svg"
            alt="Menu"
            width={24}
            height={24}
            className="dark:invert"
          />
        </div>
      </DrawerTrigger>
      <DrawerContent className="p-4 gap-6 mb-4">
        {navSections.map((e) => {
          return (
            <div key={e.title} className="flex flex-col">
              <DrawerTitle className="mb-4">{e.title}</DrawerTitle>
              {e.options.map((option) => {
                return (
                  <Link className="mb-1" key={option.value} href={option.value}>
                    <DrawerClose>{option.label}</DrawerClose>
                  </Link>
                );
              })}
            </div>
          );
        })}
      </DrawerContent>
    </Drawer>
  );
}
