import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard, type Product } from "@/components/ProductCard";
import { Footer } from "@/components/Footer";

type FullProduct = Product & { category_slug: string; featured: boolean };

const searchSchema = z.object({
  tipo: z.enum(["todos", "mais-vendidos"]).catch("todos").default("todos"),
  cat: z.string().catch("").default(""),
  q: z.string().catch("").default(""),
});

export const Route = createFileRoute("/catalogo")({
  validateSearch: (s: Record<string, unknown>) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Catálogo de Flores — Buquês, Rosas e Arranjos | Floratta Express" },
      { name: "description", content: "Catálogo completo da Floratta Express: buquês de rosas vermelhas, flores para namorada, arranjos, cestas e combos com entrega de flores no mesmo dia em todo o Brasil." },
      { name: "keywords", content: "catálogo de flores, buquê de rosas, comprar flores online, flores para presente, arranjos florais, cestas de presente, floricultura online" },
      { property: "og:title", content: "Catálogo de Flores — Floratta Express" },
      { property: "og:description", content: "Buquês, rosas, arranjos e cestas com entrega rápida em todo o Brasil." },
    ],
    links: [{ rel: "canonical", href: "https://exact-pixel-perfect-797.lovable.app/catalogo" }],
  }),
  component: CatalogoPage,
});

const BESTSELLER_ORDER: string[] = [
  "buque-com-10-rosas-vermelhas-premium",
  "buque-de-rosas-spray-vermelhas-no-kraft",
  "buque-com-3-rosas-colombianas-no-kraft",
  "buque-de-6-rosas-colombianas-fechadas",
];

function CatalogoPage() {
  const { tipo, cat, q } = Route.useSearch();
  const navigate = useNavigate({ from: "/catalogo" });
  const [localQ, setLocalQ] = useState(q);

  const dataQ = useQuery({
    queryKey: ["catalogo"],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const [products, categories] = await Promise.all([
        supabase.from("products").select("*").eq("active", true).gt("price", 0).order("featured", { ascending: false }),
        supabase.from("categories").select("*").eq("active", true).order("sort_order"),
      ]);
      return {
        products: (products.data ?? []) as FullProduct[],
        categories: (categories.data ?? []) as { name: string; slug: string; emoji: string | null }[],
      };
    },
  });

  const products = dataQ.data?.products ?? [];
  const categories = dataQ.data?.categories ?? [];

  const list = useMemo(() => {
    let l: FullProduct[] = products;
    if (tipo === "mais-vendidos") {
      const bySlug = new Map(products.map((p) => [p.slug, p]));
      l = BESTSELLER_ORDER.map((s) => bySlug.get(s)).filter((p): p is FullProduct => Boolean(p));
      // Add remaining featured products
      const rest = products.filter((p) => p.featured && !BESTSELLER_ORDER.includes(p.slug));
      l = [...l, ...rest];
    }
    if (cat) l = l.filter((p) => p.category_slug === cat);
    if (localQ.trim()) {
      const term = localQ.trim().toLowerCase();
      l = l.filter((p) => p.name.toLowerCase().includes(term));
    }
    return l;
  }, [products, tipo, cat, localQ]);

  const title = tipo === "mais-vendidos" ? "Mais Vendidos" : "Todos os Produtos";
  const emoji = tipo === "mais-vendidos" ? "🔥" : "💐";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="mx-auto max-w-3xl px-4 pt-6">
        <div className="flex items-center gap-3">
          <Link to="/" className="rounded-full p-2 text-green-deep hover:bg-blush/40">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="font-display text-xl text-green-deep flex items-center gap-2">
              <span>{emoji}</span> {title}
            </h1>
            <p className="text-xs text-muted-foreground">{list.length} produtos disponíveis</p>
          </div>
        </div>

        <div className="mt-4 relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-green-deep/60" />
          <input
            type="text"
            value={localQ}
            onChange={(e) => setLocalQ(e.target.value)}
            placeholder="Buscar nesta lista..."
            className="w-full rounded-full border border-border bg-blush/30 py-3 pl-12 pr-4 text-sm text-green-deep placeholder:text-green-deep/60 outline-none focus:bg-blush/40"
          />
        </div>

        {categories.length > 0 && (
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button
              onClick={() => navigate({ search: (p: any) => ({ ...p, cat: "" }) })}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition ${!cat ? "bg-green-deep text-cream" : "bg-blush/40 text-green-deep"}`}
            >
              Todas
            </button>
            {categories.map((c) => (
              <button
                key={c.slug}
                onClick={() => navigate({ search: (p: any) => ({ ...p, cat: c.slug }) })}
                className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition ${cat === c.slug ? "bg-green-deep text-cream" : "bg-blush/40 text-green-deep"}`}
              >
                {c.emoji} {c.name}
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-16 pt-6">
        {dataQ.isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-32 animate-pulse rounded-2xl bg-cream-dark" />
            ))}
          </div>
        ) : list.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">Nenhum produto encontrado.</p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {list.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
