import { Link } from "@tanstack/react-router";
import { MapPin, Search, ShoppingBag, Menu, Flower2 } from "lucide-react";
import { useLocationStore } from "@/stores/location";
import { useCartStore, cartCount } from "@/stores/cart";
import { openLocationModal } from "./LocationGate";

export function ContextBar() {
  const loc = useLocationStore((s) => s.location);
  if (!loc) return null;
  return (
    <div className="bg-green-deep text-cream">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-1.5 text-[12px] tracking-wide">
        <span className="truncate">
          🌿 Entrega hoje em <strong>{loc.city}/{loc.state}</strong> · Aberto agora · ⏱{" "}
          {loc.deliveryTimeMin}–{loc.deliveryTimeMax}min
        </span>
        <span className="hidden sm:inline">⭐ 4,9 (2.847 avaliações)</span>
      </div>
    </div>
  );
}

export function Header() {
  const loc = useLocationStore((s) => s.location);
  const items = useCartStore((s) => s.items);
  const openCart = useCartStore((s) => s.open);
  const count = cartCount(items);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-cream/85 backdrop-blur-md">
      <ContextBar />
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4">
        <Link to="/" className="flex items-center gap-2 text-green-deep">
          <Flower2 className="h-6 w-6" />
          <span className="font-display text-2xl">Flora Luxe</span>
        </Link>

        <nav className="ml-6 hidden items-center gap-6 text-sm md:flex">
          <Link to="/" className="hover:text-green-mid" activeOptions={{ exact: true }}>
            Loja
          </Link>
          <Link to="/carrinho" className="hover:text-green-mid">
            Carrinho
          </Link>
        </nav>

        <div className="ml-auto hidden flex-1 max-w-md md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Buscar buquês, ocasiões..."
              className="w-full rounded-full border border-border bg-cream-dark/60 py-2 pl-10 pr-4 text-sm outline-none transition focus:border-green-mid focus:bg-cream"
            />
          </div>
        </div>

        <button
          onClick={openLocationModal}
          className="hidden items-center gap-1.5 rounded-full border border-green-sage/40 bg-cream-dark px-3 py-1.5 text-xs text-green-deep transition hover:border-green-mid sm:flex"
        >
          <MapPin className="h-3.5 w-3.5" />
          {loc ? `${loc.city}/${loc.state}` : "Escolher cidade"}
        </button>

        <button
          onClick={openCart}
          aria-label="Abrir carrinho"
          className="relative inline-flex items-center justify-center rounded-full bg-green-deep p-2.5 text-cream transition hover:bg-green-mid"
        >
          <ShoppingBag className="h-5 w-5" />
          {count > 0 && (
            <span className="absolute -right-1 -top-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[11px] font-bold text-green-deep">
              {count}
            </span>
          )}
        </button>

        <Link
          to="/login"
          className="hidden rounded-full border border-border px-3 py-1.5 text-xs hover:border-green-mid md:inline-flex"
        >
          Entrar
        </Link>

        <button aria-label="Menu" className="md:hidden">
          <Menu className="h-6 w-6 text-green-deep" />
        </button>
      </div>
    </header>
  );
}
