
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ifihyhksovoaxtiiaete.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmaWh5aGtzb3ZvYXh0aWlhZXRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwNjY1NDAsImV4cCI6MjA2MzY0MjU0MH0.pCO2lg_X-pxygaOs733INbaoqETGFhz6IpztAda6RSs";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
