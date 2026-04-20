import { auth } from "@/auth/auth";
import { NextResponse, type NextRequest } from "next/server";
// middleware or proxy to protect routes and redirect based on auth status and role
// it helps check cookies and role before allowing access to protected routes under /admin and /student
function clearAuthCookies(response: NextResponse) {
  response.cookies.set("better-auth.session_token", "", {
    path: "/",
    maxAge: 0,
  });
  response.cookies.set("__Secure-better-auth.session_token", "", { // secure cookie variant
    path: "/", 
    maxAge: 0,
    secure: true,
  });
}


export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtectedRoute =
    pathname.startsWith("/admin") || pathname.startsWith("/student"); //protect any routes that start with /admin or /student, allowing only authenticated users with appropriate roles to access them

  // If the route is not protected, allow the request to proceed without checks.
  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Check for the presence of the session cookie. If it's missing, redirect to the login page
  const hasSessionCookie = request.cookies.has("better-auth.session_token");

  if (!hasSessionCookie) {
    const response = NextResponse.redirect(new URL("/", request.url));
    // to prevent caching of the redirect response, ensuring that clients always get the latest auth status on subsequent requests
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate"); 
    return response;
  }

  let authResult: unknown;
  try {
    // better auth api to get session data given the request headers, which includes cookies. If the session is valid, it returns user data; if not, it throws an error, which we catch to handle unauthenticated access.
    authResult = await auth.api.getSession({
      headers: request.headers,
    });
  } catch {
    const response = NextResponse.redirect(new URL("/", request.url));
    clearAuthCookies(response);
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    return response;
  }

  // grab auth data from the result
  // due to TypeScript, this line is a bit verbose. It basically means that treat auth result as an object that may have an user property with that shape, or it could be null or undefined. This allows us to safely access user data without TypeScript errors,
  // while still handling cases where the auth result might not be in the expected format.
  // we take auth result to do Type Assertion, which is a way to tell TS that auth result is a certain shape (example user), and we only care about the user object. 
  // this allows us to grab the role without type error.
  // Type assertion: https://www.typescriptlang.org/docs/handbook/2/everyday-types.html

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
  // redirect users based on their role
  // Admin cannot access student routes, and students cannot access admin routes. This ensures that users only access the parts of the application that are relevant to their role, enhancing security and user experience.
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
