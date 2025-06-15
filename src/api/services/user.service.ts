import { Container } from "../container";
import { TOKENS } from "../tokens";
import { IUserRepository } from "../repositories/user.repository.interface";
import { User } from "../types";

export class UserService {
  private userRepository: IUserRepository;

  constructor() {
    const container = Container.getInstance();
    this.userRepository = container.resolve<IUserRepository>(
      TOKENS.UserRepository
    );
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async findUserById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async createUser(
    data: Omit<User, "id" | "createdAt" | "updatedAt" | "version">
  ): Promise<User> {
    return this.userRepository.create(data);
  }

  async updateUser(
    id: string,
    data: Partial<User>,
    expectedVersion: number
  ): Promise<User> {
    return this.userRepository.update(id, data, expectedVersion);
  }

  async deleteUser(id: string, expectedVersion: number): Promise<User> {
    return this.userRepository.delete(id, expectedVersion);
  }
}
