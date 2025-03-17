"use client";

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
        <div className="flex flex-col items-center gap-2 rounded-xl p-0 border hover:border-2 hover:border-orange-500 transition hover:scale-[1.12]">
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
        </div>
      </Link>
    </>
  );
}
