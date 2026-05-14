import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED = ["/account", "/checkout"];
const ADMIN = ["/admin"];
const AUTH_ONLY = ["/login", "/register", "/forgot-password"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = PROTECTED.some((r) => pathname.startsWith(r));
  const isAdmin = ADMIN.some((r) => pathname.startsWith(r));
  const isAuthOnly = AUTH_ONLY.some((r) => pathname.startsWith(r));

  // Only hit the session for routes that actually need it
  if (isProtected || isAdmin || isAuthOnly) {
    const session = await auth();

    if ((isProtected || isAdmin) && !session) {
      const url = new URL("/login", req.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }

    if (isAdmin && session?.user?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (isAuthOnly && session) {
      return NextResponse.redirect(new URL("/account", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/account/:path*",
    "/checkout/:path*",
    "/admin/:path*",
    "/login",
    "/register",
    "/forgot-password",
  ],
};
