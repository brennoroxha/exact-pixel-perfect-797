DROP POLICY IF EXISTS "products public read" ON public.products;
DROP POLICY IF EXISTS "reviews public read approved" ON public.reviews;

CREATE POLICY "products public read active"
ON public.products
FOR SELECT
TO public
USING (active = true);

CREATE POLICY "products admin read all"
ON public.products
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "reviews public read approved"
ON public.reviews
FOR SELECT
TO public
USING (approved = true);

CREATE POLICY "reviews admin read all"
ON public.reviews
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;