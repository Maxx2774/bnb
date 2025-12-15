import { createServerClient } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { cache } from "react";
import { serverEnv } from "../env";
import type { Database, UserProfile } from "./types";

export function createPublicClient() {
  return createSupabaseClient<Database>(
    serverEnv.supabase.url,
    serverEnv.supabase.publishableKey,
  );
}

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    serverEnv.supabase.url,
    serverEnv.supabase.publishableKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {}
        },
      },
    },
  );
}

export const getUser = cache(async (): Promise<User | null> => {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  const user = data?.claims;

  if (error || !user) return null;

  return { ...(user as unknown as User), id: user.sub };
});

export const getUserId = cache(async (): Promise<string> => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims?.sub) {
    throw new Error("Unauthorized");
  }
  return data.claims.sub;
});

export const getUserProfile = cache(async (): Promise<UserProfile | null> => {
  const user = await getUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("id, name, email, is_admin, created_at, updated_at")
    .eq("id", user.id)
    .single();

  return profile;
});
