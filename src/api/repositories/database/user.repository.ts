import { User } from "@/api/types";
import { IUserRepository } from "@/api/repositories/user.repository.interface";

export class DatabaseUserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    // TODO: Implement database logic
    return null;
  }

  async findById(id: string): Promise<User | null> {
    // TODO: Implement database logic
    return null;
  }

  async create(
    data: Omit<User, "id" | "createdAt" | "updatedAt" | "version">
  ): Promise<User> {
    // TODO: Implement database logic
    throw new Error("Not implemented");
  }

  async update(
    id: string,
    data: Partial<User>,
    expectedVersion: number
  ): Promise<User> {
    // TODO: Implement database logic
    throw new Error("Not implemented");
  }

  async delete(id: string, expectedVersion: number): Promise<User> {
    // TODO: Implement database logic
    throw new Error("Not implemented");
  }
}
