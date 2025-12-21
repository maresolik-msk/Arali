import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';

const supabaseUrl = `https://${projectId}.supabase.co`;

// Create a single instance of the Supabase client to be used throughout the app
export const supabase = createClient(supabaseUrl, publicAnonKey);
