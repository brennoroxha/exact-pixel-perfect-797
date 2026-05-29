import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { Check, Truck, Clock, MessageCircle } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { brl } from "@/lib/format";
import { getPublicOrder } from "@/lib/orders.functions";

export const Route = createFileRoute("/pedido/$id")({
  head: () => ({ meta: [{ title: "Acompanhe seu pedido — Flora Luxe" }] }),
  component: OrderPage,
});

const STAGES = [
  { key: "new", label: "Pedido recebido", icon: Check },
  { key: "preparing", label: "Preparando seu buquê", icon: Clock },
  { key: "out_for_delivery", label: "Saiu para entrega", icon: Truck },
  { key: "delivered", label: "Entregue", icon: Check },
];

function OrderPage() {
  const { id } = Route.useParams();
  const fetchOrder = useServerFn(getPublicOrder);
  const { data: order, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: () => fetchOrder({ data: { id } }),
    refetchInterval: 8000,
  });

  if (isLoading || !order) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="mx-auto max-w-2xl px-4 py-20 text-center text-muted-foreground">Carregando pedido...</div>
      </div>
    );
  }

  const currentIdx = STAGES.findIndex((s) => s.key === order.status);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="rounded-3xl bg-gradient-luxe p-8 text-cream">
          <div className="text-xs uppercase tracking-wider text-cream/70">Pedido</div>
          <h1 className="mt-1 font-display text-4xl">#{order.order_number}</h1>
          <p className="mt-2 text-cream/80">
            Para <strong>{order.recipient_name}</strong> em {order.address_city}/{order.address_state}
          </p>
          <a
            href={`https://wa.me/5511999999999?text=Ol%C3%A1!%20Quero%20ajuda%20com%20o%20pedido%20${order.order_number}`}
            target="_blank" rel="noopener"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-cream/15 px-4 py-2 text-sm hover:bg-cream/25"
          >
            <MessageCircle className="h-4 w-4" /> Falar no WhatsApp
          </a>
        </div>

        <ol className="mt-8 space-y-4">
          {STAGES.map((s, i) => {
            const done = i <= currentIdx;
            const active = i === currentIdx;
            return (
              <li key={s.key} className="flex items-center gap-4">
                <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${done ? "bg-green-deep text-cream" : "bg-cream-dark text-muted-foreground"}`}>
                  <s.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className={`font-medium ${done ? "text-green-deep" : "text-muted-foreground"}`}>
                    {s.label}
                  </div>
                  {active && <div className="text-xs text-green-mid">em andamento</div>}
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-8 rounded-2xl bg-cream-dark p-6">
          <h2 className="font-display text-xl text-green-deep">Itens</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {(order.items as { name: string; quantity: number; price: number }[]).map((i, idx) => (
              <li key={idx} className="flex justify-between">
                <span>{i.quantity}× {i.name}</span>
                <span>{brl(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex justify-between border-t border-border pt-3 font-display text-lg text-green-deep">
            <span>Total</span><span>{brl(Number(order.total))}</span>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
