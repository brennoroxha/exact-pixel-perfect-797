import { createFileRoute, useNavigate, Link, Outlet } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LayoutDashboard, ShoppingBag, Package, MapPin, Tag, Star, LogOut, Flower2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Flora Luxe" }] }),
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let active = true;
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate({ to: "/login" });
        return;
      }
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id);
      if (!active) return;
      const admin = (data ?? []).some((r: { role: string }) => r.role === "admin");
      setIsAdmin(admin);
      setReady(true);
      if (!admin) toast.error("Você precisa de permissão de admin para acessar.");
    };
    check();
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) navigate({ to: "/login" });
    });
    return () => { active = false; sub.subscription.unsubscribe(); };
  }, [navigate]);

  if (!ready) {
    return <div className="grid min-h-screen place-items-center text-muted-foreground">Verificando...</div>;
  }
  if (!isAdmin) {
    return (
      <div className="grid min-h-screen place-items-center px-4 text-center">
        <div>
          <h1 className="font-display text-2xl text-green-deep">Acesso restrito</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sua conta não tem permissão de administrador.<br />
            Peça a um admin para conceder o papel <code>admin</code> no banco.
          </p>
          <button onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/login" }); }}
            className="mt-4 rounded-full bg-green-deep px-5 py-2 text-sm text-cream">Sair</button>
        </div>
      </div>
    );
  }

  const nav: { to: "/admin" | "/admin/pedidos" | "/admin/produtos" | "/admin/cidades" | "/admin/cupons" | "/admin/avaliacoes"; label: string; icon: typeof LayoutDashboard; exact?: boolean }[] = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { to: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag },
    { to: "/admin/produtos", label: "Produtos", icon: Package },
    { to: "/admin/cidades", label: "Cidades", icon: MapPin },
    { to: "/admin/cupons", label: "Cupons", icon: Tag },
    { to: "/admin/avaliacoes", label: "Avaliações", icon: Star },
  ];

  return (
    <div className="grid min-h-screen bg-background md:grid-cols-[240px_1fr]">
      <aside className="border-r border-border bg-green-deep p-6 text-cream">
        <Link to="/" className="mb-8 flex items-center gap-2">
          <Flower2 className="h-5 w-5" /> <span className="font-display text-xl">Flora Luxe</span>
        </Link>
        <nav className="space-y-1">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.exact }}
              activeProps={{ className: "bg-cream/15" }}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-cream/85 hover:bg-cream/10"
            >
              <n.icon className="h-4 w-4" /> {n.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/login" }); }}
          className="mt-8 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-cream/70 hover:text-cream"
        >
          <LogOut className="h-4 w-4" /> Sair
        </button>
      </aside>
      <main className="p-8">
        <Outlet />
      </main>
    </div>
  );
}
