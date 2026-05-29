import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Star,
  Heart,
  Truck,
  Clock,
  ShieldCheck,
  ChevronLeft,
  Check,
  Plus,
  Minus,
  BadgeCheck,
} from "lucide-react";
import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Footer } from "@/components/Footer";
import { resolveImage } from "@/lib/product-images";
import { brl } from "@/lib/format";
import { useCartStore } from "@/stores/cart";
import { useLocationStore } from "@/stores/location";
import { toast } from "sonner";

const SITE_URL = "https://florexpress.delivery";

export const Route = createFileRoute("/produto/$slug")({
  loader: async ({ params }) => {
    const { data } = await supabase
      .from("products")
      .select("id,slug,name,description,price,original_price,images,stock_qty,stock_unlimited,category_slug")
      .eq("slug", params.slug)
      .eq("active", true)
      .maybeSingle();
    return { product: data };
  },
  head: ({ params, loaderData }) => {
    const url = `${SITE_URL}/produto/${params.slug}`;
    const p = loaderData?.product;
    if (!p) {
      const fallback = params.slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      return {
        meta: [
          { title: `${fallback} | Floratta Express` },
          { name: "description", content: `Compre ${fallback} com entrega no mesmo dia.` },
          { property: "og:url", content: url },
          { property: "og:type", content: "product" },
        ],
        links: [{ rel: "canonical", href: url }],
      };
    }
    const price = Number(p.price).toFixed(2);
    const inStock = p.stock_unlimited || (p.stock_qty ?? 0) > 0;
    const img = resolveImage(p.images?.[0]);
    const imgAbs = img.startsWith("http") ? img : `${SITE_URL}${img}`;
    const desc = p.description || `Compre ${p.name} na Floratta Express. Entrega de flores no mesmo dia em todo o Brasil. Pagamento via PIX ou cartão.`;
    return {
      meta: [
        { title: `${p.name} — Comprar com Entrega Hoje | Floratta Express` },
        { name: "description", content: desc },
        { property: "og:title", content: `${p.name} — Floratta Express` },
        { property: "og:description", content: desc },
        { property: "og:type", content: "product" },
        { property: "og:url", content: url },
        { property: "og:image", content: imgAbs },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: imgAbs },
        { property: "product:availability", content: inStock ? "in stock" : "out of stock" },
        { property: "product:condition", content: "new" },
        { property: "product:price:amount", content: price },
        { property: "product:price:currency", content: "BRL" },
        { property: "product:brand", content: "Floratta Express" },
        { property: "product:retailer_item_id", content: p.id },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: ProductPage,
});

type CardOption = { id: string; title: string; subtitle: string };
const CARD_OPTIONS: CardOption[] = [
  { id: "none", title: "Sem cartão", subtitle: "Enviar sem mensagem" },
  { id: "amor", title: "Cartão Eu Te Amo", subtitle: "Mensagem romântica" },
  { id: "aniversario", title: "Cartão Feliz Aniversário", subtitle: "Parabéns especial" },
  { id: "agradecimento", title: "Cartão de Agradecimento", subtitle: "Obrigado(a) de coração" },
  { id: "melhoras", title: "Cartão de Melhoras", subtitle: "Desejando recuperação" },
];

type AddOn = { id: string; title: string; subtitle: string; price: number };
const ADDONS: AddOn[] = [
  { id: "ferrero", title: "Ferrero Rocher T8", subtitle: "Caixa com 8 bombons", price: 24.9 },
  { id: "lindt", title: "Chocolate Lindt", subtitle: "Barra premium 100g", price: 19.9 },
  { id: "urso", title: "Urso de Pelúcia", subtitle: "Pelúcia fofa 25cm", price: 29.9 },
  { id: "balao", title: "Balão Coração Metalizado", subtitle: "Balão metalizado vermelho", price: 14.9 },
  { id: "vela", title: "Vela Aromática", subtitle: "Perfumada e relaxante", price: 17.9 },
];

function ProductPage() {
  const { slug } = Route.useParams();
  const loc = useLocationStore((s) => s.location);
  const add = useCartStore((s) => s.add);
  const open = useCartStore((s) => s.open);
  const [qty, setQty] = useState(1);
  const [card, setCard] = useState("none");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [obs, setObs] = useState("");
  const [favorite, setFavorite] = useState(false);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      if (!data) throw notFound();
      return data;
    },
  });

  const { data: related } = useQuery({
    queryKey: ["related-bestsellers", product?.id],
    enabled: !!product,
    queryFn: async () => {
      const { data } = await supabase
        .from("products")
        .select("slug,name,price,original_price,images")
        .eq("active", true)
        .eq("featured", true)
        .gt("price", 0)
        .neq("id", product!.id)
        .limit(10);
      return data ?? [];
    },
  });

  // Deterministic rating display per product (4.5 – 4.9, count 800 – 2500)
  const ratingDisplay = useMemo(() => {
    if (!product) return { rating: "4.9", count: 1274 };
    let h = 0;
    for (let i = 0; i < product.id.length; i++) h = (h * 31 + product.id.charCodeAt(i)) >>> 0;
    const rating = (4.5 + (h % 5) * 0.1).toFixed(1);
    const count = 800 + (h % 1700);
    return { rating, count };
  }, [product]);

  const { data: reviews } = useQuery({
    queryKey: ["reviews", slug],
    queryFn: async () => {
      const { data } = await supabase
        .from("reviews")
        .select("*")
        .eq("approved", true)
        .order("created_at", { ascending: true })
        .limit(3);
      return data ?? [];
    },
  });

  const toggleAddon = (id: string) => {
    setSelectedAddons((cur) => {
      if (cur.includes(id)) return cur.filter((x) => x !== id);
      if (cur.length >= 3) {
        toast.message("Máximo de 3 complementos");
        return cur;
      }
      return [...cur, id];
    });
  };

  const addonsTotal = useMemo(
    () => ADDONS.filter((a) => selectedAddons.includes(a.id)).reduce((s, a) => s + a.price, 0),
    [selectedAddons],
  );

  if (isLoading || !product) {
    return (
      <div className="min-h-screen bg-cream">
        <div className="mx-auto max-w-2xl px-4 py-10">
          <div className="h-[420px] animate-pulse rounded-3xl bg-cream-dark" />
          <div className="mt-6 h-8 w-2/3 animate-pulse rounded bg-cream-dark" />
          <div className="mt-3 h-6 w-1/3 animate-pulse rounded bg-cream-dark" />
        </div>
      </div>
    );
  }

  const image = resolveImage(product.images?.[0]);
  const price = Number(product.price);
  const original = product.original_price ? Number(product.original_price) : null;
  const discountPct =
    original && original > price ? Math.round(((original - price) / original) * 100) : 0;
  const stockLeft = product.stock_unlimited ? 10 : Math.max(1, product.stock_qty ?? 0);
  const stockPct = Math.min(100, Math.max(15, (stockLeft / 30) * 100));

  const totalPrice = price * qty + addonsTotal;

  const handleAdd = () => {
    add(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: Number(product.price),
        imageKey: product.images?.[0] ?? "",
      },
      qty,
    );
    if (selectedAddons.length > 0) {
      const labels = ADDONS.filter((a) => selectedAddons.includes(a.id))
        .map((a) => a.title)
        .join(", ");
      toast.success(`Adicionado com: ${labels}`);
    } else {
      toast.success("Adicionado ao carrinho");
    }
    open();
  };

  const SITE = "https://exact-pixel-perfect-797.lovable.app";
  const productUrl = `${SITE}/produto/${product.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: product.name,
        description: product.description ?? `${product.name} — entrega de flores no mesmo dia em todo o Brasil.`,
        image: [image],
        sku: product.id,
        brand: { "@type": "Brand", name: "Floratta Express" },
        offers: {
          "@type": "Offer",
          url: productUrl,
          priceCurrency: "BRL",
          price: price.toFixed(2),
          availability: "https://schema.org/InStock",
          itemCondition: "https://schema.org/NewCondition",
          priceValidUntil: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
          shippingDetails: {
            "@type": "OfferShippingDetails",
            shippingRate: { "@type": "MonetaryAmount", value: "0", currency: "BRL" },
            shippingDestination: { "@type": "DefinedRegion", addressCountry: "BR" },
            deliveryTime: { "@type": "ShippingDeliveryTime", handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 1, unitCode: "HUR" }, transitTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 1, unitCode: "HUR" } },
          },
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: ratingDisplay.rating,
          reviewCount: ratingDisplay.count,
          bestRating: 5,
          worstRating: 1,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Início", item: SITE },
          { "@type": "ListItem", position: 2, name: "Catálogo", item: `${SITE}/catalogo` },
          { "@type": "ListItem", position: 3, name: product.name, item: productUrl },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-cream pb-28">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="w-full pt-4">
        {/* Top bar */}
        <div className="flex items-center justify-between rounded-2xl bg-card px-3 py-2.5 shadow-soft">
          <Link
            to="/"
            className="flex items-center gap-1 text-sm font-bold tracking-wide text-green-deep hover:opacity-80"
          >
            <ChevronLeft className="h-4 w-4" /> VOLTAR
          </Link>
          <button
            onClick={() => setFavorite((v) => !v)}
            aria-label="Favoritar"
            className="grid h-8 w-8 place-items-center rounded-full hover:bg-cream-dark"
          >
            <Heart
              className={`h-5 w-5 transition ${
                favorite ? "fill-blush text-blush" : "text-green-deep/60"
              }`}
            />
          </button>
        </div>

        {/* Image */}
        <div className="relative mt-3 overflow-hidden rounded-2xl bg-card">
          <img
            src={image}
            alt={product.name}
            fetchPriority="high"
            decoding="async"
            className="aspect-square w-full object-contain"
          />
          {discountPct > 0 && (
            <span className="absolute left-3 top-3 rounded-full bg-green-deep px-3 py-1 text-xs font-bold text-cream shadow-soft">
              {discountPct}% OFF
            </span>
          )}
          {product.featured && (
            <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-gold px-3 py-1 text-xs font-bold text-green-deep shadow-soft">
              <Star className="h-3 w-3 fill-current" /> MAIS VENDIDO
            </span>
          )}
        </div>

        {/* Title + price */}
        <section className="mt-3 rounded-2xl bg-card p-5 shadow-soft">
          <h1 className="font-display text-xl font-semibold text-green-deep md:text-2xl">
            {product.name}
          </h1>
          {product.description && (
            <p className="mt-1 text-sm text-muted-foreground">{product.description}</p>
          )}

          <div className="mt-4 flex items-end gap-2">
            {original && original > price && (
              <span className="text-sm text-muted-foreground">
                de <span className="line-through">{brl(original)}</span>
              </span>
            )}
            <span className="font-display text-3xl font-bold text-foreground">{brl(price)}</span>
          </div>

          {discountPct > 0 && (
            <div className="mt-2">
              <span className="inline-block rounded-full bg-green-mid px-3 py-1 text-xs font-bold text-cream">
                {discountPct}% OFF
              </span>
            </div>
          )}

          <div className="mt-4">
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-cream-dark">
              <div
                className="h-full rounded-full bg-green-mid"
                style={{ width: `${stockPct}%` }}
              />
            </div>
            <div className="mt-1 text-right text-xs text-muted-foreground">Restam {stockLeft}</div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3 border-t border-border pt-4 text-xs">
            <div className="flex items-center gap-1.5 text-green-deep">
              <Truck className="h-4 w-4 text-green-mid" />
              <span>Entrega grátis</span>
            </div>
            <div className="flex items-center gap-1.5 text-green-deep">
              <Clock className="h-4 w-4 text-gold" />
              <span>
                {loc ? `${loc.deliveryTimeMin}-${loc.deliveryTimeMax} min` : "30-50 min"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-green-deep">
              <ShieldCheck className="h-4 w-4 text-green-mid" />
              <span>Garantia</span>
            </div>
          </div>
        </section>

        {/* Cartão de Mensagem */}
        <section className="mt-3 rounded-2xl bg-card p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-green-deep">
              Cartão de Mensagem
            </h2>
            <span className="text-[10px] font-bold tracking-wider text-muted-foreground">
              OPCIONAL
            </span>
          </div>
          <div className="mt-3 space-y-2">
            {CARD_OPTIONS.map((opt) => {
              const active = card === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setCard(opt.id)}
                  className={`flex w-full items-center justify-between rounded-xl border-2 p-3 text-left transition ${
                    active
                      ? "border-green-deep bg-green-deep/5"
                      : "border-border bg-cream hover:border-green-sage/40"
                  }`}
                >
                  <div>
                    <div className="text-sm font-semibold text-green-deep">{opt.title}</div>
                    <div className="text-xs text-muted-foreground">{opt.subtitle}</div>
                  </div>
                  <span
                    className={`grid h-6 w-6 place-items-center rounded-full ${
                      active ? "bg-green-deep text-cream" : "bg-cream-dark text-transparent"
                    }`}
                  >
                    <Check className="h-4 w-4" />
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Complementos */}
        <section className="mt-3 rounded-2xl bg-card p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-green-deep">
              Complementos{" "}
              <span className="text-xs font-normal text-muted-foreground">(até 3)</span>
            </h2>
            <span className="text-[10px] font-bold tracking-wider text-muted-foreground">
              OPCIONAL
            </span>
          </div>
          <div className="mt-3 space-y-2">
            {ADDONS.map((a) => {
              const active = selectedAddons.includes(a.id);
              return (
                <button
                  key={a.id}
                  onClick={() => toggleAddon(a.id)}
                  className={`flex w-full items-center justify-between rounded-xl border-2 p-3 text-left transition ${
                    active
                      ? "border-green-deep bg-green-deep/5"
                      : "border-border bg-cream hover:border-green-sage/40"
                  }`}
                >
                  <div>
                    <div className="text-sm font-semibold text-green-deep">{a.title}</div>
                    <div className="text-xs text-muted-foreground">{a.subtitle}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-green-deep">+ {brl(a.price)}</span>
                    <span
                      className={`grid h-6 w-6 place-items-center rounded-full ${
                        active ? "bg-green-deep text-cream" : "bg-cream-dark text-green-deep"
                      }`}
                    >
                      {active ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Observações */}
        <section className="mt-3 rounded-2xl bg-card p-5 shadow-soft">
          <h2 className="font-display text-lg font-semibold text-green-deep">Observações</h2>
          <textarea
            value={obs}
            onChange={(e) => setObs(e.target.value)}
            maxLength={250}
            rows={3}
            placeholder="Alguma observação para a entrega? (ex.: deixar com porteiro)"
            className="mt-3 w-full rounded-xl border border-border bg-cream p-3 text-sm outline-none focus:border-green-mid"
          />
          <div className="mt-1 text-right text-[11px] text-muted-foreground">{obs.length}/250</div>
        </section>

        {/* Avaliações */}
        <section className="mt-3 rounded-2xl bg-card p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-green-deep">Avaliações</h2>
            <div className="flex items-center gap-1 text-sm">
              <span className="flex text-star">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </span>
              <span className="font-semibold text-green-deep">{ratingDisplay.rating}</span>
              <span className="text-muted-foreground">({ratingDisplay.count})</span>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {(reviews ?? []).map((r) => (
              <div
                key={r.id}
                className="flex gap-3 rounded-2xl border border-border bg-cream p-3 shadow-soft"
              >
                {r.image_url ? (
                  <img
                    src={r.image_url}
                    alt={r.buyer_name}
                    loading="lazy"
                    className="h-14 w-14 shrink-0 rounded-xl object-cover"
                    onError={(e) => {
                      const el = e.currentTarget as HTMLImageElement;
                      el.style.display = "none";
                      el.nextElementSibling?.classList.remove("hidden");
                    }}
                  />
                ) : null}
                <div
                  className={`${r.image_url ? "hidden " : ""}grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-cream-dark text-base font-bold text-green-deep`}
                >
                  {r.buyer_name?.[0] ?? "C"}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-green-deep">
                      {r.buyer_name}
                    </span>
                    <BadgeCheck className="h-4 w-4 fill-green-mid text-cream" />
                  </div>
                  <span className="mt-0.5 flex text-star">
                    {Array.from({ length: r.rating ?? 5 }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-current" />
                    ))}
                  </span>
                  <p className="mt-1 text-xs leading-snug text-foreground/80">
                    {r.comment}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Você também pode gostar — carrossel de mais vendidos */}
        {related && related.length > 0 && (
          <section className="mt-3 rounded-2xl bg-card p-5 shadow-soft">
            <div className="mb-3">
              <h2 className="font-display text-lg font-semibold text-green-deep">
                Você também pode gostar
              </h2>
            </div>
            <div className="-mx-5 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex snap-x snap-mandatory gap-3">
                {related.map((p) => {
                  const orig = p.original_price ? Number(p.original_price) : null;
                  const pct = orig && orig > Number(p.price)
                    ? Math.round(((orig - Number(p.price)) / orig) * 100)
                    : 0;
                  return (
                    <Link
                      key={p.slug}
                      to="/produto/$slug"
                      params={{ slug: p.slug }}
                      className="group relative w-[150px] shrink-0 snap-start overflow-hidden rounded-xl border border-border bg-cream transition hover:shadow-soft"
                    >
                      {pct > 0 && (
                        <span className="absolute left-2 top-2 z-10 rounded-full bg-green-deep px-2 py-0.5 text-[10px] font-bold text-cream">
                          {pct}% OFF
                        </span>
                      )}
                      <img
                        src={resolveImage(p.images?.[0])}
                        alt={p.name}
                        loading="lazy"
                        decoding="async"
                        className="aspect-square w-full object-cover transition group-hover:scale-105"
                      />
                      <div className="p-2.5">
                        <div className="line-clamp-2 text-xs font-medium text-green-deep">{p.name}</div>
                        <div className="mt-1 flex items-baseline gap-1">
                          {orig && orig > Number(p.price) && (
                            <span className="text-[10px] text-muted-foreground line-through">{brl(orig)}</span>
                          )}
                          <span className="text-sm font-bold text-green-deep">{brl(Number(p.price))}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Sticky CTA */}
      <div className="fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-40 border-t border-border bg-card px-3 py-2 shadow-float">
        <div className="mx-auto max-w-2xl">
          <button
            onClick={handleAdd}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-deep py-3 text-sm font-bold text-cream shadow-soft transition hover:opacity-90"
          >
            <span>🌸</span>
            <span>Adicionar ao carrinho • {brl(totalPrice)}</span>
          </button>
        </div>
      </div>

      <div className="hidden">
        <Footer />
      </div>
    </div>
  );
}
