"use client";
import useInitializeRegistry from "@/hooks/useInitializeRegistry";
import useWidgetStore from "@/store/useRegistry";
import { NavOption, NavSection } from "@/util/constants";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Loading from "./loading";
import useRegistry from "@/store/useRegistry";

const OptionItem = ({
  option,
  pathname,
}: {
  option: NavOption;
  pathname: string | null;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
    >
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
    </motion.div>
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
    <motion.div
      key={section.title}
      className="flex flex-col gap-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="font-semibold text-sm px-2">{section.title}</h3>
      <div className="flex flex-col gap-[2px]">
        {section.options.map((option) => (
          <OptionItem key={option.label} option={option} pathname={pathname} />
        ))}
      </div>
    </motion.div>
  );
};

const LeftPanel = () => {
  const pathname = usePathname();
  const { registry } = useRegistry();
  const [animatedSections, setAnimatedSections] = useState<NavSection[]>([]);

  useEffect(() => {
    if (registry.length > 0) {
      const newNavSections: NavSection[] = [
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
        ...Array.from(new Set(registry.map((item) => item.type))).map(
          (type) => ({
            title:
              type.charAt(0).toUpperCase() + type.slice(1).toLowerCase() + "s",
            options: registry
              .filter((item) => item.type === type)
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

      // Gradually reveal sections
      const revealSections = () => {
        newNavSections.forEach((section, index) => {
          setTimeout(() => {
            setAnimatedSections((prev) => {
              // Ensure we don't duplicate sections
              const updatedSections = [...prev];
              if (
                !prev.some(
                  (existingSection) => existingSection.title === section.title
                )
              ) {
                updatedSections.push(section);
              }
              return updatedSections;
            });
          }, index * 200); // Stagger the reveal
        });
      };

      // Clear existing sections and start reveal
      setAnimatedSections([]);
      revealSections();
    }
  }, [registry]);

  return (
    <nav className="flex flex-col hidden md:block pr-4 py-6 border-r h-full">
      <div className="flex flex-col gap-8">
        <Suspense fallback={<Loading size="md" variant="light" />}>
          <AnimatePresence>
            {(animatedSections.length > 0 ? animatedSections : []).map(
              (section) => (
                <SectionView
                  key={section.title}
                  section={section}
                  pathname={pathname}
                />
              )
            )}
          </AnimatePresence>
        </Suspense>
      </div>
    </nav>
  );
};

export default LeftPanel;
