// LOKASI: src/pages/api/auth/[...nextauth].js
// VERSI BARU: Dengan template email HTML yang sudah diperindah.

import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { Resend } from 'resend';

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      from: process.env.EMAIL_FROM,
      
      // FUNGSI INI AKAN KITA GANTI TOTAL BAGIAN HTML-NYA
      sendVerificationRequest: async ({ identifier: email, url, provider: { from } }) => {
        try {
          console.log(`Mencoba mengirim email ke ${email} dari ${from} via Resend...`);

          const { data, error } = await resend.emails.send({
            from: from,
            to: [email],
            subject: `Sign in ke SOLMATE`,
            // === TEMPLATE HTML BARU YANG LEBIH INDAH DIMULAI DI SINI ===
            html: `
              <div style="font-family: Arial, sans-serif; line-height: 1.6; text-align: center; color: #333; max-width: 600px; margin: 20px auto; border: 1px solid #ddd; border-radius: 12px; overflow: hidden;">
                <div style="background-color: #0d6efd; color: white; padding: 20px;">
                  <h1 style="margin: 0; font-size: 24px;">SOLMATE</h1>
                </div>
                <div style="padding: 30px;">
                  <h2 style="color: #333;">Verifikasi Login Anda</h2>
                  <p>Halo! Terima kasih sudah menggunakan SOLMATE. Klik tombol di bawah ini untuk masuk dengan aman ke akun Anda.</p>
                  
                  <a href="${url}" target="_blank" style="background-color: #0d6efd; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0; font-size: 16px; font-weight: bold;">
                    Sign In ke Akun Saya
                  </a>
                  
                  <p style="font-size: 14px; color: #555;">
                    Tombol tidak berfungsi? Anda bisa salin dan tempel link di bawah ini ke browser Anda:
                  </p>
                  <p style="font-size: 12px; color: #888; word-break: break-all; background-color: #f8f9fa; padding: 10px; border-radius: 5px;">
                    ${url}
                  </p>
                </div>
                <div style="background-color: #f8f9fa; padding: 20px; font-size: 12px; color: #888;">
                  Jika Anda tidak meminta email ini, Anda bisa mengabaikannya dengan aman.
                </div>
              </div>
            `,
            // === AKHIR DARI TEMPLATE HTML BARU ===
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
    signIn: '/auth/signin', // Alamat halaman login
    verifyRequest: '/auth/verify-request', // Alamat halaman "Cek Email"
    error: '/auth/signin', // Jika ada error, arahkan kembali ke halaman login
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role;
      }
      return session;
    }
  },
};

export default NextAuth(authOptions);
