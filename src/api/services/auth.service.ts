import { SignJWT, jwtVerify } from "jose";
import { IUserRepository } from "@/api/repositories/user.repository.interface";
import { LoginInput, RegisterInput, User, AuthOutput } from "@/api/types";
import { hashPassword, verifyPassword } from "@/api/utils/crypto";

export class AuthService {
  private readonly JWT_SECRET: Uint8Array;
  private readonly JWT_EXPIRES_IN: string;

  constructor(private userRepository: IUserRepository) {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET environment variable is not set");
    }
    this.JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
    this.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";
  }

  async register(data: RegisterInput): Promise<Omit<User, "password">> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await hashPassword(data.password);
    const user = await this.userRepository.create({
      email: data.email,
      password: hashedPassword,
    });

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(data: LoginInput): Promise<AuthOutput> {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isValid = await verifyPassword(data.password, user.password);
    if (!isValid) {
      throw new Error("Invalid credentials");
    }

    const token = await new SignJWT({ userId: user.id, email: user.email })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime(this.JWT_EXPIRES_IN)
      .sign(this.JWT_SECRET);

    const { password, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword };
  }

  async verifyToken(token: string): Promise<{ userId: string; email: string }> {
    const { payload } = await jwtVerify(token, this.JWT_SECRET);
    return payload as { userId: string; email: string };
  }
}
