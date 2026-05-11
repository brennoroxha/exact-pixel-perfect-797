
ALTER FUNCTION public.touch_updated_at() SET search_path = public;
ALTER FUNCTION public.set_order_number() SET search_path = public;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

-- Tighten public order insert: require non-empty buyer/recipient + total >= 0
DROP POLICY IF EXISTS "orders public insert" ON public.orders;
CREATE POLICY "orders public insert" ON public.orders FOR INSERT
WITH CHECK (
  length(buyer_name) > 1 AND length(buyer_phone) >= 8
  AND length(recipient_name) > 1
  AND length(address_cep) >= 8 AND length(address_street) > 1
  AND length(address_city) > 1 AND length(address_state) = 2
  AND total >= 0 AND status = 'new' AND payment_status IN ('pending','paid')
);
