import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Validasi dan log ENV
const emailHost = process.env.EMAIL_SERVER_HOST;
const emailPort = process.env.EMAIL_SERVER_PORT;
const emailUser = process.env.EMAIL_SERVER_USER;
const emailPass = process.env.EMAIL_SERVER_PASSWORD;
const emailFrom = process.env.EMAIL_FROM;

if (!emailHost || !emailPort || !emailUser || !emailPass || !emailFrom) {
  console.warn("⚠️ Email provider env vars are missing or invalid");
}

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    emailUser && emailPass && emailFrom
      ? EmailProvider({
          server: {
            host: emailHost,
            port: Number(emailPort),
            auth: {
              user: emailUser,
              pass: emailPass,
            },
          },
          from: emailFrom,

          maxAge: 60 * 60 * 24, // 24 jam
        })
      : null,
  ].filter(Boolean), // Penting agar tidak ada 'null' dalam array
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "database",
  },
  pages: {
    signIn: "/auth/signin",
  },
});
