import { NextRequest, NextResponse } from "next/server";
import { Container } from "@/api/container";
import { TOKENS } from "@/api/tokens";
import { TransactionService } from "@/api/services/transaction.service";
import { TransactionFilter, SortableFields } from "@/api/types";
import { withInitialization } from "@/api/utils/withInitialization";

// Get all transactions for the authenticated user with filters
async function getHandler(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "User ID not found" }, { status: 401 });
    }

    // Parse query parameters
    const searchParams = req.nextUrl.searchParams;
    const filters: TransactionFilter = {
      startDate: searchParams.get("startDate")
        ? new Date(searchParams.get("startDate")!)
        : undefined,
      endDate: searchParams.get("endDate")
        ? new Date(searchParams.get("endDate")!)
        : undefined,
      category: searchParams.get("category") || undefined,
      minAmount: searchParams.get("minAmount")
        ? parseFloat(searchParams.get("minAmount")!)
        : undefined,
      maxAmount: searchParams.get("maxAmount")
        ? parseFloat(searchParams.get("maxAmount")!)
        : undefined,
      payee: searchParams.get("payee") || undefined,
      sortBy: (searchParams.get("sortBy") as SortableFields) || undefined,
      sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || undefined,
      page: searchParams.get("page")
        ? parseInt(searchParams.get("page")!)
        : undefined,
      pageSize: searchParams.get("pageSize")
        ? parseInt(searchParams.get("pageSize")!)
        : undefined,
    };

    const container = Container.getInstance();
    const transactionService = container.resolve<TransactionService>(
      TOKENS.TransactionService
    );
    const transactions = await transactionService.findTransactionsWithFilters(
      userId,
      filters
    );
    return NextResponse.json(transactions);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}

// Create a new transaction
async function postHandler(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "User ID not found" }, { status: 401 });
    }

    const data = await req.json();
    const container = Container.getInstance();
    const transactionService = container.resolve<TransactionService>(
      TOKENS.TransactionService
    );
    const transaction = await transactionService.createTransaction({
      ...data,
      userId,
    });

    return NextResponse.json(transaction);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}

export const GET = withInitialization(getHandler);
export const POST = withInitialization(postHandler);
