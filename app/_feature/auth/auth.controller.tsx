import BaseController from "@/app/_common/base.controller";
import UserService from "../user/user.service";
import User, { RegistrationDto } from "./types/RegistrationDto";
import bcrypt, { genSalt, hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import Logger from "@/app/_utils/logger";
import { sendVerificationEmail } from "@/app/lib/mail";
import { getServerEnv } from "@/app/lib/env";
import VerifyEmail, {
  VerifyEmailDto,
  VerifyEmailSchema,
} from "./types/VerifyEmailDto";

const { JWT_SECRET } = getServerEnv();

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
      const decoded = jwt.verify(token, JWT_SECRET) as {
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

  async verifyEmail(data: VerifyEmailDto) {
    try {
      const validated = this.validate<VerifyEmailDto>({
        data,
        schema: VerifyEmailSchema,
      });
      if (!validated.success) {
        return this.formResponse({
          message: "Validation failed",
          error: JSON.stringify(validated.error.issues),
          status: 400,
        });
      }
      const { token } = validated.data;
      const decoded = jwt.verify(token, JWT_SECRET) as {
        userId: string;
      };
      if (!decoded || !decoded.userId) {
        return this.formResponse({
          message: "Invalid token",
          error: "Token verification failed",
          status: 400,
        });
      }
      const result = await this.userService.verifyEmail(decoded.userId);
      if (result?.isVerified) {
        return this.formResponse({
          message: "Email verified successfully",
          data: { isVerified: result.isVerified },
          status: 200,
        });
      } else {
        return this.formResponse({
          message: "User not found",
          error: "No user associated with this token",
          status: 404,
        });
      }
    } catch (error) {
      Logger.error("Error verifying email:", error);
      return this.formResponse({
        message: "Failed to verify email",
        error: error instanceof Error ? error.message : "Unknown error",
        status: 500,
      });
    }
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
          likedPosts: [],
          dislikedPosts: [],
        });

        const emailVerificationToken = jwt.sign(
          { userId: newUser.id },
          JWT_SECRET,
          { expiresIn: "24h" },
        );
        sendVerificationEmail(newUser.email, emailVerificationToken).catch(
          (err) => {
            Logger.error("Error sending verification email:", err);
          },
        );

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
        const token = jwt.sign({ userId: existingUser.id }, JWT_SECRET, {
          expiresIn: "1h",
        });
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
