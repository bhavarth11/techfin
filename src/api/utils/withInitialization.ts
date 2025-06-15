import { NextRequest, NextResponse } from "next/server";
import { ensureInitialized } from "../container";

type RouteHandler = (req: NextRequest, context?: any) => Promise<NextResponse>;

export function withInitialization(handler: RouteHandler): RouteHandler {
  return async (req: NextRequest, context?: any) => {
    ensureInitialized();
    return handler(req, context);
  };
}
