REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM public;

DROP POLICY IF EXISTS "products admin read all" ON public.products;
DROP POLICY IF EXISTS "reviews admin read all" ON public.reviews;