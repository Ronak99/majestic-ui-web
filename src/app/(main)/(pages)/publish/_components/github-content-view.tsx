"use client";

import { Button } from "@/components/ui/button";
import {
  getRepoContents,
  getRepositoryTree,
  getUserRepos,
} from "@/actions/github";
import { FolderIcon, FileIcon, ChevronRightIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import {
  GithubRepository,
  GithubRepositoryContent,
  GithubScanResult,
  ScannedFile,
} from "@/util/types";
import { Card } from "@/components/ui/card";
import { IconArrowLeft } from "@tabler/icons-react";
import React from "react";
import Loading from "@/app/components/loading";
import yaml from "yaml";

import { toast } from "sonner";
import { signOut } from "@/actions/auth";

type PathSegment = {
  name: string;
  path: string;
};

type PubspecDependency = {
  version?: string;
  path?: string;
  git?: {
    url: string;
    ref?: string;
  };
};

type PubspecContent = {
  name: string;
  description: string;
  label?: string;
  dependencies: Record<string, string | PubspecDependency>;
  dependency_names: string[];
  preview_url?: string;
};

type RepoItem = {
  name: string;
  path: string;
  download_url: string;
  type: "file" | "dir";
};

type GithubContentViewProps = {
  onSuccessfulScan: (file: GithubScanResult) => void;
};

export default function GithubContentView({
  onSuccessfulScan,
}: GithubContentViewProps) {
  const [repos, setRepos] = useState<GithubRepository[]>();
  const [content, setContent] = useState<GithubRepositoryContent[]>();
  const [pathHistory, setPathHistory] = useState<PathSegment[]>([
    { name: "All", path: "" },
  ]);
  const [selectedRepo, setSelectedRepo] = useState<{
    name: string;
    owner: string;
  } | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  let isSigningOut = false;

  const initialize = async () => {
    setIsLoading(true);

    try {
      const repositories = await getUserRepos();
      setRepos(repositories);
      setContent(undefined);
      setSelectedRepo(null);
      setPathHistory([{ name: "All", path: "" }]);
    } catch (e) {
      if (e instanceof Error) {
        if (isSigningOut) return;
        isSigningOut = true;
        toast("Session Expired.", {
          description: "Your Github session was expired, please sign in again.",
        });
        signOut();
      }
    }

    setIsLoading(false);
  };

  useEffect(() => {
    initialize();
  }, []);

  const handleRepoClick = async (repo: GithubRepository) => {
    if (isLoading) return;

    setSelectedRepo({ name: repo.name, owner: repo.owner.login });
    setPathHistory((prev) => [...prev, { name: repo.name, path: "" }]);

    setIsLoading(true);

    try {
      const data = await getRepoContents(repo.owner.login, repo.name, "");
      // @ts-ignore
      setContent(Array.isArray(data) ? data : [data]);
    } catch (error) {
      console.error("Error fetching repo contents:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContentClick = async (item: GithubRepositoryContent) => {
    if (isLoading) return;

    if (item.type === "dir" && selectedRepo) {
      setIsScanning(false);
      setPathHistory((prev) => [...prev, { name: item.name, path: item.path }]);

      setIsLoading(true);

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
      } finally {
        setIsLoading(false);
      }
    }
  };

  const navigateToPath = async (index: number) => {
    if (isLoading) return;

    setIsScanning(false);

    // If clicking on "All", reset to repository list
    if (index === 0) {
      setContent(undefined);
      setSelectedRepo(null);
      setPathHistory([{ name: "All", path: "" }]);
      return;
    }

    setIsLoading(true);

    // Get the path segments up to the clicked index
    const newPathHistory = pathHistory.slice(0, index + 1);
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
      } finally {
        setIsLoading(false);
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
      } finally {
        setIsLoading(false);
      }
    }
  };

  async function fetchFileContent(
    ownerName: string,
    repoName: string,
    downloadUrl: string
  ): Promise<string> {
    const response = await fetch(downloadUrl);
    return response.text();
  }

  async function scanDirectory(
    ownerName: string,
    repoName: string,
    directoryPath: string,
    componentName: string,
    scannedFiles: ScannedFile[] = []
  ): Promise<ScannedFile[]> {
    const directoryContents = (await getRepoContents(
      ownerName,
      repoName,
      directoryPath
    )) as RepoItem[];

    const trailingPath = directoryPath.split("lib")[1];

    for (const item of directoryContents) {
      if (item.type === "file") {
        const fileContent = await fetchFileContent(
          ownerName,
          repoName,
          item.download_url
        );

        scannedFiles.push({
          name: item.name,
          file_path: `lib/majestic/community/${componentName}${trailingPath}/${item.name}`,
          content: fileContent,
        });
      } else if (item.type === "dir") {
        // Recursively scan subdirectories
        await scanDirectory(
          ownerName,
          repoName,
          item.path,
          componentName,
          scannedFiles
        );
      }
    }

    return scannedFiles;
  }

  // async function scanRepositoryv2() {
  //   // Get all files

  //   const files = await getRepositoryTree(
  //     selectedRepo!.owner,
  //     selectedRepo!.name,
  //     false
  //   );

  //   console.log(files);

  //   // Filter for specific file types and exclude node_modules, etc.
  //   // const relevantFiles = filterFiles(files, {
  //   //   extensions: ["js", "ts", "jsx", "tsx", "py", "java"],
  //   //   exclude: ["node_modules", "dist", "build", ".git"],
  //   //   maxSize: 1024 * 100, // 100KB max
  //   // });

  //   return;
  // }

  const scanRepository = async () => {
    try {
      if (isScanning) return;
      setIsScanning(true);

      // Get current directory contents
      const currentDirectory = pathHistory[pathHistory.length - 1];
      const directoryContents = (await getRepoContents(
        selectedRepo!.owner,
        selectedRepo!.name,
        currentDirectory.path
      )) as RepoItem[];

      // Validate pubspec.yaml existence
      const pubspecInfo = await extractPubspecInfo(directoryContents);

      // Validate lib directory existence
      const libDirectory = directoryContents.find(
        (item) => item.name === "lib" && item.type === "dir"
      );
      if (!libDirectory) {
        throw new Error("lib directory not found in the repository.");
      }

      // Scan lib directory contents
      const libContents = (await getRepoContents(
        selectedRepo!.owner,
        selectedRepo!.name,
        libDirectory.path
      )) as RepoItem[];

      if (libContents.length === 0) {
        throw new Error("lib directory is empty.");
      }

      // Recursively scan the lib directory and collect all files
      const scannedFiles = await scanDirectory(
        selectedRepo!.owner,
        selectedRepo!.name,
        libDirectory.path,
        pubspecInfo.name
      );

      toast("Scanned Successfully.", {
        description:
          "Please fill the form and your component is ready to publish.",
      });

      onSuccessfulScan({
        dependencies: pubspecInfo.dependency_names,
        description: pubspecInfo.description,
        label: pubspecInfo.label,
        name: "community/" + pubspecInfo.name,
        files: scannedFiles,
        previewUrl: pubspecInfo.preview_url,
      });

      return scannedFiles;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred during repository scanning.";

      console.error("Repository scanning error:", error);
      toast("Scanning Failed", {
        description: errorMessage,
      });

      throw error;
    } finally {
      setIsScanning(false);
    }
  };

  async function extractPubspecInfo(
    directoryContents: RepoItem[]
  ): Promise<PubspecContent> {
    // Find the pubspec.yaml file
    const pubspecFile = directoryContents.find(
      (item) => item.name === "pubspec.yaml"
    );

    if (!pubspecFile || !pubspecFile.download_url) {
      throw new Error("pubspec.yaml not found or invalid.");
    }

    // Fetch and parse the pubspec.yaml content
    try {
      const response = await fetch(pubspecFile.download_url);
      const yamlContent = await response.text();
      const parsedContent = yaml.parse(yamlContent) as PubspecContent;

      // Validate required fields
      if (!parsedContent.name) {
        throw new Error("Required field 'name' is missing in pubspec.yaml");
      }
      if (!parsedContent.description) {
        throw new Error(
          "Required field 'description' is missing in pubspec.yaml"
        );
      }
      if (!parsedContent.dependencies) {
        throw new Error(
          "Required field 'dependencies' is missing in pubspec.yaml"
        );
      }

      const dependencyList = Object.keys(parsedContent.dependencies).filter(
        (dep) => dep !== "flutter"
      );

      return {
        name: parsedContent.name,
        description: parsedContent.description,
        label: parsedContent.label,
        dependencies: parsedContent.dependencies,
        preview_url: parsedContent.preview_url,
        dependency_names: dependencyList,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to parse pubspec.yaml: ${error.message}`);
      }
      throw new Error("Failed to parse pubspec.yaml");
    }
  }

  return (
    <Card className="flex flex-col h-[550px] mt-4 relative">
      {/* Top Bar */}
      <div className="flex items-center justify-between font-medium border-b px-4 py-4 w-full">
        <div>
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
        {selectedRepo && (
          <div
            className="flex items-center justify-center rounded-lg bg-white text-black font-semibold text-sm py-1 cursor-pointer w-20"
            onClick={scanRepository}
          >
            {!isScanning && "Scan"}
            {isScanning && <Loading size="sm" variant="dark" />}
          </div>
        )}
      </div>

      {/* Github Content View */}
      <div className="flex-1 overflow-y-scroll">
        {!content &&
          repos?.map((repo) => (
            <div
              key={repo.name}
              className={`flex justify-between cursor-pointer px-4 py-3 items-center border-b hover:bg-neutral-800 transition ${
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
              aria-disabled={true}
              className={`flex justify-between cursor-pointer px-4 py-3 items-center border-b hover:bg-neutral-800 transition`}
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

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <Loading size="md" variant="light" />
        </div>
      )}
    </Card>
  );
}
