import type { Metadata } from "next";
import { ToastProvider } from '@/components/ui/ToastProvider';
import { AuthProvider } from '@/lib/hooks/useAuth';
import MobileNav from '@/components/MobileNav';
import "./globals.css";

export const metadata: Metadata = {
  title: "PredictX - 全球预测市场平台",
  description: "体育、加密货币、政治、娱乐、科技 - 全球领先的预测市场交易平台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="bg-[#0a0c10] text-white antialiased">
        <ToastProvider>
          <AuthProvider>
            {children}
            <MobileNav />
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
