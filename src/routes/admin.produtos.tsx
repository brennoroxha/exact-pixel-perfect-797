import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { brl } from "@/lib/format";

export const Route = createFileRoute("/admin/produtos")({ component: AdminProducts });

function AdminProducts() {
  const [products, setProducts] = useState<{ id: string; name: string; price: number; active: boolean; category_slug: string | null }[]>([]);
  useEffect(() => {
    supabase.from("products").select("id, name, price, active, category_slug").order("created_at", { ascending: false })
      .then(({ data }) => setProducts(data ?? []));
  }, []);
  return (
    <div>
      <h1 className="font-display text-3xl text-green-deep">Produtos</h1>
      <p className="mt-2 text-sm text-muted-foreground">Listagem somente leitura — edição completa em breve.</p>
      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-cream-dark text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr><th className="px-4 py-3">Nome</th><th className="px-4 py-3">Categoria</th><th className="px-4 py-3">Preço</th><th className="px-4 py-3">Status</th></tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="px-4 py-3">{p.name}</td>
                <td className="px-4 py-3">{p.category_slug}</td>
                <td className="px-4 py-3">{brl(Number(p.price))}</td>
                <td className="px-4 py-3">{p.active ? "Ativo" : "Inativo"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
