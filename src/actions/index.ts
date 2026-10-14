'use server';

import { createClient } from '@/utils/supabase/server';
import { clientSchema, markerSchema } from '@/types';
import { revalidatePath } from 'next/cache';

// --- CLIENT ACTIONS ---

export async function getClients() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function createClientAction(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated.');

  const parsed = clientSchema.safeParse({
    name: formData.get('name'),
    influence_tier: formData.get('influence_tier'),
    status: formData.get('status') || 'Active',
  });

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues.map((i) => i.message).join(', ')
    );
  }

  const { error } = await supabase
    .from('clients')
    .insert([{ ...parsed.data, user_id: user.id }]);
  if (error) throw new Error(error.message);

  revalidatePath('/dashboard');
}

export async function deleteClientAction(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('clients').delete().eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard');
}

export async function updateClientAction(id: string, formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated.');

  const parsed = clientSchema.safeParse({
    name: formData.get('name'),
    influence_tier: formData.get('influence_tier'),
    status: formData.get('status') || 'Active',
  });

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues.map((i) => i.message).join(', ')
    );
  }

  const { error } = await supabase
    .from('clients')
    .update(parsed.data)
    .eq('id', id);

  if (error) throw new Error(error.message);

  revalidatePath('/dashboard');
}

// --- MARKER ACTIONS ---

export async function getMarkers() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('markers')
    .select('*, clients(name)')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function createMarkerAction(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated.');

  const parsed = markerSchema.safeParse({
    client_id: formData.get('client_id'),
    favor_type: formData.get('favor_type'),
    leverage_value: formData.get('leverage_value'),
    status: formData.get('status') || 'Outstanding',
  });

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues.map((i) => i.message).join(', ')
    );
  }

  const { error } = await supabase
    .from('markers')
    .insert([{ ...parsed.data, user_id: user.id }]);
  if (error) throw new Error(error.message);

  revalidatePath('/dashboard');
}

export async function deleteMarkerAction(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('markers').delete().eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard');
}

export async function updateMarkerAction(id: string, formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated.');

  const parsed = markerSchema.safeParse({
    client_id: formData.get('client_id'),
    favor_type: formData.get('favor_type'),
    leverage_value: formData.get('leverage_value'),
    status: formData.get('status') || 'Outstanding',
  });

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues.map((i) => i.message).join(', ')
    );
  }

  const { error } = await supabase
    .from('markers')
    .update(parsed.data)
    .eq('id', id);

  if (error) throw new Error(error.message);

  revalidatePath('/dashboard');
}
