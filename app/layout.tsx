import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Study Notes — AI-powered",
  description: "Write notes. Generate summaries, key points, and exam questions with AI.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Providers>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#111",
                color: "#fff",
                fontSize: "14px",
                borderRadius: "8px",
                border: "1px solid #222",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
