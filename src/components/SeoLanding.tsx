import { Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Truck, Clock, ShieldCheck, Heart, Star } from "lucide-react";
import { safeJsonLd } from "@/lib/json-ld";

export type SeoFaq = { q: string; a: string };

export type SeoLandingProps = {
  h1: string;
  intro: string;
  bullets: string[];
  sections: { title: string; body: string }[];
  faq: SeoFaq[];
  ctaLabel?: string;
};

export function SeoLanding({ h1, intro, bullets, sections, faq, ctaLabel = "Ver buquês disponíveis →" }: SeoLandingProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <article className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="font-display text-4xl text-green-deep md:text-5xl">{h1}</h1>
        <p className="mt-4 text-base text-muted-foreground">{intro}</p>

        <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
          <div className="rounded-2xl border border-border bg-card p-3 text-center">
            <Clock className="mx-auto h-5 w-5 text-green-deep" />
            <p className="mt-1 text-[11px] font-medium text-foreground">Entrega em 60min</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-3 text-center">
            <Truck className="mx-auto h-5 w-5 text-green-deep" />
            <p className="mt-1 text-[11px] font-medium text-foreground">Todo Brasil</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-3 text-center">
            <ShieldCheck className="mx-auto h-5 w-5 text-green-deep" />
            <p className="mt-1 text-[11px] font-medium text-foreground">Pagamento PIX</p>
          </div>
        </div>

        <ul className="mt-6 space-y-2">
          {bullets.map((b) => (
            <li key={b} className="flex gap-2 text-sm text-muted-foreground">
              <Heart className="mt-0.5 h-4 w-4 shrink-0 text-blush" /> <span>{b}</span>
            </li>
          ))}
        </ul>

        {sections.map((s) => (
          <section key={s.title} className="mt-8">
            <h2 className="font-display text-2xl text-green-deep">{s.title}</h2>
            <p className="mt-2 text-muted-foreground">{s.body}</p>
          </section>
        ))}

        {faq.length > 0 && (
          <section className="mt-10">
            <h2 className="font-display text-2xl text-green-deep">Perguntas frequentes</h2>
            <div className="mt-3 space-y-3">
              {faq.map((f) => (
                <details key={f.q} className="rounded-xl border border-border bg-card p-4">
                  <summary className="cursor-pointer text-sm font-semibold text-foreground">{f.q}</summary>
                  <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-green-deep px-6 py-3 text-sm font-medium text-cream"
          >
            <Star className="h-4 w-4" /> {ctaLabel}
          </Link>
          <Link
            to="/catalogo"
            search={{ tipo: "todos", cat: "", q: "" }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-cream px-6 py-3 text-sm font-medium text-foreground"
          >
            Ver catálogo completo
          </Link>
        </div>
      </article>
      <Footer />
    </div>
  );
}

export function buildLandingHead(opts: {
  path: string;
  title: string;
  description: string;
  keywords: string;
  faq: SeoFaq[];
  breadcrumbName: string;
}) {
  const SITE = "https://exact-pixel-perfect-797.lovable.app";
  const url = `${SITE}${opts.path}`;
  return {
    meta: [
      { title: opts.title },
      { name: "description", content: opts.description },
      { name: "keywords", content: opts.keywords },
      { property: "og:title", content: opts.title },
      { property: "og:description", content: opts.description },
      { property: "og:url", content: url },
      { property: "og:type", content: "website" },
      { property: "og:image", content: `${SITE}/og-default.jpg` },
    ],
    links: [{ rel: "canonical", href: url }],
    scripts: [
      {
        type: "application/ld+json",
        children: safeJsonLd({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Início", item: SITE },
                { "@type": "ListItem", position: 2, name: opts.breadcrumbName, item: url },
              ],
            },
            {
              "@type": "FAQPage",
              mainEntity: opts.faq.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
          ],
        }),
      },
    ],
  };
}
