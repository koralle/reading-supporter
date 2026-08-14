import localFont from "next/font/local";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

const notoSansJP = localFont({
  src: "./fonts/NotoSansJP-VariableFont_wght.ttf",
  variable: "--font-noto-sans-jp",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Reading Supporter",
  description: "Ask questions about the page you are reading.",
};

export const viewport: Viewport = {
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ja" className={notoSansJP.variable}>
      <body>{children}</body>
    </html>
  );
}
