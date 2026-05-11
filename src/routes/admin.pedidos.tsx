import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { brl } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/pedidos")({ component: AdminOrders });

const STATUS = [
  { key: "new", label: "Novo" },
  { key: "preparing", label: "Preparando" },
  { key: "out_for_delivery", label: "Saiu p/ entrega" },
  { key: "delivered", label: "Entregue" },
  { key: "cancelled", label: "Cancelado" },
];

type Order = {
  id: string; order_number: string; buyer_name: string; recipient_name: string;
  address_city: string; address_state: string; total: number; status: string; created_at: string;
};

function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<string>("");

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("orders").select("id, order_number, buyer_name, recipient_name, address_city, address_state, total, status, created_at").order("created_at", { ascending: false });
      setOrders((data ?? []) as Order[]);
    };
    load();
    const ch = supabase.channel("orders-live").on("postgres_changes", { event: "INSERT", schema: "public", table: "orders" }, (p) => {
      toast.success("🛎️ Novo pedido recebido!", { description: (p.new as Order).order_number });
      load();
    }).on("postgres_changes", { event: "UPDATE", schema: "public", table: "orders" }, load).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) toast.error("Erro ao atualizar"); else toast.success("Status atualizado");
  };

  const filtered = filter ? orders.filter((o) => o.status === filter) : orders;

  return (
    <div>
      <h1 className="font-display text-3xl text-green-deep">Pedidos</h1>
      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={() => setFilter("")} className={`rounded-full px-3 py-1 text-xs ${filter === "" ? "bg-green-deep text-cream" : "bg-cream-dark"}`}>Todos</button>
        {STATUS.map((s) => (
          <button key={s.key} onClick={() => setFilter(s.key)} className={`rounded-full px-3 py-1 text-xs ${filter === s.key ? "bg-green-deep text-cream" : "bg-cream-dark"}`}>{s.label}</button>
        ))}
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-cream-dark text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Pedido</th><th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Cidade</th><th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th><th className="px-4 py-3">Data</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} className="border-t border-border">
                <td className="px-4 py-3 font-mono text-xs">{o.order_number}</td>
                <td className="px-4 py-3">{o.buyer_name} → {o.recipient_name}</td>
                <td className="px-4 py-3">{o.address_city}/{o.address_state}</td>
                <td className="px-4 py-3 font-medium">{brl(Number(o.total))}</td>
                <td className="px-4 py-3">
                  <select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value)}
                    className="rounded-full border border-border bg-cream px-2 py-1 text-xs">
                    {STATUS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
                  </select>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString("pt-BR")}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="py-10 text-center text-muted-foreground">Nenhum pedido</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
