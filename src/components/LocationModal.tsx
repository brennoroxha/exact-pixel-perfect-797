import { useEffect, useMemo, useState } from "react";
import { MapPin, Check, Loader2, ChevronDown, Search } from "lucide-react";
import { BR_STATES, stateName } from "@/lib/br-states";
import { useLocationStore, type SavedLocation } from "@/stores/location";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const DEFAULTS = {
  delivery_fee: 0,
  free_shipping_min: 0,
  delivery_time_min: 18,
  delivery_time_max: 35,
};

export function LocationModal({ onClose }: { onClose?: () => void }) {
  const setLocation = useLocationStore((s) => s.setLocation);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [uf, setUf] = useState<string>("");
  const [search, setSearch] = useState("");
  const [picked, setPicked] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const [citiesByState, setCitiesByState] = useState<Record<string, string[]>>({});
  const [ipCity, setIpCity] = useState<string>("");

  useEffect(() => {
    if (Object.keys(citiesByState).length > 0) return;
    if (step !== 2 && !ipCity) return;
    let cancelled = false;
    import("@/lib/br-cities").then((m) => {
      if (!cancelled) setCitiesByState(m.CITIES_BY_STATE);
    });
    return () => {
      cancelled = true;
    };
  }, [citiesByState, step, ipCity]);

  // Pré-seleção via IP
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch("https://ipwho.is/?fields=success,country_code,region_code,city");
        const d = await r.json();
        if (cancelled || !d?.success || d.country_code !== "BR") return;
        if (d.region_code) setUf((cur) => cur || d.region_code);
        if (d.city) setIpCity(d.city);
      } catch {}
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ipCity || !uf) return;
    const list = citiesByState[uf];
    if (!list?.length) return;
    const norm = (s: string) =>
      s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const target = norm(ipCity);
    const match = list.find((c) => norm(c) === target);
    if (match) {
      setPicked((cur) => cur || match);
      setSearch((cur) => cur || match);
    }
  }, [ipCity, uf, citiesByState]);

  const cities = useMemo(() => (uf ? citiesByState[uf] || [] : []), [uf, citiesByState]);
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    const list = q ? cities.filter((c) => c.toLowerCase().includes(q)) : cities;
    return list.slice(0, 60);
  }, [cities, search]);

  useEffect(() => {
    if (step !== 3 || !picked || !uf) return;
    setProgress(0);
    setShowSuccess(false);
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const p = Math.min(100, (elapsed / 1200) * 100);
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setShowSuccess(true);
        const saved: SavedLocation = {
          state: uf,
          city: picked,
          citySlug: slugify(picked),
          deliveryFee: DEFAULTS.delivery_fee,
          freeShippingMin: DEFAULTS.free_shipping_min,
          deliveryTimeMin: DEFAULTS.delivery_time_min,
          deliveryTimeMax: DEFAULTS.delivery_time_max,
          savedAt: Date.now(),
        };
        setLocation(saved);
      }
    }, 80);
    return () => clearInterval(interval);
  }, [step, picked, uf, setLocation]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-3xl bg-cream p-6 pt-12 shadow-float animate-in zoom-in-95 duration-200">
        {/* Floating pin icon */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blush text-cream shadow-lg">
            <MapPin className="h-7 w-7" />
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-4 text-center">
            <h2 className="font-display text-lg leading-tight text-green-deep">
              Encontre o Delivery de Flores mais próximo
            </h2>
            <p className="text-sm text-muted-foreground">Escolha seu estado:</p>

            <Select value={uf} onValueChange={(v) => { setUf(v); setPicked(null); setSearch(""); }}>
              <SelectTrigger className="h-12 w-full rounded-full border-0 bg-blush/20 px-5 text-green-deep">
                <SelectValue placeholder="Selecione seu estado" />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {BR_STATES.map((s) => (
                  <SelectItem key={s.uf} value={s.uf}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              disabled={!uf}
              onClick={() => setStep(2)}
              className="h-12 w-full rounded-full bg-blush text-base font-semibold text-cream hover:bg-blush/90"
            >
              Continuar
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 text-center">
            <h2 className="font-display text-lg leading-tight text-green-deep">
              Em qual cidade está?
            </h2>
            <p className="text-sm text-muted-foreground">
              Estado: <strong className="text-green-deep">{stateName(uf)}</strong>
            </p>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar cidade..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-12 rounded-full border-0 bg-blush/20 pl-11 text-green-deep"
              />
            </div>

            <div className="max-h-56 space-y-1 overflow-y-auto rounded-2xl bg-blush/10 p-2 text-left">
              {filtered.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  Nenhuma cidade encontrada.
                </div>
              ) : (
                filtered.map((c) => {
                  const active = picked === c;
                  return (
                    <button
                      key={c}
                      onClick={() => setPicked(c)}
                      className={`flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-sm transition ${
                        active
                          ? "bg-blush text-cream"
                          : "text-green-deep hover:bg-blush/20"
                      }`}
                    >
                      <span>{c}</span>
                      {active && <Check className="h-4 w-4" />}
                    </button>
                  );
                })
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="h-12 flex-1 rounded-full border-blush/40 text-green-deep"
              >
                Voltar
              </Button>
              <Button
                disabled={!picked}
                onClick={() => setStep(3)}
                className="h-12 flex-1 rounded-full bg-blush font-semibold text-cream hover:bg-blush/90"
              >
                Confirmar
              </Button>
            </div>
          </div>
        )}

        {step === 3 && picked && (
          <div className="space-y-5 py-2 text-center">
            {showSuccess ? (
              <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-sage/20 text-green-deep">
                  <Check className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-display text-lg text-green-deep">Entregamos aí! 📍</h3>
                  <p className="text-sm text-muted-foreground">
                    {picked} - {uf}
                  </p>
                </div>
                <div className="rounded-2xl bg-blush/15 p-3 text-green-deep">
                  <p className="text-[11px] uppercase tracking-wider opacity-60">Previsão</p>
                  <p className="text-base font-semibold">Grátis: 18 a 35 min</p>
                </div>
                <Button
                  onClick={() => onClose?.()}
                  className="h-12 w-full rounded-full bg-blush font-semibold text-cream hover:bg-blush/90"
                >
                  Ver catálogo
                </Button>
              </div>
            ) : (
              <>
                <h3 className="font-display text-lg text-green-deep">
                  Buscando em {picked}...
                </h3>
                <div className="mx-auto h-2 w-full overflow-hidden rounded-full bg-blush/15">
                  <div
                    className="h-full rounded-full bg-blush transition-[width] duration-100 ease-linear"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verificando disponibilidade...
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
