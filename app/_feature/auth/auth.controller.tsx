import BaseController from "@/app/_common/base.controller";
import UserService from "../user/user.service";
import User, { RegistrationDto } from "./types/RegistrationDto";
import bcrypt, { genSalt, hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

class AuthController extends BaseController<{}> {
  private userService: UserService;

  constructor({ userService }: { userService: UserService }) {
    super();
    this.userService = userService;
  }

  async registration(formData: RegistrationDto) {
    const { success, data, error } = User.safeParse(formData);
    console.log("Parsed data:", { success, data, error });
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
        console.error("Error creating user:", error);
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
    const cookieStore = await cookies();
    const cookie = cookieStore.get("token");
    console.log("Cookie retrieved in me():", cookie);
    const { value: token } = cookie || {};
    console.log("Token from cookies:", token);
    if (token) {
      try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        if (decoded && decoded.userId) {
          return this.formResponse({
            message: "User info retrieved successfully",
            data: { id: decoded.userId, name: decoded.name || null },
            status: 200,
          });
        }
      } catch (error) {
        console.error("Error verifying token in me():", error);
        return this.formResponse({
          message: "Invalid token",
          error: error instanceof Error ? error.message : "Unknown error",
          status: 401,
        });
      }
    }
    return this.formResponse({
      message: "No token provided",
      error: "Unauthorized",
      status: 401,
    });
  }

  async login(formData: RegistrationDto) {
    const { success, data, error } = User.safeParse(formData);
    console.log("Parsed data:", { success, data, error });
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
        console.error("Error logging in user:", error);
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
