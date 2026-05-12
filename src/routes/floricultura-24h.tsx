import { createFileRoute } from "@tanstack/react-router";
import { SeoLanding, buildLandingHead } from "@/components/SeoLanding";

const FAQ = [
  { q: "A floricultura funciona 24 horas?", a: "Sim. A Floratta Express é uma floricultura 24h online — você faz o pedido a qualquer hora do dia ou da noite e nosso time despacha imediatamente." },
  { q: "Vocês entregam de madrugada e em finais de semana?", a: "Sim. Operamos todos os dias, 24h por dia, incluindo madrugada, finais de semana e feriados nacionais." },
  { q: "Quanto tempo demora a entrega de uma floricultura 24h?", a: "Em média 60 minutos nas capitais. Para cidades menores, a entrega no mesmo dia é garantida." },
];

export const Route = createFileRoute("/floricultura-24h")({
  head: () => buildLandingHead({
    path: "/floricultura-24h",
    title: "Floricultura 24 Horas com Entrega no Mesmo Dia | Floratta Express",
    description: "Floricultura 24h online: entrega de flores em qualquer horário, todos os dias. Buquês de rosas, arranjos e presentes com entrega no mesmo dia.",
    keywords: "floricultura 24h, floricultura 24 horas, floricultura online 24h, entrega de flores 24 horas, floricultura noturna, flores madrugada",
    faq: FAQ,
    breadcrumbName: "Floricultura 24h",
  }),
  component: () => (
    <SeoLanding
      h1="Floricultura 24 horas — entrega de flores a qualquer hora do dia"
      intro="A Floratta Express é a floricultura 24h mais ágil do Brasil. Atendemos pedidos online dia e noite, com entregadores prontos para sair no minuto seguinte à confirmação do pagamento. Ideal para surpresas de última hora, declarações de madrugada e presentes inesperados."
      bullets={[
        "Pedidos aceitos 24h por dia, 7 dias por semana",
        "Entrega noturna e de madrugada disponível em capitais",
        "Suporte por WhatsApp em tempo real",
        "Pagamento via PIX com confirmação instantânea",
      ]}
      sections={[
        { title: "Floricultura noturna: quando contar com a Floratta", body: "Nem toda emoção espera o sol nascer. Para um pedido de casamento à meia-noite, uma surpresa de aniversário pontual ou uma declaração espontânea, a Floratta Express é a única floricultura realmente 24h, com entregadores ativos durante toda a madrugada nas principais cidades." },
        { title: "Cobertura nacional, atendimento sem pausa", body: "Cobrimos todas as 27 capitais brasileiras e mais de 200 municípios com entrega no mesmo dia. Em qualquer lugar do Brasil, a qualquer hora, sua mensagem em flores chega no tempo certo." },
      ]}
      faq={FAQ}
    />
  ),
});
