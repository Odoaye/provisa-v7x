import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Provisa Writers',
  description:
    'Provisa Writers connects exceptional professionals to global opportunities.',
  metadataBase: new URL('http://localhost:3000'),
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.svg',
  },
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