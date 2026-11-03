import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  metadataBase: new URL("https://yash-rank-portfolio1001.web.app"),
  title: "Yashkumar Rank — Senior Software Developer",
  description:
    "Senior Software Developer building Flutter apps, cloud-native backends on Google Cloud, and agentic AI systems. Team lead of 15 engineers.",
  openGraph: {
    title: "Yashkumar Rank — Senior Software Developer",
    description: "Full-stack, mobile & cloud systems. Flutter · Node.js · GCP · AI agents.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#060708",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
