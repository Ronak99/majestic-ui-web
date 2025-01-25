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
import useWidgetStore from "@/store/useWidgetStore";
import { NavSection } from "@/util/constants";
import Image from "next/image";
import Link from "next/link";

export default function MenuButton() {
  const { allWidgets } = useWidgetStore();

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
    {
      title: "Widgets",
      options: allWidgets.map((widget) => ({
        label: widget.label || "",
        value: `/widgets/${widget.name?.toLowerCase()}` || "",
      })),
    },
  ];
  return (
    <Drawer>
      <DrawerTrigger>
        <Button variant={"ghost"} size={"icon"}>
          <Image
            src="/menu.svg"
            alt="Menu"
            width={24}
            height={24}
            className="dark:invert"
          />
        </Button>
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
