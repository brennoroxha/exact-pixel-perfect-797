import { Link } from "@tanstack/react-router";

const TOP_CITIES: { slug: string; name: string }[] = [
  { slug: "sao-paulo", name: "São Paulo" },
  { slug: "rio-de-janeiro", name: "Rio de Janeiro" },
  { slug: "belo-horizonte", name: "Belo Horizonte" },
  { slug: "brasilia", name: "Brasília" },
  { slug: "porto-alegre", name: "Porto Alegre" },
  { slug: "curitiba", name: "Curitiba" },
  { slug: "salvador", name: "Salvador" },
  { slug: "fortaleza", name: "Fortaleza" },
  { slug: "recife", name: "Recife" },
  { slug: "vila-velha", name: "Vila Velha" },
  { slug: "vitoria", name: "Vitória" },
  { slug: "campinas", name: "Campinas" },
];

export function Footer() {
  return (
    <footer className="mt-16 bg-blush/20">
      <div className="mx-auto max-w-3xl px-4 py-10 text-center">
        <h3 className="font-display text-2xl font-bold text-green-deep">
          FLORATTA EXPRESS
        </h3>
        <p className="mt-1 text-sm text-foreground/80">
          Levando emoção em cada pétala 🌹
        </p>

        <p className="mt-3 text-xs text-muted-foreground">
          Floricultura online aberta 24h
          <span className="mx-2">·</span>
          Entregas rápidas em todo o Brasil
        </p>

        <section className="mt-6 border-t border-border/60 pt-5 text-left">
          <h4 className="text-center text-xs font-bold uppercase tracking-wider text-green-deep">
            Principais cidades atendidas
          </h4>
          <nav className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-xs text-green-deep">
            {TOP_CITIES.map((c) => (
              <Link
                key={c.slug}
                to="/entrega/$cidade"
                params={{ cidade: c.slug }}
                className="hover:underline"
              >
                Floricultura em {c.name}
              </Link>
            ))}
          </nav>
        </section>

        <nav className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-green-deep">
          <Link to="/sobre" className="hover:underline">Sobre nós</Link>
          <Link to="/contato" className="hover:underline">Fale conosco</Link>
          <Link to="/politica-de-entrega" className="hover:underline">Política de entrega</Link>
          <Link to="/politica-de-devolucao" className="hover:underline">Trocas e devoluções</Link>
        </nav>
        <nav className="mt-2 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-green-deep">
          <Link to="/politica-de-privacidade" className="hover:underline">Privacidade</Link>
          <Link to="/termos-e-condicoes" className="hover:underline">Termos de uso</Link>
        </nav>

        <p className="mt-6 text-[11px] text-muted-foreground">
          Express Flor da Penha Ltda. — CNPJ 53.848.207/0001-87
        </p>
        <p className="mt-1 text-[11px] text-muted-foreground">
          © {new Date().getFullYear()} Floratta Express · Todos os direitos reservados
        </p>
      </div>
    </footer>
  );
}
