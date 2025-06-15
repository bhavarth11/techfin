import { Container } from "@/api/container";
import { TOKENS } from "@/api/tokens";
import { ITransactionRepository } from "@/api/repositories/transaction.repository.interface";
import {
  Transaction,
  CreateTransactionInput,
  UpdateTransactionInput,
  TransactionFilter,
} from "@/api/types";

export class TransactionService {
  private transactionRepository: ITransactionRepository;

  constructor() {
    const container = Container.getInstance();
    this.transactionRepository = container.resolve<ITransactionRepository>(
      TOKENS.TransactionRepository
    );
  }

  async findTransactionById(
    userId: string,
    id: string
  ): Promise<Transaction | null> {
    return this.transactionRepository.findById(userId, id);
  }

  async findTransactionsByUserId(userId: string): Promise<Transaction[]> {
    return this.transactionRepository.findByUserId(userId);
  }

  async findTransactionsWithFilters(
    userId: string,
    filters: TransactionFilter
  ): Promise<{
    count: number;
    page: number;
    pageSize: number;
    data: Transaction[];
  }> {
    return this.transactionRepository.findWithFilters(userId, filters);
  }

  async createTransaction(data: CreateTransactionInput): Promise<Transaction> {
    return this.transactionRepository.create(data);
  }

  async updateTransaction(
    userId: string,
    id: string,
    data: UpdateTransactionInput,
    expectedVersion: number
  ): Promise<Transaction | null> {
    return this.transactionRepository.update(userId, id, data, expectedVersion);
  }

  async deleteTransaction(
    userId: string,
    id: string,
    expectedVersion: number
  ): Promise<boolean> {
    return this.transactionRepository.delete(userId, id, expectedVersion);
  }

  async restoreTransaction(
    userId: string,
    id: string,
    expectedVersion: number
  ): Promise<Transaction | null> {
    return this.transactionRepository.restore(userId, id, expectedVersion);
  }
}
