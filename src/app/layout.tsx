import type { Metadata } from "next";
import type { Viewport } from "next";
import "./globals.css";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "빵돌이 통합 인증",
  description: "여러 서비스에서 공유하여 사용하는 범용 통합 인증 UI 서비스입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        {children}
        <ThemeToggle />
      </body>
    </html>
  );
}
