import { BaseEntity } from "./base";

export interface User extends BaseEntity {
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
}

export interface AuthOutput {
  token: string;
  user: Omit<User, "password">;
}
