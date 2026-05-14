import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${process.env.NEXT_PUBLIC_BASIC_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: '"My App" <noreply@myapp.com>',
    to: email,
    subject: 'Confirm your email address',
    html: `
      <h1>Welcome!</h1>
      <p>Please click the link below to verify your email:</p>
      <a href="${confirmLink}">Verify Email</a>
      <p>This link will expire in 24 hours.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};