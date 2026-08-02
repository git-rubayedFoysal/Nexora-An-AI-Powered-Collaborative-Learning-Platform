import { createClient } from "@supabase/supabase-js";
import conf from "../../config/conf";

// Connect to Supabase using the URL and key from .env
export const supabase = createClient(
  conf.supabaseUrl,
  conf.supabasePublishableKey,
);
