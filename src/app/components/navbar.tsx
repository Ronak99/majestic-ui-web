"use client";
import useWidgetsInitialization from "@/hooks/useWidgetsInitialization";
import useWidgetStore from "@/store/useWidgetStore";
import { NavOption, NavSection } from "@/util/constants";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Loading from "./loading";

const OptionItem = ({
  option,
  pathname,
}: {
  option: NavOption;
  pathname: string | null;
}) => {
  return (
    <Link href={option.value}>
      <div
        className={`flex space-x-3 items-center px-2 py-[6px] text-white cursor-pointer rounded-lg transition ease-in-out duration-200 bg-transparent hover:bg-zinc-900 ${
          pathname?.includes(option.value) ? "bg-zinc-800" : ""
        }`}
      >
        <p className="text-sm font-medium" key={option.value}>
          {option.label}
        </p>
      </div>
    </Link>
  );
};

const SectionView = ({
  section,
  pathname,
}: {
  section: NavSection;
  pathname: string | null;
}) => {
  return (
    <div key={section.title} className="flex flex-col gap-2">
      <h3 className="font-semibold text-sm px-2">{section.title}</h3>
      <div className="flex flex-col gap-[2px]">
        {section.options.map((option) => (
          <OptionItem key={option.label} option={option} pathname={pathname} />
        ))}
      </div>
    </div>
  );
};

const LeftPanel = () => {
  const { isLoading, error } = useWidgetsInitialization();
  const pathname = usePathname();
  const { allWidgets } = useWidgetStore();

  if (error) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p className="text-destructive">
          Failed to load widgets: {error.message}
        </p>
      </div>
    );
  }

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
    <nav className="flex flex-col hidden md:block pr-4 py-6 border-r h-full">
      <div className="flex flex-col gap-8">
        <Suspense fallback={<Loading />}>
          {navSections.map((section) => (
            <SectionView
              key={section.title}
              section={section}
              pathname={pathname}
            />
          ))}
          {isLoading ? <Loading /> : null}
        </Suspense>
      </div>
    </nav>
  );
};

export default LeftPanel;
