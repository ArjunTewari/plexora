import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the path is protected
  const isProtectedPath =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/ai-assistant") ||
    pathname.startsWith("/forecasting") ||
    pathname.startsWith("/data-integration") ||
    pathname.startsWith("/anomaly-detection") ||
    pathname.startsWith("/competitor-analysis") ||
    pathname.startsWith("/reports") ||
    (pathname.startsWith("/api/") && !pathname.startsWith("/api/auth"))

  // Check if the path is auth related
  const isAuthPath =
    pathname.startsWith("/auth/login") ||
    pathname.startsWith("/auth/register") ||
    pathname.startsWith("/auth/forgot-password")

  // Get the token
  const token = await getToken({ req: request })

  // Redirect unauthenticated users to login page
  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  // Redirect authenticated users to dashboard if they try to access auth pages
  if (isAuthPath && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/ai-assistant/:path*",
    "/forecasting/:path*",
    "/data-integration/:path*",
    "/anomaly-detection/:path*",
    "/competitor-analysis/:path*",
    "/reports/:path*",
    "/auth/:path*",
    "/api/:path*",
  ],
}

