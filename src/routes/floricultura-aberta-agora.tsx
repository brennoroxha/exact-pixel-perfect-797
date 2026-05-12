import { createFileRoute } from "@tanstack/react-router";
import { SeoLanding, buildLandingHead } from "@/components/SeoLanding";

const FAQ = [
  { q: "A floricultura está aberta agora?", a: "Sim. A Floratta Express atende online 24 horas por dia, todos os dias. Você pode fazer seu pedido a qualquer hora e a entrega é despachada imediatamente após a confirmação do pagamento." },
  { q: "Em quanto tempo as flores chegam?", a: "Em até 60 minutos nas principais cidades do Brasil, com entrega no mesmo dia em todo o território nacional." },
  { q: "Vocês entregam de madrugada?", a: "Sim. Nosso atendimento é 24h e fazemos entregas urgentes em horários estendidos." },
  { q: "Quais formas de pagamento aceitam?", a: "PIX (confirmação imediata), cartão de crédito e cartão de débito." },
];

export const Route = createFileRoute("/floricultura-aberta-agora")({
  head: () => buildLandingHead({
    path: "/floricultura-aberta-agora",
    title: "Floricultura Aberta Agora 24h | Entrega de Flores Hoje | Floratta Express",
    description: "Floricultura aberta agora com entrega de flores no mesmo dia em todo o Brasil. Atendimento 24h, buquês de rosas, presente urgente, pagamento via PIX.",
    keywords: "floricultura aberta agora, floricultura aberta 24 horas, floricultura entregando agora, floricultura perto de mim aberta, comprar flores agora, entrega de flores urgente",
    faq: FAQ,
    breadcrumbName: "Floricultura aberta agora",
  }),
  component: () => (
    <SeoLanding
      h1="Floricultura aberta agora — entrega de flores em até 60 minutos"
      intro="Precisa enviar flores agora mesmo? A Floratta Express é a floricultura online aberta 24 horas por dia, com entrega no mesmo dia em todas as regiões do Brasil. Buquês frescos, montagem rápida e despacho imediato após a confirmação do pagamento via PIX."
      bullets={[
        "Atendimento 24h, todos os dias — incluindo feriados e madrugada",
        "Entrega expressa em até 60 minutos nas principais capitais",
        "Confirmação imediata por WhatsApp e foto da entrega",
        "Buquês montados na hora com flores selecionadas",
      ]}
      sections={[
        { title: "Por que escolher uma floricultura 24h online", body: "Quando você precisa de flores urgentes — para um pedido de desculpas, surpresa de aniversário, agradecimento ou condolências — não dá pra esperar a floricultura do bairro abrir. A Floratta Express opera com entregadores 24h e estoque sempre disponível, garantindo que seu pedido saia em minutos." },
        { title: "Como funciona o pedido urgente", body: "Escolha o buquê, informe o endereço e o nome do destinatário, finalize o pagamento via PIX e pronto: nosso entregador parte imediatamente. Você acompanha tudo pelo WhatsApp e recebe a foto da entrega assim que as flores chegarem." },
      ]}
      faq={FAQ}
    />
  ),
});
