import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Better Auth stores the session token in "better-auth.session_token" (or secure variant)
  const sessionCookie =
    request.cookies.get("better-auth.session_token") ||
    request.cookies.get("__secure-better-auth.session_token");

  const { pathname } = request.nextUrl;
  const isAuthPage = pathname.startsWith("/login");
  const isDashboardPage = pathname.startsWith("/dashboard");

  if (isDashboardPage && !sessionCookie) {
    const loginUrl = new URL("/login", request.url);
    // Remember original URL to redirect after successful login
    loginUrl.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPage && sessionCookie) {
    const dashboardUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

// Strict matcher to prevent middleware from intercepting static resources
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, logo images, etc.
     */
    "/((?!api|_next/static|_next/image|favicon.ico|logo\\.png|.*\\.png$|.*\\.jpg$).*)",
  ],
};
