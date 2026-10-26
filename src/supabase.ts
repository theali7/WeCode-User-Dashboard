import { createClient } from "@supabase/supabase-js"

// Browser-safe publishable key; private data is protected by database RLS.
export const supabaseUrl = "https://oapnfhnvisujhrfdvklm.supabase.co"
export const supabasePublishableKey = "sb_publishable_FDA2L17LT0viS5GPFoumZQ__2bWOGmY"
export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
})
