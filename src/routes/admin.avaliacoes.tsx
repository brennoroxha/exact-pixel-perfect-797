import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Star } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/avaliacoes")({ component: AdminReviews });

function AdminReviews() {
  const [reviews, setReviews] = useState<{ id: string; buyer_name: string; rating: number; comment: string | null; approved: boolean; product_slug: string | null }[]>([]);

  const load = () => supabase.from("reviews").select("*").order("created_at", { ascending: false }).then(({ data }) => setReviews(data ?? []));
  useEffect(() => { load(); }, []);

  const toggle = async (id: string, approved: boolean) => {
    const { error } = await supabase.from("reviews").update({ approved }).eq("id", id);
    if (error) toast.error("Erro"); else { toast.success("Atualizado"); load(); }
  };

  return (
    <div>
      <h1 className="font-display text-3xl text-green-deep">Avaliações</h1>
      <ul className="mt-6 space-y-3">
        {reviews.map((r) => (
          <li key={r.id} className="rounded-2xl bg-card p-4 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-green-deep">{r.buyer_name}</div>
                <div className="flex text-star">{Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}</div>
              </div>
              <button onClick={() => toggle(r.id, !r.approved)}
                className={`rounded-full px-3 py-1 text-xs ${r.approved ? "bg-green-mid text-cream" : "bg-cream-dark text-foreground"}`}>
                {r.approved ? "Aprovada" : "Aprovar"}
              </button>
            </div>
            {r.comment && <p className="mt-2 text-sm text-foreground/80">"{r.comment}"</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
