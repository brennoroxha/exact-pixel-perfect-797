DROP POLICY IF EXISTS "orders public read by id" ON public.orders;

CREATE POLICY "orders admin read"
ON public.orders
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE OR REPLACE FUNCTION public.get_order_by_id(_id uuid)
RETURNS TABLE (
  updated_at timestamp with time zone,
  id uuid,
  order_number text,
  buyer_name text,
  buyer_phone text,
  buyer_email text,
  recipient_name text,
  recipient_phone text,
  address_cep text,
  address_street text,
  address_number text,
  address_complement text,
  address_neighborhood text,
  address_city text,
  address_state text,
  card_message text,
  items jsonb,
  subtotal numeric,
  delivery_fee numeric,
  discount numeric,
  total numeric,
  coupon_code text,
  delivery_date date,
  delivery_period text,
  payment_method text,
  payment_status text,
  status text,
  city_slug text,
  created_at timestamp with time zone
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    o.updated_at,
    o.id,
    o.order_number,
    o.buyer_name,
    o.buyer_phone,
    o.buyer_email,
    o.recipient_name,
    o.recipient_phone,
    o.address_cep,
    o.address_street,
    o.address_number,
    o.address_complement,
    o.address_neighborhood,
    o.address_city,
    o.address_state,
    o.card_message,
    o.items,
    o.subtotal,
    o.delivery_fee,
    o.discount,
    o.total,
    o.coupon_code,
    o.delivery_date,
    o.delivery_period,
    o.payment_method,
    o.payment_status,
    o.status,
    o.city_slug,
    o.created_at
  FROM public.orders AS o
  WHERE o.id = _id
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_order_by_id(uuid) TO anon, authenticated, service_role;