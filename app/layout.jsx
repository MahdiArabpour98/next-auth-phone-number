import { Vazirmatn } from "next/font/google";
import "./globals.css";

import SessionProviders from "@/providers/session-provider";
import ToastProvider from "@/providers/toast-provider";

const vazir = Vazirmatn({ subsets: ["latin"] });

export const metadata = {
  title: "دیار مرد میدان",
  description: "وب سایت رسمی دیار مرد میدان",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa-IR" dir="rtl">
      <body className={vazir.className}>
        <SessionProviders>
          <ToastProvider />
          {children}
        </SessionProviders>
      </body>
    </html>
  );
}
