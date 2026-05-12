import { createFileRoute } from "@tanstack/react-router";
import { SeoLanding, buildLandingHead } from "@/components/SeoLanding";

const FAQ = [
  { q: "Quais flores enviar no Dia dos Namorados?", a: "Rosas vermelhas são as preferidas — especialmente buquês de 12 ou 24 unidades. Cestas com vinho, chocolates e ursos de pelúcia também são muito procurados." },
  { q: "Posso agendar entrega para o Dia dos Namorados?", a: "Sim. Agende a entrega para o dia e período exatos no checkout. Recomendamos antecedência de pelo menos 24h." },
  { q: "Vocês fazem entrega anônima ou surpresa?", a: "Sim. Você pode optar por entrega-surpresa, sem informar quem enviou — apenas com a mensagem do cartão." },
];

export const Route = createFileRoute("/dia-dos-namorados")({
  head: () => buildLandingHead({
    path: "/dia-dos-namorados",
    title: "Flores para o Dia dos Namorados com Entrega Romântica | Floratta Express",
    description: "Presentes para Dia dos Namorados: buquês de rosas vermelhas, cestas com vinho e chocolate, ursos de pelúcia. Entrega agendada e surpresa em todo o Brasil.",
    keywords: "flores dia dos namorados, presente dia dos namorados, buquê dia dos namorados, rosas vermelhas namorada, cesta dia dos namorados, surpresa namorada",
    faq: FAQ,
    breadcrumbName: "Dia dos Namorados",
  }),
  component: () => (
    <SeoLanding
      h1="Flores para o Dia dos Namorados — surpresa romântica garantida"
      intro="Faça do 12 de junho um dia inesquecível. A Floratta Express entrega buquês de rosas vermelhas, cestas com vinho e chocolates, e combos românticos diretamente para a sua pessoa especial — com entrega agendada e opção de surpresa anônima."
      bullets={[
        "Buquês de rosas vermelhas 12, 24 e 50 unidades",
        "Cestas românticas com vinho, chocolate Lindt e Ferrero Rocher",
        "Cartão romântico personalizado",
        "Entrega-surpresa: ela só descobre quando abrir",
      ]}
      sections={[
        { title: "O presente perfeito para a namorada", body: "Não é só flor — é mensagem. O buquê de 12 rosas vermelhas significa 'eu te amo' de forma clássica. Combine com chocolates premium e um cartão escrito por você para um presente memorável." },
        { title: "Entrega no Dia dos Namorados em qualquer cidade", body: "Mesmo que vocês estejam separados pela distância, sua surpresa chega. Atendemos todas as capitais e mais de 200 cidades brasileiras com entrega no mesmo dia, em horário escolhido por você." },
      ]}
      faq={FAQ}
    />
  ),
});
