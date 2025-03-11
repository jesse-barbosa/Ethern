import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;

// Verifique se as variáveis estão definidas
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('As variáveis de ambiente do Supabase não estão definidas.');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
