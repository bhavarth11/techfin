import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/api/services/auth.service";
import { Container } from "@/api/container";
import { TOKENS } from "@/api/tokens";
import { withInitialization } from "@/api/utils/withInitialization";

async function handler(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const container = Container.getInstance();
    const authService = container.resolve<AuthService>(TOKENS.AuthService);
    const { user, token } = await authService.login({ email, password });

    // Create response with user data
    const response = NextResponse.json(user);

    // Set cookie with proper configuration
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
}

export const POST = withInitialization(handler);
