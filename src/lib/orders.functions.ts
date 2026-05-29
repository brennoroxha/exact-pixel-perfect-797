import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { fetchPublicOrderById } from "./orders.server";

const OrderLookupSchema = z.object({
  id: z.string().uuid(),
});

export const getPublicOrder = createServerFn({ method: "GET" })
  .inputValidator((input) => OrderLookupSchema.parse(input))
  .handler(async ({ data }) => fetchPublicOrderById(data.id));