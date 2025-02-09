"use server";

import { createSSRClient } from "@/lib/supabase/server";
import { Octokit } from "@octokit/rest";

export const getOctokit = async () => {
  const supabase = await createSSRClient();
  const session = await supabase.auth?.getSession();
  const accessToken = session.data.session?.provider_token;
  if (!accessToken) {
    throw new Error("No access token found");
  }
  return new Octokit({ auth: accessToken });
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
