import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ChevronLeft,
  ChevronDown,
  Lock,
  Mail,
  Phone,
  User,
  Hash,
  MapPin,
  Truck,
  Zap,
  Flame,
  CreditCard,
  Star,
} from "lucide-react";
import { cartSubtotal, useCartStore } from "@/stores/cart";
import { useLocationStore } from "@/stores/location";
import { brl, formatCEP, formatPhone } from "@/lib/format";
import { resolveImage } from "@/lib/product-images";
import { useServerFn } from "@tanstack/react-start";
import { createOrder } from "@/lib/orders.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Finalizar Pedido — Floratta Express" }] }),
  component: CheckoutPage,
});

type Step = 1 | 2 | 3;

const ADDONS = [
  { id: "ferrero", title: "Ferrero Rocher T8", price: 24.9, emoji: "🍫" },
  { id: "urso", title: "Urso de Pelúcia 25cm", price: 19.9, emoji: "🧸" },
];

function formatCPF(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 14);
  if (d.length <= 11)
    return d.replace(/(\d{3})(\d{0,3})(\d{0,3})(\d{0,2}).*/, "$1.$2.$3-$4")
      .replace(/[.-]+$/, "");
  return d.replace(/(\d{2})(\d{0,3})(\d{0,3})(\d{0,4})(\d{0,2}).*/, "$1.$2.$3/$4-$5")
    .replace(/[./-]+$/, "");
}

function CheckoutPage() {
  const navigate = useNavigate();
  const { items, clear } = useCartStore();
  const loc = useLocationStore((s) => s.location);
  const subtotal = cartSubtotal(items);

  const [step, setStep] = useState<Step>(1);
  const [submitting, setSubmitting] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [openDelivery, setOpenDelivery] = useState(false);
  const [deliveryMode, setDeliveryMode] = useState<"normal" | "rapida">("normal");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [payment, setPayment] = useState<"pix" | "credit">("pix");

  const [form, setForm] = useState({
    email: "",
    phone: "",
    name: "",
    cpf: "",
    cep: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: loc?.city ?? "",
  });

  const set = <K extends keyof typeof form>(k: K, v: string) =>
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
          city: data.localidade || f.city,
        }));
      }
    } catch {}
  };

  const baseFee = loc?.deliveryFee ?? 0;
  const freeMin = loc?.freeShippingMin ?? 200;
  const normalFee = subtotal >= freeMin ? 0 : baseFee;
  const rapidaFee = (subtotal >= freeMin ? 0 : baseFee) + 6.9;
  const shipping = deliveryMode === "rapida" ? rapidaFee : normalFee;
  const addonsTotal = ADDONS.filter((a) => selectedAddons.includes(a.id))
    .reduce((s, a) => s + a.price, 0);
  const total = subtotal + shipping + addonsTotal;

  const validStep1 =
    /\S+@\S+\.\S+/.test(form.email) &&
    form.phone.replace(/\D/g, "").length >= 10 &&
    form.name.trim().length > 2 &&
    form.cpf.replace(/\D/g, "").length >= 11;

  const validStep2 =
    form.cep.replace(/\D/g, "").length === 8 &&
    form.street.length > 1 &&
    form.number.length > 0 &&
    form.city.length > 1;

  const next = () => {
    if (step === 1 && !validStep1) return toast.error("Preencha todos os campos");
    if (step === 2 && !validStep2) return toast.error("Preencha o endereço");
    setStep((s) => (s + 1) as Step);
  };

  const submit = async () => {
    if (!loc) {
      toast.error("Selecione uma cidade primeiro");
      return;
    }
    setSubmitting(true);
    const allItems = [
      ...items.map((i) => ({
        slug: i.slug, name: i.name, price: i.price,
        quantity: i.quantity, imageKey: i.imageKey,
      })),
      ...ADDONS.filter((a) => selectedAddons.includes(a.id)).map((a) => ({
        slug: a.id, name: a.title, price: a.price, quantity: 1, imageKey: "",
      })),
    ];
    const { data, error } = await supabase
      .from("orders")
      .insert({
        order_number: "",
        buyer_name: form.name,
        buyer_phone: form.phone.replace(/\D/g, ""),
        buyer_email: form.email || null,
        recipient_name: form.name,
        recipient_phone: form.phone.replace(/\D/g, ""),
        address_cep: form.cep.replace(/\D/g, ""),
        address_street: form.street,
        address_number: form.number,
        address_complement: form.complement || null,
        address_neighborhood: form.neighborhood || null,
        address_city: form.city || loc.city,
        address_state: loc.state,
        card_message: null,
        items: allItems,
        subtotal, delivery_fee: shipping, discount: 0, total,
        payment_method: payment,
        payment_status: "paid",
        status: "new",
        city_slug: loc.citySlug,
      })
      .select("id, order_number")
      .single();
    setSubmitting(false);
    if (error || !data) {
      toast.error("Não foi possível criar o pedido.");
      return;
    }
    clear();
    toast.success("Pedido confirmado!");
    navigate({ to: "/pedido/$id", params: { id: data.id } });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream">
        <CheckoutHeader />
        <div className="px-4 py-20 text-center">
          <h1 className="font-display text-2xl text-green-deep">Carrinho vazio</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Adicione produtos antes de finalizar.
          </p>
          <Link
            to="/"
            className="mt-6 inline-block rounded-xl bg-green-deep px-6 py-3 text-sm font-bold text-cream"
          >
            Voltar para a loja
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream pb-8">
      <CheckoutHeader />

      {/* Stepper */}
      <div className="bg-cream px-4 pb-4 pt-5">
        <Stepper step={step} />
      </div>

      <div className="space-y-3 px-3">
        {/* Carrinho collapsible */}
        <Collapsible
          open={openCart}
          onToggle={() => setOpenCart((v) => !v)}
          title={
            <div className="flex items-center gap-2">
              <span className="font-semibold text-green-deep">Seu carrinho</span>
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-green-deep px-1.5 text-[11px] font-bold text-cream">
                {items.length}
              </span>
            </div>
          }
        >
          <ul className="divide-y divide-border">
            {items.map((i) => (
              <li key={i.slug} className="flex items-center gap-3 py-2.5">
                <img
                  src={resolveImage(i.imageKey)}
                  alt={i.name}
                  className="h-12 w-12 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="line-clamp-1 text-sm font-medium text-green-deep">
                    {i.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {i.quantity}× {brl(i.price)}
                  </div>
                </div>
                <div className="text-sm font-bold text-green-deep">
                  {brl(i.price * i.quantity)}
                </div>
              </li>
            ))}
          </ul>
        </Collapsible>

        {/* Step 3: collapsibles for entrega */}
        {step === 3 && (
          <Collapsible
            open={openDelivery}
            onToggle={() => setOpenDelivery((v) => !v)}
            title={<span className="font-semibold text-green-deep">Dados de entrega</span>}
          >
            <div className="space-y-1 text-sm text-foreground/80">
              <div><strong>{form.name}</strong></div>
              <div>{form.email} • {form.phone}</div>
              <div>
                {form.street}, {form.number}
                {form.complement ? ` - ${form.complement}` : ""}
              </div>
              <div>{form.neighborhood} • {form.city}</div>
              <div>CEP {form.cep}</div>
            </div>
          </Collapsible>
        )}

        {/* Step 1: Identificação */}
        {step === 1 && (
          <Card>
            <FieldLabel>E-mail</FieldLabel>
            <InputBox icon={<Mail className="h-4 w-4" />}>
              <input
                type="email"
                placeholder="Digite seu e-mail"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
              />
            </InputBox>

            <FieldLabel>Telefone</FieldLabel>
            <InputBox icon={<Phone className="h-4 w-4" />}>
              <input
                inputMode="tel"
                placeholder="(00) 00000-0000"
                value={form.phone}
                onChange={(e) => set("phone", formatPhone(e.target.value))}
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
              />
            </InputBox>

            <FieldLabel>Nome completo</FieldLabel>
            <InputBox icon={<User className="h-4 w-4" />}>
              <input
                placeholder="Digite seu nome completo"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
              />
            </InputBox>

            <FieldLabel>CPF/CNPJ</FieldLabel>
            <InputBox icon={<Hash className="h-4 w-4" />}>
              <input
                inputMode="numeric"
                placeholder="000.000.000-00"
                value={form.cpf}
                onChange={(e) => set("cpf", formatCPF(e.target.value))}
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
              />
            </InputBox>

            <button
              onClick={next}
              disabled={!validStep1}
              className="mt-5 w-full rounded-xl bg-green-deep py-3.5 text-sm font-bold tracking-wide text-cream shadow-soft transition hover:opacity-90 disabled:opacity-50"
            >
              IR PARA A ENTREGA
            </button>
          </Card>
        )}

        {/* Step 2: Entrega */}
        {step === 2 && (
          <>
            <Card>
              <FieldLabel>CEP</FieldLabel>
              <InputBox icon={<MapPin className="h-4 w-4" />}>
                <input
                  inputMode="numeric"
                  placeholder="00000-000"
                  value={form.cep}
                  onChange={(e) => {
                    const f = formatCEP(e.target.value);
                    set("cep", f);
                    if (f.replace(/\D/g, "").length === 8) fetchCEP(f);
                  }}
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
                />
              </InputBox>

              <FieldLabel>Endereço</FieldLabel>
              <InputBox>
                <input
                  placeholder="Rua, Avenida..."
                  value={form.street}
                  onChange={(e) => set("street", e.target.value)}
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
                />
              </InputBox>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel>Número</FieldLabel>
                  <InputBox>
                    <input
                      placeholder="Nº"
                      value={form.number}
                      onChange={(e) => set("number", e.target.value)}
                      className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
                    />
                  </InputBox>
                </div>
                <div>
                  <FieldLabel>Complemento</FieldLabel>
                  <InputBox>
                    <input
                      placeholder="Apto, Bloco..."
                      value={form.complement}
                      onChange={(e) => set("complement", e.target.value)}
                      className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
                    />
                  </InputBox>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel>Bairro</FieldLabel>
                  <InputBox>
                    <input
                      placeholder="Bairro"
                      value={form.neighborhood}
                      onChange={(e) => set("neighborhood", e.target.value)}
                      className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
                    />
                  </InputBox>
                </div>
                <div>
                  <FieldLabel>Cidade</FieldLabel>
                  <InputBox>
                    <input
                      placeholder="Cidade"
                      value={form.city}
                      onChange={(e) => set("city", e.target.value)}
                      className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
                    />
                  </InputBox>
                </div>
              </div>
            </Card>

            <Card>
              <div className="mb-3 flex items-center gap-2">
                <Truck className="h-5 w-5 text-green-deep" />
                <h3 className="font-semibold text-green-deep">Entrega</h3>
              </div>

              <button
                onClick={() => setDeliveryMode("normal")}
                className={`flex w-full items-center justify-between rounded-xl border-2 p-3 text-left transition ${
                  deliveryMode === "normal"
                    ? "border-green-deep bg-green-deep/5"
                    : "border-border bg-cream"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-green-deep/10">
                    <Truck className="h-4 w-4 text-green-deep" />
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-green-deep">Entrega</div>
                    <div className="text-xs text-muted-foreground">15 - 30 minutos</div>
                  </div>
                </div>
                <span className="text-sm font-bold text-green-mid">
                  {normalFee === 0 ? "GRÁTIS" : brl(normalFee)}
                </span>
              </button>

              <button
                onClick={() => setDeliveryMode("rapida")}
                className={`mt-2 flex w-full items-center justify-between rounded-xl border-2 p-3 text-left transition ${
                  deliveryMode === "rapida"
                    ? "border-green-deep bg-green-deep/5"
                    : "border-border bg-cream"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-gold/20">
                    <Zap className="h-4 w-4 text-gold" />
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-green-deep">Rápida</div>
                    <div className="text-xs text-muted-foreground">10 - 15 minutos</div>
                  </div>
                </div>
                <span className="text-sm font-bold text-green-deep">+ {brl(6.9)}</span>
              </button>
            </Card>

            <div className="flex gap-3 px-1">
              <button
                onClick={() => setStep(1)}
                className="flex-1 rounded-xl border-2 border-border bg-card py-3.5 text-sm font-bold text-green-deep"
              >
                Voltar
              </button>
              <button
                onClick={next}
                disabled={!validStep2}
                className="flex-[2] rounded-xl bg-green-deep py-3.5 text-sm font-bold tracking-wide text-cream shadow-soft transition hover:opacity-90 disabled:opacity-50"
              >
                IR PARA PAGAMENTO
              </button>
            </div>
          </>
        )}

        {/* Step 3: Pagamento */}
        {step === 3 && (
          <>
            {/* Addons */}
            <div className="rounded-2xl border-2 border-dashed border-blush bg-blush/10 p-4 shadow-soft">
              <div className="mb-3 flex items-center gap-2">
                <Flame className="h-4 w-4 text-blush" />
                <span className="text-sm font-bold text-green-deep">
                  Aproveite e adicione ao seu pedido!
                </span>
              </div>
              <div className="space-y-2">
                {ADDONS.map((a) => {
                  const checked = selectedAddons.includes(a.id);
                  return (
                    <label
                      key={a.id}
                      className="flex items-center gap-3 rounded-xl bg-card p-3 shadow-soft"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() =>
                          setSelectedAddons((cur) =>
                            cur.includes(a.id)
                              ? cur.filter((x) => x !== a.id)
                              : [...cur, a.id],
                          )
                        }
                        className="h-4 w-4 accent-green-deep"
                      />
                      <span className="grid h-10 w-10 place-items-center rounded-lg bg-cream-dark text-xl">
                        {a.emoji}
                      </span>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-green-deep">
                          {a.title}
                        </div>
                        <div className="text-sm font-bold text-blush">{brl(a.price)}</div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Payment methods */}
            <Card>
              <button
                onClick={() => setPayment("pix")}
                className={`flex w-full items-center gap-3 rounded-xl border-2 p-3 text-left transition ${
                  payment === "pix"
                    ? "border-green-deep bg-green-deep/5"
                    : "border-border"
                }`}
              >
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-green-mid/15 text-green-mid">
                  <PixIcon />
                </span>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-green-deep">PIX</div>
                  <div className="text-xs text-muted-foreground">
                    Pagamento instantâneo
                  </div>
                </div>
                <span
                  className={`grid h-5 w-5 place-items-center rounded-full border-2 ${
                    payment === "pix"
                      ? "border-green-deep"
                      : "border-border"
                  }`}
                >
                  {payment === "pix" && (
                    <span className="h-2.5 w-2.5 rounded-full bg-green-deep" />
                  )}
                </span>
              </button>

              <button
                onClick={() => setPayment("credit")}
                className={`mt-2 flex w-full items-center gap-3 rounded-xl border-2 p-3 text-left transition ${
                  payment === "credit"
                    ? "border-green-deep bg-green-deep/5"
                    : "border-border"
                }`}
              >
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-cream-dark text-green-deep">
                  <CreditCard className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-green-deep">
                    Cartão de crédito
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Parcelamento disponível
                  </div>
                </div>
                <span
                  className={`grid h-5 w-5 place-items-center rounded-full border-2 ${
                    payment === "credit"
                      ? "border-green-deep"
                      : "border-border"
                  }`}
                >
                  {payment === "credit" && (
                    <span className="h-2.5 w-2.5 rounded-full bg-green-deep" />
                  )}
                </span>
              </button>
            </Card>

            {/* Totals */}
            <div className="rounded-2xl bg-card px-4 py-4 shadow-soft">
              <Row label="Subtotal" value={brl(subtotal + addonsTotal)} />
              <Row
                label="Frete"
                value={shipping === 0 ? "Grátis" : brl(shipping)}
                accent={shipping === 0}
              />
              <div className="mt-2 flex items-center justify-between border-t border-border pt-3">
                <span className="text-base font-bold text-green-deep">Total</span>
                <span className="text-lg font-extrabold text-green-mid">
                  {brl(total)}
                </span>
              </div>
            </div>

            <div className="flex gap-3 px-1">
              <button
                onClick={() => setStep(2)}
                className="flex-1 rounded-xl border-2 border-border bg-card py-3.5 text-sm font-bold text-green-deep"
              >
                Voltar
              </button>
              <button
                onClick={submit}
                disabled={submitting}
                className="flex-[2] rounded-xl bg-green-deep py-3.5 text-sm font-bold tracking-wide text-cream shadow-soft transition hover:opacity-90 disabled:opacity-50"
              >
                {submitting ? "PROCESSANDO..." : "FAZER PEDIDO"}
              </button>
            </div>

            <div className="flex items-center justify-center gap-1.5 pt-1 text-xs text-muted-foreground">
              <Lock className="h-3 w-3" />
              <span>Pagamento 100% seguro</span>
            </div>
          </>
        )}

        {/* Trust card on step 1 */}
        {step === 1 && (
          <div className="rounded-2xl bg-card p-4 shadow-soft">
            <div className="flex gap-3">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-cream-dark font-display text-lg font-bold text-green-deep">
                F
              </div>
              <div className="flex-1">
                <div className="flex text-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <div className="mt-1 text-sm font-bold text-green-deep">
                  Entrega Garantida Floratta Express
                </div>
                <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
                  Suas flores são entregues com cuidado especial, embalagem premium e
                  acompanhamento em tempo real.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CheckoutHeader() {
  return (
    <div className="sticky top-0 z-30 flex items-center justify-between bg-green-deep px-3 py-3 text-cream shadow-soft">
      <Link to="/" className="grid h-9 w-9 place-items-center rounded-full hover:bg-cream/10">
        <ChevronLeft className="h-5 w-5" />
      </Link>
      <h1 className="font-display text-base font-semibold">Finalizar Pedido</h1>
      <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wide">
        <Lock className="h-3.5 w-3.5" />
        <div className="leading-tight">
          <div>PAGAMENTO</div>
          <div>100% SEGURO</div>
        </div>
      </div>
    </div>
  );
}

function Stepper({ step }: { step: Step }) {
  const items = [
    { n: 1, label: "Identificação" },
    { n: 2, label: "Entrega" },
    { n: 3, label: "Pagamento" },
  ];
  return (
    <div className="flex items-center justify-between">
      {items.map((it, idx) => {
        const active = step === it.n;
        const done = step > it.n;
        const reached = active || done;
        return (
          <div key={it.n} className="flex flex-1 items-center">
            <div className="flex flex-col items-center">
              <div
                className={`grid h-9 w-9 place-items-center rounded-full text-sm font-bold transition ${
                  reached
                    ? "bg-green-deep text-cream"
                    : "bg-cream-dark text-muted-foreground"
                }`}
              >
                {it.n}
              </div>
              <span
                className={`mt-1.5 text-[11px] font-medium ${
                  reached ? "text-green-deep" : "text-muted-foreground"
                }`}
              >
                {it.label}
              </span>
            </div>
            {idx < items.length - 1 && (
              <div
                className={`mx-1 mb-5 h-0.5 flex-1 ${
                  step > it.n ? "bg-green-deep" : "bg-cream-dark"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-2 rounded-2xl bg-card p-4 shadow-soft">{children}</div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-1 mt-2 text-sm font-semibold text-green-deep">{children}</div>
  );
}

function InputBox({
  icon,
  children,
}: {
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-border bg-cream px-3 py-3 focus-within:border-green-mid">
      {icon && <span className="text-muted-foreground">{icon}</span>}
      {children}
    </div>
  );
}

function Collapsible({
  open,
  onToggle,
  title,
  children,
}: {
  open: boolean;
  onToggle: () => void;
  title: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-card shadow-soft">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-3"
      >
        {title}
        <ChevronDown
          className={`h-4 w-4 text-green-deep transition ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="border-t border-border px-4 py-3">{children}</div>}
    </div>
  );
}

function Row({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-1 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={accent ? "font-semibold text-green-mid" : "text-foreground"}>
        {value}
      </span>
    </div>
  );
}

function PixIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
      <path d="M12 2 2 12l10 10 10-10L12 2zm0 3.41L18.59 12 12 18.59 5.41 12 12 5.41z" />
    </svg>
  );
}
