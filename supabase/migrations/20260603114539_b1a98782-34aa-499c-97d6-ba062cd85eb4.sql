
-- Tighten coupons SELECT: remove public read, admins still manage via existing policy
DROP POLICY IF EXISTS "coupons public read active" ON public.coupons;

-- Revoke broad SELECT to anon on coupons (admin path uses authenticated)
REVOKE SELECT ON public.coupons FROM anon;

-- Security-definer lookup for a single coupon by code (for future checkout validation)
CREATE OR REPLACE FUNCTION public.get_coupon_by_code(_code text)
RETURNS TABLE (
  code text,
  type text,
  value numeric,
  min_order numeric,
  first_order_only boolean,
  expires_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT c.code, c.type, c.value, c.min_order, c.first_order_only, c.expires_at
  FROM public.coupons c
  WHERE c.active = true
    AND c.code = _code
    AND (c.expires_at IS NULL OR c.expires_at > now())
    AND (c.max_uses IS NULL OR c.used_count < c.max_uses)
  LIMIT 1
$$;

GRANT EXECUTE ON FUNCTION public.get_coupon_by_code(text) TO anon, authenticated;

-- Tighten orders INSERT: clients can only insert as 'pending'.
-- Server-side admin code (service role) bypasses RLS and may set 'paid' after verifying payment.
DROP POLICY IF EXISTS "orders public insert" ON public.orders;

CREATE POLICY "orders public insert"
ON public.orders
FOR INSERT
TO public
WITH CHECK (
  length(buyer_name) > 1
  AND length(buyer_phone) >= 8
  AND length(recipient_name) > 1
  AND length(address_cep) >= 8
  AND length(address_street) > 1
  AND length(address_city) > 1
  AND length(address_state) = 2
  AND total >= 0
  AND status = 'new'
  AND payment_status = 'pending'
);
