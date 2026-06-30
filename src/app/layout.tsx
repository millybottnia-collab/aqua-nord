import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aqua Nord | Scandinavian Water Purification",
  description:
    "Premium Scandinavian water purification systems engineered for quiet luxury, measurable purity, and refined homes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
