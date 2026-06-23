import { createClient } from "@supabase/supabase-js";
import conf from "../../config/conf";

export const supabase = createClient(
  conf.supabaseUrl,
  conf.supabasePublishableKey,
);
