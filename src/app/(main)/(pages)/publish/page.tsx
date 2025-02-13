"use client";

import Heading from "../../_component/heading";
import { useAuthStore } from "@/store/useAuthStore";
import NoUserView from "./_components/no-user-view";
import ContentView from "./_components/content-view";

export default function PublishPage() {
  const { user } = useAuthStore();

  return (
    <>
      <Heading
        currentTitle={"Publish"}
        subtitle={"Easily publish a Github Repository."}
      />

      {!user && <NoUserView />}

      {user && <ContentView />}
    </>
  );
}
