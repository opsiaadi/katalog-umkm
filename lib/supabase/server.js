import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createServerClient as createSsrServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Koneksi server untuk pengunjung menggunakan SUPABASE_URL dan SUPABASE_SECRET_KEY.
 * Digunakan untuk membaca data produk (katalog dan detail produk).
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

/**
 * Koneksi sesi admin menggunakan SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, dan cookie (@supabase/ssr).
 * Digunakan untuk login, keluar, ganti password, dan kelola produk.
 */
export async function createAdminSessionClient() {
  const cookieStore = await cookies();
  const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
  const supabasePublishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error(
      "SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY belum diatur di environment variable."
    );
  }

  return createSsrServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Method setAll dipanggil dari Server Component (bukan Server Action / Route Handler).
          // Diabaikan jika sesi di-refresh di middleware / proxy.
        }
      },
    },
  });
}

export const createAuthClient = createAdminSessionClient;
export const createSessionClient = createAdminSessionClient;
