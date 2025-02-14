import { getAllRegistryItems, getContentForCli } from "@/actions/registry";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const query = url.searchParams.get("q");

  // Requested registry items
  const registryItemList = query?.split(",");

  if (!registryItemList?.length) {
    return new NextResponse(JSON.stringify({ registry: "enter something." }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const content = await getContentForCli(registryItemList);

  return new NextResponse(JSON.stringify(content), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
