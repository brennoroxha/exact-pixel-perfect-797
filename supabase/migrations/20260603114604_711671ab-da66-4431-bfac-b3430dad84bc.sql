
REVOKE EXECUTE ON FUNCTION public.get_coupon_by_code(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_coupon_by_code(text) TO anon, authenticated;
