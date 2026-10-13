import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { signInAction, signUpAction } from '@/actions/auth';

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
          <form action={signInAction} style={{ display: 'grid', gap: 8, marginTop: 16 }}>
            <input name="email" type="email" placeholder="OPERATOR EMAIL" required autoComplete="email" autoCapitalize="none" autoCorrect="off" spellCheck={false} maxLength={254} className="brut-input" />
            <input name="password" type="password" placeholder="PASSPHRASE" required autoComplete="current-password" className="brut-input" />
            <button type="submit" className="brut-btn brut-btn-amber">
              AUTHENTICATE
            </button>
          </form>
        </div>
        <div className="brut-cell">
          <p className="mono-meta">[ TERMINAL // NEW OPERATOR ]</p>
          <form action={signUpAction} style={{ display: 'grid', gap: 8, marginTop: 16 }}>
            <input name="email" type="email" placeholder="OPERATOR EMAIL" required autoComplete="email" autoCapitalize="none" autoCorrect="off" spellCheck={false} maxLength={254} className="brut-input" />
            <input name="password" type="password" placeholder="PASSPHRASE" required autoComplete="new-password" className="brut-input" />
            <button type="submit" className="brut-btn">
              REGISTER
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
