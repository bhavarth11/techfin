import { NextRequest, NextResponse } from "next/server";
import { Container } from "@/api/container";
import { TOKENS } from "@/api/tokens";
import { TransactionService } from "@/api/services/transaction.service";
import { withInitialization } from "@/api/utils/withInitialization";

async function getHandler(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "User ID not found" }, { status: 401 });
    }

    const { id } = await params;
    const container = Container.getInstance();
    const transactionService = container.resolve<TransactionService>(
      TOKENS.TransactionService
    );
    const transaction = await transactionService.findTransactionById(
      userId,
      id
    );
    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    if (transaction.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json(transaction);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}

async function putHandler(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = req.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json({ error: "User ID not found" }, { status: 401 });
    }

    const { id } = await params;
    const { version, ...data } = await req.json();

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
    const updatedTransaction = await transactionService.updateTransaction(
      userId,
      id,
      data,
      version
    );
    return NextResponse.json(updatedTransaction);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    if (errorMessage === "Concurrent modification detected") {
      return NextResponse.json(
        {
          error:
            "Transaction was modified by someone else. Please refresh and try again.",
        },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}

async function deleteHandler(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "User ID not found" }, { status: 401 });
    }

    const { version } = await req.json();
    if (typeof version !== "number") {
      return NextResponse.json(
        { error: "Version number is required" },
        { status: 400 }
      );
    }

    const { id } = await params;
    const container = Container.getInstance();
    const transactionService = container.resolve<TransactionService>(
      TOKENS.TransactionService
    );
    const success = await transactionService.deleteTransaction(
      userId,
      id,
      version
    );
    if (!success) {
      return NextResponse.json(
        { error: "Failed to delete transaction" },
        { status: 400 }
      );
    }
    return NextResponse.json({ message: "Transaction deleted successfully" });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    if (errorMessage === "Concurrent modification detected") {
      return NextResponse.json(
        {
          error:
            "Transaction was modified by someone else. Please refresh and try again.",
        },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}

export const GET = withInitialization(getHandler);
export const PUT = withInitialization(putHandler);
export const DELETE = withInitialization(deleteHandler);
