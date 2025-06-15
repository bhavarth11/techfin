import { User } from "@/api/types";
import { IUserRepository } from "../user.repository.interface";

export class InMemoryUserRepository implements IUserRepository {
  private users: Map<string, User>;

  constructor() {
    this.users = new Map();
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = Array.from(this.users.values()).find(
      (user) => user.email === email
    );
    return user || null;
  }

  async findById(id: string): Promise<User | null> {
    const user = this.users.get(id);
    return user || null;
  }

  async create(
    data: Omit<User, "id" | "createdAt" | "updatedAt" | "version">
  ): Promise<User> {
    const id = crypto.randomUUID();
    const now = new Date();

    const user = {
      id,
      ...data,
      createdAt: now,
      updatedAt: now,
      version: 1,
    };

    this.users.set(id, user);

    return user;
  }

  async update(
    id: string,
    data: Partial<User>,
    expectedVersion: number
  ): Promise<User> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new Error("User not found");
    }

    if (existing.version !== expectedVersion) {
      throw new Error("Concurrent modification detected");
    }

    const now = new Date();
    const updated = {
      ...existing,
      ...data,
      updatedAt: now,
      version: existing.version + 1,
    };

    this.users.set(id, updated);
    return updated;
  }

  async delete(id: string, expectedVersion: number): Promise<User> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new Error("User not found");
    }

    if (existing.version !== expectedVersion) {
      throw new Error("Concurrent modification detected");
    }

    const now = new Date();
    const updated = {
      ...existing,
      deletedAt: now,
      updatedAt: now,
      version: existing.version + 1,
    };

    this.users.set(id, updated);
    return updated;
  }
}
