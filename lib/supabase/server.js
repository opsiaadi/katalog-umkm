import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Membuat koneksi Supabase untuk server menggunakan SUPABASE_URL dan SUPABASE_SECRET_KEY.
 * Digunakan untuk Server Component, Server Action, atau Route Handler.
 */
export function createClient() {
  const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseSecretKey) {
    throw new Error("SUPABASE_URL dan SUPABASE_SECRET_KEY belum diatur di environment variable.");
  }

  return createSupabaseClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export const createServerClient = createClient;

