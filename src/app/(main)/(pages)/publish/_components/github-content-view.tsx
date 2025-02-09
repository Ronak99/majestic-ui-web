"use client";

import { Button } from "@/components/ui/button";
import { getRepoContents, getUserRepos } from "@/actions/github";
import { FolderIcon, FileIcon, ChevronRightIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { GithubRepository, GithubRepositoryContent } from "@/util/types";
import { Card } from "@/components/ui/card";
import { IconArrowLeft } from "@tabler/icons-react";
import React from "react";

type PathSegment = {
  name: string;
  path: string;
};

export default function GithubContentView() {
  const [repos, setRepos] = useState<GithubRepository[]>();
  const [content, setContent] = useState<GithubRepositoryContent[]>();
  const [pathHistory, setPathHistory] = useState<PathSegment[]>([
    { name: "All", path: "" },
  ]);
  const [selectedRepo, setSelectedRepo] = useState<{
    name: string;
    owner: string;
  } | null>(null);

  const initialize = async () => {
    const repositories = await getUserRepos();
    setRepos(repositories);
    setContent(undefined);
    setSelectedRepo(null);
    setPathHistory([{ name: "All", path: "" }]);
  };

  useEffect(() => {
    initialize();
  }, []);

  const handleRepoClick = async (repo: GithubRepository) => {
    setSelectedRepo({ name: repo.name, owner: repo.owner.login });
    setPathHistory((prev) => [...prev, { name: repo.name, path: "" }]);

    try {
      const data = await getRepoContents(repo.owner.login, repo.name, "");
      // @ts-ignore
      setContent(Array.isArray(data) ? data : [data]);
    } catch (error) {
      console.error("Error fetching repo contents:", error);
    }
  };

  const handleContentClick = async (item: GithubRepositoryContent) => {
    if (item.type === "dir" && selectedRepo) {
      setPathHistory((prev) => [...prev, { name: item.name, path: item.path }]);

      try {
        const data = await getRepoContents(
          selectedRepo.owner,
          selectedRepo.name,
          item.path
        );
        // @ts-ignore
        setContent(Array.isArray(data) ? data : [data]);
      } catch (error) {
        console.error("Error fetching directory contents:", error);
      }
    }
  };

  const navigateToPath = async (index: number) => {
    // If clicking on "All", reset to repository list
    if (index === 0) {
      setContent(undefined);
      setSelectedRepo(null);
      setPathHistory([{ name: "All", path: "" }]);
      return;
    }

    // Get the path segments up to the clicked index
    const newPathHistory = pathHistory.slice(0, index + 1);
    console.log(newPathHistory);
    setPathHistory(newPathHistory);

    // If we're navigating to a repository level
    if (index === 1 && selectedRepo) {
      try {
        const data = await getRepoContents(
          selectedRepo.owner,
          selectedRepo.name,
          ""
        );
        // @ts-ignore
        setContent(Array.isArray(data) ? data : [data]);
      } catch (error) {
        console.error("Error navigating to repository:", error);
      }
      return;
    }

    // If we're navigating to a subfolder
    if (selectedRepo && index > 1) {
      const targetPath = newPathHistory[newPathHistory.length - 1].path;
      try {
        const data = await getRepoContents(
          selectedRepo.owner,
          selectedRepo.name,
          targetPath
        );
        // @ts-ignore
        setContent(Array.isArray(data) ? data : [data]);
      } catch (error) {
        console.error("Error navigating to path:", error);
      }
    }
  };

  return (
    <Card className="flex flex-col h-[550px] mt-4">
      <div className="items-center font-medium border-b px-4 py-4 w-full">
        {pathHistory.map((segment, index) => (
          <React.Fragment key={index}>
            <span
              className={`hover:underline cursor-pointer ${
                index == pathHistory.length - 1
                  ? "text-blue-300 font-semibold"
                  : "text-muted-foreground"
              }`}
              onClick={() => navigateToPath(index)}
            >
              {segment.name}
            </span>
            {index < pathHistory.length - 1 && (
              <span className="mx-2 text-gray-400">/</span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Rest of your component remains the same */}
      <div className="flex-grow overflow-y-scroll">
        {!content &&
          repos?.map((repo) => (
            <div
              key={repo.name}
              className={`flex justify-between cursor-pointer px-4 py-3 items-center border-b hover:bg-neutral-800 transition-colors ${
                selectedRepo?.name === repo.name ? "bg-neutral-800" : ""
              }`}
              onClick={() => handleRepoClick(repo)}
            >
              <div className="flex gap-2">
                <FolderIcon className="w-5 h-5" /> {repo.name}
              </div>
              <ChevronRightIcon className="w-5 h-5 ml-auto" />
            </div>
          ))}

        {content &&
          content.map((item) => (
            <div
              key={item.sha}
              className="flex justify-between cursor-pointer px-4 py-3 items-center border-b hover:bg-neutral-800 transition-colors"
              onClick={() => handleContentClick(item)}
            >
              {item.type === "dir" ? (
                <>
                  <div className="flex gap-2">
                    <FolderIcon className="w-5 h-5 text-blue-400" />
                    <span>{item.name}</span>
                  </div>
                  <ChevronRightIcon className="w-5 h-5 ml-auto" />
                </>
              ) : (
                <>
                  <div className="flex gap-2">
                    <FileIcon className="w-5 h-5 text-gray-300" />
                    <span>{item.name}</span>
                  </div>

                  {item.size && (
                    <span className="text-xs text-gray-300 ml-auto">
                      {(item.size / 1024).toFixed(1)} KB
                    </span>
                  )}
                </>
              )}
            </div>
          ))}
      </div>
    </Card>
  );
}
