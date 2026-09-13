import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "priyadarsani-classes-super-secret-key-2024"
);

const PUBLIC_PATHS = [
  "/",
  "/about",
  "/courses",
  "/contact",
  "/ai-learning",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/api/auth",
  "/api/health",
  "/api/demo",
  "/_next",
  "/favicon",
  "/images",
  "/logo",
];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname.startsWith(p));
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get("pc_auth_token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const role = payload.role as string;

    // Route protection by role
    if (pathname.startsWith("/student") && role !== "student") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (pathname.startsWith("/teacher") && !["teacher", "admin"].includes(role)) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (pathname.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
