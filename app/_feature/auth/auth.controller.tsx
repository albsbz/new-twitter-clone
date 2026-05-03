import BaseController from "@/app/_common/base.controller";
import UserService from "../user/user.service";
import User, { RegistrationDto } from "./types/RegistrationDto";
import bcrypt, { genSalt, hash } from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import Logger from "@/app/_utils/logger";

class AuthController extends BaseController<{}> {
  private userService: UserService;

  constructor({ userService }: { userService: UserService }) {
    super();
    this.userService = userService;
  }

  async checkAuth() {
    const cookieStore = await cookies();
    const cookie = cookieStore.get("token");
    if (!cookie) {
      throw new Error("No cookie found");
    }
    const { value: token } = cookie;
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: string;
        name?: string;
      };
      if (decoded && decoded.userId) {
        return { id: decoded.userId, name: decoded.name || null };
      }
      throw new Error("Authentication required");
    }
    throw new Error("No token provided");
  }

  async registration(formData: RegistrationDto) {
    const { success, data, error } = User.safeParse(formData);
    Logger.log("Parsed data:", { success, data, error });
    if (!success) {
      return this.formResponse({
        message: "Validation failed",
        error: JSON.stringify(error!.issues),
        status: 400,
      });
    } else {
      try {
        const existingUser = await this.userService.findByEmail(data.email);
        if (existingUser) {
          return this.formResponse({
            message: "Email already in use",
            error: "A user with this email already exists",
            status: 409,
          });
        }
        const salt = await genSalt(10);
        const hashedPassword = await hash(data.password, salt);
        const newUser = await this.userService.create({
          ...data,
          password: hashedPassword,
          isVerified: false,
        });

        return this.formResponse({
          message: "User registered successfully",
          data: { id: newUser.id, email: newUser.email },
          status: 201,
        });
      } catch (error) {
        Logger.error("Error creating user:", error);
        return this.formResponse({
          message: "Failed to create user",
          error: error instanceof Error ? error.message : "Unknown error",
          status: 500,
        });
      }
    }
  }

  async logout() {
    return this.formResponse({
      message: "Logout successful",
      status: 200,
    });
  }

  async me() {
    try {
      const data = await this.checkAuth();
      return this.formResponse({
        message: "User info retrieved successfully",
        data,
        status: 200,
      });
    } catch (error) {
      return this.formResponse({
        message: "No token provided",
        error: "Unauthorized",
        status: 401,
      });
    }
  }

  async login(formData: RegistrationDto) {
    const { success, data, error } = User.safeParse(formData);
    Logger.log("Parsed data:", { success, data, error });
    if (!success) {
      return this.formResponse({
        message: "Validation failed",
        error: JSON.stringify(error!.issues),
        status: 400,
      });
    } else {
      try {
        const existingUser = await this.userService.findByEmail(data.email);
        if (!existingUser) {
          return this.formResponse({
            message: "Invalid email or password",
            error: "Unauthorized",
            status: 401,
          });
        }
        const passwordCompare = await bcrypt.compare(
          data.password,
          existingUser.password,
        );
        if (!passwordCompare) {
          return this.formResponse({
            message: "Invalid email or password",
            error: "Unauthorized",
            status: 401,
          });
        }
        const token = jwt.sign(
          { userId: existingUser.id },
          process.env.JWT_SECRET!,
          {
            expiresIn: "1h",
          },
        );
        return this.formResponse({
          message: "Login successful",
          token,
          data: { id: existingUser.id, name: existingUser.name || null },
          status: 200,
        });
      } catch (error) {
        Logger.error("Error logging in user:", error);
        return this.formResponse({
          message: "Failed to login user",
          error: error instanceof Error ? error.message : "Unknown error",
          status: 500,
        });
      }
    }
  }
}

export default AuthController;
