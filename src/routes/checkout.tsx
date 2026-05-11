import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy, CreditCard, QrCode } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { cartSubtotal, useCartStore } from "@/stores/cart";
import { useLocationStore } from "@/stores/location";
import { brl, formatCEP, formatPhone } from "@/lib/format";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Flora Luxe" }] }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const navigate = useNavigate();
  const { items, clear } = useCartStore();
  const loc = useLocationStore((s) => s.location);
  const subtotal = cartSubtotal(items);
  const fee = loc?.deliveryFee ?? 14.9;
  const freeMin = loc?.freeShippingMin ?? 200;
  const shipping = subtotal >= freeMin ? 0 : fee;
  const total = subtotal + shipping;

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    buyerName: "",
    buyerPhone: "",
    buyerEmail: "",
    recipientName: "",
    recipientPhone: "",
    recipientIsBuyer: true,
    cep: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    cardMessage: "",
    includeCard: true,
    deliveryDate: new Date().toISOString().slice(0, 10),
    deliveryPeriod: "tarde" as "manha" | "tarde" | "noite",
    paymentMethod: "pix" as "pix" | "credit",
  });

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const fetchCEP = async (cep: string) => {
    const clean = cep.replace(/\D/g, "");
    if (clean.length !== 8) return;
    try {
      const r = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
      const data = await r.json();
      if (!data.erro) {
        setForm((f) => ({
          ...f,
          street: data.logradouro || f.street,
          neighborhood: data.bairro || f.neighborhood,
        }));
      }
    } catch {}
  };

  const submit = async () => {
    if (!loc) {
      toast.error("Selecione uma cidade primeiro");
      return;
    }
    setSubmitting(true);
    const recipName = form.recipientIsBuyer ? form.buyerName : form.recipientName;
    const recipPhone = form.recipientIsBuyer ? form.buyerPhone : form.recipientPhone;
    const { data, error } = await supabase
      .from("orders")
      .insert({
        order_number: "",
        buyer_name: form.buyerName,
        buyer_phone: form.buyerPhone.replace(/\D/g, ""),
        buyer_email: form.buyerEmail || null,
        recipient_name: recipName,
        recipient_phone: recipPhone.replace(/\D/g, ""),
        address_cep: form.cep.replace(/\D/g, ""),
        address_street: form.street,
        address_number: form.number,
        address_complement: form.complement || null,
        address_neighborhood: form.neighborhood || null,
        address_city: loc.city,
        address_state: loc.state,
        card_message: form.includeCard ? form.cardMessage : null,
        items: items.map((i) => ({
          slug: i.slug, name: i.name, price: i.price, quantity: i.quantity, imageKey: i.imageKey,
        })),
        subtotal, delivery_fee: shipping, discount: 0, total,
        delivery_date: form.deliveryDate,
        delivery_period: form.deliveryPeriod,
        payment_method: form.paymentMethod,
        payment_status: "paid", // mocked
        status: "new",
        city_slug: loc.citySlug,
      })
      .select("id, order_number")
      .single();
    setSubmitting(false);
    if (error || !data) {
      toast.error("Não foi possível criar o pedido. Verifique os dados.");
      return;
    }
    clear();
    setStep(4);
    setTimeout(() => navigate({ to: "/pedido/$id", params: { id: data.id } }), 1800);
  };

  const stepValid = (() => {
    if (step === 1) return form.buyerName.length > 1 && form.buyerPhone.replace(/\D/g, "").length >= 10 && form.cep.replace(/\D/g, "").length === 8 && form.street.length > 1 && form.number.length > 0;
    if (step === 2) return true;
    return true;
  })();

  if (items.length === 0 && step !== 4) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="mx-auto max-w-2xl px-4 py-20 text-center">
          <h1 className="font-display text-3xl text-green-deep">Carrinho vazio</h1>
          <p className="mt-2 text-muted-foreground">Adicione produtos antes de finalizar.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 md:grid-cols-[1fr_360px]">
        <div>
          {/* Stepper */}
          <ol className="mb-8 flex items-center gap-3 text-xs">
            {["Entrega", "Mensagem", "Pagamento", "Confirmação"].map((label, i) => {
              const idx = (i + 1) as 1 | 2 | 3 | 4;
              const active = step === idx;
              const done = step > idx;
              return (
                <li key={label} className="flex items-center gap-2">
                  <span className={`grid h-7 w-7 place-items-center rounded-full text-[11px] font-bold ${
                    done ? "bg-green-mid text-cream" : active ? "bg-green-deep text-cream" : "bg-cream-dark text-muted-foreground"
                  }`}>{done ? "✓" : idx}</span>
                  <span className={active ? "font-medium text-green-deep" : "text-muted-foreground"}>{label}</span>
                  {i < 3 && <span className="mx-2 h-px w-8 bg-border" />}
                </li>
              );
            })}
          </ol>

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="font-display text-2xl text-green-deep">Entrega</h2>
              <div className="grid gap-3 md:grid-cols-2">
                <Field label="Seu nome" value={form.buyerName} onChange={(v) => set("buyerName", v)} />
                <Field label="Seu telefone" value={form.buyerPhone} onChange={(v) => set("buyerPhone", formatPhone(v))} />
                <Field label="E-mail (opcional)" value={form.buyerEmail} onChange={(v) => set("buyerEmail", v)} className="md:col-span-2" />
                <Field
                  label="CEP"
                  value={form.cep}
                  onChange={(v) => { const f = formatCEP(v); set("cep", f); if (f.replace(/\D/g, "").length === 8) fetchCEP(f); }}
                />
                <Field label="Bairro" value={form.neighborhood} onChange={(v) => set("neighborhood", v)} />
                <Field label="Rua" value={form.street} onChange={(v) => set("street", v)} className="md:col-span-2" />
                <Field label="Número" value={form.number} onChange={(v) => set("number", v)} />
                <Field label="Complemento" value={form.complement} onChange={(v) => set("complement", v)} />
              </div>

              <label className="mt-4 flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.recipientIsBuyer} onChange={(e) => set("recipientIsBuyer", e.target.checked)} />
                Quem vai receber sou eu
              </label>
              {!form.recipientIsBuyer && (
                <div className="grid gap-3 md:grid-cols-2">
                  <Field label="Nome de quem recebe" value={form.recipientName} onChange={(v) => set("recipientName", v)} />
                  <Field label="Telefone de quem recebe" value={form.recipientPhone} onChange={(v) => set("recipientPhone", formatPhone(v))} />
                </div>
              )}

              <div className="grid gap-3 md:grid-cols-2">
                <Field label="Data da entrega" type="date" value={form.deliveryDate} onChange={(v) => set("deliveryDate", v)} />
                <div>
                  <label className="text-xs text-muted-foreground">Horário</label>
                  <select
                    value={form.deliveryPeriod}
                    onChange={(e) => set("deliveryPeriod", e.target.value as "manha" | "tarde" | "noite")}
                    className="mt-1 w-full rounded-xl border border-border bg-cream px-3 py-2.5"
                  >
                    <option value="manha">Manhã (8h-12h)</option>
                    <option value="tarde">Tarde (12h-18h)</option>
                    <option value="noite">Noite (18h-21h)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="font-display text-2xl text-green-deep">Mensagem no cartão</h2>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.includeCard} onChange={(e) => set("includeCard", e.target.checked)} />
                Incluir um cartão com mensagem
              </label>
              {form.includeCard && (
                <>
                  <textarea
                    maxLength={300}
                    rows={4}
                    value={form.cardMessage}
                    onChange={(e) => set("cardMessage", e.target.value)}
                    placeholder="Escreva sua mensagem (até 300 caracteres)"
                    className="w-full rounded-xl border border-border bg-cream p-3 text-sm"
                  />
                  <motion.div
                    layout
                    className="mx-auto max-w-md rounded-2xl bg-gradient-luxe p-8 text-center text-cream shadow-elegant"
                  >
                    <div className="font-display text-3xl">🌹</div>
                    <p className="mt-3 whitespace-pre-wrap font-display text-lg italic">
                      {form.cardMessage || "Sua mensagem aparecerá aqui..."}
                    </p>
                  </motion.div>
                </>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="font-display text-2xl text-green-deep">Pagamento</h2>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => set("paymentMethod", "pix")}
                  className={`flex items-center gap-2 rounded-2xl border-2 p-4 text-sm ${form.paymentMethod === "pix" ? "border-green-deep bg-green-deep/5" : "border-border"}`}
                >
                  <QrCode className="h-5 w-5" /> PIX (5% off)
                </button>
                <button
                  onClick={() => set("paymentMethod", "credit")}
                  className={`flex items-center gap-2 rounded-2xl border-2 p-4 text-sm ${form.paymentMethod === "credit" ? "border-green-deep bg-green-deep/5" : "border-border"}`}
                >
                  <CreditCard className="h-5 w-5" /> Cartão de crédito
                </button>
              </div>

              {form.paymentMethod === "pix" ? (
                <div className="rounded-2xl bg-cream-dark p-6 text-center">
                  <div className="mx-auto grid h-44 w-44 place-items-center rounded-2xl bg-cream font-mono text-xs text-muted-foreground">
                    [QR Code PIX]
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Escaneie o QR Code ou copie o código:
                  </p>
                  <button
                    onClick={() => { navigator.clipboard.writeText("00020126580014BR.GOV.BCB.PIX0136..."); toast.success("Código copiado"); }}
                    className="mt-2 inline-flex items-center gap-2 rounded-full bg-green-deep px-4 py-2 text-xs text-cream"
                  >
                    <Copy className="h-3.5 w-3.5" /> Copiar código PIX
                  </button>
                </div>
              ) : (
                <div className="grid gap-3">
                  <Field label="Número do cartão" value="" onChange={() => {}} placeholder="0000 0000 0000 0000" />
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Validade" value="" onChange={() => {}} placeholder="MM/AA" />
                    <Field label="CVV" value="" onChange={() => {}} placeholder="123" />
                  </div>
                  <Field label="Nome impresso" value="" onChange={() => {}} />
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-3xl bg-gradient-luxe p-12 text-center text-cream shadow-elegant"
            >
              <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-cream/20">
                <Check className="h-8 w-8" />
              </div>
              <h2 className="font-display text-3xl">Pedido confirmado! 🌸</h2>
              <p className="mt-2 text-cream/80">Redirecionando para o rastreamento...</p>
            </motion.div>
          )}

          {step < 4 && (
            <div className="mt-8 flex gap-3">
              {step > 1 && (
                <button onClick={() => setStep(step - 1)} className="rounded-full border border-border px-6 py-3 text-sm">
                  Voltar
                </button>
              )}
              {step < 3 ? (
                <button
                  disabled={!stepValid}
                  onClick={() => setStep(step + 1)}
                  className="ml-auto rounded-full bg-green-deep px-8 py-3 text-sm text-cream disabled:opacity-50"
                >
                  Continuar →
                </button>
              ) : (
                <button
                  disabled={submitting}
                  onClick={submit}
                  className="ml-auto rounded-full bg-green-deep px-8 py-3 text-sm text-cream disabled:opacity-50"
                >
                  {submitting ? "Processando..." : `Pagar ${brl(total)}`}
                </button>
              )}
            </div>
          )}
        </div>

        <aside className="h-fit space-y-3 rounded-2xl bg-cream-dark p-6">
          <h3 className="font-display text-lg text-green-deep">Resumo do pedido</h3>
          <ul className="space-y-2 text-sm">
            {items.map((i) => (
              <li key={i.slug} className="flex justify-between gap-2">
                <span className="line-clamp-1">{i.quantity}× {i.name}</span>
                <span>{brl(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="space-y-1 border-t border-border pt-3 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{brl(subtotal)}</span></div>
            <div className="flex justify-between"><span>Frete</span><span>{shipping === 0 ? "Grátis" : brl(shipping)}</span></div>
            <div className="flex justify-between border-t border-border pt-2 font-display text-lg text-green-deep">
              <span>Total</span><span>{brl(total)}</span>
            </div>
          </div>
        </aside>
      </div>
      <Footer />
    </div>
  );
}

function Field({
  label, value, onChange, type = "text", placeholder, className = "",
}: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; className?: string;
}) {
  return (
    <div className={className}>
      <label className="text-xs text-muted-foreground">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-border bg-cream px-3 py-2.5 text-sm outline-none focus:border-green-mid"
      />
    </div>
  );
}
