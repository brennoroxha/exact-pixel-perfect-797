import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { brl } from "@/lib/format";

export const Route = createFileRoute("/admin/cidades")({ component: AdminCities });

function AdminCities() {
  const [cities, setCities] = useState<{ id: string; state: string; city_name: string; delivery_fee: number; active: boolean }[]>([]);
  useEffect(() => {
    supabase.from("cities").select("*").order("city_name").then(({ data }) => setCities(data ?? []));
  }, []);
  return (
    <div>
      <h1 className="font-display text-3xl text-green-deep">Cidades atendidas</h1>
      <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {cities.map((c) => (
          <div key={c.id} className="rounded-2xl bg-card p-4 shadow-soft">
            <div className="font-display text-lg text-green-deep">{c.city_name}/{c.state}</div>
            <div className="text-sm text-muted-foreground">Frete: {brl(Number(c.delivery_fee))}</div>
            <div className="mt-1 text-xs">{c.active ? "✅ Ativa" : "❌ Inativa"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
