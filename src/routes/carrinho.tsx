import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, CreditCard, Plus, Tag, Trash2 } from "lucide-react";
import { Footer } from "@/components/Footer";
import { cartSubtotal, useCartStore } from "@/stores/cart";
import { useLocationStore } from "@/stores/location";
import { resolveImage } from "@/lib/product-images";
import { brl } from "@/lib/format";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/carrinho")({
  head: () => ({ meta: [{ title: "Seu Carrinho — Flor Express" }] }),
  component: CartPage,
});

type SuggestProduct = {
  id: string;
  slug: string;
  name: string;
  price: number;
  original_price: number | null;
  images: string[];
};

function CartPage() {
  const { items, setQty, remove, add } = useCartStore();
  const loc = useLocationStore((s) => s.location);
  const subtotal = cartSubtotal(items);
  const fee = loc?.deliveryFee ?? 14.9;
  const freeMin = loc?.freeShippingMin ?? 200;
  const shipping = subtotal >= freeMin ? 0 : fee;
  const total = subtotal + shipping;
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);

  const suggestQ = useQuery({
    queryKey: ["cart-suggestions"],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const { data } = await supabase
        .from("products")
        .select("id,slug,name,price,original_price,images")
        .eq("active", true)
        .gt("price", 0)
        .order("featured", { ascending: false });
      return (data ?? []) as SuggestProduct[];
    },
  });

  const inCart = new Set(items.map((i) => i.slug));
  const suggestions = (suggestQ.data ?? []).filter((p) => !inCart.has(p.slug));

  return (
    <div className="min-h-screen bg-background">
      {/* Topo */}
      <header className="sticky top-0 z-30 border-b border-border bg-cream/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <Link to="/" className="rounded-full p-2 text-green-deep hover:bg-blush/40">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="font-display text-lg text-green-deep">Seu Carrinho</h1>
          <div className="grid h-8 w-8 place-items-center rounded-full bg-green-deep text-xs font-semibold text-cream">
            {totalItems}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 pb-20 pt-4">
        {items.length === 0 ? (
          <div className="mt-10 rounded-3xl bg-cream-dark/60 p-12 text-center">
            <p className="text-muted-foreground">Seu carrinho está vazio.</p>
            <Link to="/" className="mt-4 inline-block rounded-full bg-green-deep px-6 py-3 text-sm text-cream">
              Ver buquês
            </Link>
          </div>
        ) : (
          <>
            {/* Itens */}
            <ul className="space-y-3">
              {items.map((it) => (
                <li key={it.slug} className="rounded-2xl bg-card p-3 shadow-soft">
                  <div className="flex gap-3">
                    <img
                      src={resolveImage(it.imageKey)}
                      alt={it.name}
                      className="h-16 w-16 shrink-0 rounded-xl object-cover"
                    />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <h3 className="font-display text-sm text-green-deep line-clamp-2">{it.name}</h3>
                      <div className="mt-1 font-display text-base font-semibold text-foreground">
                        {brl(it.price)}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="inline-flex items-center gap-3">
                      <button
                        onClick={() => setQty(it.slug, it.quantity - 1)}
                        className="grid h-8 w-8 place-items-center rounded-full border border-border text-green-deep"
                      >
                        −
                      </button>
                      <span className="min-w-[1.5rem] text-center text-sm font-semibold">{it.quantity}</span>
                      <button
                        onClick={() => setQty(it.slug, it.quantity + 1)}
                        className="grid h-8 w-8 place-items-center rounded-full border border-border text-green-deep"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => remove(it.slug)}
                      className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground hover:bg-blush/40 hover:text-destructive"
                      aria-label="Remover"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {/* Resumo */}
            <div className="mt-4 rounded-2xl bg-blush/50 p-5 text-sm">
              <div className="flex justify-between text-foreground/80">
                <span>Subtotal</span>
                <span>{brl(subtotal)}</span>
              </div>
              <div className="mt-2 flex justify-between text-foreground/80">
                <span>Entrega</span>
                <span className={shipping === 0 ? "font-semibold text-green-mid" : ""}>
                  {shipping === 0 ? "Grátis" : brl(shipping)}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-green-deep/15 pt-3">
                <span className="font-display text-base text-green-deep">Total</span>
                <span className="font-display text-xl font-bold text-green-deep">{brl(total)}</span>
              </div>
            </div>

            {/* CTA */}
            <Link
              to="/checkout"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-green-deep py-4 text-sm font-semibold text-cream shadow-soft transition hover:bg-green-mid"
            >
              <CreditCard className="h-4 w-4" />
              Finalizar Pedido
            </Link>

            {/* Complete seu pedido */}
            {suggestions.length > 0 && (
              <section className="mt-8">
                <h2 className="mb-3 flex items-center gap-2 font-display text-base text-green-deep">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-green-mid text-cream">
                    <Plus className="h-3.5 w-3.5" />
                  </span>
                  Complete seu pedido
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {suggestions.map((p) => {
                    const discount =
                      p.original_price && p.original_price > p.price
                        ? Math.round(((p.original_price - p.price) / p.original_price) * 100)
                        : 0;
                    return (
                      <article
                        key={p.id}
                        className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
                      >
                        <Link
                          to="/produto/$slug"
                          params={{ slug: p.slug }}
                          className="relative block aspect-square overflow-hidden bg-cream-dark"
                        >
                          <img
                            src={resolveImage(p.images[0])}
                            alt={p.name}
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                          {discount > 0 && (
                            <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-green-deep px-2 py-0.5 text-[10px] font-bold text-cream">
                              <Tag className="h-3 w-3" />
                              PROMO
                            </span>
                          )}
                        </Link>
                        <div className="p-3">
                          <h3 className="font-display text-xs text-green-deep line-clamp-2">{p.name}</h3>
                          <div className="mt-1 flex items-baseline gap-1.5">
                            <span className="font-display text-sm font-bold text-foreground">{brl(p.price)}</span>
                            {p.original_price && p.original_price > p.price && (
                              <span className="text-[10px] text-muted-foreground line-through">
                                {brl(p.original_price)}
                              </span>
                            )}
                          </div>
                          <button
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
                            className="mt-2 inline-flex w-full items-center justify-center gap-1 rounded-full bg-green-deep py-2 text-[11px] font-semibold text-cream transition hover:bg-green-mid"
                          >
                            <Plus className="h-3 w-3" /> Adicionar
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
