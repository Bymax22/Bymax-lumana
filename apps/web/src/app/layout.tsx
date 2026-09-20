import "./globals.css";
import type { Metadata } from "next";
import AppShell from "./AppShell";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.lumanainvestment.com'),
  title: {
    default: 'Lumana AutoPlanet | Buy, Import, Hire and Finance Vehicles',
    template: '%s | Lumana AutoPlanet',
  },
  description: 'Buy, import, hire, finance and manage vehicles with Lumana AutoPlanet in Zambia and worldwide.',
  keywords: ['vehicles for sale Zambia', 'car hire Lusaka', 'import cars Zambia', 'vehicle finance Zambia', 'used cars Zambia', 'Lumana AutoPlanet'],
  applicationName: 'Lumana AutoPlanet',
  authors: [{ name: 'Lumana Investment Ltd' }],
  creator: 'Lumana Investment Ltd',
  publisher: 'Lumana Investment Ltd',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'Lumana AutoPlanet',
    locale: 'en_ZM',
    title: 'Lumana AutoPlanet | Buy, Import, Hire and Finance Vehicles',
    description: 'Find vehicles for sale, car hire, import support and vehicle finance with Lumana AutoPlanet.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lumana AutoPlanet | Vehicles, Hire and Finance',
    description: 'Buy, import, hire and finance vehicles with Lumana AutoPlanet.',
  },
  icons: {
    icon: '/lumana-site-icon.png',
    apple: '/lumana-site-icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  '@id': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.lumanainvestment.com'}#organization`,
                  name: 'Lumana Investment Ltd',
                  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.lumanainvestment.com',
                  logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.lumanainvestment.com'}/lumana-logo.png`,
                  email: 'info@lumanaautoplanet.com',
                  telephone: '+260977635060',
                  sameAs: [],
                },
                {
                  '@type': 'WebSite',
                  '@id': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.lumanainvestment.com'}#website`,
                  name: 'Lumana AutoPlanet',
                  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.lumanainvestment.com',
                  publisher: { '@id': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.lumanainvestment.com'}#organization` },
                  potentialAction: {
                    '@type': 'SearchAction',
                    target: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.lumanainvestment.com'}/vehicles?search={search_term_string}`,
                    'query-input': 'required name=search_term_string',
                  },
                },
              ],
            }),
          }}
        />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
