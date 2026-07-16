import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Allow all requests to pass through to let the mock session fallback handle rendering/auth bypass
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
