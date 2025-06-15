import { config, STORAGE_TYPE } from "../config";
import { IUserRepository } from "@/api/repositories/user.repository.interface";
import { ITransactionRepository } from "@/api/repositories/transaction.repository.interface";
import { InMemoryUserRepository } from "@/api/repositories/in-memory/user.repository";
import { InMemoryTransactionRepository } from "@/api/repositories/in-memory/transaction.repository";
import { DatabaseUserRepository } from "@/api/repositories/database/user.repository";
import { DatabaseTransactionRepository } from "@/api/repositories/database/transaction.repository";

export function createUserRepository(): IUserRepository {
  switch (config.storage) {
    case STORAGE_TYPE.IN_MEMORY:
      return new InMemoryUserRepository();
    case STORAGE_TYPE.DATABASE:
      return new DatabaseUserRepository();
    default:
      throw new Error("Invalid storage type");
  }
}

export function createTransactionRepository(): ITransactionRepository {
  switch (config.storage) {
    case STORAGE_TYPE.IN_MEMORY:
      return new InMemoryTransactionRepository();
    case STORAGE_TYPE.DATABASE:
      return new DatabaseTransactionRepository();
    default:
      throw new Error("Invalid storage type");
  }
}
