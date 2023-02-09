import "@/styles/globals.css";
import Alert from "@/ui/Alert";
import { Inter } from "@next/font/google";

import Nav from "./Nav";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} font-sans`}>
      <body>
        <Alert />
        <Nav />
        <main className="mx-auto max-w-4xl px-4 text-gray-900 sm:px-6 lg:px-8">
          {children}
        </main>
      </body>
    </html>
  );
}
