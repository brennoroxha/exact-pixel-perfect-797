import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { Footer } from "./Footer";

export function LegalPage({
  title,
  subtitle,
  updatedAt = "12 de maio de 2026",
  children,
}: {
  title: string;
  subtitle?: string;
  updatedAt?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-cream pb-10">
      <div className="mx-auto max-w-2xl px-4 pt-4">
        <div className="flex items-center justify-between rounded-2xl bg-card px-3 py-2.5 shadow-soft">
          <Link
            to="/"
            className="flex items-center gap-1 text-sm font-bold tracking-wide text-green-deep hover:opacity-80"
          >
            <ChevronLeft className="h-4 w-4" /> VOLTAR
          </Link>
          <span className="text-[10px] font-bold tracking-wider text-muted-foreground">
            FLORATTA EXPRESS
          </span>
        </div>

        <header className="mt-3 rounded-2xl bg-card p-6 shadow-soft">
          <h1 className="font-display text-2xl font-semibold text-green-deep md:text-3xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-sm text-foreground/80">{subtitle}</p>
          )}
          <p className="mt-3 text-xs text-muted-foreground">
            Última atualização: {updatedAt}
          </p>
        </header>

        <article
          className="prose prose-sm mt-3 max-w-none rounded-2xl bg-card p-6 shadow-soft
            prose-headings:font-display prose-headings:text-green-deep
            prose-h2:mt-6 prose-h2:text-lg prose-h2:font-semibold
            prose-h3:text-base prose-h3:font-semibold
            prose-p:text-foreground/85 prose-p:leading-relaxed
            prose-li:text-foreground/85
            prose-strong:text-green-deep
            prose-a:text-green-mid prose-a:font-medium hover:prose-a:underline"
        >
          {children}
        </article>

        <div className="mt-4 rounded-2xl bg-card p-5 text-center text-xs text-muted-foreground shadow-soft">
          <strong className="text-green-deep">Floratta Express</strong> — Atendimento ao cliente:{" "}
          <a className="text-green-mid" href="mailto:contato@florattaexpress.delivery">
            contato@florattaexpress.delivery
          </a>{" "}
          • WhatsApp:{" "}
          <a className="text-green-mid" href="https://wa.me/5511998119893">
            (11) 99811-9893
          </a>
        </div>
      </div>
      <Footer />
    </div>
  );
}
