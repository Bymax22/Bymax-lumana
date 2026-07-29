import "./globals.css";
import type { Metadata } from "next";
import AppShell from "./AppShell";

export const metadata: Metadata = {
  title: "Lumana AutoPlanet",
  description: "Enterprise-first vehicle marketplace starter",
  icons: {
    icon: '/lumana-site-icon.png',
    apple: '/lumana-site-icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
