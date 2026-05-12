import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/LegalPage";

export const Route = createFileRoute("/politica-de-entrega")({
  head: () => ({
    meta: [
      { title: "Política de Entrega — Floratta Express" },
      {
        name: "description",
        content:
          "Prazos, áreas atendidas, taxas e horários de entrega da Floratta Express. Entrega expressa em até 2 dias úteis.",
      },
      { property: "og:title", content: "Política de Entrega — Floratta Express" },
      { property: "og:description", content: "Prazos, áreas atendidas, taxas e horários de entrega." },
    ],
  }),
  component: PoliticaEntregaPage,
});

function PoliticaEntregaPage() {
  return (
    <LegalPage
      title="Política de Entrega"
      subtitle="Tudo sobre prazos, áreas atendidas, taxas e horários de entrega"
    >
      <h2>1. Áreas de atendimento</h2>
      <p>
        A <strong>Floratta Express</strong> realiza entregas em todo o território nacional brasileiro,
        com foco principal nas regiões metropolitanas das capitais e cidades de grande porte. Para
        localidades fora dessas áreas, o prazo poderá ser ajustado de acordo com a logística disponível.
      </p>

      <h2>2. Prazos de entrega</h2>
      <p>
        Trabalhamos com entrega expressa para garantir que suas flores cheguem frescas e no melhor
        momento. Nosso prazo padrão é:
      </p>
      <ul>
        <li><strong>Limite para pedidos do dia:</strong> até as 14:00 (horário de Brasília, GMT-03:00 / São Paulo).</li>
        <li><strong>Tempo de separação:</strong> de 0 a 1 dia útil (segunda a sábado).</li>
        <li><strong>Tempo em trânsito:</strong> de 0 a 1 dia útil (segunda a sábado), para todos os destinos.</li>
        <li><strong>Tempo total estimado de entrega:</strong> de <strong>0 a 2 dias úteis</strong>, conforme a localização do cliente.</li>
      </ul>
      <p>
        Pedidos realizados <strong>após as 14:00</strong>, aos domingos ou feriados serão processados
        no próximo dia útil.
      </p>

      <h2>3. Taxa de entrega</h2>
      <p>
        A taxa de entrega é calculada de acordo com a região do destinatário e exibida de forma
        transparente no momento da finalização do pedido (checkout). A taxa padrão para entregas em
        área metropolitana é de <strong>R$ 15,90</strong>.
      </p>

      <h2>4. Horário de entrega</h2>
      <p>
        As entregas são realizadas de <strong>segunda a sábado</strong>, entre <strong>08:00 e 19:00</strong>.
        Não é possível agendar horário exato, mas você pode escolher o turno preferencial (manhã ou
        tarde) no momento da compra.
      </p>

      <h2>5. Acompanhamento do pedido</h2>
      <p>
        Após a confirmação do pagamento, você receberá atualizações sobre o status do pedido por{" "}
        <strong>WhatsApp</strong> e/ou e-mail, incluindo confirmação de saída para entrega.
      </p>

      <h2>6. Tentativas de entrega</h2>
      <p>
        Realizamos até <strong>2 (duas) tentativas</strong> de entrega no endereço informado. Caso o
        destinatário não esteja presente, o entregador deixará o produto com um vizinho ou porteiro
        autorizado, sempre que possível, ou retornará no próximo turno.
      </p>
      <p>
        Se após as duas tentativas a entrega não puder ser concluída, o pedido retornará à nossa
        central e o cliente será contatado para reagendamento. Custos adicionais de nova tentativa
        poderão ser aplicados.
      </p>

      <h2>7. Endereço incorreto ou incompleto</h2>
      <p>
        É de responsabilidade do cliente fornecer endereço de entrega completo e correto (rua, número,
        bairro, cidade, CEP, complemento e ponto de referência). Em caso de erro no endereço informado,
        custos de redirecionamento poderão ser cobrados.
      </p>

      <h2>8. Produtos perecíveis</h2>
      <p>
        Por se tratar de flores naturais e produtos perecíveis, recomendamos que o destinatário esteja
        disponível no horário previsto e que o produto seja colocado em local fresco e arejado
        imediatamente após o recebimento.
      </p>

      <h2>9. Atrasos e ocorrências</h2>
      <p>
        Em caso de atrasos por motivo de força maior (condições climáticas adversas, restrições de
        trânsito, problemas logísticos), comunicaremos imediatamente o cliente e adotaremos as medidas
        cabíveis para garantir a entrega no menor prazo possível.
      </p>

      <h2>10. Contato e suporte</h2>
      <p>Em caso de dúvidas sobre sua entrega, entre em contato pelo nosso atendimento ao cliente:</p>
      <ul>
        <li>E-mail: <a href="mailto:contato@florattaexpress.delivery">contato@florattaexpress.delivery</a></li>
        <li>WhatsApp: <a href="https://wa.me/5511998119893">(11) 99811-9893</a></li>
        <li>Horário de atendimento: segunda a sábado, das 08:00 às 18:00</li>
      </ul>
    </LegalPage>
  );
}
