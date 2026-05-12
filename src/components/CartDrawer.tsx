import { ArrowLeft, Trash2, Plus, CreditCard } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { cartSubtotal, useCartStore } from "@/stores/cart";
import { useLocationStore } from "@/stores/location";
import { supabase } from "@/integrations/supabase/client";
import { resolveImage } from "@/lib/product-images";
import { brl } from "@/lib/format";
import { toast } from "sonner";

type SuggestProduct = {
  id: string;
  slug: string;
  name: string;
  price: number;
  original_price: number | null;
  images: string[];
};

export function CartDrawer() {
  const { items, isOpen, close, setQty, remove, add } = useCartStore();
  const loc = useLocationStore((s) => s.location);
  const subtotal = cartSubtotal(items);
  const fee = loc?.deliveryFee ?? 14.9;
  const freeMin = loc?.freeShippingMin ?? 200;
  const shipping = subtotal >= freeMin ? 0 : fee;
  const total = subtotal + shipping;
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);

  const suggestQ = useQuery({
    queryKey: ["cart-drawer-suggestions"],
    staleTime: 5 * 60 * 1000,
    enabled: isOpen,
    queryFn: async () => {
      const { data } = await supabase
        .from("products")
        .select("id,slug,name,price,original_price,images")
        .eq("active", true)
        .gt("price", 0)
        .order("featured", { ascending: false })
        .limit(20);
      return (data ?? []) as SuggestProduct[];
    },
  });

  const inCart = new Set(items.map((i) => i.slug));
  const suggestions = (suggestQ.data ?? []).filter((p) => !inCart.has(p.slug)).slice(0, 8);

  if (!isOpen) return null;

  return (
    <>
      <div
        onClick={close}
        className="fixed inset-0 z-50 bg-charcoal/50 backdrop-blur-sm animate-in fade-in duration-150"
      />
      <aside className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-cream shadow-float animate-in slide-in-from-right duration-200">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-border/60 bg-cream px-4 py-4">
          <button onClick={close} aria-label="Voltar" className="rounded-full p-1 text-charcoal">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="font-display text-base font-semibold text-charcoal">Seu Carrinho</h2>
          <div className="grid h-7 w-7 place-items-center rounded-full bg-green-deep text-xs font-semibold text-cream">
            {totalItems}
          </div>
        </header>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <p className="text-muted-foreground">Seu carrinho está vazio</p>
              <button
                onClick={close}
                className="mt-2 rounded-full bg-green-deep px-5 py-2 text-sm text-cream"
              >
                Ver buquês
              </button>
            </div>
          ) : (
            <>
              {/* Items */}
              <ul className="space-y-3">
                {items.map((it) => (
                  <li
                    key={it.slug}
                    className="rounded-2xl border border-border/70 bg-card p-3 shadow-soft"
                  >
                    <div className="flex gap-3">
                      <img
                        src={resolveImage(it.imageKey)}
                        alt={it.name}
                        className="h-20 w-20 shrink-0 rounded-xl object-cover"
                      />
                      <div className="flex flex-1 flex-col">
                        <h3 className="line-clamp-2 text-sm font-medium text-charcoal">
                          {it.name}
                        </h3>
                        <div className="mt-1 font-display text-base font-semibold text-green-deep">
                          {brl(it.price)}
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="inline-flex items-center gap-3">
                            <button
                              onClick={() => setQty(it.slug, it.quantity - 1)}
                              aria-label="Diminuir"
                              className="grid h-7 w-7 place-items-center rounded-full border border-border text-charcoal"
                            >
                              −
                            </button>
                            <span className="w-4 text-center text-sm font-semibold">
                              {it.quantity}
                            </span>
                            <button
                              onClick={() => setQty(it.slug, it.quantity + 1)}
                              aria-label="Aumentar"
                              className="grid h-7 w-7 place-items-center rounded-full border border-border text-charcoal"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => remove(it.slug)}
                            aria-label="Remover"
                            className="grid h-8 w-8 place-items-center rounded-full text-charcoal/70 hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Summary */}
              <div className="mt-4 rounded-2xl bg-cream-dark px-4 py-4 text-sm">
                <div className="flex items-center justify-between text-charcoal/70">
                  <span>Subtotal</span>
                  <span>{brl(subtotal)}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-charcoal/70">
                  <span>Entrega</span>
                  <span className={shipping === 0 ? "font-semibold text-green-mid" : ""}>
                    {shipping === 0 ? "Grátis" : brl(shipping)}
                  </span>
                </div>
                <div className="mt-3 border-t border-charcoal/10 pt-3 flex items-center justify-between">
                  <span className="font-semibold text-charcoal">Total</span>
                  <span className="font-display text-xl font-bold text-green-deep">{brl(total)}</span>
                </div>
              </div>

              {/* CTA */}
              <Link
                to="/checkout"
                onClick={close}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-green-deep py-4 font-semibold text-cream shadow-soft transition hover:bg-green-deep-soft"
              >
                <CreditCard className="h-5 w-5" />
                Finalizar Pedido
              </Link>

              {/* Suggestions */}
              {suggestions.length > 0 && (
                <section className="mt-6">
                  <h3 className="mb-3 flex items-center gap-2 font-semibold text-charcoal">
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-green-mid text-cream">
                      <Plus className="h-4 w-4" />
                    </span>
                    Complete seu pedido
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {suggestions.map((p) => {
                      const promo =
                        p.original_price && p.original_price > p.price
                          ? Math.round(((p.original_price - p.price) / p.original_price) * 100)
                          : 0;
                      return (
                        <article
                          key={p.id}
                          className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-soft"
                        >
                          <Link
                            to="/produto/$slug"
                            params={{ slug: p.slug }}
                            onClick={close}
                            className="relative block aspect-square overflow-hidden bg-cream-dark"
                          >
                            <img
                              src={resolveImage(p.images?.[0])}
                              alt={p.name}
                              loading="lazy"
                              className="h-full w-full object-cover"
                            />
                            {promo > 0 && (
                              <span className="absolute right-2 top-2 rounded-md bg-green-deep px-2 py-0.5 text-[10px] font-bold tracking-wide text-cream">
                                PROMO
                              </span>
                            )}
                          </Link>
                          <div className="p-3">
                            <h4 className="line-clamp-2 text-xs font-medium text-charcoal min-h-[2.5rem]">
                              {p.name}
                            </h4>
                            <div className="mt-1 flex items-baseline gap-1.5">
                              <span className="font-display text-sm font-semibold text-green-deep">
                                {brl(Number(p.price))}
                              </span>
                              {p.original_price && p.original_price > p.price && (
                                <span className="text-[10px] text-muted-foreground line-through">
                                  {brl(Number(p.original_price))}
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
                                  imageKey: p.images?.[0] ?? "",
                                });
                                toast.success("Adicionado ao carrinho", { description: p.name });
                              }}
                              className="mt-2 inline-flex w-full items-center justify-center gap-1 rounded-full bg-green-deep px-2 py-1.5 text-[11px] font-semibold text-cream transition hover:bg-green-deep-soft"
                            >
                              <Plus className="h-3.5 w-3.5" /> Adicionar
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
      </aside>
    </>
  );
}
