import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { cartSubtotal, useCartStore } from "@/stores/cart";
import { useLocationStore } from "@/stores/location";
import { resolveImage } from "@/lib/product-images";
import { brl } from "@/lib/format";

export const Route = createFileRoute("/carrinho")({
  head: () => ({ meta: [{ title: "Carrinho — Flora Luxe" }] }),
  component: CartPage,
});

function CartPage() {
  const { items, setQty, remove } = useCartStore();
  const loc = useLocationStore((s) => s.location);
  const subtotal = cartSubtotal(items);
  const fee = loc?.deliveryFee ?? 14.9;
  const freeMin = loc?.freeShippingMin ?? 200;
  const shipping = subtotal >= freeMin ? 0 : fee;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="font-display text-4xl text-green-deep">Seu carrinho</h1>

        {items.length === 0 ? (
          <div className="mt-10 rounded-3xl bg-cream-dark/60 p-16 text-center">
            <p className="text-muted-foreground">Seu carrinho está vazio.</p>
            <Link to="/" className="mt-4 inline-block rounded-full bg-green-deep px-6 py-3 text-sm text-cream">
              Ver buquês
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 md:grid-cols-[1fr_360px]">
            <ul className="space-y-4">
              {items.map((it) => (
                <li key={it.slug} className="flex gap-4 rounded-2xl bg-card p-4 shadow-soft">
                  <img src={resolveImage(it.imageKey)} alt={it.name} className="h-24 w-24 rounded-xl object-cover" />
                  <div className="flex-1">
                    <h3 className="font-display text-lg text-green-deep">{it.name}</h3>
                    <div className="text-sm text-muted-foreground">{brl(it.price)}</div>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="inline-flex items-center rounded-full border border-border">
                        <button onClick={() => setQty(it.slug, it.quantity - 1)} className="px-3 py-1">−</button>
                        <span className="w-8 text-center text-sm">{it.quantity}</span>
                        <button onClick={() => setQty(it.slug, it.quantity + 1)} className="px-3 py-1">+</button>
                      </div>
                      <button onClick={() => remove(it.slug)} className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <span className="ml-auto font-display text-lg text-green-deep">
                        {brl(it.price * it.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <aside className="h-fit space-y-4 rounded-2xl bg-cream-dark p-6">
              <h2 className="font-display text-xl text-green-deep">Resumo</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Subtotal</span><span>{brl(subtotal)}</span></div>
                <div className="flex justify-between"><span>Frete</span><span>{shipping === 0 ? "Grátis 🎁" : brl(shipping)}</span></div>
                <div className="flex justify-between border-t border-border pt-2 font-display text-lg text-green-deep">
                  <span>Total</span><span>{brl(total)}</span>
                </div>
              </div>
              <Link to="/checkout" className="block rounded-full bg-green-deep py-3.5 text-center text-cream hover:bg-green-mid">
                Finalizar pedido →
              </Link>
            </aside>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
