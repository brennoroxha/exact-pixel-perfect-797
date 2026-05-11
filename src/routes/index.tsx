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
        supabase.from("products").select("*").eq("active", true).order("featured", { ascending: false }),
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
  const filtered =
    activeCat === "mais-vendidos"
      ? allProducts.filter((p) => p.featured)
      : allProducts.filter((p) => p.category_slug === activeCat);

  const cityLabel = loc ? `${loc.city}` : "sua cidade";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 md:grid-cols-2 md:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-cream-dark px-3 py-1 text-xs text-green-deep">
              🔥 Primeiro pedido com frete grátis · cupom <strong>FLORASPRIMEIRA</strong>
            </span>
            <h1 className="mt-5 font-display text-5xl leading-[1.05] text-green-deep md:text-7xl">
              Flores que <br />
              <span className="italic text-green-mid">chegam vivas</span> <br />
              até você. 🌹
            </h1>
            <p className="mt-5 max-w-md text-base text-muted-foreground">
              Entrega em <strong>{loc ? `${loc.deliveryTimeMin}–${loc.deliveryTimeMax} min` : "30–60 min"}</strong> para {cityLabel}. Buquês editoriais, embalagem caprichada e mensagem manuscrita.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#vitrine" className="inline-flex items-center gap-2 rounded-full bg-green-deep px-6 py-3.5 text-sm font-medium text-cream transition hover:bg-green-mid">
                Ver buquês <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#ocasioes" className="inline-flex items-center gap-2 rounded-full border border-green-deep px-6 py-3.5 text-sm font-medium text-green-deep transition hover:bg-green-deep hover:text-cream">
                Por ocasião
              </a>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <img src={heroImage} alt="Buquê de rosas pastel" className="col-span-2 row-span-2 h-full w-full rounded-3xl object-cover shadow-elegant" loading="eager" decoding="async" />
            <img src={resolveImage("girassois")} alt="Girassóis" className="aspect-square w-full rounded-3xl object-cover shadow-soft" loading="eager" decoding="async" />
            <img src={resolveImage("orquidea")} alt="Orquídea" className="aspect-square w-full rounded-3xl object-cover shadow-soft" loading="eager" decoding="async" />
          </div>
        </div>
      </section>

      {/* Categorias */}
      <section className="border-y border-border bg-cream-dark/40">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-4 scrollbar-hide">
          {(homeQ.data?.categories ?? []).map((c) => {
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

      {/* Ocasiões */}
      <section id="ocasioes" className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-3xl text-green-deep md:text-4xl">Por ocasião</h2>
          <span className="text-sm text-muted-foreground">Escolha o motivo</span>
        </div>
        <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:grid md:grid-cols-4 md:gap-3 md:overflow-visible md:px-0 lg:grid-cols-7">
          {(homeQ.data?.occasions ?? []).map((o, i) => (
            <button
              key={o.slug}
              className="group relative flex aspect-[4/5] w-[38vw] shrink-0 snap-start flex-col items-center justify-end overflow-hidden rounded-2xl bg-green-mid p-3 text-cream shadow-soft transition hover:-translate-y-1 hover:shadow-elegant md:w-auto"
              style={{ backgroundImage: `url(${resolveImage(["rosas-vermelhas","girassois","peonias","flores-campo","flores-secas","orquidea","buque-pastel"][i % 7])})`, backgroundSize: "cover", backgroundPosition: "center" }}
            >
              <div className="absolute inset-0 bg-overlay-warm" />
              <div className="relative text-center">
                <div className="text-2xl">{o.emoji}</div>
                <div className="mt-1 font-display text-sm">{o.name}</div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Vitrine */}
      <section id="vitrine" className="mx-auto max-w-7xl px-4 pb-16">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-3xl text-green-deep md:text-4xl">
            {activeCat === "mais-vendidos" ? "Mais vendidos" : "Selecionados para você"}
          </h2>
          <span className="text-sm text-muted-foreground">{filtered.length} produtos</span>
        </div>
        {homeQ.isLoading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square animate-pulse rounded-2xl bg-cream-dark" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
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
