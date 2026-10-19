"use server";

import { redirect } from "next/navigation";
import { createAdminSessionClient } from "@/lib/supabase/server";

export async function login(prevState, formData) {
  let form;
  let isActionState = true;
  if (formData instanceof FormData) {
    form = formData;
  } else if (prevState instanceof FormData) {
    form = prevState;
    isActionState = false;
  } else {
    form = formData;
  }

  const email = form?.get("email");
  const password = form?.get("password");

  if (!email || !password) {
    const errorMsg = "Email dan password wajib diisi.";
    if (!isActionState) {
      redirect(`/admin/login?error=${encodeURIComponent(errorMsg)}`);
    }
    return { error: errorMsg };
  }

  let loginSuccess = false;
  try {
    const supabase = await createAdminSessionClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: String(email).trim(),
      password: String(password),
    });

    if (error) {
      const errorMsg =
        error.message === "Invalid login credentials"
          ? "Email atau password salah."
          : error.message;

      if (!isActionState) {
        redirect(`/admin/login?error=${encodeURIComponent(errorMsg)}`);
      }
      return { error: errorMsg };
    }

    loginSuccess = true;
  } catch (err) {
    if (err?.message === "NEXT_REDIRECT" || err?.digest?.startsWith("NEXT_REDIRECT")) {
      throw err;
    }
    const errorMsg = err.message || "Terjadi kesalahan saat masuk.";
    if (!isActionState) {
      redirect(`/admin/login?error=${encodeURIComponent(errorMsg)}`);
    }
    return { error: errorMsg };
  }

  if (loginSuccess) {
    redirect("/admin");
  }
}

export async function keluar() {
  const supabase = await createAdminSessionClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export const logout = keluar;

