import { AnimatePresence, motion } from "framer-motion";
import { X, Trash2, ShoppingBag, Tag } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cartSubtotal, useCartStore } from "@/stores/cart";
import { useLocationStore } from "@/stores/location";
import { resolveImage } from "@/lib/product-images";
import { brl } from "@/lib/format";

export function CartDrawer() {
  const { items, isOpen, close, setQty, remove } = useCartStore();
  const loc = useLocationStore((s) => s.location);
  const subtotal = cartSubtotal(items);
  const freeMin = loc?.freeShippingMin ?? 200;
  const remaining = Math.max(0, freeMin - subtotal);
  const progress = Math.min(100, (subtotal / freeMin) * 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-50 bg-charcoal/50 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-cream shadow-float"
          >
            <header className="flex items-center justify-between border-b border-border px-6 py-5">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-green-deep" />
                <h2 className="font-display text-xl text-green-deep">Seu carrinho</h2>
              </div>
              <button onClick={close} aria-label="Fechar"><X className="h-5 w-5" /></button>
            </header>

            <div className="border-b border-border bg-cream-dark/50 px-6 py-3 text-xs">
              {remaining > 0 ? (
                <p className="text-green-deep">
                  Faltam <strong>{brl(remaining)}</strong> para frete grátis 🎁
                </p>
              ) : (
                <p className="font-medium text-green-mid">🎉 Você ganhou frete grátis!</p>
              )}
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-cream">
                <div
                  className="h-full rounded-full bg-green-mid transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                  <ShoppingBag className="h-10 w-10 text-muted-foreground" />
                  <p className="text-muted-foreground">Seu carrinho está vazio</p>
                  <button
                    onClick={close}
                    className="mt-2 rounded-full bg-green-deep px-5 py-2 text-sm text-cream"
                  >
                    Ver buquês
                  </button>
                </div>
              ) : (
                <ul className="space-y-4">
                  {items.map((it) => (
                    <li key={it.slug} className="flex gap-3">
                      <img
                        src={resolveImage(it.imageKey)}
                        alt={it.name}
                        className="h-20 w-20 rounded-xl object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="line-clamp-2 text-sm font-medium text-green-deep">
                          {it.name}
                        </h3>
                        <div className="mt-1 text-sm text-muted-foreground">{brl(it.price)}</div>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="inline-flex items-center rounded-full border border-border bg-cream">
                            <button
                              onClick={() => setQty(it.slug, it.quantity - 1)}
                              className="px-2.5 py-1 text-sm"
                              aria-label="Diminuir"
                            >−</button>
                            <span className="w-6 text-center text-sm">{it.quantity}</span>
                            <button
                              onClick={() => setQty(it.slug, it.quantity + 1)}
                              className="px-2.5 py-1 text-sm"
                              aria-label="Aumentar"
                            >+</button>
                          </div>
                          <button
                            onClick={() => remove(it.slug)}
                            aria-label="Remover"
                            className="ml-auto text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <footer className="space-y-3 border-t border-border px-6 py-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{brl(subtotal)}</span>
                </div>
                <Link
                  to="/checkout"
                  onClick={close}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-green-deep py-3.5 text-cream transition hover:bg-green-mid"
                >
                  Finalizar pedido →
                </Link>
                <Link
                  to="/carrinho"
                  onClick={close}
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-border py-2 text-xs text-green-deep hover:border-green-mid"
                >
                  <Tag className="h-3 w-3" /> Ver carrinho completo
                </Link>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
