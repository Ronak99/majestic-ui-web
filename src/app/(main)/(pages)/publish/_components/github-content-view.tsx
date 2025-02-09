"use client";

import { Button } from "@/components/ui/button";
import { getRepoContents, getUserRepos } from "@/actions/github";
import { FolderIcon, FileIcon, ChevronRightIcon } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import DetailSectionView from "../../[type]/[id]/_component/detail-section-view";
import { GithubRepository, GithubRepositoryContent } from "@/util/types";

export default function GithubContentView() {
  const [repos, setRepos] = useState<GithubRepository[]>();
  const [content, setContent] = useState<GithubRepositoryContent[]>();
  const [currentPath, setCurrentPath] = useState<string>("");
  const [selectedRepo, setSelectedRepo] = useState<{
    name: string;
    owner: string;
  } | null>(null);

  const handleRepoClick = async (repo: GithubRepository) => {
    setSelectedRepo({ name: repo.name, owner: repo.owner.login });
    setCurrentPath("");
    try {
      const data = await getRepoContents(repo.owner.login, repo.name, "");

      //@ts-ignore
      setContent(Array.isArray(data) ? data : [data]);
    } catch (error) {
      console.error("Error fetching repo contents:", error);
    }
  };

  const handleContentClick = async (item: GithubRepositoryContent) => {
    if (item.type === "dir" && selectedRepo) {
      const newPath = item.path;
      setCurrentPath(newPath);
      try {
        const data = await getRepoContents(
          selectedRepo.owner,
          selectedRepo.name,
          newPath
        );

        //@ts-ignore
        setContent(Array.isArray(data) ? data : [data]);
      } catch (error) {
        console.error("Error fetching directory contents:", error);
      }
    }
  };

  const navigateBack = async () => {
    if (!selectedRepo || !currentPath) return;

    const parentPath = currentPath.split("/").slice(0, -1).join("/");
    setCurrentPath(parentPath);
    try {
      const data = await getRepoContents(
        selectedRepo.owner,
        selectedRepo.name,
        parentPath
      );

      //@ts-ignore
      setContent(Array.isArray(data) ? data : [data]);
    } catch (error) {
      console.error("Error navigating back:", error);
    }
  };

  return (
    <DetailSectionView heading="Provide a valid Flutter package.">
      <div className="flex flex-col gap-4">
        <Button
          onClick={async () => {
            const repositories = await getUserRepos();
            setRepos(repositories);
            setContent(undefined);
            setSelectedRepo(null);
          }}
        >
          Get User Repos
        </Button>
        <div className="flex flex-row gap-8">
          <div className="flex flex-col w-64 rounded-lg p-4">
            <h3 className="font-semibold mb-3">Repositories</h3>
            {repos?.map((repo) => (
              <div
                key={repo.name}
                className={`cursor-pointer p-2 rounded hover:bg-neutral-800 transition-colors ${
                  selectedRepo?.name === repo.name ? "bg-neutral-800" : ""
                }`}
                onClick={() => handleRepoClick(repo)}
              >
                {repo.name}
              </div>
            ))}
          </div>

          {content && (
            <div className="flex flex-col flex-1 bg-neutral-80 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={navigateBack}
                  disabled={!currentPath}
                >
                  Back
                </Button>
                <span className="text-sm text-gray-600">/{currentPath}</span>
              </div>

              <div className="flex flex-col">
                {content.map((item) => (
                  <div
                    key={item.sha}
                    className="flex items-center gap-2 p-2 hover:bg-neutral-800 rounded cursor-pointer"
                    onClick={() => handleContentClick(item)}
                  >
                    {item.type === "dir" ? (
                      <>
                        <FolderIcon className="w-4 h-4 text-blue-400" />
                        <span>{item.name}</span>
                        <ChevronRightIcon className="w-4 h-4 ml-auto" />
                      </>
                    ) : (
                      <>
                        <FileIcon className="w-4 h-4 text-gray-300" />
                        <span>{item.name}</span>
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
            </div>
          )}
        </div>
      </div>
    </DetailSectionView>
  );
}
