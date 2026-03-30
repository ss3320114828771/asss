import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Islamic Store - Quality Islamic Products",
  description: "Shop high-quality Islamic products including prayer mats, Quran, books, perfumes, and more. Free shipping on orders over $50.",
  keywords: "islamic store, prayer mat, quran, islamic books, muslim products",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50">
        {/* Bismillah Banner - Required at top center of every page */}
        <div className="bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-white text-center py-2 sticky top-0 z-40 shadow-md">
          <p className="text-lg md:text-xl font-bold tracking-wide">
            بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </p>
        </div>
        
        {/* Navigation Bar */}
        <Navbar />
        
        {/* Main Content - grows to fill space */}
        <main className="flex-1">
          {children}
        </main>
        
        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}