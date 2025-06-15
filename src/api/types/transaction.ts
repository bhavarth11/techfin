import { BaseEntity } from "./base";

export interface Transaction extends BaseEntity {
  payee: string;
  amount: number;
  category: string;
  date: Date;
  userId: string;
  deletedAt?: Date;
}

export interface CreateTransactionInput {
  payee: string;
  amount: number;
  category: string;
  date: Date;
  userId: string;
}

export interface UpdateTransactionInput {
  payee?: string;
  amount?: number;
  category?: string;
  date?: Date;
}

export type SortableFields = "date" | "amount" | "payee" | "category";
export type SortOrder = "asc" | "desc";

export interface TransactionFilter {
  startDate?: Date;
  endDate?: Date;
  category?: string;
  minAmount?: number;
  maxAmount?: number;
  payee?: string;
  sortBy?: SortableFields;
  sortOrder?: SortOrder;
  page?: number;
  pageSize?: number;
}
