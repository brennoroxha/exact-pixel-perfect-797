import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage } from "@/components/LegalPage";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre a Floratta Express — Floricultura com entrega expressa" },
      {
        name: "description",
        content:
          "Conheça a história, missão e valores da Floratta Express. Flores frescas e presentes inesquecíveis com entrega rápida em todo o Brasil.",
      },
      { property: "og:title", content: "Sobre a Floratta Express" },
      {
        property: "og:description",
        content:
          "Flores frescas e presentes inesquecíveis com entrega expressa em todo o Brasil.",
      },
    ],
  }),
  component: SobrePage,
});

function SobrePage() {
  return (
    <LegalPage
      title="Sobre a Floratta Express"
      subtitle="Flores frescas e presentes inesquecíveis com entrega expressa"
    >
      <h2>Nossa história</h2>
      <p>
        A <strong>Floratta Express</strong> nasceu com a missão de transformar momentos especiais em
        memórias inesquecíveis através das flores. Acreditamos que cada flor carrega uma mensagem,
        e cada entrega é uma oportunidade de espalhar amor, carinho e gratidão.
      </p>

      <h2>Nossa missão</h2>
      <p>
        Entregar flores frescas, buquês exclusivos e presentes encantadores, com qualidade premium,
        atendimento humanizado e logística rápida em todo o território nacional.
      </p>

      <h2>Nossos valores</h2>
      <ul>
        <li><strong>Qualidade:</strong> trabalhamos apenas com flores selecionadas dos melhores produtores;</li>
        <li><strong>Frescor:</strong> nossas flores chegam em até 2 dias úteis após o pedido;</li>
        <li><strong>Cuidado:</strong> cada arranjo é montado por floristas experientes;</li>
        <li><strong>Confiança:</strong> transparência em preços, prazos e atendimento;</li>
        <li><strong>Encantamento:</strong> nosso objetivo é superar expectativas em cada entrega.</li>
      </ul>

      <h2>O que oferecemos</h2>
      <ul>
        <li>Buquês de rosas (vermelhas, brancas, amarelas, champagne, coloridas);</li>
        <li>Buquês de girassóis e flores do campo;</li>
        <li>Arranjos em vasos de vidro e cachepôs;</li>
        <li>Orquídeas e plantas ornamentais;</li>
        <li>Cestas de café da manhã, vinho e chocolates;</li>
        <li>Combos especiais com pelúcias, balões e Ferrero Rocher;</li>
        <li>Rosas preservadas em redomas com LED.</li>
      </ul>

      <h2>Onde atendemos</h2>
      <p>
        Realizamos entregas em todo o <strong>Brasil</strong>, com atendimento prioritário nas
        principais regiões metropolitanas. Veja nossa{" "}
        <Link to="/politica-de-entrega">Política de Entrega</Link> para mais detalhes.
      </p>

      <h2>Nosso compromisso</h2>
      <p>
        Somos comprometidos com a satisfação dos nossos clientes. Caso algo não saia como o esperado,
        nossa equipe está pronta para resolver — consulte nossa{" "}
        <Link to="/politica-de-devolucao">Política de Troca e Devolução</Link>.
      </p>

      <h2>Fale conosco</h2>
      <p>
        Estamos prontos para atender você. <Link to="/contato">Entre em contato</Link> pelos nossos
        canais oficiais.
      </p>
    </LegalPage>
  );
}
