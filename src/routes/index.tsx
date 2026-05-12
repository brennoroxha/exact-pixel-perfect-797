import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Truck, Flower2, CreditCard, MessageCircle, Star } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard, type Product } from "@/components/ProductCard";
import { resolveImage, heroImage } from "@/lib/product-images";
import { useLocationStore } from "@/stores/location";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Flora Luxe — Buquês entregues em 60 min" },
      {
        name: "description",
        content:
          "Floricultura delivery premium. Rosas, peônias, orquídeas e arranjos editoriais entregues em até 60 minutos.",
      },
    ],
  }),
  component: HomePage,
});

type Category = { name: string; slug: string; emoji: string | null };
type Occasion = { name: string; slug: string; emoji: string | null };
type Review = { id: string; buyer_name: string; rating: number; comment: string | null; product_slug: string | null };
type FullProduct = Product & { category_slug: string; featured: boolean };

function HomePage() {
  const loc = useLocationStore((s) => s.location);
  const [activeCat, setActiveCat] = useState<string>("mais-vendidos");

  // Single combined query — runs all reads in parallel and caches together
  const homeQ = useQuery({
    queryKey: ["home"],
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    queryFn: async () => {
      const [products, categories, occasions, reviews] = await Promise.all([
        supabase.from("products").select("*").eq("active", true).gt("price", 0).order("featured", { ascending: false }),
        supabase.from("categories").select("*").eq("active", true).order("sort_order"),
        supabase.from("occasions").select("*").eq("active", true),
        supabase.from("reviews").select("*").eq("approved", true).limit(8),
      ]);
      return {
        products: (products.data ?? []) as FullProduct[],
        categories: (categories.data ?? []) as Category[],
        occasions: (occasions.data ?? []) as Occasion[],
        reviews: (reviews.data ?? []) as Review[],
      };
    },
  });

  const allProducts = homeQ.data?.products ?? [];

  // Ordem manual dos mais vendidos (ranking de probabilidade real de venda)
  const BESTSELLER_ORDER: string[] = [
    "buque-com-10-rosas-vermelhas-premium",
    "buque-de-rosas-spray-vermelhas-no-kraft",
    "buque-com-3-rosas-colombianas-no-kraft",
    "buque-de-6-rosas-colombianas-fechadas",
    "buque-com-10-rosas-amarelas-premium",
    "buque-com-10-rosas-brancas-premium",
    "buque-com-10-rosas-cor-de-rosa-premium",
    "buque-com-10-rosas-champagne",
    "buque-de-42-rosas-vermelhas",
    "buque-de-24-rosas-vermelhas-e-pink",
    "buque-de-24-rosas-vermelhas-premium",
    "buque-de-50-rosas-vermelhas",
    "buque-tradicional-de-12-rosas-vermelhas",
    "kit-meu-amor-buque-de-15-rosas-vermelhas",
    "bouquet-15-rosas-vermelhas",
    "box-de-rosas-vermelhas-luxo-premium",
    "buque-de-18-rosas-vermelhas",
    "belissimo-bouquet-de-rosas-azuis",
    "bouquet-12-rosas-colombianas",
    "buque-de-20-rosas-colombianas-fechadas",
    "ramalhete-com-6-rosas-vermelhas",
    "ramalhete-de-rosa-spray-cor-de-rosa",
    "ramalhete-de-rosas-champagne",
    "buque-de-10-rosas-colombianas-fechadas",
    "buque-de-24-rosas-colombianas-abertas",
    "buque-de-36-rosas-colombianas-abertas",
    "ramalhete-24-rosas-vermelhas-astromelias",
    "buque-partitura-de-rosas-nacionais-vermelho",
    "buque-de-rosas-vermelhas-amor-no-jornal",
    "buque-carinho-de-rosas-pink",
    "buque-de-mini-spray-vermelho-florence",
    "mega-buque-supremo-lilas",
    "buque-de-42-rosas-cor-de-rosa",
    "buque-trio-de-rosas-cor-de-rosa",
    "buque-de-6-rosas-vermelhas",
    "buque-flame-20-rosas-coloridas",
    "buque-tres-cores-36-rosas",
    "buque-passion-12-rosas-coloridas",
    "buque-20-rosas-cor-de-rosa",
    "buque-amor-dourado-25-rosas-amarelas",
    "bouquet-de-rosas-vermelhas-e-rosas",
    "bouquet-de-rosas-brancas-e-vermelhas",
    "bouquet-20-rosas-vermelhas-sem-folhagem",
    "duplo-colombiano",
    "bouquet-24-rosas-na-folhagem",
    "bouquet-30-rosas-coloridas",
    "bouquet-com-50-rosas-vermelhas",
    "bouquet-de-12-rosas-vermelhas-no-kraft",
  ];
  const orderIndex = new Map(BESTSELLER_ORDER.map((slug, i) => [slug, i]));

  // Dedup por slug e ordena: itens listados primeiro (na ordem manual), demais featured ao final
  const seen = new Set<string>();
  const featuredProducts = allProducts
    .filter((p) => p.featured && !seen.has(p.slug) && (seen.add(p.slug), true))
    .sort((a, b) => {
      const ia = orderIndex.get(a.slug) ?? Number.POSITIVE_INFINITY;
      const ib = orderIndex.get(b.slug) ?? Number.POSITIVE_INFINITY;
      return ia - ib;
    });

  const isAll = activeCat === "todos";
  const isFeatured = activeCat === "mais-vendidos";
  const categoryFiltered = isAll || isFeatured
    ? []
    : allProducts.filter((p) => p.category_slug === activeCat);
  const activeCategory = homeQ.data?.categories.find((c) => c.slug === activeCat);


  const cityLabel = loc ? `${loc.city}` : "sua cidade";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Card da loja */}
      <section className="mx-auto max-w-3xl px-4 pt-6">
        <div className="rounded-3xl border border-border bg-white p-6 shadow-soft">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-background shadow-soft">
              <Flower2 className="h-9 w-9 text-green-deep" />
            </div>
            <h1 className="mt-4 font-display text-2xl text-green-deep">Floratta Express</h1>
            <div className="mt-2 flex items-center gap-2 text-sm">
              <span className="flex text-yellow-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </span>
              <span className="font-medium text-green-deep">4,9</span>
              <span className="text-muted-foreground">(2.847 avaliações)</span>
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Tempo de Entrega</span>
              <span className="rounded-full bg-green-mid px-3 py-0.5 text-xs font-semibold text-cream">
                {loc ? `${loc.deliveryTimeMin} - ${loc.deliveryTimeMax} min` : "20 - 30 min"}
              </span>
            </div>
          </div>

          <div className="my-5 border-t border-border" />

          <div className="space-y-2 text-center text-sm">
            <p>
              <span className="mr-1">🌹</span>
              <span className="text-foreground">Mínimo </span>
              <strong className="text-green-deep">R$ 50,00</strong>
              <span className="mx-2 text-muted-foreground">·</span>
              <span className="italic text-green-mid">Entrega Grátis para {cityLabel}</span>
            </p>
            <p className="text-muted-foreground">
              <span className="mr-1">📍</span>
              Estamos a <strong className="text-green-deep">1,6 km</strong> de você
            </p>
          </div>

          <div className="mt-5 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-green-mid bg-background px-5 py-2 text-sm font-semibold text-green-deep">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
              </span>
              ABERTO
            </span>
          </div>
        </div>

        <div className="mt-3 rounded-2xl bg-rose-300/40 p-4 text-center text-sm text-green-deep">
          <p>
            <span className="mr-1">🌸</span> Promoção de primeiro pedido ativada!
          </p>
          <p className="mt-1 font-display text-base font-semibold">Entrega Grátis para {cityLabel}!</p>
          <p className="mt-1 text-xs">Flores frescas com até 50% OFF + frete grátis no seu primeiro pedido!</p>
        </div>
      </section>

      {/* Categorias */}
      <section className="border-y border-border bg-cream-dark/40">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-4 scrollbar-hide">
          {([{ slug: "todos", name: "Todos", emoji: "🌼" } as Category, ...(homeQ.data?.categories ?? [])]).map((c) => {
            const active = activeCat === c.slug;
            return (
              <button
                key={c.slug}
                onClick={() => setActiveCat(c.slug)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-green-deep text-cream"
                    : "bg-cream text-green-deep hover:bg-green-sage/15"
                }`}
              >
                <span className="mr-1">{c.emoji}</span> {c.name}
              </button>
            );
          })}
        </div>
      </section>

      {/* Vitrine */}
      <section id="vitrine" className="mx-auto max-w-7xl px-4 pb-16 pt-8 space-y-12">
        {homeQ.isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square animate-pulse rounded-2xl bg-cream-dark" />
            ))}
          </div>
        ) : isAll ? (
          <>
            {/* Mais Vendidos */}
            {featuredProducts.length > 0 && (
              <div>
                <div className="mb-5">
                  <h2 className="font-display text-2xl text-green-deep md:text-3xl">
                    🔥 Mais Vendidos
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Os favoritos dos nossos clientes
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {featuredProducts.slice(0, 6).map((p, i) => (
                    <ProductCard key={p.id} product={p} index={i} />
                  ))}
                </div>
                {featuredProducts.length > 6 && (
                  <div className="mt-6 flex justify-center">
                    <button
                      onClick={() => setActiveCat("mais-vendidos")}
                      className="rounded-full border border-green-deep px-6 py-2.5 text-sm font-medium text-green-deep transition hover:bg-green-deep hover:text-cream"
                    >
                      Ver todos os mais vendidos ({featuredProducts.length})
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Todos os Produtos */}
            <div>
              <div className="mb-5">
                <h2 className="font-display text-2xl text-green-deep md:text-3xl">
                  💐 Todos os Produtos
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Explore nossa coleção completa
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {allProducts.slice(0, 8).map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
              {allProducts.length > 8 && (
                <div className="mt-6 flex justify-center">
                  <span className="text-sm text-muted-foreground">
                    {allProducts.length} produtos disponíveis · use as categorias acima para filtrar
                  </span>
                </div>
              )}
            </div>
          </>
        ) : isFeatured ? (
          <div>
            <div className="mb-5">
              <h2 className="font-display text-2xl text-green-deep md:text-3xl">🔥 Mais Vendidos</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Os favoritos dos nossos clientes · {featuredProducts.length} produtos
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {featuredProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-5">
              <h2 className="font-display text-2xl text-green-deep md:text-3xl">
                {activeCategory?.emoji} {activeCategory?.name ?? "Produtos"}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {categoryFiltered.length} {categoryFiltered.length === 1 ? "produto" : "produtos"}
              </p>
            </div>
            {categoryFiltered.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {categoryFiltered.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            ) : (
              <p className="rounded-2xl bg-cream-dark/40 py-12 text-center text-sm text-muted-foreground">
                Nenhum produto nesta categoria ainda.
              </p>
            )}
          </div>
        )}
      </section>

      {/* Pilares */}
      <section className="bg-cream-dark/50 py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 md:grid-cols-4">
          {[
            { icon: Flower2, title: "Flores frescas diariamente", desc: "Direto dos melhores produtores" },
            { icon: Truck, title: "Entrega em até 60 minutos", desc: "Nas principais capitais" },
            { icon: CreditCard, title: "PIX, cartão ou boleto", desc: "Pagamento 100% seguro" },
            { icon: MessageCircle, title: "Suporte WhatsApp 24h", desc: "Atendimento humano" },
          ].map((p, i) => (
            <div key={i} className="text-center">
              <p.icon className="mx-auto mb-3 h-8 w-8 text-green-mid" />
              <h3 className="font-display text-lg text-green-deep">{p.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-8 text-center">
          <h2 className="font-display text-3xl text-green-deep md:text-4xl">O que dizem nossas clientes</h2>
          <p className="mt-2 text-sm text-muted-foreground">⭐ 4,9 de 5 com 2.847 avaliações</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {(homeQ.data?.reviews ?? []).slice(0, 6).map((r) => (
            <article key={r.id} className="rounded-2xl bg-card p-6 shadow-soft">
              <div className="flex items-center gap-1 text-gold">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-3 text-sm text-foreground">"{r.comment}"</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-green-deep font-display text-sm text-cream">
                  {r.buyer_name.slice(0, 1)}
                </div>
                <div>
                  <div className="text-sm font-medium text-green-deep">{r.buyer_name}</div>
                  <div className="text-xs text-muted-foreground">Cliente verificada</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Banner promo */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <div className="overflow-hidden rounded-3xl bg-gradient-luxe p-10 text-cream md:p-14">
          <div className="grid gap-6 md:grid-cols-[1.5fr_1fr] md:items-center">
            <div>
              <h2 className="font-display text-3xl md:text-5xl">🎁 Primeiro pedido com frete grátis</h2>
              <p className="mt-3 text-cream/80">
                Use o cupom <span className="rounded bg-cream px-2 py-0.5 font-mono text-sm text-green-deep">FLORASPRIMEIRA</span> no checkout.
              </p>
            </div>
            <div className="text-right">
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-medium text-green-deep hover:bg-gold/90"
              >
                Aproveitar agora →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
