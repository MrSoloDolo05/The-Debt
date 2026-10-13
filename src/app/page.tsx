import Link from 'next/link';

export default function Home() {
  return (
    <main style={{ padding: 32, maxWidth: 720 }}>
      <h1>The Debt — Broker Ledger</h1>
      <p>Secure multi-tenant dashboard for managing clients and markers.</p>
      <p>
        <Link href="/dashboard">Go to dashboard</Link>
      </p>
    </main>
  );
}
