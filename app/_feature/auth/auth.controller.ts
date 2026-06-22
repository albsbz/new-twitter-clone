import BaseController from "@/app/_common/base.controller";
import UserService from "../user/user.service";
import User, { RegistrationDto } from "./types/RegistrationDto";
import bcrypt, { genSalt, hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import Logger from "@/app/_utils/logger";
import { sendVerificationEmail, sendPasswordResetEmail } from "@/app/lib/mail";
import { getServerEnv } from "@/app/lib/env";
import VerifyEmail, {
  VerifyEmailDto,
  VerifyEmailSchema,
} from "./types/VerifyEmailDto";
import UpdatePasswordSchema, {
  UpdatePasswordDto,
} from "./types/UpdatePasswordDto";
import ResetPasswordSchema, {
  ResetPasswordDto,
} from "./types/ResetPasswordDto";
import RefreshTokenService from "./refreshToken.service";

class AuthController extends BaseController<{}> {
  private userService: UserService;
  private refreshTokenService: RefreshTokenService;

  constructor({
    userService,
    refreshTokenService,
  }: {
    userService: UserService;
    refreshTokenService: RefreshTokenService;
  }) {
    super();
    this.userService = userService;
    this.refreshTokenService = refreshTokenService;
  }

  async getUserIdFromAuth() {
    let userId;
    try {
      const data = await this.checkAuth();
      userId = data.id;
    } catch (error) {
      Logger.error("Error checking authentication:", error);
    }
    return userId;
  }

  async getUserDataFromAuth() {
    let userId;
    let userName;
    try {
      const data = await this.checkAuth();
      userId = data.id;
      userName = data.name;
    } catch (error) {
      Logger.error("Error checking authentication:", error);
    }
    return { userId, userName };
  }

  async checkAuth() {
    const { JWT_SECRET } = getServerEnv();
    const cookieStore = await cookies();
    const cookie = cookieStore.get("token");
    if (!cookie) {
      throw new Error("No cookie found");
    }
    const { value: token } = cookie;
    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        userId: string;
        userName?: string;
      };
      if (decoded && decoded.userId) {
        return { id: decoded.userId, name: decoded.userName || null };
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
          error: validated.error.issues,
          status: 400,
        });
      }
      const { JWT_SECRET } = getServerEnv();
      const { token } = validated.data;
      const decoded = jwt.verify(token, JWT_SECRET) as {
        userId: string;
      };
      if (!decoded || !decoded.userId) {
        return this.formResponse({
          message: "Invalid token",
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

  async updatePassword(data: UpdatePasswordDto) {
    try {
      const validated = this.validate<UpdatePasswordDto>({
        data,
        schema: UpdatePasswordSchema,
      });
      if (!validated.success) {
        return this.formResponse({
          message: "Validation failed",
          error: validated.error.issues,
          status: 400,
        });
      }
      const { JWT_SECRET } = getServerEnv();
      const { token } = validated.data;
      const decoded = jwt.verify(token, JWT_SECRET) as {
        userId: string;
      };
      if (!decoded || !decoded.userId) {
        return this.formResponse({
          message: "Invalid token",
          status: 400,
        });
      }
      const salt = await genSalt(10);
      const hashedPassword = await hash(validated.data.password, salt);
      const result = await this.userService.updatePassword({
        userId: decoded.userId,
        newPassword: hashedPassword,
      });
      if (result) {
        return this.formResponse({
          message: "Password updated successfully",
          data: result,
          status: 200,
        });
      } else {
        return this.formResponse({
          message: "User not found",
          status: 404,
        });
      }
    } catch (error) {
      Logger.error("Error updating password:", error);
      return this.formResponse({
        message: "Failed to update password",
        error: error instanceof Error ? error.message : "Unknown error",
        status: 500,
      });
    }
  }

  async sendVerificationEmail(userId: string, email: string) {
    const { JWT_SECRET } = getServerEnv();
    const emailVerificationToken = jwt.sign({ userId }, JWT_SECRET, {
      expiresIn: "24h",
    });
    sendVerificationEmail(email, emailVerificationToken).catch((err) => {
      Logger.error("Error sending verification email:", err);
    });
  }

  async resetPassword(data: ResetPasswordDto) {
    try {
      const validated = this.validate<ResetPasswordDto>({
        data,
        schema: ResetPasswordSchema,
      });
      if (!validated.success) {
        return this.formResponse({
          message: "Validation failed",
          error: validated.error.issues,
          status: 400,
        });
      }
      const { email } = validated.data;
      const user = await this.userService.findByEmail(email);
      if (!user) {
        return this.formResponse({
          message: "User not found",
          status: 404,
        });
      }
      const { JWT_SECRET } = getServerEnv();
      const resetPasswordToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: "24h",
      });
      await sendPasswordResetEmail(email, resetPasswordToken).catch((err) => {
        Logger.error("Error sending password reset email:", err);
      });
      return this.formResponse({
        message: "Password reset email sent",
        status: 200,
      });
    } catch (error) {
      Logger.error("Error in resetPassword:", error);
      return this.formResponse({
        message: "Failed to send password reset email",
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
        error: error!.issues,
        status: 400,
      });
    } else {
      try {
        const existingUser = await this.userService.findByEmail(data.email);
        if (existingUser) {
          return this.formResponse({
            message: "Email already in use",
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
          verificationEmailSendAt: new Date(),
        });

        await this.sendVerificationEmail(newUser.id, newUser.email);

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
        status: 401,
      });
    }
  }

  async refreshToken() {
    const { JWT_SECRET } = getServerEnv();
    const cookieStore = await cookies();
    const cookie = cookieStore.get("refreshToken");
    if (!cookie) {
      return this.formResponse({
        message: "No refresh token found",
        status: 401,
      });
    }
    const { value: refreshToken } = cookie;
    try {
      const decoded = jwt.verify(refreshToken, JWT_SECRET) as {
        userId: string;
        userName?: string;
      };
      if (!decoded || !decoded.userId) {
        return this.formResponse({
          message: "Invalid refresh token",
          status: 400,
        });
      }
      let userName = decoded.userName || null;
      if (!decoded.userName) {
        const user = await this.userService.findById(decoded.userId);
        if (user.name) {
          userName = user.name;
        }
      }
      const newToken = jwt.sign(
        { userId: decoded.userId, userName: userName },
        JWT_SECRET,
        {
          expiresIn: "1h",
        },
      );
      return this.formResponse({
        message: "Token refreshed successfully",
        token: newToken,
        status: 200,
      });
    } catch (error) {
      Logger.error("Error refreshing token:", error);
      if (error instanceof jwt.TokenExpiredError) {
        await this.refreshTokenService.deleteByToken(refreshToken);
        return this.formResponse({
          message: "Refresh token expired",
          status: 401,
        });
      }
      return this.formResponse({
        message: "Failed to refresh token",
        error: error instanceof Error ? error.message : "Unknown error",
        status: 500,
      });
    }
  }

  async login(formData: RegistrationDto) {
    const { success, data, error } = User.safeParse(formData);
    Logger.log("Parsed data:", { success, data, error });
    if (!success) {
      return this.formResponse({
        message: "Validation failed",
        error: error!.issues,
        status: 400,
      });
    } else {
      try {
        const existingUser = await this.userService.findByEmail(data.email);
        if (!existingUser) {
          return this.formResponse({
            message: "Invalid email or password",
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
            status: 401,
          });
        }
        const { JWT_SECRET } = getServerEnv();
        const token = jwt.sign(
          { userId: existingUser.id, userName: existingUser.name || null },
          JWT_SECRET,
          {
            expiresIn: "1h",
          },
        );
        const refreshToken = jwt.sign(
          { userId: existingUser.id, userName: existingUser.name || null },
          JWT_SECRET,
          {
            expiresIn: "7d",
          },
        );
        await this.refreshTokenService.findByUserAndUpdate(existingUser.id, {
          token: refreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });
        return this.formResponse({
          message: "Login successful",
          token,
          refreshToken,
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
