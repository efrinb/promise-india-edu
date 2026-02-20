import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Promise India Education Consultancy',
  description: 'Your trusted partner for nursing college admissions with transparent fees and personalized support.',
  icons: {
    icon: [
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
      },
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body className="bg-background dark:bg-gray-900 text-text dark:text-gray-100 transition-colors">
        {children}
      </body>
    </html>
  );
}