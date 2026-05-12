import { Link, useLocation } from "@tanstack/react-router";
import { Home, Search, ShoppingBag, User } from "lucide-react";
import { useCartStore } from "@/stores/cart";

export function BottomNav() {
  const { pathname } = useLocation();
  const items = useCartStore((s) => s.items);
  const open = useCartStore((s) => s.open);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  const isActive = (path: string, exact = false) =>
    exact ? pathname === path : pathname === path || pathname.startsWith(path + "/");

  const base =
    "flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-medium transition";
  const active = "text-green-deep";
  const idle = "text-foreground/50 hover:text-green-deep";

  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card pb-[env(safe-area-inset-bottom)] shadow-float"
    >
      <div className="mx-auto flex max-w-2xl items-stretch">
        <Link to="/" className={`${base} ${isActive("/", true) ? active : idle}`}>
          <Home className="h-5 w-5" />
          <span>Início</span>
        </Link>
        <Link to="/catalogo" className={`${base} ${isActive("/catalogo") ? active : idle}`}>
          <Search className="h-5 w-5" />
          <span>Buscar</span>
        </Link>
        <button
          type="button"
          onClick={open}
          className={`${base} ${idle} relative`}
          aria-label="Abrir carrinho"
        >
          <span className="relative">
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-2 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-green-deep px-1 text-[10px] font-bold text-cream">
                {count}
              </span>
            )}
          </span>
          <span>Carrinho</span>
        </button>
        <Link to="/login" className={`${base} ${isActive("/login") ? active : idle}`}>
          <User className="h-5 w-5" />
          <span>Conta</span>
        </Link>
      </div>
    </nav>
  );
}
