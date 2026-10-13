import { z } from 'zod';

export type InfluenceTier = 'Local' | 'Federal' | 'Global Syndicate';
export type ClientStatus = 'Active' | 'Settled' | 'In Default';

export type MarkerStatus = 'Outstanding' | 'Called In' | 'Defaulted';

export interface Client {
  id: string;
  user_id: string;
  name: string;
  influence_tier: InfluenceTier;
  status: ClientStatus;
  created_at: string;
}

export interface Marker {
  id: string;
  user_id: string;
  client_id: string;
  favor_type: string;
  leverage_value: number;
  status: MarkerStatus;
  created_at: string;
  clients?: {
    name: string;
  };
}

// Zod Validation Schemas for Server Actions
export const clientSchema = z.object({
  name: z.string().min(2, 'Client name is required'),
  influence_tier: z.enum(['Local', 'Federal', 'Global Syndicate']),
  status: z.enum(['Active', 'Settled', 'In Default']).default('Active'),
});

export const markerSchema = z.object({
  client_id: z.string().uuid('Valid client ID is required'),
  favor_type: z.string().min(3, 'Favor type description is required'),
  leverage_value: z.coerce.number().min(1).max(10),
  status: z.enum(['Outstanding', 'Called In', 'Defaulted']).default('Outstanding'),
});
