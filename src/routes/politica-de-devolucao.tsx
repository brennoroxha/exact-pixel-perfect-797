import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/LegalPage";

export const Route = createFileRoute("/politica-de-devolucao")({
  head: () => ({
    meta: [
      { title: "Política de Troca e Devolução — Floratta Express" },
      {
        name: "description",
        content:
          "Aceitamos trocas e devoluções conforme o Código de Defesa do Consumidor. Saiba prazos, condições e como solicitar.",
      },
      { property: "og:title", content: "Política de Troca e Devolução — Floratta Express" },
      { property: "og:description", content: "Trocas, devoluções e reembolsos conforme o CDC." },
    ],
  }),
  component: PoliticaDevolucaoPage,
});

function PoliticaDevolucaoPage() {
  return (
    <LegalPage
      title="Política de Troca e Devolução"
      subtitle="Garantimos sua satisfação e respeitamos integralmente o Código de Defesa do Consumidor"
    >
      <h2>Resumo da política (conforme exigido pelo Google Merchant)</h2>
      <ul>
        <li><strong>Países atendidos:</strong> Brasil</li>
        <li><strong>Devoluções:</strong> Aceitamos devoluções de produtos com e sem defeito</li>
        <li><strong>Trocas:</strong> Aceitamos trocas</li>
        <li><strong>Condição do produto aceita para devolução:</strong> Apenas novos</li>
        <li><strong>Período para solicitar devolução/troca:</strong> 3 dias após o recebimento</li>
        <li><strong>Método de devolução:</strong> Em um ponto de devolução</li>
        <li><strong>Taxas de reposição de estoque:</strong> Não há custo</li>
        <li><strong>Tempo de processamento do reembolso:</strong> 3 dias após o recebimento do produto devolvido</li>
      </ul>

      <h2>1. Direito de arrependimento (Art. 49 do CDC)</h2>
      <p>
        Conforme o <strong>Código de Defesa do Consumidor (Lei nº 8.078/90, Art. 49)</strong>, o
        cliente tem o direito de desistir da compra realizada pela internet em até{" "}
        <strong>7 (sete) dias corridos</strong>, contados a partir da data de recebimento do produto,
        sem necessidade de justificativa.
      </p>

      <h2>2. Aceitamos devoluções</h2>
      <p>
        <strong>
          Sim, a Floratta Express aceita devoluções de produtos, com ou sem defeito
        </strong>
        , desde que respeitadas as condições descritas nesta política.
      </p>

      <h2>3. Trocas</h2>
      <p><strong>Sim, aceitamos trocas</strong> de produtos. A troca poderá ser solicitada por:</p>
      <ul>
        <li>Produto avariado ou com defeito;</li>
        <li>Divergência entre o produto recebido e o anunciado;</li>
        <li>Insatisfação com a qualidade do produto natural recebido (flores murchas, danificadas no transporte, etc.).</li>
      </ul>

      <h2>4. Prazos para solicitação</h2>
      <ul>
        <li><strong>Arrependimento:</strong> até 7 dias corridos após o recebimento.</li>
        <li><strong>Defeito ou avaria:</strong> até 24 horas após o recebimento (devido à natureza perecível das flores).</li>
        <li><strong>Divergência do produto:</strong> até 48 horas após o recebimento.</li>
      </ul>

      <h2>5. Como solicitar</h2>
      <p>Para solicitar troca ou devolução, entre em contato pelos nossos canais oficiais:</p>
      <ul>
        <li>E-mail: <a href="mailto:contato@florattaexpress.delivery">contato@florattaexpress.delivery</a></li>
        <li>WhatsApp: <a href="https://wa.me/5511998119893">(11) 99811-9893</a></li>
      </ul>
      <p>
        Será necessário informar: <strong>número do pedido</strong>, <strong>nome completo do comprador</strong>,
        <strong> motivo</strong> da solicitação e <strong>fotos do produto</strong> recebido (em caso
        de defeito ou divergência).
      </p>

      <h2>6. Análise da solicitação</h2>
      <p>
        Nossa equipe analisará a solicitação em até <strong>2 (dois) dias úteis</strong> e retornará
        com a aprovação ou solicitação de informações complementares.
      </p>

      <h2>7. Reembolso</h2>
      <p>
        Após a aprovação da devolução, o reembolso será processado em até <strong>7 dias úteis</strong>,
        conforme o método de pagamento utilizado:
      </p>
      <ul>
        <li><strong>PIX:</strong> devolução integral via PIX para a chave informada pelo cliente, em até 5 dias úteis.</li>
        <li><strong>Cartão de crédito:</strong> estorno na próxima fatura ou em até 2 faturas, conforme política da operadora.</li>
      </ul>

      <h2>8. Substituição do produto</h2>
      <p>
        Em casos de troca por defeito ou divergência, podemos optar pelo <strong>reenvio gratuito</strong>{" "}
        de um produto idêntico ou equivalente, sem custos adicionais para o cliente, conforme disponibilidade.
      </p>

      <h2>9. Países atendidos</h2>
      <p>Esta política aplica-se a todas as compras realizadas no <strong>Brasil</strong>.</p>

      <h2>10. Custos de devolução</h2>
      <p>
        Em caso de defeito, divergência ou erro nosso, todos os custos de devolução serão arcados pela{" "}
        <strong>Floratta Express</strong>. Em caso de arrependimento (Art. 49 CDC), os custos de coleta
        poderão ser arcados pelo cliente, salvo regra mais benéfica.
      </p>

      <h2>11. Produtos não passíveis de devolução por arrependimento</h2>
      <p>
        Em razão da natureza perecível, produtos personalizados (com mensagens, cartões ou complementos
        sob encomenda) e cestas de café da manhã com itens consumíveis abertos não são passíveis de
        devolução por simples arrependimento, salvo defeito comprovado.
      </p>

      <h2>12. Atendimento</h2>
      <p>Estamos à disposição para garantir sua total satisfação. Fale conosco:</p>
      <ul>
        <li>E-mail: <a href="mailto:contato@florattaexpress.delivery">contato@florattaexpress.delivery</a></li>
        <li>WhatsApp: <a href="https://wa.me/5511998119893">(11) 99811-9893</a></li>
        <li>Atendimento: segunda a sábado, das 08:00 às 18:00</li>
      </ul>
    </LegalPage>
  );
}
