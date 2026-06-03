import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  createPendingOrder,
  fetchPublicOrderById,
  isUserAdmin,
} from "./orders.server";

const OrderLookupSchema = z.object({
  id: z.string().uuid(),
});

export const getPublicOrder = createServerFn({ method: "GET" })
  .inputValidator((input) => OrderLookupSchema.parse(input))
  .handler(async ({ data }) => fetchPublicOrderById(data.id));

const CreateOrderSchema = z.object({
  buyer_name: z.string().min(2).max(120),
  buyer_phone: z.string().min(8).max(20),
  buyer_email: z.string().email().max(160).nullable(),
  recipient_name: z.string().min(2).max(120),
  recipient_phone: z.string().min(8).max(20).nullable(),
  address_cep: z.string().min(8).max(9),
  address_street: z.string().min(2).max(200),
  address_number: z.string().min(1).max(20),
  address_complement: z.string().max(120).nullable(),
  address_neighborhood: z.string().max(120).nullable(),
  address_city: z.string().min(2).max(120),
  address_state: z.string().length(2),
  card_message: z.string().max(500).nullable(),
  items: z
    .array(
      z.object({
        slug: z.string().min(1).max(200),
        name: z.string().min(1).max(200),
        price: z.number().min(0).max(100000),
        quantity: z.number().int().min(1).max(50),
        imageKey: z.string().max(200).optional(),
      }),
    )
    .min(1)
    .max(50),
  subtotal: z.number().min(0).max(1_000_000),
  delivery_fee: z.number().min(0).max(10_000),
  discount: z.number().min(0).max(1_000_000),
  total: z.number().min(0).max(1_000_000),
  payment_method: z.enum(["pix", "credit"]),
  city_slug: z.string().max(120).nullable(),
});

export const createOrder = createServerFn({ method: "POST" })
  .inputValidator((input) => CreateOrderSchema.parse(input))
  .handler(async ({ data }) => createPendingOrder(data));

export const checkIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => ({
    isAdmin: await isUserAdmin(context.userId),
  }));
