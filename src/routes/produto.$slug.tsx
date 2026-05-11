import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Star, ShoppingBag, Heart, Truck } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { resolveImage } from "@/lib/product-images";
import { brl } from "@/lib/format";
import { useCartStore } from "@/stores/cart";
import { useLocationStore } from "@/stores/location";
import { toast } from "sonner";

export const Route = createFileRoute("/produto/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `Buquê — Flora Luxe` },
      { name: "description", content: `Confira ${params.slug} na Flora Luxe.` },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const loc = useLocationStore((s) => s.location);
  const add = useCartStore((s) => s.add);
  const open = useCartStore((s) => s.open);
  const [qty, setQty] = useState(1);
  const [message, setMessage] = useState("");

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").eq("slug", slug).maybeSingle();
      if (error) throw error;
      if (!data) throw notFound();
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="h-96 animate-pulse rounded-3xl bg-cream-dark" />
        </div>
      </div>
    );
  }
  if (!product) return null;

  const image = resolveImage(product.images?.[0]);
  const handleAdd = () => {
    add(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: Number(product.price),
        imageKey: product.images?.[0] ?? "",
      },
      qty,
    );
    toast.success("Adicionado ao carrinho");
    open();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 md:grid-cols-2 md:py-16">
        <div className="overflow-hidden rounded-3xl bg-cream-dark shadow-elegant">
          <img src={image} alt={product.name} className="aspect-square w-full object-cover" />
        </div>
        <div>
          <Link to="/" className="text-xs text-muted-foreground hover:text-green-deep">← Voltar à loja</Link>
          <h1 className="mt-3 font-display text-4xl text-green-deep md:text-5xl">{product.name}</h1>
          <div className="mt-2 flex items-center gap-2 text-sm">
            <div className="flex text-gold">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <span className="text-muted-foreground">
              {Number(product.rating).toFixed(1)} · {product.review_count} avaliações
            </span>
          </div>
          <div className="mt-5 flex items-end gap-3">
            {product.original_price && (
              <span className="text-base text-muted-foreground line-through">
                {brl(Number(product.original_price))}
              </span>
            )}
            <span className="font-display text-4xl text-green-deep">
              {brl(Number(product.price))}
            </span>
          </div>
          <p className="mt-5 text-foreground/80">{product.description}</p>

          <div className="mt-6 rounded-2xl bg-cream-dark p-4 text-sm">
            <div className="flex items-center gap-2 text-green-mid">
              <Truck className="h-4 w-4" />
              <span>
                🟢 Entregamos {loc ? `hoje em ${loc.city}` : "rapidamente"} se pedir até as 18h
              </span>
            </div>
          </div>

          <div className="mt-6">
            <label className="text-sm font-medium text-green-deep">Mensagem no cartão (opcional)</label>
            <textarea
              maxLength={200}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ex.: Te amo. Para todos os dias da nossa vida."
              className="mt-1.5 w-full rounded-xl border border-border bg-cream p-3 text-sm outline-none focus:border-green-mid"
              rows={3}
            />
            <div className="mt-1 text-right text-[11px] text-muted-foreground">{message.length}/200</div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <div className="inline-flex items-center rounded-full border border-border bg-cream">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-2 text-lg">−</button>
              <span className="w-10 text-center">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="px-4 py-2 text-lg">+</button>
            </div>
            <button
              onClick={handleAdd}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-green-deep py-4 text-cream transition hover:bg-green-mid"
            >
              <ShoppingBag className="h-5 w-5" /> Adicionar ao carrinho
            </button>
            <button
              aria-label="Favoritar"
              className="grid h-12 w-12 place-items-center rounded-full border border-border bg-cream"
            >
              <Heart className="h-5 w-5" />
            </button>
          </div>
          <Link
            to="/checkout"
            onClick={handleAdd}
            className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-green-deep py-3 text-sm font-medium text-green-deep hover:bg-green-deep hover:text-cream"
          >
            💚 Comprar agora
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
