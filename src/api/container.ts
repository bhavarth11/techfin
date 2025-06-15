export class Container {
  private static instance: Container;
  private dependencies: Map<string, any> = new Map();
  private initialized = false;

  private constructor() {}

  static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  register<T>(token: string, implementation: T): void {
    this.dependencies.set(token, implementation);
  }

  resolve<T>(token: string): T {
    const implementation = this.dependencies.get(token);
    if (!implementation) {
      throw new Error(`No implementation found for token: ${token}`);
    }
    return implementation;
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  setInitialized(value: boolean): void {
    this.initialized = value;
  }
}

// Helper function to ensure container is initialized
export function ensureInitialized(): void {
  const container = Container.getInstance();
  if (!container.isInitialized()) {
    const { initializeApp } = require("./app");
    initializeApp();
    container.setInitialized(true);
  }
}
