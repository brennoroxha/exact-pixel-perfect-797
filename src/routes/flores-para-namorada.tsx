import { createFileRoute } from "@tanstack/react-router";
import { SeoLanding, buildLandingHead } from "@/components/SeoLanding";

const FAQ = [
  { q: "Qual o melhor buquê para namorada?", a: "Buquês de rosas vermelhas (12 ou 24 unidades) são os mais clássicos. Para um toque diferente, rosas champagne, cor de rosa ou tulipas também encantam." },
  { q: "Posso fazer surpresa para minha namorada?", a: "Sim. Escolha entrega-surpresa no checkout — ela só descobre quem enviou pelo cartão." },
  { q: "Vocês entregam no trabalho dela?", a: "Sim. Entregamos em residências, empresas, escolas e qualquer endereço comercial dentro do horário comercial ou estendido." },
];

export const Route = createFileRoute("/flores-para-namorada")({
  head: () => buildLandingHead({
    path: "/flores-para-namorada",
    title: "Flores para Namorada com Entrega Surpresa no Mesmo Dia | Floratta Express",
    description: "Surpreenda sua namorada com buquês de rosas vermelhas, cestas românticas e combos com chocolate. Entrega-surpresa em casa ou no trabalho, em todo o Brasil.",
    keywords: "flores para namorada, buquê para namorada, surpresa para namorada, presente para namorada, rosas para namorada, entrega surpresa namorada",
    faq: FAQ,
    breadcrumbName: "Flores para Namorada",
  }),
  component: () => (
    <SeoLanding
      h1="Flores para namorada — surpresa romântica com entrega no mesmo dia"
      intro="Diga 'eu te amo' do jeito mais bonito. A Floratta Express entrega buquês de rosas vermelhas, cestas com chocolate e combos românticos diretamente para sua namorada — em casa, no trabalho ou onde ela estiver, com entrega-surpresa em até 60 minutos."
      bullets={[
        "Buquês de rosas vermelhas, champagne e cor de rosa",
        "Cestas com chocolate Ferrero, Lindt e Cacau Show",
        "Cartão romântico personalizado com sua mensagem",
        "Entrega-surpresa: ela só descobre na hora de abrir",
      ]}
      sections={[
        { title: "Quando enviar flores para a namorada", body: "Não precisa ser data especial. Um 'só porque sim' no meio da semana, depois de uma briga, no dia em que ela menos espera — esses são os momentos que mais marcam. Surpresa sem motivo vale por dez datas comemorativas." },
      ]}
      faq={FAQ}
    />
  ),
});
