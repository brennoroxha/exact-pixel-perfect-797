
# Floricultura Delivery "Flora Luxe" — Plano de Implementação

Sistema completo de e-commerce de flores com modal de localização, catálogo, checkout, rastreamento e admin. Pagamentos e WhatsApp mockados. Backend real via Lovable Cloud.

## 1. Design System (`src/styles.css`)

Reescrever tokens em **oklch** seguindo a paleta Flora Luxe:
- `--cream`, `--cream-dark`, `--green-deep`, `--green-mid`, `--green-sage`, `--blush`, `--gold`, `--charcoal`
- Mapear como semânticos: `background=cream`, `primary=green-deep`, `accent=gold`, `secondary=green-sage`, etc.
- Fontes: Playfair Display (display) + DM Sans (body) via `<link>` em `__root.tsx`
- Sombras suaves, raio pill nos botões, tokens de gradiente sutil

## 2. Stack & Dependências

- Adicionar: `framer-motion`, `zustand`, `date-fns`, `sonner` (já presente)
- Manter TanStack Router/Query (em vez de React Router v6 do prompt — é o padrão do template)
- Habilitar **Lovable Cloud** (Supabase) para DB + auth admin

## 3. Banco de Dados (migrations)

Tabelas: `store_config`, `cities`, `categories`, `occasions`, `products`, `addons`, `coupons`, `orders`, `reviews`. RLS:
- Leitura pública: produtos, categorias, ocasiões, cidades, reviews aprovadas
- Escrita admin: tabela `user_roles` + função `has_role` (padrão seguro)
- Pedidos: insert público, leitura pelo próprio número de pedido

Seed inicial: ~20 produtos, 8 categorias, 7 ocasiões, ~15 cidades das principais capitais.

## 4. Estrutura de Rotas (`src/routes/`)

```text
__root.tsx              shell + fontes + providers + LocationGate + WhatsAppButton + Toaster
index.tsx               Home (hero, categorias, ocasiões, mais vendidos, reviews, banner, footer)
produto.$slug.tsx       Página de produto
carrinho.tsx            Carrinho cheio (drawer também disponível global)
checkout.tsx            Stepper 4 etapas
pedido.$id.tsx          Rastreamento com timeline
entrega.$cidade.tsx     SEO por cidade
admin.tsx               Layout admin (auth gate)
admin.index.tsx         Dashboard
admin.pedidos.tsx
admin.produtos.tsx
admin.cidades.tsx
admin.cupons.tsx
admin.avaliacoes.tsx
login.tsx               Login admin (Supabase)
```

Cada rota com `head()` próprio (title, description, og:*).

## 5. Componentes-chave (`src/components/`)

`LocationModal` (3 etapas com pétalas animadas + geolocation + Nominatim), `Header`, `ContextBar`, `Hero`, `CategoryPills`, `OccasionCards`, `ProductCard`, `ProductGrid`, `CartDrawer`, `FreeShippingBar`, `CheckoutStepper`, `OrderTimeline`, `WhatsAppButton`, `UrgencyBar`, `ReviewCarousel`, `Footer`, `AdminSidebar`.

## 6. Estado Global (Zustand)

- `useLocationStore`: state, city, savedAt (localStorage persist, expira em 30 dias)
- `useCartStore`: items, addons, coupon, totals (localStorage persist)

## 7. Animações (Framer Motion)

Pétalas SVG caindo no modal, stagger nos cards, drawer slide-in, confetti de pétalas no sucesso, bounce no add-to-cart, slide-in da timeline ao scroll, hover elevation.

## 8. Mocks

- **Pagamento**: tela PIX com QR code placeholder + "copia e cola" estático; cartão com máscara e validação visual; ambos resultam em status `paid` mockado
- **WhatsApp**: link `wa.me/5511999999999?text=...` (botão flutuante e confirmação)
- **ViaCEP**: integração real (API pública, sem chave)
- **Geolocation**: real via navigator + Nominatim
- **Rastreamento**: simulação de progressão de status no admin (real-time via Supabase Realtime)

## 9. Admin

- Login via Supabase email/password
- Tabela `user_roles` + `has_role()` (padrão seguro, nunca campo no profiles)
- Realtime nos pedidos novos com toast sonoro
- CRUD de produtos com upload de imagens (Supabase Storage)

## 10. Detalhes finais

- PT-BR em tudo, `date-fns/locale/pt-BR`
- Skeletons, lazy images, aria-labels
- Imagens dos produtos: gerar 8-10 hero shots editoriais (premium quality) + usar nas categorias

## Observações

Devido ao tamanho, vou priorizar nesta ordem de qualidade visual: **Design System → Modal Localização → Home → Produto → Carrinho/Checkout → Rastreamento → Admin**. Tudo entregue numa única passada, mas é esperado que algumas partes do admin sejam funcionais-mas-básicas vs. as páginas voltadas ao cliente que serão polidas.
