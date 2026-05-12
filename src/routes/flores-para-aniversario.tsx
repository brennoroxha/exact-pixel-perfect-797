import { createFileRoute } from "@tanstack/react-router";
import { SeoLanding, buildLandingHead } from "@/components/SeoLanding";

const FAQ = [
  { q: "Quais flores enviar para aniversário?", a: "Buquês coloridos de gérberas, girassóis, rosas mistas e cestas com chocolates são as opções mais alegres para aniversários." },
  { q: "Posso enviar com balão e bolo?", a: "Sim. Oferecemos combos com balão metalizado, bolo personalizado e flores no mesmo pacote." },
  { q: "Vocês fazem entrega no horário do parabéns?", a: "Sim. Você escolhe o horário exato — manhã, tarde ou noite — e nosso entregador chega pontualmente." },
];

export const Route = createFileRoute("/flores-para-aniversario")({
  head: () => buildLandingHead({
    path: "/flores-para-aniversario",
    title: "Flores para Aniversário com Entrega no Mesmo Dia | Floratta Express",
    description: "Buquês, cestas e combos com balão para aniversário. Entrega no horário do parabéns em todo o Brasil. Surpreenda com flores frescas e cartão personalizado.",
    keywords: "flores para aniversário, buquê de aniversário, presente de aniversário, flores parabéns, cesta de aniversário, surpresa de aniversário",
    faq: FAQ,
    breadcrumbName: "Flores para Aniversário",
  }),
  component: () => (
    <SeoLanding
      h1="Flores para aniversário — entrega no horário do parabéns"
      intro="Surpreenda quem você ama com flores frescas no dia do aniversário. A Floratta Express entrega buquês coloridos, cestas com chocolates e combos com balão metalizado pontualmente no horário escolhido — em qualquer cidade do Brasil."
      bullets={[
        "Buquês alegres de gérberas, girassóis e rosas mistas",
        "Combos com balão 'Feliz Aniversário' e bolo",
        "Cartão personalizado com sua mensagem",
        "Entrega cronometrada para o momento do parabéns",
      ]}
      sections={[
        { title: "Combinações que mais surpreendem", body: "Buquê + chocolate + balão é o trio perfeito para arrancar sorrisos. Para aniversários femininos, rosas pastel com Ferrero Rocher; para os masculinos, girassóis com chocolate Lindt." },
      ]}
      faq={FAQ}
    />
  ),
});
