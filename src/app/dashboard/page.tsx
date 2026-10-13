import {
  getClients,
  getMarkers,
  createClientAction,
  createMarkerAction,
  deleteClientAction,
  deleteMarkerAction,
} from '@/actions';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { signOutAction } from '@/actions/auth';

const DONUT_COLORS = ['#fafafa', '#ffb703', '#52525b', '#27272a', '#a1a1aa', '#e4e4e7'];

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const clients = await getClients();
  const markers = await getMarkers();
  const activeClients = (clients ?? []).filter((c) => c.status === 'Active');

  const markersPerMonth: Record<string, number> = {};
  (markers ?? []).forEach((m) => {
    const d = new Date(m.created_at);
    if (Number.isNaN(d.getTime())) return;
    const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    markersPerMonth[k] = (markersPerMonth[k] || 0) + 1;
  });
  const sortedMonths = Object.keys(markersPerMonth).sort();
  const maxMonthCount = Math.max(0, ...Object.values(markersPerMonth));
  const monthLabel = (k: string) =>
    new Date(`${k}-01T00:00:00`).toLocaleString('default', { month: 'short', year: '2-digit' });

  const favorCategories: Record<string, number> = {};
  (markers ?? []).forEach((m) => {
    const t = (m.favor_type || 'General').trim() || 'General';
    favorCategories[t] = (favorCategories[t] || 0) + 1;
  });
  const totalMarkers = markers?.length || 0;
  const entries = Object.entries(favorCategories).sort((a, b) => b[1] - a[1]);
  let acc = 0;
  const segments = entries.map(([type, count], i) => {
    const pct = totalMarkers === 0 ? 0 : (count / totalMarkers) * 100;
    const seg = { type, count, pct, offset: 25 - acc, color: DONUT_COLORS[i % DONUT_COLORS.length] };
    acc += pct;
    return seg;
  });

  return (
    <div style={{ background: '#080808', color: '#fafafa', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <header className="brut-banner" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p className="mono-meta">[ UNDERWORLD LEDGER // VOID-08 ]</p>
          <h1 className="grotesk" style={{ fontSize: '3rem', margin: '0.5rem 0' }}>THE DEBT</h1>
          <p className="mono-meta">[OPERATOR: {user.email}] [SYS_TIME: 2026-10-13]</p>
        </div>
        <form action={signOutAction}>
          <button type="submit" className="brut-btn">TERMINATE</button>
        </form>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: '#27272a', border: '2px solid #fafafa', marginTop: '2rem' }}>
        <div className="brut-cell" style={{ border: 'none' }}>
          <p className="mono-meta">[ LEVERAGE GROWTH ]</p>
          <h3 className="grotesk" style={{ fontSize: '1.5rem', margin: '0.5rem 0' }}>Is our leverage growing?</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', height: '150px', gap: '0.5rem', borderBottom: '2px solid #fafafa', marginTop: '1rem' }}>
            {sortedMonths.length === 0 ? (
              <p className="mono-meta">No ledger data recorded yet.</p>
            ) : (
              sortedMonths.map((mk) => {
                const count = markersPerMonth[mk];
                const h = maxMonthCount === 0 ? 0 : Math.round((count / maxMonthCount) * 120);
                const isMax = count === maxMonthCount && maxMonthCount > 0;
                return (
                  <div key={mk} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                    <span className="mono-meta" style={{ color: isMax ? '#ffb703' : '#a1a1aa' }}>{count}</span>
                    <div style={{ width: '100%', height: `${h}px`, background: isMax ? '#ffb703' : '#52525b', border: '1px solid #fafafa' }} />
                    <span className="mono-meta" style={{ marginTop: '4px' }}>{monthLabel(mk)}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
        <div className="brut-cell" style={{ border: 'none', borderLeft: '1px solid #27272a' }}>
          <p className="mono-meta">[ POWER CONCENTRATION ]</p>
          <h3 className="grotesk" style={{ fontSize: '1.5rem', margin: '0.5rem 0' }}>Where is power held?</h3>
          {totalMarkers === 0 ? (
            <p className="mono-meta">No markers issued to compute share.</p>
          ) : (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '1rem' }}>
              <svg width="140" height="140" viewBox="0 0 42 42" role="img" aria-label="Favor category donut chart">
                <circle cx="21" cy="21" r="15.9155" fill="transparent" stroke="#27272a" strokeWidth="7" />
                {segments.map((s) => (
                  <circle key={s.type} cx="21" cy="21" r="15.9155" fill="transparent" stroke={s.color} strokeWidth="7" strokeDasharray={`${s.pct} ${100 - s.pct}`} strokeDashoffset={`${s.offset}`} />
                ))}
                <text x="21" y="21" textAnchor="middle" dominantBaseline="central" fontSize="7" fill="#fafafa" fontWeight="900">{totalMarkers}</text>
              </svg>
              <div style={{ flex: 1 }}>
                {segments.map((s) => (
                  <div key={s.type} className="mono-meta" style={{ marginBottom: '0.5rem', color: '#fafafa' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span><span style={{ display: 'inline-block', width: '10px', height: '10px', background: s.color, marginRight: '6px' }} />{s.type}</span>
                      <span>{s.count} ({Math.round(s.pct)}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: '#27272a', border: '2px solid #fafafa', borderTop: 'none' }}>
        <div className="brut-cell" style={{ border: 'none' }}>
          <p className="mono-meta">[ REGISTER DEBTOR ]</p>
          <h3 className="grotesk" style={{ fontSize: '1.5rem', margin: '0.5rem 0' }}>New client</h3>
          <form action={createClientAction} style={{ display: 'grid', gap: 8, marginTop: '1rem' }}>
            <input name="name" type="text" placeholder="CLIENT / SYNDICATE NAME" required className="brut-input" />
            <select name="influence_tier" required defaultValue="Local" className="brut-input">
              <option value="Local">Local</option>
              <option value="Federal">Federal</option>
              <option value="Global Syndicate">Global Syndicate</option>
            </select>
            <select name="status" required defaultValue="Active" className="brut-input">
              <option value="Active">Active</option>
              <option value="Settled">Settled</option>
              <option value="In Default">In Default</option>
            </select>
            <button type="submit" className="brut-btn brut-btn-amber">REGISTER CLIENT</button>
          </form>
        </div>
        <div className="brut-cell" style={{ border: 'none', borderLeft: '1px solid #27272a' }}>
          <p className="mono-meta">[ ISSUE FAVOR ]</p>
          <h3 className="grotesk" style={{ fontSize: '1.5rem', margin: '0.5rem 0' }}>New marker</h3>
          <form action={createMarkerAction} style={{ display: 'grid', gap: 8, marginTop: '1rem' }}>
            <select name="client_id" required defaultValue="" className="brut-input">
              <option value="" disabled>SELECT DEBTOR CLIENT...</option>
              {activeClients.map((c) => (
                <option key={c.id} value={c.id}>{c.name} ({c.influence_tier})</option>
              ))}
            </select>
            <input name="favor_type" type="text" placeholder="FAVOR TYPE" required className="brut-input" />
            <input name="leverage_value" type="number" min="1" max="10" placeholder="LEVERAGE 1-10" required className="brut-input" />
            <select name="status" required defaultValue="Outstanding" className="brut-input">
              <option value="Outstanding">Outstanding</option>
              <option value="Called In">Called In</option>
              <option value="Defaulted">Defaulted</option>
            </select>
            <button type="submit" className="brut-btn">ISSUE MARKER</button>
          </form>
          {activeClients.length === 0 && (
            <p className="mono-meta" style={{ marginTop: '0.5rem' }}>No active clients — register one first.</p>
          )}
        </div>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: '#27272a', border: '2px solid #fafafa', borderTop: 'none', marginBottom: '3rem' }}>
        <div className="brut-cell" style={{ border: 'none' }}>
          <h3 className="grotesk" style={{ fontSize: '1.25rem' }}>DEBTORS ({clients?.length || 0})</h3>
          <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem', display: 'grid', gap: '0.5rem' }}>
            {clients?.map((client) => (
              <li key={client.id} style={{ border: '1px solid #27272a', background: '#080808', padding: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 900, textTransform: 'uppercase' }}>{client.name}</div>
                  <div className="mono-meta">[{client.influence_tier}] <span style={{ color: client.status === 'Active' ? '#ffb703' : '#fafafa' }}>■ {client.status}</span></div>
                </div>
                <form action={deleteClientAction.bind(null, client.id)}>
                  <button type="submit" className="brut-btn">[X]</button>
                </form>
              </li>
            ))}
          </ul>
        </div>
        <div className="brut-cell" style={{ border: 'none', borderLeft: '1px solid #27272a' }}>
          <h3 className="grotesk" style={{ fontSize: '1.25rem' }}>MARKERS ({markers?.length || 0})</h3>
          <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem', display: 'grid', gap: '0.5rem' }}>
            {markers?.map((marker) => (
              <li key={marker.id} style={{ border: '1px solid #27272a', background: '#080808', padding: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 900, textTransform: 'uppercase' }}>{marker.favor_type}</div>
                  <div className="mono-meta">[LEVERAGE: {String(marker.leverage_value).padStart(2, '0')}/10] DEBTOR: {marker.clients?.name || 'UNKNOWN'} | {marker.status}</div>
                </div>
                <form action={deleteMarkerAction.bind(null, marker.id)}>
                  <button type="submit" className="brut-btn">[X]</button>
                </form>
              </li>
            ))}
          </ul>
        </div>
      </section>
      </div>
    </div>
  );
}
