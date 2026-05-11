import { Link } from "@tanstack/react-router";
import { Plus, Tag } from "lucide-react";
import { useCartStore } from "@/stores/cart";
import { resolveImage } from "@/lib/product-images";
import { brl } from "@/lib/format";
import { toast } from "sonner";

export type Product = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  images: string[];
  price: number;
  original_price?: number | null;
  badge?: string | null;
  rating?: number | null;
  review_count?: number | null;
};

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const add = useCartStore((s) => s.add);
  const imageKey = product.images[0];
  const discount =
    product.original_price && product.original_price > product.price
      ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
      : 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: Number(product.price),
      imageKey,
    });
    toast.success("Adicionado ao carrinho", { description: product.name });
  };

  return (
    <Link
      to="/produto/$slug"
      params={{ slug: product.slug }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-elegant"
    >
      <div className="relative aspect-square overflow-hidden bg-cream-dark">
        <img
          src={resolveImage(imageKey)}
          alt={product.name}
          loading={index < 4 ? "eager" : "lazy"}
          decoding="async"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        {discount > 0 && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-green-deep px-2.5 py-1 text-[11px] font-bold text-cream shadow-soft">
            <Tag className="h-3 w-3" />
            {discount}% OFF
          </span>
        )}
        {product.badge && (
          <span className="absolute right-3 top-3 rounded-full bg-gold px-2.5 py-1 text-[11px] font-bold text-green-deep">
            {product.badge}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-base text-green-deep line-clamp-1">{product.name}</h3>
        {product.description && (
          <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
            {product.description}
          </p>
        )}

        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-display text-xl text-green-deep">
            {brl(Number(product.price))}
          </span>
          {product.original_price && product.original_price > product.price && (
            <span className="text-xs text-muted-foreground line-through">
              {brl(Number(product.original_price))}
            </span>
          )}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <span
            className="inline-flex items-center justify-center rounded-full border border-green-deep px-3 py-2 text-xs font-medium text-green-deep transition hover:bg-green-deep/5"
          >
            Ver detalhes
          </span>
          <button
            onClick={handleAdd}
            aria-label={`Adicionar ${product.name}`}
            className="inline-flex items-center justify-center gap-1 rounded-full bg-green-deep px-3 py-2 text-xs font-medium text-cream transition active:scale-95 hover:bg-green-mid"
          >
            <Plus className="h-3.5 w-3.5" /> Comprar
          </button>
        </div>
      </div>
    </Link>
  );
}
