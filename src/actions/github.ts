"use server";

import { createSSRClient } from "@/lib/supabase/server";
import { Octokit } from "@octokit/rest";
import { signOut } from "./auth";

export const getOctokit = async () => {
  const supabase = await createSSRClient();
  const {
    data: { session },
  } = await supabase.auth?.getSession();

  if (!session) {
    throw new Error("No active session");
  }

  // Check if provider token exists and is valid
  if (session.provider_token) {
    // If we have a valid token, return existing or create new Octokit instance
    return new Octokit({ auth: session.provider_token });
  }

  // If no provider token, try to refresh the session
  const { data: refreshData, error: refreshError } =
    await supabase.auth.refreshSession();

  if (refreshError) {
    throw refreshError;
  }

  const newSession = refreshData.session;

  if (!newSession?.provider_token) {
    // If still no provider token after refresh, we need to re-authenticate
    throw new Error("GitHub token refresh failed. Please sign in again.", {
      cause: "no-refresh-token",
    });
  }

  // Create new Octokit instance with refreshed token
  return new Octokit({ auth: newSession.provider_token });
};

export const getUserRepos = async (page = 1, perPage = 30) => {
  const octokit = await getOctokit();
  const { data } = await octokit.repos.listForAuthenticatedUser({
    per_page: perPage,
    page,
    sort: "updated",
    direction: "desc",
  });
  return data;
};

export const getRepoContents = async (
  owner: string,
  repo: string,
  path = ""
) => {
  const octokit = await getOctokit();
  const { data } = await octokit.repos.getContent({
    owner,
    repo,
    path,
  });

  return data;
};

interface TreeFile {
  name: string;
  file_path: string;
  content?: string;
  size?: number;
  type: "blob" | "tree";
  sha: string;
}

export async function getRepositoryTree(
  owner: string,
  repo: string,
  shouldFetchContent: boolean = true
): Promise<TreeFile[]> {
  const octokit = await getOctokit();

  try {
    // Get the default branch's latest commit SHA
    const { data: repoData } = await octokit.repos.get({
      owner,
      repo,
    });

    // Get the complete tree with recursive flag
    const { data: treeData } = await octokit.git.getTree({
      owner,
      repo,
      tree_sha: repoData.default_branch,
      recursive: "true",
    });

    const files: TreeFile[] = [];

    // Process all tree items
    for (const item of treeData.tree) {
      if (item.type === "blob") {
        // 'blob' represents a file
        const file: TreeFile = {
          name: item.path?.split("/").pop() || "",
          file_path: item.path ?? "",
          type: "blob",
          size: item.size,
          sha: item.sha ?? "",
        };

        // Optionally fetch content for the file
        if (shouldFetchContent) {
          try {
            const { data: blobData } = await octokit.git.getBlob({
              owner,
              repo,
              file_sha: item.sha ?? "",
            });

            // GitHub returns base64 encoded content
            file.content = Buffer.from(blobData.content, "base64").toString(
              "utf-8"
            );
          } catch (error) {
            console.warn(`Failed to fetch content for ${item.path}:`, error);
          }
        }

        files.push(file);
      }
    }

    return files;
  } catch (error) {
    console.error("Error fetching repository tree:", error);
    throw error;
  }
}
