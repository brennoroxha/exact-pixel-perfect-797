REVOKE EXECUTE ON FUNCTION public.get_order_by_id(uuid) FROM anon, authenticated, service_role;
DROP FUNCTION IF EXISTS public.get_order_by_id(uuid);