"use client";

import { CardSpotlight } from "@/components/ui/card-spotlight";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AuthorView({
  githubUsername,
}: {
  githubUsername: string | null;
}) {
  const [author, setAuthor] = useState(null);

  const initialize = async () => {
    const response = await fetch(
      `https://api.github.com/users/${githubUsername}`
    );
    const githubUser = await response?.json();
    setAuthor(githubUser);
  };

  useEffect(() => {
    if (githubUsername && githubUsername != "Ronak99") {
      initialize();
    }
  });

  if (!author) return <></>;

  return (
    <>
      <Link href={author!["html_url"]} target="_">
        <CardSpotlight
          radius={80}
          color="#00000000"
          className="flex flex-col items-center gap-2 rounded-xl p-0"
        >
          <div className="text-xs border-b px-4 py-2 font-bold text-muted-foreground">
            CONTRIBUTED BY
          </div>

          <div className="flex flex-row gap-2 pt-1 pb-4 items-center">
            <img
              src={author!["avatar_url"]}
              alt="User avatar"
              className={`h-[25px] w-[25px] rounded-full`}
            />
            <p className="font-semibold text-sm">{author!["login"]}</p>
          </div>
        </CardSpotlight>
      </Link>
    </>
  );
}

// {
//     "login": "Ronak99",
//     "id": 25359214,
//     "node_id": "MDQ6VXNlcjI1MzU5MjE0",
//     "avatar_url": "https://avatars.githubusercontent.com/u/25359214?v=4",
//     "gravatar_id": "",
//     "url": "https://api.github.com/users/Ronak99",
//     "html_url": "https://github.com/Ronak99",
//     "followers_url": "https://api.github.com/users/Ronak99/followers",
//     "following_url": "https://api.github.com/users/Ronak99/following{/other_user}",
//     "gists_url": "https://api.github.com/users/Ronak99/gists{/gist_id}",
//     "starred_url": "https://api.github.com/users/Ronak99/starred{/owner}{/repo}",
//     "subscriptions_url": "https://api.github.com/users/Ronak99/subscriptions",
//     "organizations_url": "https://api.github.com/users/Ronak99/orgs",
//     "repos_url": "https://api.github.com/users/Ronak99/repos",
//     "events_url": "https://api.github.com/users/Ronak99/events{/privacy}",
//     "received_events_url": "https://api.github.com/users/Ronak99/received_events",
//     "type": "User",
//     "user_view_type": "public",
//     "site_admin": false,
//     "name": "Ronak Punase",
//     "company": null,
//     "blog": "https://ronak99.github.io/portfolio/",
//     "location": null,
//     "email": null,
//     "hireable": true,
//     "bio": null,
//     "twitter_username": "The_RonakPunase",
//     "public_repos": 72,
//     "public_gists": 0,
//     "followers": 390,
//     "following": 25,
//     "created_at": "2017-01-26T03:26:53Z",
//     "updated_at": "2025-03-07T12:39:33Z"
//   }
