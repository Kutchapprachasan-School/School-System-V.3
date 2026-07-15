import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { status: "UP", timestamp: Date.now() },
    {
      status: 200,
      headers: {
        // Allow clients to cache this for up to 30 seconds
        "Cache-Control": "public, max-age=30, s-maxage=30",
      },
    }
  );
}
