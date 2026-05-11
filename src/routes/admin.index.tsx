import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { brl } from "@/lib/format";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const [metrics, setMetrics] = useState({ today: 0, pending: 0, revenue: 0, total: 0 });

  useEffect(() => {
    const load = async () => {
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const { data } = await supabase.from("orders").select("total, status, created_at");
      const orders = data ?? [];
      const todayOrders = orders.filter((o) => new Date(o.created_at) >= today);
      setMetrics({
        today: todayOrders.length,
        pending: orders.filter((o) => ["new", "preparing"].includes(o.status)).length,
        revenue: todayOrders.reduce((a, o) => a + Number(o.total), 0),
        total: orders.length,
      });
    };
    load();
    const ch = supabase.channel("admin-orders").on("postgres_changes", { event: "*", schema: "public", table: "orders" }, load).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const cards = [
    { label: "Pedidos hoje", value: metrics.today },
    { label: "Receita hoje", value: brl(metrics.revenue) },
    { label: "Pendentes", value: metrics.pending },
    { label: "Total de pedidos", value: metrics.total },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl text-green-deep">Dashboard</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl bg-card p-6 shadow-soft">
            <div className="text-xs text-muted-foreground">{c.label}</div>
            <div className="mt-2 font-display text-2xl text-green-deep">{c.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
