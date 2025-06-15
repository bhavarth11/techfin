import { NextRequest, NextResponse } from "next/server";
import { Container } from "@/api/container";
import { TOKENS } from "@/api/tokens";
import { TransactionService } from "@/api/services/transaction.service";
import { withInitialization } from "@/api/utils/withInitialization";

async function postHandler(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "User ID not found" }, { status: 401 });
    }

    const { id } = await params;
    const { version } = await req.json();

    if (typeof version !== "number") {
      return NextResponse.json(
        { error: "Version number is required" },
        { status: 400 }
      );
    }

    const container = Container.getInstance();
    const transactionService = container.resolve<TransactionService>(
      TOKENS.TransactionService
    );
    const transaction = await transactionService.restoreTransaction(
      userId,
      id,
      version
    );
    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(transaction);
  } catch (error: unknown) {
    if (error instanceof Error) {
      const errorMessage = error.message;
      if (errorMessage === "Concurrent modification detected") {
        return NextResponse.json(
          {
            error:
              "Transaction was modified by someone else. Please refresh and try again.",
          },
          { status: 409 }
        );
      } else {
        return NextResponse.json({ error: errorMessage }, { status: 400 });
      }
    }
    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 400 }
    );
  }
}

export const POST = withInitialization(postHandler);
