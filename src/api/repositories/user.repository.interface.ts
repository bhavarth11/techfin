import { User } from "@/api/types";

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(
    data: Omit<User, "id" | "createdAt" | "updatedAt" | "version">
  ): Promise<User>;
  update(
    id: string,
    data: Partial<User>,
    expectedVersion: number
  ): Promise<User>;
  delete(id: string, expectedVersion: number): Promise<User>;
}
