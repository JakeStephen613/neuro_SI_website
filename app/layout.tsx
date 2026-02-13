import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google"; // Changed from Geist, Geist_Mono
import "./globals.css";

const inter = Inter({
  variable: "--font-sans", // Renamed to --font-sans
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-serif", // Added --font-serif
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NeuroSI Research", // Updated title
  description: "A comparative study of human expert analysis versus the Qwen-32B Fine-Tuned architecture on complex biological pathway deduction.", // Updated description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfairDisplay.variable} font-sans antialiased`} // Applied font-sans and font-serif variables
      >
        {children}
      </body>
    </html>
  );
}
