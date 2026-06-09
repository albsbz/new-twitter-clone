import nodemailer from "nodemailer";
import { getServerEnv, publicEnv } from "./env";
const createTransporter = (serverEnv: {
  MONGODB_URI?: string;
  JWT_SECRET?: string;
  EMAIL_SERVER_HOST: any;
  EMAIL_SERVER_PORT: any;
  EMAIL_SERVER_USER: any;
  EMAIL_SERVER_PASSWORD: any;
}) => {
  return nodemailer.createTransport({
    host: serverEnv.EMAIL_SERVER_HOST,
    port: serverEnv.EMAIL_SERVER_PORT,
    auth: {
      user: serverEnv.EMAIL_SERVER_USER,
      pass: serverEnv.EMAIL_SERVER_PASSWORD,
    },
  });
};
export const sendVerificationEmail = async (email: string, token: string) => {
  const transporter = createTransporter(getServerEnv());
  const confirmLink = `${publicEnv.NEXT_PUBLIC_BASIC_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: '"Alexkamens twitter clone" <noreply@alexkamens.org>',
    to: email,
    subject: "Confirm your email address",
    html: `
      <h1>Welcome!</h1>
      <p>Please click the link below to verify your email:</p>
      <a href="${confirmLink}">Verify Email</a>
      <p>This link will expire in 24 hours.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const transporter = createTransporter(getServerEnv());
  const resetLink = `${publicEnv.NEXT_PUBLIC_BASIC_URL}/update-password?token=${token}`;

  const mailOptions = {
    from: '"Alexkamens twitter clone" <noreply@alexkamens.org>',
    to: email,
    subject: "Reset your password",
    html: `
      <h1>Password Reset</h1>
      <p>Please click the link below to reset your password:</p>
      <a href="${resetLink}">Reset Password</a>
      <p>This link will expire in 24 hours.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
