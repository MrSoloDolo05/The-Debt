import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { SignInForm, SignUpForm } from './login-forms';

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect('/dashboard');

  return (
    <main
      className="wire-grid"
      style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        background: '#080808',
        color: '#fafafa',
      }}
    >
      <section style={{ borderRight: '2px solid #fafafa', padding: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <p className="mono-meta">[ CLEARANCE: BROKER // SYS 2026-10-13 ]</p>
          <h1 className="grotesk" style={{ fontSize: '5rem', margin: '1rem 0' }}>
            THE
            <br />
            DEBT
          </h1>
          <p className="mono-meta" style={{ maxWidth: 420, lineHeight: 1.8 }}>
            UNDERWORLD LEDGER — COLLATERAL / LEVERAGE / FAVORS.
            <br />
            ZERO POLISH. RAW STRUCTURE. TOTAL ISOLATION.
          </p>
        </div>
        <div className="mono-meta" style={{ display: 'flex', gap: '1.5rem' }}>
          <span>[ SYS_TIME: 2026-10-13 ]</span>
          <span>[ RLS: ENFORCED ]</span>
        </div>
      </section>
      <section style={{ padding: '3rem', display: 'grid', gap: '2rem', alignContent: 'start' }}>
        <div className="brut-cell">
          <p className="mono-meta">[ TERMINAL // SIGN IN ]</p>
          <SignInForm />
        </div>
        <div className="brut-cell">
          <p className="mono-meta">[ TERMINAL // NEW OPERATOR ]</p>
          <SignUpForm />
        </div>
      </section>
    </main>
  );
}
