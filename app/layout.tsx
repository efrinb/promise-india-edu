import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: {
    default: "Promise Land India Education Consultancy",
    template: "%s | Promise Land India",
  },
  description:
    "Leading nursing education consultancy in India. Get guidance for nursing admissions, colleges, placements, and career opportunities.",
  keywords: [
    "nursing admission",
    "nursing consultancy",
    "BSc Nursing",
    "GNM Nursing",
    "Kerala nursing admission",
    "Promise Land India",
  ],
  metadataBase: new URL("https://promiselandindia.com"),
  openGraph: {
    title: "Promise Land India Education Consultancy",
    description:
      "Trusted partner for nursing college admissions and career guidance.",
    url: "https://promiselandindia.com",
    siteName: "Promise Land India",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plusJakarta.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body className="bg-background dark:bg-gray-900 text-text dark:text-gray-100 font-sans transition-colors">
        {children}
      </body>
    </html>
  );
}