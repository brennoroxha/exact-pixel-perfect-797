import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const SITE_URL = "https://exact-pixel-perfect-797.lovable.app";

export const Route = createFileRoute("/entrega/$cidade")({
  head: ({ params }) => {
    const name = params.cidade.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
    const url = `${SITE_URL}/entrega/${params.cidade}`;
    return {
      meta: [
        { title: `Floricultura em ${name} com Entrega Hoje | Floratta Express` },
        { name: "description", content: `Floricultura aberta agora em ${name}. Entrega de flores no mesmo dia em até 60 minutos. Buquês de rosas, flores para namorada, presente e aniversário com pagamento via PIX.` },
        { name: "keywords", content: `floricultura ${name.toLowerCase()}, floricultura em ${name.toLowerCase()}, entrega de flores ${name.toLowerCase()}, flores ${name.toLowerCase()}, floricultura aberta ${name.toLowerCase()}, comprar flores ${name.toLowerCase()}` },
        { property: "og:title", content: `Floricultura em ${name} — Entrega de Flores Hoje` },
        { property: "og:description", content: `Buquês entregues em ${name} em até 60 minutos. Floricultura aberta agora.` },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "LocalBusiness",
                "@id": `${url}#localbusiness`,
                name: `Floratta Express — Floricultura em ${name}`,
                url,
                image: `${SITE_URL}/og-default.jpg`,
                priceRange: "$$",
                areaServed: { "@type": "City", name },
                address: { "@type": "PostalAddress", addressLocality: name, addressCountry: "BR" },
                openingHoursSpecification: [{
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
                  opens: "00:00", closes: "23:59",
                }],
              },
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Início", item: SITE_URL },
                  { "@type": "ListItem", position: 2, name: "Entrega", item: `${SITE_URL}/catalogo` },
                  { "@type": "ListItem", position: 3, name: `Entrega em ${name}`, item: url },
                ],
              },
              {
                "@type": "FAQPage",
                mainEntity: [
                  {
                    "@type": "Question",
                    name: `Vocês entregam flores em ${name} no mesmo dia?`,
                    acceptedAnswer: { "@type": "Answer", text: `Sim. A Floratta Express entrega buquês e arranjos em ${name} no mesmo dia, em até 60 minutos após a confirmação do pagamento.` },
                  },
                  {
                    "@type": "Question",
                    name: `Qual o horário de funcionamento da floricultura em ${name}?`,
                    acceptedAnswer: { "@type": "Answer", text: `Atendemos ${name} 24 horas por dia, todos os dias da semana, incluindo feriados.` },
                  },
                  {
                    "@type": "Question",
                    name: `Quais formas de pagamento são aceitas para entrega em ${name}?`,
                    acceptedAnswer: { "@type": "Answer", text: "Aceitamos PIX (com confirmação imediata), cartão de crédito e cartão de débito." },
                  },
                  {
                    "@type": "Question",
                    name: `É possível enviar flores anônimas ou com cartão de mensagem em ${name}?`,
                    acceptedAnswer: { "@type": "Answer", text: `Sim. Em ${name} você pode enviar surpresas anônimas ou incluir um cartão personalizado com mensagem para namorada, aniversário, agradecimento e outras ocasiões.` },
                  },
                ],
              },
            ],
          }),
        },
      ],
    };
  },
  component: CityPage,
});


function CityPage() {
  const { cidade } = Route.useParams();
  const name = cidade.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <article className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="font-display text-4xl text-green-deep md:text-5xl">
          Floricultura em {name} com entrega hoje
        </h1>
        <p className="mt-4 text-muted-foreground">
          A Floratta Express é a floricultura online aberta agora em {name}, com entrega de flores
          no mesmo dia em até 60 minutos. Encontre buquês de rosas vermelhas, flores para namorada,
          presentes de aniversário, arranjos e cestas, com pagamento via PIX ou cartão.
        </p>

        <h2 className="mt-8 font-display text-2xl text-green-deep">
          Entrega rápida de flores em {name}
        </h2>
        <p className="mt-2 text-muted-foreground">
          Atendemos {name} todos os dias, 24 horas. Faça seu pedido online e receba flores frescas
          diretamente no endereço escolhido — ideal para presentes de última hora, surpresas,
          aniversário, namorada, agradecimento e datas comemorativas.
        </p>

        <h2 className="mt-8 font-display text-2xl text-green-deep">
          Mais buscados em {name}
        </h2>
        <ul className="mt-2 list-disc pl-6 text-muted-foreground">
          <li>Buquê de rosas vermelhas com entrega em {name}</li>
          <li>Buquê de rosas colombianas premium</li>
          <li>Cestas e combos de presente com chocolate</li>
          <li>Flores para namorada com cartão de mensagem</li>
          <li>Arranjos para aniversário e parabéns</li>
        </ul>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/" className="inline-block rounded-full bg-green-deep px-6 py-3 text-sm text-cream">
            Ver buquês para {name} →
          </Link>
          <Link to="/catalogo" search={{ tipo: "todos", cat: "", q: "" }} className="inline-block rounded-full border border-border bg-cream px-6 py-3 text-sm text-foreground">
            Catálogo completo
          </Link>
        </div>
      </article>
      <Footer />
    </div>
  );
}
