import { createFileRoute } from "@tanstack/react-router";
import { SeoLanding, buildLandingHead } from "@/components/SeoLanding";

const FAQ = [
  { q: "Como funciona a entrega de flores hoje?", a: "Escolha o buquê, informe o endereço e finalize o pagamento via PIX. A entrega acontece no mesmo dia, em média em 60 minutos nas capitais." },
  { q: "Vocês entregam flores hoje em todo o Brasil?", a: "Sim. A Floratta Express entrega flores no mesmo dia em todas as capitais e mais de 200 municípios brasileiros." },
  { q: "Até que horas posso pedir flores para entrega hoje?", a: "Aceitamos pedidos 24h. Para garantir entrega no mesmo dia em cidades menores, recomendamos finalizar até as 16h." },
  { q: "Posso enviar flores com cartão personalizado hoje?", a: "Sim. Você escreve a mensagem no checkout e o cartão vai escrito à mão junto com o buquê." },
];

export const Route = createFileRoute("/entrega-de-flores-hoje")({
  head: () => buildLandingHead({
    path: "/entrega-de-flores-hoje",
    title: "Entrega de Flores Hoje em Todo o Brasil | Floratta Express",
    description: "Precisa enviar flores hoje? Compre agora e a entrega acontece no mesmo dia. Buquês de rosas, girassóis, orquídeas, cestas e combos românticos com entrega expressa.",
    keywords: "entrega de flores hoje, flores entrega hoje, enviar flores hoje, comprar flores entrega hoje, flores no mesmo dia, entrega de flores mesmo dia, buquê entrega hoje",
    faq: FAQ,
    breadcrumbName: "Entrega de flores hoje",
  }),
  component: () => (
    <SeoLanding
      h1="Entrega de flores hoje em todo o Brasil"
      intro="Precisa enviar flores hoje? Na Floratta Express você compra agora e a entrega acontece no mesmo dia. Buquês de rosas vermelhas, girassóis, orquídeas, cestas de café da manhã e combos românticos — tudo com entrega expressa em todo o Brasil."
      bullets={[
        "Entrega no mesmo dia em todas as capitais e mais de 200 cidades",
        "Buquês de rosas, girassóis, orquídeas, cestas e combos com chocolate",
        "Pagamento via PIX com aprovação instantânea",
        "Código de rastreio em tempo real e foto da entrega",
      ]}
      sections={[
        { title: "Mais pedidos para entrega hoje", body: "Buquês de rosas vermelhas premium, rosas spray no kraft, rosas colombianas e astromélias no vaso de vidro estão entre os mais escolhidos para envio no mesmo dia. Todos disponíveis a partir de R$ 52." },
        { title: "Como funciona a entrega de flores no mesmo dia", body: "Escolha o buquê e adicione um cartão personalizado. Informe o endereço de entrega em qualquer cidade do Brasil. Pague via PIX com aprovação instantânea. Receba o código de rastreio e acompanhe a entrega em tempo real." },
        { title: "Flores para presente com entrega no mesmo dia", body: "Ideal para aniversário, pedido de desculpas, Dia dos Namorados, nascimento e datas especiais. Cada buquê é montado na hora com flores selecionadas e despachado em minutos." },
      ]}
      faq={FAQ}
    />
  ),
});
