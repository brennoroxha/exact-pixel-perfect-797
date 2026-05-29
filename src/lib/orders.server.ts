import { supabaseAdmin } from "@/integrations/supabase/client.server";

export async function fetchPublicOrderById(id: string) {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("id, order_number, recipient_name, address_city, address_state, items, total, status")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data;
}