'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { z } from 'zod';

const emailSchema = z.string().email('Enter a valid operator email.');

export type AuthResult = { ok: boolean; message: string | null };

function fail(message: string): AuthResult {
  return { ok: false, message };
}

// Translate GoTrue/mailer rejections into brutalist terminal copy.
// Raw provider internals only surface as a truncated fallback.
function mapSupabaseError(raw: string): string {
  const msg = raw.toLowerCase();
  if (msg.includes('already registered') || msg.includes('already exists'))
    return 'DUPLICATE // OPERATOR EXISTS — AUTHENTICATE INSTEAD';
  if (msg.includes('invalid login') || msg.includes('invalid credentials'))
    return 'REJECTED // BAD CREDENTIALS — CHECK EMAIL / PASSPHRASE';
  if (msg.includes('email not confirmed') || msg.includes('not confirmed'))
    return 'PENDING // EMAIL UNCONFIRMED — CHECK INBOX FOR TRANSMISSION';
  if (msg.includes('email address') && msg.includes('invalid'))
    return 'REJECTED // OPERATOR EMAIL INVALID — CHECK DOMAIN / MAILER POLICY';
  if (msg.includes('password'))
    return 'REJECTED // PASSPHRASE TOO WEAK — MIN 6 CHARS';
  if (msg.includes('rate limit') || msg.includes('too many') || msg.includes('over request'))
    return 'THROTTLED // TOO MANY ATTEMPTS — WAIT THEN RETRY';
  if (msg.includes('confirm') || msg.includes('verif'))
    return 'PENDING // CHECK INBOX FOR CONFIRMATION TRANSMISSION';
  return `REJECTED // ${raw.toUpperCase().slice(0, 120)}`;
}

function normalizeEmail(raw: unknown): string {
  return String(raw ?? '')
    .normalize('NFC')
    // Strip invisible chars browsers/autofill can inject (explicit escapes so
    // the source stays ASCII-safe): U+200B-U+200D, U+FEFF, U+00A0, U+2060.
    .replace(/[\u200B-\u200D\uFEFF\u00A0\u2060]/g, '')
    .trim()
    .toLowerCase();
}

function parseCredentials(formData: FormData): { email: string; password: string } | AuthResult {
  const email = normalizeEmail(formData.get('email'));
  const password = String(formData.get('password') ?? '');
  const parsed = emailSchema.safeParse(email);
  if (!parsed.success) return fail('REJECTED // OPERATOR EMAIL INVALID');
  if (!password) return fail('REJECTED // PASSPHRASE REQUIRED');
  return { email: parsed.data, password };
}

function isAuthFailure(
  value: { email: string; password: string } | AuthResult,
): value is AuthResult {
  return 'ok' in value;
}

export async function signInAction(
  _prevState: AuthResult,
  formData: FormData,
): Promise<AuthResult> {
  const supabase = await createClient();
  const creds = parseCredentials(formData);
  if (isAuthFailure(creds)) return creds;

  const { error } = await supabase.auth.signInWithPassword({
    email: creds.email,
    password: creds.password,
  });
  if (error) return fail(mapSupabaseError(error.message));
  redirect('/dashboard');
}

export async function signUpAction(
  _prevState: AuthResult,
  formData: FormData,
): Promise<AuthResult> {
  const supabase = await createClient();
  const creds = parseCredentials(formData);
  if (isAuthFailure(creds)) return creds;

  const { error } = await supabase.auth.signUp({
    email: creds.email,
    password: creds.password,
  });
  if (error) return fail(mapSupabaseError(error.message));
  redirect('/dashboard');
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
