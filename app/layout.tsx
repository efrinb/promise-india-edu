import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Promise India Education Consultancy',
  description: 'Your trusted partner for nursing college admissions with transparent fees and personalized support.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
