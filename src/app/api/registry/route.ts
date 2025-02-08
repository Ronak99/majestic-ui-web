import { NextResponse } from "next/server";

export function GET(req: Request) {
  // @ts-ignore
  return new NextResponse(JSON.stringify(data.default), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
