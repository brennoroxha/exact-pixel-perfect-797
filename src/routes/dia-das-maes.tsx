import { createFileRoute } from "@tanstack/react-router";
import { SeoLanding, buildLandingHead } from "@/components/SeoLanding";

const FAQ = [
  { q: "Quais flores enviar para o Dia das Mães?", a: "As favoritas são rosas em tons pastel, lírios, orquídeas e cestas com chocolates. Cestas com flores e bombons são o presente mais pedido para o Dia das Mães." },
  { q: "Posso agendar a entrega para o Dia das Mães?", a: "Sim. Você escolhe o dia exato da entrega no checkout. Recomendamos agendar com antecedência, pois é a data mais movimentada do ano em floricultura." },
  { q: "Vocês entregam no domingo do Dia das Mães?", a: "Sim. Operamos normalmente no domingo do Dia das Mães em todo o Brasil." },
  { q: "Posso enviar flores para minha mãe em outra cidade?", a: "Sim. A Floratta Express entrega em todas as 27 capitais e mais de 200 municípios brasileiros, no mesmo dia." },
];

export const Route = createFileRoute("/dia-das-maes")({
  head: () => buildLandingHead({
    path: "/dia-das-maes",
    title: "Flores para o Dia das Mães 2026 com Entrega no Domingo | Floratta Express",
    description: "Presentes para o Dia das Mães: buquês, cestas com chocolate, orquídeas e arranjos especiais com entrega agendada para o domingo. A partir de R$ 89.",
    keywords: "flores dia das mães, presente dia das mães, buquê dia das mães, cesta dia das mães, flores para mãe, comprar flores dia das maes, entrega domingo dia das maes",
    faq: FAQ,
    breadcrumbName: "Dia das Mães",
  }),
  component: () => (
    <SeoLanding
      h1="Flores para o Dia das Mães com entrega agendada no domingo"
      intro="O Dia das Mães merece o presente mais sincero. A Floratta Express oferece buquês exclusivos, cestas com chocolates e arranjos especiais com entrega agendada para o domingo — em qualquer cidade do Brasil. Faça sua mãe sorrir mesmo à distância."
      bullets={[
        "Entrega no domingo do Dia das Mães em todo o Brasil",
        "Cestas com flores e chocolates Lindt, Ferrero, Cacau Show",
        "Buquês de rosas pastel, lírios e orquídeas",
        "Cartão personalizado escrito à mão",
      ]}
      sections={[
        { title: "Os presentes mais pedidos para o Dia das Mães", body: "Buquês de rosas champagne e cor de rosa lideram a procura, seguidos por cestas combinando flores e chocolates premium. Para mães mais sofisticadas, orquídeas no vaso são opção duradoura — vivem por meses dentro de casa." },
        { title: "Garanta a entrega: agende com antecedência", body: "O Dia das Mães é a data com maior volume de pedidos do ano. Agende sua compra com pelo menos 48h de antecedência para garantir o horário ideal de entrega — manhã, tarde ou final de tarde." },
      ]}
      faq={FAQ}
    />
  ),
});
