import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const cookieStore = await cookies();
  
  // Delete the Better Auth session cookies
  cookieStore.delete("better-auth.session_token");
  cookieStore.delete("__secure-better-auth.session_token");

  // Redirect back to login
  const url = new URL(request.url);
  const loginUrl = new URL("/login", url.origin);
  
  return NextResponse.redirect(loginUrl);
}
