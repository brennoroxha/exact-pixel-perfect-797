import { Link } from "@tanstack/react-router";

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

        <nav className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-green-deep">
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
