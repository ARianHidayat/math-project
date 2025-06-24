// File: src/pages/api/auth/[...nextauth].js

import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { Resend } from 'resend';

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      // --- PERBAIKAN KUNCI ADA DI BARIS DI BAWAH INI ---
      from: process.env.EMAIL_FROM, // <-- BARIS PENTING YANG SEBELUMNYA HILANG

      // Fungsi kustom untuk mengirim email
      sendVerificationRequest: async ({ identifier: email, url, provider: { from } }) => {
        try {
          // Log ini akan membantu kita melihat pengirim yang benar
          console.log(`Mencoba mengirim email ke ${email} dari ${from} via Resend...`);

          const { data, error } = await resend.emails.send({
            from: from, // Sekarang akan mengambil nilai dari .env
            to: [email],
            subject: `Sign in ke SOLMATE`,
            html: `
              <div style="font-family: Arial, sans-serif; line-height: 1.6; text-align: center; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; padding: 30px;">
                <h2 style="color: #0d6efd;">Sign in ke SOLMATE</h2>
                <p>Halo! Terima kasih sudah bergabung. Klik tombol di bawah ini untuk masuk dengan aman ke akun Anda.</p>
                <a href="${url}" target="_blank" style="background-color: #0d6efd; color: white; padding: 14px 28px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; font-size: 16px; font-weight: bold;">
                  Sign In ke Akun Saya
                </a>
                <p style="font-size: 12px; color: #888;">
                  Jika Anda kesulitan dengan tombol di atas, Anda bisa salin dan tempel link ini di browser lain:
                </p>
                <p style="font-size: 12px; color: #888; word-break: break-all;">${url}</p>
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;"/>
                <p style="font-size: 10px; color: #aaa;">
                  Jika Anda tidak meminta email ini, Anda bisa mengabaikannya dengan aman.
                </p>
              </div>
            `,
          });

          if (error) {
            console.error("Gagal mengirim email via Resend:", error);
            throw new Error(error.message);
          }

          console.log("✅ Email verifikasi berhasil dikirim via Resend.");

        } catch (error) {
          console.error("Error pada sendVerificationRequest:", error);
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
});