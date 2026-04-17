import { auth } from "@/auth/auth";
import { NextResponse, type NextRequest } from "next/server";

function clearAuthCookies(response: NextResponse) {
  response.cookies.set("better-auth.session_token", "", {
    path: "/",
    maxAge: 0,
  });
  response.cookies.set("__Secure-better-auth.session_token", "", {
    path: "/",
    maxAge: 0,
    secure: true,
  });
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtectedRoute =
    pathname.startsWith("/admin") || pathname.startsWith("/student");

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  const hasSessionCookie =
    request.cookies.has("better-auth.session_token") ||
    request.cookies.has("__Secure-better-auth.session_token");

  if (!hasSessionCookie) {
    const response = NextResponse.redirect(new URL("/", request.url));
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    return response;
  }

  let authResult: unknown;
  try {
    authResult = await auth.api.getSession({
      headers: request.headers,
    });
  } catch {
    const response = NextResponse.redirect(new URL("/", request.url));
    clearAuthCookies(response);
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    return response;
  }

  const authData = authResult as
    | { user?: { role?: string }; session?: unknown }
    | null
    | undefined;
  const user = authData?.user;

  if (!user) {
    const response = NextResponse.redirect(new URL("/", request.url));
    clearAuthCookies(response);
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    return response;
  }

  const userRole = user.role;
  if (pathname.startsWith("/admin") && userRole !== "admin") {
    const response = NextResponse.redirect(new URL("/student", request.url));
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    return response;
  }

  if (pathname.startsWith("/student") && userRole === "admin") {
    const response = NextResponse.redirect(new URL("/admin", request.url));
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    return response;
  }

  const response = NextResponse.next();
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/student/:path*"],
};
