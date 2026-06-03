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

export type CreateOrderInput = {
  buyer_name: string;
  buyer_phone: string;
  buyer_email: string | null;
  recipient_name: string;
  recipient_phone: string | null;
  address_cep: string;
  address_street: string;
  address_number: string;
  address_complement: string | null;
  address_neighborhood: string | null;
  address_city: string;
  address_state: string;
  card_message: string | null;
  items: Array<{
    slug: string;
    name: string;
    price: number;
    quantity: number;
    imageKey?: string;
  }>;
  subtotal: number;
  delivery_fee: number;
  discount: number;
  total: number;
  payment_method: "pix" | "credit";
  city_slug: string | null;
};

export async function createPendingOrder(input: CreateOrderInput) {
  // Server-side trust boundary: payment_status ALWAYS starts as "pending".
  // It can only transition to "paid" via a verified payment webhook (admin/service role).
  const { data, error } = await supabaseAdmin
    .from("orders")
    .insert({
      order_number: "",
      buyer_name: input.buyer_name,
      buyer_phone: input.buyer_phone,
      buyer_email: input.buyer_email,
      recipient_name: input.recipient_name,
      recipient_phone: input.recipient_phone,
      address_cep: input.address_cep,
      address_street: input.address_street,
      address_number: input.address_number,
      address_complement: input.address_complement,
      address_neighborhood: input.address_neighborhood,
      address_city: input.address_city,
      address_state: input.address_state,
      card_message: input.card_message,
      items: input.items,
      subtotal: input.subtotal,
      delivery_fee: input.delivery_fee,
      discount: input.discount,
      total: input.total,
      payment_method: input.payment_method,
      payment_status: "pending",
      status: "new",
      city_slug: input.city_slug,
    })
    .select("id, order_number")
    .single();

  if (error || !data) throw error ?? new Error("Failed to create order");
  return data;
}

export async function isUserAdmin(userId: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) return false;
  return !!data;
}
