import { NextResponse } from "next/server";

export function GET(req: Request) {
  const componentName = req.url.split("/").pop();

  console.log(componentName);

  // @ts-ignore
  return new NextResponse(JSON.stringify({}), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
