"use client";

import { useState } from "react";
import GithubContentView from "./github-content-view";
import PublishForm from "./publish-form";
import { GithubScanResult } from "@/util/types";

export default function ContentView() {
  const [page, setPage] = useState<"github" | "form">("github");
  const [scanResult, setScanResult] = useState<GithubScanResult>();

  const handleSuccessfulScan = (scanResult: GithubScanResult) => {
    setPage("form");
    setScanResult(scanResult);
  };

  const onBackButtonTap = () => {
    setPage("github");
  };

  if (page == "github") {
    return <GithubContentView onSuccessfulScan={handleSuccessfulScan} />;
  }

  return (
    scanResult && (
      <PublishForm scanResult={scanResult} onBackButtonTap={onBackButtonTap} />
    )
  );
}
