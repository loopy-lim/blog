import type { Metadata } from "next";
import "./globals.css";
import Gnb from "@/components/commons/gnb";

export const metadata: Metadata = {
  title: "loopy blog",
  description: "loopy의 blog입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <Gnb />
        {children}
      </body>
    </html>
  );
}
