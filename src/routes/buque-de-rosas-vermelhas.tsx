import { createFileRoute } from "@tanstack/react-router";
import { SeoLanding, buildLandingHead } from "@/components/SeoLanding";

const FAQ = [
  { q: "Quantas rosas tem em um buquê de rosas vermelhas?", a: "Trabalhamos com buquês de 6, 10, 12, 24 e 50 rosas vermelhas. O modelo de 12 rosas é o mais tradicional para presente romântico." },
  { q: "As rosas vermelhas são frescas?", a: "Sim. Todas as rosas vermelhas são montadas no momento do despacho, com flores selecionadas e hidratadas para chegar em perfeitas condições." },
  { q: "Posso enviar um buquê de rosas vermelhas com cartão?", a: "Sim. Você pode incluir uma mensagem personalizada no cartão sem custo adicional, com entrega no mesmo dia." },
  { q: "Quanto custa um buquê de rosas vermelhas?", a: "Os buquês de rosas vermelhas começam em R$ 89, com opções premium importadas a partir de R$ 189." },
];

export const Route = createFileRoute("/buque-de-rosas-vermelhas")({
  head: () => buildLandingHead({
    path: "/buque-de-rosas-vermelhas",
    title: "Buquê de Rosas Vermelhas com Entrega Hoje | A partir de R$ 89 | Floratta Express",
    description: "Buquês de rosas vermelhas frescas com entrega no mesmo dia em todo o Brasil. Modelos de 6, 12, 24 e 50 rosas, com cartão personalizado. A partir de R$ 89.",
    keywords: "buquê de rosas vermelhas, buque de rosas vermelhas, comprar buquê de rosas, rosas vermelhas entrega, buquê 12 rosas, buquê 24 rosas, dúzia de rosas vermelhas, rosas colombianas",
    faq: FAQ,
    breadcrumbName: "Buquê de Rosas Vermelhas",
  }),
  component: () => (
    <SeoLanding
      h1="Buquê de rosas vermelhas com entrega no mesmo dia"
      intro="A rosa vermelha é o símbolo universal do amor verdadeiro. Na Floratta Express, você compra buquês de rosas vermelhas frescas, montados na hora e entregues em até 60 minutos nas principais capitais — perfeitos para declarações, aniversários, pedidos de namoro e datas especiais."
      bullets={[
        "Modelos de 6, 10, 12, 24 e 50 rosas vermelhas",
        "Rosas nacionais e importadas (colombianas) premium",
        "Embalagem em papel kraft, celofane ou caixa rústica",
        "Cartão de mensagem incluso sem custo adicional",
      ]}
      sections={[
        { title: "Significado das rosas vermelhas", body: "A rosa vermelha representa amor profundo, paixão e respeito. Um buquê com 12 rosas é a forma clássica de dizer 'eu te amo'; 24 rosas significam 'sou seu para sempre'; 50 ou 100 rosas são reservadas para grandes declarações e pedidos de casamento." },
        { title: "Como cuidar do buquê após a entrega", body: "Para que as rosas durem mais, corte as hastes na diagonal, troque a água do vaso a cada 2 dias e mantenha o buquê longe do sol direto. Com esses cuidados, suas rosas vermelhas duram entre 7 e 10 dias." },
      ]}
      faq={FAQ}
    />
  ),
});
