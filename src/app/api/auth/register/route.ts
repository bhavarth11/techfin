import { NextRequest, NextResponse } from "next/server";
import { Container } from "@/api/container";
import { TOKENS } from "@/api/tokens";
import { AuthService } from "@/api/services/auth.service";
import { withInitialization } from "@/api/utils/withInitialization";

async function handler(req: NextRequest) {
  try {
    const data = await req.json();
    const container = Container.getInstance();
    const authService = container.resolve<AuthService>(TOKENS.AuthService);
    const user = await authService.register(data);
    return NextResponse.json(user);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}

export const POST = withInitialization(handler);
