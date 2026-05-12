
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS image_url text;

UPDATE public.reviews SET image_url = '/reviews/av1.jpg' WHERE buyer_name = 'Mariana Souza';
UPDATE public.reviews SET image_url = '/reviews/av7.jpg' WHERE buyer_name = 'Carlos Mendes';
UPDATE public.reviews SET image_url = '/reviews/av10.jpg' WHERE buyer_name = 'Beatriz Lima';
UPDATE public.reviews SET image_url = '/reviews/av4.jpg' WHERE buyer_name = 'Felipe Rocha';
UPDATE public.reviews SET image_url = '/reviews/av8.jpg' WHERE buyer_name = 'Renato Oliveira';
UPDATE public.reviews SET image_url = '/reviews/av2.jpg' WHERE buyer_name = 'Juliana Pires';

INSERT INTO public.reviews (buyer_name, product_slug, rating, comment, approved, image_url, created_at) VALUES
('Patrícia Almeida', 'buque-12-rosas-vermelhas', 5, 'Buquê espetacular com Ferrero Rocher, surpresa perfeita para o aniversário do meu marido. Chegou rapidinho!', true, '/reviews/av3.jpg', now() - interval '5 days'),
('Ana Paula Castro', 'buque-12-rosas-vermelhas', 5, 'Rosas vermelhas lindíssimas e bem firmes. A apresentação é deslumbrante, recomendo muito!', true, '/reviews/av6.jpg', now() - interval '12 days'),
('Camila Rodrigues', 'buque-12-rosas-vermelhas', 5, 'Comprei para o aniversário da minha mãe e ela amou. Frescas, perfumadas e com entrega no horário.', true, '/reviews/av5.jpg', now() - interval '18 days'),
('Larissa Fernandes', 'buque-12-rosas-vermelhas', 5, 'Rosas pink vibrantes, embalagem encantadora. Minha amiga ficou emocionada com o presente.', true, '/reviews/av9.jpg', now() - interval '25 days');
