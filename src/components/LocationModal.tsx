import { useEffect, useMemo, useState } from "react";
import { Search, MapPin, Check, Flower2, Loader2 } from "lucide-react";
import { BR_STATES, stateName } from "@/lib/br-states";
// Cidades carregadas sob demanda (lazy) para não inflar o bundle inicial
import { useLocationStore, type SavedLocation } from "@/stores/location";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
  const [searchMsg, setSearchMsg] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [autoDetecting, setAutoDetecting] = useState(true);
  const [citiesByState, setCitiesByState] = useState<Record<string, string[]>>({});

  // Lazy-load the cities list on mount (chunk separated from main bundle)
  useEffect(() => {
    let cancelled = false;
    import("@/lib/br-cities").then((m) => {
      if (!cancelled) setCitiesByState(m.citiesByState);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Auto-detect via IP geolocation on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch("https://ipapi.co/json/");
        const data = await r.json();
        if (cancelled) return;
        const detectedUf: string | undefined = data?.region_code;
        const detectedCity: string | undefined = data?.city;
        if (detectedUf && citiesByState[detectedUf]) {
          setUf(detectedUf);
          if (detectedCity) {
            const list = citiesByState[detectedUf];
            const match = list.find(
              (c) => slugify(c) === slugify(detectedCity),
            );
            if (match) {
              setPicked(match);
              setSearch(match);
            } else {
              setSearch(detectedCity);
            }
          }
        }
      } catch {}
      if (!cancelled) setAutoDetecting(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const cities = useMemo(() => (uf ? citiesByState[uf] || [] : []), [uf]);
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    const list = q
      ? cities.filter((c) => c.toLowerCase().includes(q))
      : cities;
    return list.slice(0, 50);
  }, [cities, search]);

  // Step 3 progression — 1.2s
  useEffect(() => {
    if (step !== 3 || !picked || !uf) return;
    setProgress(0);
    setSearchMsg(0);
    setShowSuccess(false);
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const p = Math.min(100, (elapsed / 1200) * 100);
      setProgress(p);
      setSearchMsg(Math.min(2, Math.floor(elapsed / 400)));
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

  const useGeolocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const r = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`,
        );
        const data = await r.json();
        const cityName: string =
          data.address?.city || data.address?.town || data.address?.municipality || "";
        const stateUf = (data.address?.["ISO3166-2-lvl4"] || "").split("-")[1];
        if (stateUf) setUf(stateUf);
        if (cityName) setSearch(cityName);
      } catch {}
    });
  };

  const messages = [
    "Verificando disponibilidade de entrega...",
    "Encontrando os buquês mais frescos...",
    "Preparando ofertas exclusivas para você...",
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-green-deep/95 px-4 animate-in fade-in duration-200">
      <div className="relative z-10 w-full max-w-xl rounded-3xl bg-cream p-8 shadow-float md:p-10 animate-in zoom-in-95 duration-200">
        <div className="mb-6 flex items-center justify-center gap-2">
          <Flower2 className="h-6 w-6 text-green-deep" />
          <span className="font-display text-2xl text-green-deep">Flora Luxe</span>
        </div>

        {step === 1 && (
          <div className="space-y-5">
            <div className="text-center">
              <h2 className="font-display text-3xl text-green-deep">Onde você está? 🌿</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {autoDetecting
                  ? "Detectando sua localização..."
                  : uf
                  ? "Detectamos seu estado. Confirme ou escolha outro."
                  : "Selecione seu estado para encontrar flores frescas perto de você"}
              </p>
            </div>

            <button
              onClick={useGeolocation}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-green-sage bg-cream-dark px-4 py-2.5 text-sm font-medium text-green-deep transition hover:bg-green-sage/20"
            >
              <MapPin className="h-4 w-4" /> Usar minha localização
            </button>

            <div className="grid max-h-[42vh] grid-cols-3 gap-2 overflow-y-auto rounded-2xl bg-cream-dark/40 p-3 sm:grid-cols-4 md:grid-cols-5">
              {BR_STATES.map((s) => {
                const active = uf === s.uf;
                return (
                  <button
                    key={s.uf}
                    onClick={() => {
                      setUf(s.uf);
                      setPicked(null);
                      setSearch("");
                    }}
                    className={`flex flex-col items-center justify-center rounded-xl border-2 px-2 py-2.5 text-center transition ${
                      active
                        ? "border-green-deep bg-green-deep text-cream"
                        : "border-transparent bg-cream text-green-deep hover:border-green-sage"
                    }`}
                  >
                    <span className="font-display text-base font-semibold">{s.uf}</span>
                    <span className="text-[10px] opacity-80">{s.name.split(" ")[0]}</span>
                  </button>
                );
              })}
            </div>

            <Button
              disabled={!uf}
              onClick={() => setStep(2)}
              className="w-full rounded-full bg-green-deep py-6 text-base text-cream hover:bg-green-mid"
            >
              Continuar →
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div className="text-center">
              <h2 className="font-display text-3xl text-green-deep">Agora sua cidade 🏙️</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {picked ? (
                  <>
                    Detectamos <strong>{picked}</strong>. Confirme ou escolha outra cidade em{" "}
                    <strong>{stateName(uf)}</strong>.
                  </>
                ) : (
                  <>
                    Selecione ou busque sua cidade em <strong>{stateName(uf)}</strong>
                  </>
                )}
              </p>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar cidade..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-full border-green-sage/30 bg-cream-dark pl-10"
              />
            </div>

            <div className="max-h-[40vh] space-y-1.5 overflow-y-auto rounded-2xl bg-cream-dark/40 p-2">
              {filtered.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  Nenhuma cidade encontrada.
                </div>
              ) : (
                filtered.map((c) => {
                  const active = picked === c;
                  return (
                    <button
                      key={c}
                      onClick={() => setPicked(c)}
                      className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition ${
                        active
                          ? "bg-green-deep text-cream"
                          : "bg-cream text-green-deep hover:bg-green-sage/15"
                      }`}
                    >
                      <span>
                        <span className="font-medium">{c}</span>
                        <span className="ml-2 text-xs opacity-70">{uf}</span>
                      </span>
                      {active && <Check className="h-5 w-5" />}
                    </button>
                  );
                })
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1 rounded-full border-green-sage/40"
              >
                Voltar
              </Button>
              <Button
                disabled={!picked}
                onClick={() => setStep(3)}
                className="flex-1 rounded-full bg-green-deep py-6 text-cream hover:bg-green-mid"
              >
                Confirmar →
              </Button>
            </div>
          </div>
        )}

        {step === 3 && picked && (
          <div className="space-y-6 py-6 text-center">
            {showSuccess ? (
              <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-sage/20 text-green-deep">
                  <Check className="h-10 w-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-display text-2xl text-green-deep">Cidade encontrada! 📍</h3>
                  <p className="text-green-deep/70">
                    Estamos a <strong className="text-green-deep">2.75km</strong> de distância.
                  </p>
                </div>
                <div className="mx-auto max-w-[280px] rounded-2xl bg-green-deep/5 p-4 text-green-deep">
                  <p className="text-xs uppercase tracking-wider opacity-60">Previsão de Entrega</p>
                  <p className="text-lg font-semibold">Grátis: 18 a 35 minutos</p>
                </div>
                <Button
                  onClick={() => onClose?.()}
                  className="w-full rounded-full bg-green-deep py-6 text-base text-cream hover:bg-green-mid"
                >
                  Ver catálogo →
                </Button>
              </div>
            ) : (
              <>
                <div className="mx-auto inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-sage/20">
                  <Flower2 className="h-10 w-10 text-green-deep animate-pulse" />
                </div>
                <h3 className="font-display text-2xl text-green-deep">
                  Buscando floriculturas em {picked} 🌸
                </h3>
                <div className="mx-auto h-2 w-full max-w-sm overflow-hidden rounded-full bg-cream-dark">
                  <div
                    className="h-full rounded-full bg-green-deep transition-[width] duration-100 ease-linear"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {messages[searchMsg]}
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
