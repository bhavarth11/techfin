import {
  Transaction,
  CreateTransactionInput,
  UpdateTransactionInput,
  TransactionFilter,
  SortableFields,
} from "@/api/types";
import { ITransactionRepository } from "@/api/repositories/transaction.repository.interface";

export class InMemoryTransactionRepository implements ITransactionRepository {
  private userTransactions: Map<string, Map<string, Transaction>>;
  private userDeletedTransactions: Map<string, Map<string, Transaction>>;

  constructor() {
    this.userTransactions = new Map();
    this.userDeletedTransactions = new Map();
  }

  async findById(userId: string, id: string): Promise<Transaction | null> {
    const userTransactions = this.userTransactions.get(userId);
    if (userTransactions) {
      const transaction = userTransactions.get(id);
      if (transaction) return transaction;
    }

    const userDeletedTransactions = this.userDeletedTransactions.get(userId);
    if (userDeletedTransactions) {
      const transaction = userDeletedTransactions.get(id);
      if (transaction) return transaction;
    }

    return null;
  }

  async findByUserId(userId: string): Promise<Transaction[]> {
    const userTransactions = this.userTransactions.get(userId);
    return userTransactions ? Array.from(userTransactions.values()) : [];
  }

  async findWithFilters(
    userId: string,
    filters: TransactionFilter
  ): Promise<{
    count: number;
    page: number;
    pageSize: number;
    data: Transaction[];
  }> {
    let transactions = Array.from(
      this.userTransactions.get(userId)?.values() || []
    );

    if (filters.startDate) {
      transactions = transactions.filter((t) => t.date >= filters.startDate!);
    }
    if (filters.endDate) {
      transactions = transactions.filter((t) => t.date <= filters.endDate!);
    }
    if (filters.category) {
      transactions = transactions.filter(
        (t) => t.category === filters.category
      );
    }
    if (filters.minAmount !== undefined) {
      transactions = transactions.filter((t) => t.amount >= filters.minAmount!);
    }
    if (filters.maxAmount !== undefined) {
      transactions = transactions.filter((t) => t.amount <= filters.maxAmount!);
    }
    if (filters.payee) {
      transactions = transactions.filter((t) =>
        t.payee.toLowerCase().includes(filters.payee!.toLowerCase())
      );
    }

    if (filters.sortBy) {
      transactions.sort((a, b) => {
        const sortBy = filters.sortBy as SortableFields;
        const aValue = a[sortBy];
        const bValue = b[sortBy];

        if (typeof aValue === "string" && typeof bValue === "string") {
          return filters.sortOrder === "desc"
            ? bValue.localeCompare(aValue)
            : aValue.localeCompare(bValue);
        }

        return filters.sortOrder === "desc"
          ? (bValue as number) - (aValue as number)
          : (aValue as number) - (bValue as number);
      });
    }

    const pageSize = Math.min(filters.pageSize || 100, 100);
    const page = filters.page || 1;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const totalCount = transactions.length;
    transactions = transactions.slice(start, end);

    return {
      count: totalCount,
      page,
      pageSize,
      data: transactions,
    };
  }

  async create(data: CreateTransactionInput): Promise<Transaction> {
    const transaction: Transaction = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
    };

    let userTransactions = this.userTransactions.get(data.userId);
    if (!userTransactions) {
      userTransactions = new Map();
      this.userTransactions.set(data.userId, userTransactions);
    }

    userTransactions.set(transaction.id, transaction);
    return transaction;
  }

  async update(
    userId: string,
    id: string,
    data: UpdateTransactionInput,
    expectedVersion: number
  ): Promise<Transaction | null> {
    const userTransactions = this.userTransactions.get(userId);
    if (!userTransactions) return null;

    const transaction = userTransactions.get(id);
    if (!transaction) return null;

    if (transaction.version !== expectedVersion) {
      throw new Error("Concurrent modification detected");
    }

    const updatedTransaction = {
      ...transaction,
      ...data,
      updatedAt: new Date(),
      version: transaction.version + 1,
    };

    userTransactions.set(id, updatedTransaction);
    return updatedTransaction;
  }

  async delete(
    userId: string,
    id: string,
    expectedVersion: number
  ): Promise<boolean> {
    const userTransactions = this.userTransactions.get(userId);
    if (!userTransactions) return false;

    const transaction = userTransactions.get(id);
    if (!transaction) return false;

    if (transaction.version !== expectedVersion) {
      throw new Error("Concurrent modification detected");
    }

    const deletedTransaction = {
      ...transaction,
      deletedAt: new Date(),
      version: transaction.version + 1,
    };

    userTransactions.delete(id);

    let userDeletedTransactions = this.userDeletedTransactions.get(userId);
    if (!userDeletedTransactions) {
      userDeletedTransactions = new Map();
      this.userDeletedTransactions.set(userId, userDeletedTransactions);
    }
    userDeletedTransactions.set(id, deletedTransaction);

    return true;
  }

  async restore(
    userId: string,
    id: string,
    expectedVersion: number
  ): Promise<Transaction | null> {
    const userDeletedTransactions = this.userDeletedTransactions.get(userId);
    if (!userDeletedTransactions) return null;

    const transaction = userDeletedTransactions.get(id);
    if (!transaction) return null;

    if (transaction.version !== expectedVersion) {
      throw new Error("Concurrent modification detected");
    }

    const restoredTransaction = {
      ...transaction,
      deletedAt: undefined,
      version: transaction.version + 1,
    };

    userDeletedTransactions.delete(id);

    let userTransactions = this.userTransactions.get(userId);
    if (!userTransactions) {
      userTransactions = new Map();
      this.userTransactions.set(userId, userTransactions);
    }
    userTransactions.set(id, restoredTransaction);

    return restoredTransaction;
  }
}
