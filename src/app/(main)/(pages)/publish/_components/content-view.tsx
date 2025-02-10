"use client";

import { useState } from "react";
import GithubContentView from "./github-content-view";
import PublishForm from "./publish-form";
import { GithubScanResult } from "@/util/types";

export default function ContentView() {
  const [page, setPage] = useState<"github" | "form">("github");
  const [scanResult, setScanResult] = useState<GithubScanResult>();

  const handleSuccessfulScan = (scanResult: GithubScanResult) => {
    console.log(scanResult);
    setPage("form");
    setScanResult(scanResult);
  };

  if (page == "github") {
    return <GithubContentView onSuccessfulScan={handleSuccessfulScan} />;
  }

  return scanResult && <PublishForm scanResult={scanResult} />;
}
