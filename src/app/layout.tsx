import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'The Debt — Broker Ledger',
  description: 'Secure multi-tenant ledger for brokers managing clients and markers.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
