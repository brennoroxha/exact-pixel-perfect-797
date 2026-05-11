-- Remove the 12 mock products that don't have external image URLs
DELETE FROM public.products
WHERE NOT (images[1] LIKE 'http%');