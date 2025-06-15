import {
  Transaction,
  CreateTransactionInput,
  UpdateTransactionInput,
  TransactionFilter,
} from "@/api/types";
import { ITransactionRepository } from "@/api/repositories/transaction.repository.interface";

export class DatabaseTransactionRepository implements ITransactionRepository {
  async findById(userId: string, id: string): Promise<Transaction | null> {
    // TODO: Implement database logic
    return null;
  }

  async findByUserId(userId: string): Promise<Transaction[]> {
    // TODO: Implement database logic
    return [];
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
    // TODO: Implement database logic
    return {
      count: 0,
      page: 1,
      pageSize: 100,
      data: [],
    };
  }

  async create(data: CreateTransactionInput): Promise<Transaction> {
    // TODO: Implement database logic
    throw new Error("Not implemented");
  }

  async update(
    userId: string,
    id: string,
    data: UpdateTransactionInput,
    expectedVersion: number
  ): Promise<Transaction | null> {
    // TODO: Implement database logic
    throw new Error("Not implemented");
  }

  async delete(
    userId: string,
    id: string,
    expectedVersion: number
  ): Promise<boolean> {
    // TODO: Implement database logic
    throw new Error("Not implemented");
  }

  async restore(
    userId: string,
    id: string,
    expectedVersion: number
  ): Promise<Transaction | null> {
    // TODO: Implement database logic
    throw new Error("Not implemented");
  }
}
