import { createClient } from '@supabase/supabase-js';
import { config } from '../config';

export interface Organization {
  id: string;
  name: string;
  voiceflow_api_key: string | null;
  voiceflow_project_id: string | null;
  voiceflow_config: string | null;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface OrganizationMember {
  id: string;
  organization_id: string;
  user_id: string;
  role: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  organizations: Organization;
}

export const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey);

export type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}; 