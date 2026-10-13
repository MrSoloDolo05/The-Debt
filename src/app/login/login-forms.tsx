'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import {
  signInAction,
  signUpAction,
  type AuthResult,
} from '@/actions/auth';

const initialState: AuthResult = { ok: false, message: null };

function TerminalError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p className="mono-meta" style={{ color: '#ff5c5c', marginTop: 8 }}>
      [ {message} ]
    </p>
  );
}

function SignInButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="brut-btn brut-btn-amber">
      {pending ? 'AUTHENTICATING…' : 'AUTHENTICATE'}
    </button>
  );
}

export function SignInForm() {
  const [state, formAction] = useActionState(signInAction, initialState);

  return (
    <form action={formAction} style={{ display: 'grid', gap: 8, marginTop: 16 }}>
      <input
        name="email"
        type="email"
        placeholder="OPERATOR EMAIL"
        required
        autoComplete="email"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        maxLength={254}
        className="brut-input"
      />
      <input
        name="password"
        type="password"
        placeholder="PASSPHRASE"
        required
        autoComplete="current-password"
        className="brut-input"
      />
      <SignInButton />
      <TerminalError message={state.message} />
    </form>
  );
}

function SignUpButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="brut-btn">
      {pending ? 'REGISTERING…' : 'REGISTER'}
    </button>
  );
}

export function SignUpForm() {
  const [state, formAction] = useActionState(signUpAction, initialState);

  return (
    <form action={formAction} style={{ display: 'grid', gap: 8, marginTop: 16 }}>
      <input
        name="email"
        type="email"
        placeholder="OPERATOR EMAIL"
        required
        autoComplete="email"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        maxLength={254}
        className="brut-input"
      />
      <input
        name="password"
        type="password"
        placeholder="PASSPHRASE"
        required
        autoComplete="new-password"
        className="brut-input"
      />
      <SignUpButton />
      <TerminalError message={state.message} />
    </form>
  );
}
