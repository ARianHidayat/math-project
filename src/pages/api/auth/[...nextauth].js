// File: src/pages/api/auth/[...nextauth].js

import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { Resend } from 'resend';

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

// ▼▼▼ KITA BUNGKUS KONFIGURASI DI DALAM 'authOptions' DAN EKSPOR ▼▼▼
export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      from: process.env.EMAIL_FROM,
      sendVerificationRequest: async ({ identifier: email, url, provider: { from } }) => {
        // ... (isi fungsi ini tetap sama, tidak perlu diubah)
        try {
            const { data, error } = await resend.emails.send({
              from: from, to: [email], subject: `Sign in ke SOLMATE`,
              html: `<p>Klik link untuk login: <a href="${url}">Sign In</a></p>` // (Contoh singkat)
            });
            if (error) throw error;
        } catch (error) {
            throw new Error("Gagal mengirim email verifikasi.");
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "database",
  },
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify-request",
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user && user) {
        session.user.id = user.id;
        session.user.role = user.role;
      }
      return session;
    }
  },
};

// ▼▼▼ LALU KITA GUNAKAN authOptions SAAT MEMANGGIL NextAuth ▼▼▼
export default NextAuth(authOptions);