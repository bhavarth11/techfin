import { Container } from "@/api/container";
import { TOKENS } from "@/api/tokens";
import { createUserRepository } from "./repositories/factory";
import { createTransactionRepository } from "./repositories/factory";
import { AuthService } from "./services/auth.service";
import { TransactionService } from "./services/transaction.service";

export function initializeApp() {
  const container = Container.getInstance();

  // Register implementations using factory
  container.register(TOKENS.UserRepository, createUserRepository());
  container.register(
    TOKENS.TransactionRepository,
    createTransactionRepository()
  );

  // Register services
  container.register(
    TOKENS.AuthService,
    new AuthService(container.resolve(TOKENS.UserRepository))
  );

  container.register(TOKENS.TransactionService, new TransactionService());
}
