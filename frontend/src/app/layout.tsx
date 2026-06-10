import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-noto-jp",
});

export const metadata: Metadata = {
  title: "算数コーチ | MunsTeacher",
  description: "AI Math Coach for Kids — 小学1年生向け算数練習アプリ",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" className={`${notoSansJP.variable} h-full`}>
      <body className="min-h-full font-[family-name:var(--font-noto-jp)] bg-amber-50">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
