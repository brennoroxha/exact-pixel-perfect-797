import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/cupons")({ component: AdminCoupons });

function AdminCoupons() {
  const [coupons, setCoupons] = useState<{ id: string; code: string; type: string; value: number; active: boolean; first_order_only: boolean }[]>([]);
  useEffect(() => {
    supabase.from("coupons").select("*").then(({ data }) => setCoupons(data ?? []));
  }, []);
  return (
    <div>
      <h1 className="font-display text-3xl text-green-deep">Cupons</h1>
      <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {coupons.map((c) => (
          <div key={c.id} className="rounded-2xl bg-card p-4 shadow-soft">
            <div className="font-mono font-bold text-green-deep">{c.code}</div>
            <div className="text-sm text-muted-foreground">{c.type} {c.value > 0 && `· ${c.value}${c.type === "percent" ? "%" : ""}`}</div>
            <div className="mt-1 text-xs">{c.first_order_only ? "1º pedido apenas" : "Todos"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
