import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Truck, Flower2, CreditCard, MessageCircle, Star, Search, X, Plus } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

import { Footer } from "@/components/Footer";
import { ProductCard, type Product } from "@/components/ProductCard";
import { resolveImage, heroImage } from "@/lib/product-images";
import { useLocationStore } from "@/stores/location";
import { useCartStore } from "@/stores/cart";
import { brl } from "@/lib/format";
import { toast } from "sonner";

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
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

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

  const rawProducts = homeQ.data?.products ?? [];

  // Ordem manual de exibição em "Todos os Produtos"
  const ALL_PRODUCTS_ORDER: string[] = [
    "buque-com-10-rosas-vermelhas-premium",
    "buque-de-rosas-spray-vermelhas-no-kraft",
    "buque-com-3-rosas-colombianas-no-kraft",
    "buque-de-6-rosas-colombianas-fechadas",
    "astromelias-coloridas-no-vaso-de-vidro",
    "astromelias-cor-de-rosa-no-vaso-de-vidro",
    "astromelias-brancas-no-vaso-de-vidro",
    "astromelias-amarelas-no-vaso-de-vidro",
    "buque-com-10-rosas-amarelas-premium",
    "buque-com-10-rosas-brancas-premium",
    "buque-com-10-rosas-cor-de-rosa-premium",
    "buque-com-10-rosas-champagne",
    "orquidea-phalaenopsis-branca-no-cachepo",
    "orquidea-amarela-com-2-hastes-no-cachepo",
    "orquidea-2-hastes-premium-rose",
    "arranjo-de-rosas-vermelhas-no-vaso-de-vidro",
    "ramalhete-de-girassol",
    "buque-de-42-rosas-vermelhas",
    "bau-romantico-luxo-com-balao-bubble",
    "bau-estilo-gourmet",
    "buque-de-24-rosas-vermelhas-e-pink",
    "radiante-buque-de-6-girassois",
    "rosa-preservada-vermelha-redoma-led",
    "arranjo-nobreza-de-rosas-cor-de-rosa",
    "buque-de-girassol-e-rosas-vermelhas",
    "buque-de-24-rosas-vermelhas-premium",
    "buque-de-flores-do-campo-amor-no-jornal",
    "buque-de-12-rosas-vermelhas-e-ferrero",
    "arranjo-mix-de-flores-no-box-white",
    "buque-de-50-rosas-vermelhas",
    "orquidea-phalaenopsis-pink-e-ferrero",
    "buque-tradicional-de-12-rosas-vermelhas",
    "buque-amor-tropical-de-rosas-com-chocolates",
    "kit-meu-amor-buque-de-15-rosas-vermelhas",
    "buque-tradicional-de-girassois",
    "bouquet-15-rosas-vermelhas",
    "bouquet-6-rosas-urso-ferrero-t8",
    "combo-conquista",
    "coracao-de-rosas-e-chocolate-com-pelucia",
    "box-de-rosas-vermelhas-luxo-premium",
    "cesta-luxo-flores-vinho-chocolates-e-pelucia",
    "rosa-preservada-redoma-led",
    "cesta-mimo-com-pelucia-rosa",
    "cesta-executiva",
    "cesta-cafe-bom-dia",
    "girassol-no-vaso-com-rosas-amarelas",
    "buque-premium-flores-do-campo",
    "rosa-preservada-azul-redoma",
    "buque-de-18-rosas-vermelhas",
    "buque-de-flores-secas-com-pampas",
    "leleco-e-rosas-vermelhas",
    "mini-vaso-de-margaridinhas-amarelas",
    "buque-delicado-de-margaridas-brancas",
    "arranjo-de-lirios-brancos-no-vaso",
    "buque-colorido-de-gerberas",
    "buque-imperial-de-lisianthus",
    "cesta-de-cafe-da-manha-com-flores",
    "cesta-gourmet-com-vinho-e-rosas",
    "cesta-de-chocolates-premium-com-flores",
    "arranjo-de-flores-mistas-no-vaso-de-vidro",
    "cesta-de-vinho-e-flores",
    "aquario-20-rosas-vermelhas",
    "jarra-de-vidro-de-rosas-coloridas",
    "buque-de-rosas-pink-e-pelucia-romantica",
    "orquidea-phalaenopsis-rosa-no-cachepo",
    "begonia-plantada-cores-variadas",
    "box-flower-delicada",
    "cesta-grande-de-flores-do-campo",
    "belissimo-bouquet-de-rosas-azuis",
    "bouquet-12-rosas-colombianas",
    "buque-20-rosas-coloridas",
    "buque-flores-campo-rosadas",
    "orquidea-branca-no-cachepot-2-hastes",
    "arranjo-de-rosas-champagne-no-vaso-de-vidro",
    "arranjo-de-rosas-amarelas-no-vaso-de-vidro",
    "arranjo-de-rosas-brancas-no-vaso-de-vidro",
    "buque-de-alstromerias-amarelas-no-celofane",
    "buque-de-alstromerias-cor-de-rosa-no-celofane",
    "buque-de-alstromerias-brancas-no-celofane",
    "buque-de-alstromerias-vermelhas-no-celofane",
    "mini-orquidea-branca-1-haste",
    "arranjo-no-cachepo-de-gerberas-e-lirios",
    "ramalhete-com-6-rosas-vermelhas",
    "ramalhete-de-rosa-spray-cor-de-rosa",
    "ramalhete-de-rosas-champagne",
    "buque-de-10-rosas-colombianas-fechadas",
    "buque-com-2-rosas-e-chocolate-lindt",
    "buque-com-2-rosas-e-chocolate-viermon",
    "cesta-mimo-com-pelucia-azul",
    "cesta-rosaria-premium",
    "buque-de-24-rosas-colombianas-abertas",
    "buque-de-36-rosas-colombianas-abertas",
    "ramalhete-24-rosas-vermelhas-astromelias",
    "bau-eu-escolho-voce",
    "sacola-de-presente-com-orquidea-e-ferrero",
    "buque-partitura-de-rosas-nacionais-vermelho",
    "brisa-de-rosas-red",
    "luxuosas-astromelias-coloridas-no-vaso",
    "buque-de-6-rosas-champanhe-e-ferrero",
    "buque-de-12-rosas-coloridas-com-ferrero",
    "cesta-aniversario-carinhoso",
    "lirio-amarelo-plantado-e-ferrero",
    "cesta-flowers-e-dog",
    "buque-de-rosas-vermelhas-amor-no-jornal",
    "buque-carinho-de-rosas-pink",
    "buque-imperio-com-astromelias-brancas",
    "buque-de-mini-spray-vermelho-florence",
    "buque-de-flores-amarelas-majestade",
    "rosa-preservada-vermelha-pendulo",
    "mini-rosa-preservada-rosa-redoma",
    "rosa-preservada-pink-redoma-led",
    "rosa-preservada-amarela-redoma",
    "admiracao-de-astromelias-coloridas-no-vaso",
    "arranjo-harmonia-de-rosas-e-astromelias",
    "brisa-de-rosas-yellow",
    "luxuoso-mix-de-flores-do-campo-no-vaso",
    "arranjo-flores-e-vida-vermelho",
    "orquidea-denphale-lilas-presente",
    "formidavel-orquidea-mini-rara-lilas",
    "orquidea-phalaenopsis-azul-decore",
    "orquidea-dendrobium-plantada",
    "mini-orquidea-rara-mesclada",
    "mini-orquidea-rara-lilas",
    "mega-buque-supremo-lilas",
    "rosas-vermelhas-no-box-giu",
    "buque-de-42-rosas-cor-de-rosa",
    "lirio-rosa-plantado",
    "lirio-da-paz-garbo",
    "cesta-de-cafe-da-manha-doce-amanhecer",
    "kit-mini-chandon-e-petiscos",
    "cesta-sonho-dos-chocolatras",
    "cesta-de-chocolate-pra-quem-merece",
    "buque-trio-de-rosas-cor-de-rosa",
    "radiante-buque-de-3-girassois",
    "buque-classico-da-estacao-cor-de-rosa",
    "amavel-buque-de-flores-do-campo-grande",
    "buque-de-6-rosas-vermelhas",
    "mini-vaso-de-margaridinhas-plantadas",
    "buque-de-flores-do-campo-mulher-especial",
    "arranjo-flores-e-vida-amarelo",
    "orquidea-pink-presente-na-bag-floral",
    "rosa-preservada-vermelha-coracao-eterno",
    "rosa-preservada-pink-redoma-premium",
    "rosa-preservada-vermelha-cone-preto",
    "mini-box-rosa-preservada-surpresa",
    "mini-rosa-preservada-azul-redoma",
    "mini-orquidea-rara-branca",
    "orquidea-phalaenopsis-branca-mesclada",
    "orquidea-azul",
    "orquidea-phalaenopsis-pink-presente",
    "mini-orquidea-chuva-de-ouro",
    "buque-flame-20-rosas-coloridas",
    "buque-tres-cores-36-rosas",
    "buque-12-rosas-brancas-e-ferrero",
    "buque-passion-12-rosas-coloridas",
    "buque-20-rosas-cor-de-rosa",
    "buque-12-rosas-e-pelucia",
    "buque-amor-dourado-25-rosas-amarelas",
    "ramalhete-amor-meu-2-rosas-com-chocolate",
    "buque-tradicional-de-rosas-e-girassois",
    "buque-de-flores-do-campo-rosadas",
    "buque-rosas-coloridas-e-margaridas",
    "buque-de-flores-em-tons-rosados",
    "buque-12-rosas-e-astromelias-coloridas",
    "buque-summer",
    "buque-rosas-amarelas-e-girassois",
    "buque-outono-com-raffaello",
    "buque-true-love-girassois",
    "bouquet-de-rosas-vermelhas-e-rosas",
    "bouquet-de-girassois-no-kraft",
    "bouquet-de-12-girassois",
    "jarra-de-vidro-com-rosas-e-ferrero",
    "bouquet-de-rosas-brancas-e-vermelhas",
    "bouquet-20-rosas-vermelhas-sem-folhagem",
    "orquidea-plantada-branca",
    "jarra-de-vidro-de-rosas-vermelhas",
    "jarra-de-10-girassois-com-folhagens",
    "duplo-colombiano",
    "jarra-flores-tropicais",
    "jarra-de-vidro-de-rosas-cha",
    "jarra-de-girassois-com-lingua-de-gato",
    "arranjo-rosas-coloridas-premium",
    "arranjo-amor-duplo",
    "bouquet-24-rosas-na-folhagem",
    "bouquet-30-rosas-coloridas",
    "bouquet-com-50-rosas-vermelhas",
    "bouquet-de-12-rosas-vermelhas-no-kraft",
    "cesta-grande-de-rosas-vermelhas",
    "ferrero-8",
    "pelucia-urso",
    "sem-cartao",
    "amor",
    "aniversario",
    "agradecimento",
    "melhoras",
    "chocolate-lindt",
    "balao-coracao",
    "vela-aromatica",
  ];
  const allOrderIndex = new Map(ALL_PRODUCTS_ORDER.map((s, i) => [s, i]));
  const allProducts = [...rawProducts].sort((a, b) => {
    const ia = allOrderIndex.get(a.slug) ?? Number.POSITIVE_INFINITY;
    const ib = allOrderIndex.get(b.slug) ?? Number.POSITIVE_INFINITY;
    return ia - ib;
  });

  // Ordem manual dos mais vendidos
  const BESTSELLER_ORDER: string[] = [
    "buque-com-10-rosas-vermelhas-premium",
    "orquidea-phalaenopsis-branca-no-cachepo",
    "orquidea-2-hastes-premium-rose",
    "buque-de-42-rosas-vermelhas",
    "buque-de-24-rosas-vermelhas-e-pink",
    "radiante-buque-de-6-girassois",
    "rosa-preservada-vermelha-redoma-led",
    "arranjo-nobreza-de-rosas-cor-de-rosa",
    "buque-de-girassol-e-rosas-vermelhas",
    "buque-de-24-rosas-vermelhas-premium",
    "buque-de-flores-do-campo-amor-no-jornal",
    "buque-de-12-rosas-vermelhas-e-ferrero",
    "arranjo-mix-de-flores-no-box-white",
    "buque-de-50-rosas-vermelhas",
    "orquidea-phalaenopsis-pink-e-ferrero",
    "buque-tradicional-de-12-rosas-vermelhas",
    "buque-amor-tropical-de-rosas-com-chocolates",
    "kit-meu-amor-buque-de-15-rosas-vermelhas",
    "buque-tradicional-de-girassois",
    "bouquet-15-rosas-vermelhas",
    "bouquet-6-rosas-urso-ferrero-t8",
    "combo-conquista",
    "coracao-de-rosas-e-chocolate-com-pelucia",
    "box-de-rosas-vermelhas-luxo-premium",
    "cesta-luxo-flores-vinho-chocolates-e-pelucia",
    "rosa-preservada-redoma-led",
  ];
  const bySlug = new Map(allProducts.map((p) => [p.slug, p]));
  const featuredProducts = BESTSELLER_ORDER
    .map((slug) => bySlug.get(slug))
    .filter((p): p is FullProduct => Boolean(p));

  const isAll = activeCat === "todos";
  const isFeatured = activeCat === "mais-vendidos";
  const categoryFiltered = isAll || isFeatured
    ? []
    : allProducts.filter((p) => p.category_slug === activeCat);
  const activeCategory = homeQ.data?.categories.find((c) => c.slug === activeCat);


  const cityLabel = loc ? `${loc.city}` : "sua cidade";

  return (
    <div className="min-h-screen bg-background text-foreground">


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

        <div className="mt-3 rounded-2xl bg-green-deep p-4 text-center text-sm text-cream">
          <p>
            <span className="mr-1">🌸</span> Promoção de primeiro pedido ativada!
          </p>
          <p className="mt-1 font-display text-base font-semibold">Entrega Grátis para {cityLabel}!</p>
          <p className="mt-1 text-xs">Flores frescas com até 50% OFF + frete grátis no seu primeiro pedido!</p>
        </div>
      </section>

      {/* Buscar Produtos + Categorias */}
      <section className="mx-auto max-w-3xl px-4 pt-4 space-y-3">
        {/* Barra de busca (abre overlay ao clicar) */}
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="relative flex w-full items-center rounded-full border border-border bg-blush/30 py-3 pl-12 pr-4 text-left text-sm text-green-deep/60 outline-none transition hover:bg-blush/40"
        >
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-green-deep/60" />
          Buscar produtos...
        </button>

        {/* Categorias */}
        <div className="rounded-3xl border border-border bg-white p-4 shadow-soft sm:p-5">
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-green-deep">
            Categorias
          </h4>
          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
            {([{ slug: "todos", name: "Todos", emoji: "🌼" } as Category, ...(homeQ.data?.categories ?? [])]).map((c) => {
              const active = activeCat === c.slug;
              return (
                <button
                  key={c.slug}
                  onClick={() => setActiveCat(c.slug)}
                  className={`flex shrink-0 flex-col items-center justify-center gap-1.5 rounded-2xl px-3 py-3 text-xs font-semibold transition w-[88px] ${
                    active
                      ? "bg-green-deep text-cream shadow-soft"
                      : "bg-blush/40 text-green-deep hover:bg-blush/60"
                  }`}
                >
                  <span className="text-2xl leading-none">{c.emoji}</span>
                  <span className="text-center leading-tight">{c.name}</span>
                </button>
              );
            })}
          </div>
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

      {/* Overlay de busca em tela cheia */}
      {searchOpen && (
        <SearchOverlay
          allProducts={allProducts}
          search={search}
          setSearch={setSearch}
          onClose={() => {
            setSearchOpen(false);
            setSearch("");
          }}
        />
      )}

    </div>
  );
}

function SearchOverlay({
  allProducts,
  search,
  setSearch,
  onClose,
}: {
  allProducts: FullProduct[];
  search: string;
  setSearch: (v: string) => void;
  onClose: () => void;
}) {
  const add = useCartStore((s) => s.add);
  const q = search.trim().toLowerCase();
  const results = q.length === 0
    ? allProducts
    : allProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description ?? "").toLowerCase().includes(q),
      );

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-cream">
      {/* topo: X + busca */}
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-border/60 bg-cream px-4 py-3">
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar busca"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-green-deep transition hover:bg-blush/30"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-green-deep/60" />
          <input
            autoFocus
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar produtos..."
            className="w-full rounded-full border border-blush bg-blush/20 py-3 pl-12 pr-4 text-sm text-green-deep placeholder:text-green-deep/50 outline-none transition focus:border-green-deep"
          />
        </div>
      </div>

      {/* lista */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <p className="mb-3 text-xs text-muted-foreground">
          {results.length} produto(s) encontrado(s)
        </p>
        <div className="space-y-3">
          {results.map((p) => (
            <article
              key={p.id}
              className="flex items-center gap-3 rounded-2xl border border-border bg-white p-2 shadow-soft"
            >
              <Link
                to="/produto/$slug"
                params={{ slug: p.slug }}
                onClick={onClose}
                className="flex flex-1 items-center gap-3"
              >
                <img
                  src={resolveImage(p.images[0])}
                  alt={p.name}
                  loading="lazy"
                  className="h-20 w-20 shrink-0 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="line-clamp-2 text-sm font-semibold text-green-deep">
                    {p.name}
                  </h3>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-sm font-bold text-green-deep">
                      {brl(Number(p.price))}
                    </span>
                    {p.original_price && p.original_price > p.price && (
                      <span className="text-xs text-muted-foreground line-through">
                        {brl(Number(p.original_price))}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
              <button
                type="button"
                aria-label={`Adicionar ${p.name}`}
                onClick={() => {
                  add({
                    productId: p.id,
                    slug: p.slug,
                    name: p.name,
                    price: Number(p.price),
                    imageKey: p.images[0],
                  });
                  toast.success("Adicionado ao carrinho", { description: p.name });
                }}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-green-deep text-cream transition active:scale-95 hover:bg-green-mid"
              >
                <Plus className="h-5 w-5" />
              </button>
            </article>
          ))}
          {results.length === 0 && (
            <p className="rounded-2xl bg-cream-dark/40 py-12 text-center text-sm text-muted-foreground">
              Nenhum produto encontrado.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

