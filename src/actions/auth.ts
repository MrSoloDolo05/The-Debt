'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { z } from 'zod';

const emailSchema = z.string().email('Enter a valid operator email.');

function normalizeEmail(raw: unknown): string {
  return String(raw ?? '')
    .normalize('NFC')
    // Strip invisible chars browsers/autofill can inject (explicit escapes so
    // the source stays ASCII-safe): U+200B-U+200D, U+FEFF, U+00A0, U+2060.
    .replace(/[\u200B-\u200D\uFEFF\u00A0\u2060]/g, '')
    .trim()
    .toLowerCase();
}

function parseCredentials(formData: FormData) {
  const email = normalizeEmail(formData.get('email'));
  const password = String(formData.get('password') ?? '');
  const parsed = emailSchema.safeParse(email);
  if (!parsed.success) throw new Error('Enter a valid operator email.');
  if (!password) throw new Error('Passphrase is required.');
  return { email: parsed.data, password };
}

export async function signInAction(formData: FormData) {
  const supabase = await createClient();
  const { email, password } = parseCredentials(formData);

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
  redirect('/dashboard');
}

export async function signUpAction(formData: FormData) {
  const supabase = await createClient();
  const { email, password } = parseCredentials(formData);

  const { error } = await supabase.auth.signUp({ email, password });
  if (error) throw new Error(error.message);
  redirect('/dashboard');
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
