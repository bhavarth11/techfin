import {
  Transaction,
  CreateTransactionInput,
  UpdateTransactionInput,
  TransactionFilter,
} from "@/api/types";

export interface ITransactionRepository {
  findById(userId: string, id: string): Promise<Transaction | null>;
  findByUserId(userId: string): Promise<Transaction[]>;
  findWithFilters(
    userId: string,
    filters: TransactionFilter
  ): Promise<{
    count: number;
    page: number;
    pageSize: number;
    data: Transaction[];
  }>;
  create(data: CreateTransactionInput): Promise<Transaction>;
  update(
    userId: string,
    id: string,
    data: UpdateTransactionInput,
    expectedVersion: number
  ): Promise<Transaction | null>;
  delete(userId: string, id: string, expectedVersion: number): Promise<boolean>;
  restore(
    userId: string,
    id: string,
    expectedVersion: number
  ): Promise<Transaction | null>;
}
