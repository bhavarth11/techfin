import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { initializeApp } from "@/api/app";

const PUBLIC_PATHS = ["/api/auth/login", "/api/auth/register"];

interface TokenPayload {
  userId: string;
  email: string;
}

// Initialize the app
initializeApp();

export async function middleware(request: NextRequest) {
  // Check if path is public
  if (PUBLIC_PATHS.includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  // Get token from cookie
  const token = request.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET environment variable is not set");
    }

    // Create TextEncoder for the secret
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    // Verify token
    const { payload } = await jwtVerify<TokenPayload>(token, secret);
    const decoded = payload;

    // Add user ID to request headers for use in API routes
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", decoded.userId);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

export const config = {
  matcher: "/api/:path*",
};
