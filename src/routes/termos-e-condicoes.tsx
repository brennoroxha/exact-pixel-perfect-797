import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage } from "@/components/LegalPage";

export const Route = createFileRoute("/termos-e-condicoes")({
  head: () => ({
    meta: [
      { title: "Termos e Condições — Floratta Express" },
      {
        name: "description",
        content:
          "Termos e Condições de Uso do site Floratta Express. Cadastro, produtos, preços, pagamento, entrega e responsabilidades.",
      },
      { property: "og:title", content: "Termos e Condições — Floratta Express" },
      { property: "og:description", content: "Condições gerais de uso do site e venda dos produtos." },
    ],
  }),
  component: TermosPage,
});

function TermosPage() {
  return (
    <LegalPage
      title="Termos e Condições de Uso"
      subtitle="Condições gerais de uso do site e venda dos produtos Floratta Express"
    >
      <h2>1. Aceitação dos termos</h2>
      <p>
        Ao acessar e utilizar nosso site, você declara ter lido, compreendido e aceitado integralmente
        estes Termos e Condições, bem como nossa Política de Privacidade.
      </p>

      <h2>2. Sobre a Floratta Express</h2>
      <p>
        A <strong>Floratta Express</strong> é uma loja online especializada em flores, buquês,
        arranjos, orquídeas, cestas e presentes, com entrega em todo o Brasil.
      </p>

      <h2>3. Cadastro e dados do cliente</h2>
      <p>
        O cliente é responsável pelas informações fornecidas no momento da compra, comprometendo-se a
        manter dados verídicos, completos e atualizados. Dados incorretos podem inviabilizar a entrega
        e o cliente arcará com os custos de reenvio.
      </p>

      <h2>4. Produtos</h2>
      <p>
        As imagens são meramente ilustrativas. Por se tratar de produtos naturais, podem ocorrer
        pequenas variações de cor, formato ou flores utilizadas na composição, sem prejuízo da
        qualidade e da harmonia do produto final.
      </p>

      <h2>5. Preços e pagamento</h2>
      <p>
        Os preços exibidos no site estão em <strong>Reais (BRL)</strong> e incluem todos os tributos.
        A taxa de entrega é calculada e exibida no checkout. Aceitamos os seguintes meios de pagamento:
      </p>
      <ul>
        <li>PIX</li>
        <li>Cartão de crédito (em até 3x sem juros, conforme valor)</li>
      </ul>
      <p>
        A confirmação do pedido está condicionada à aprovação do pagamento. Em caso de PIX, o
        pagamento deve ser realizado em até 30 minutos após a geração do código.
      </p>

      <h2>6. Confirmação e processamento do pedido</h2>
      <p>
        Após a aprovação do pagamento, o cliente receberá confirmação por e-mail e/ou WhatsApp.
        Pedidos com pagamento aprovado até as 14:00 (horário de Brasília) são processados no mesmo
        dia útil.
      </p>

      <h2>7. Entrega</h2>
      <p>
        A entrega obedece à nossa <Link to="/politica-de-entrega">Política de Entrega</Link>. Prazos
        e condições estão descritos integralmente naquele documento.
      </p>

      <h2>8. Trocas, devoluções e reembolsos</h2>
      <p>
        Aplicam-se integralmente as regras descritas em nossa{" "}
        <Link to="/politica-de-devolucao">Política de Troca e Devolução</Link>, em conformidade com o
        Código de Defesa do Consumidor.
      </p>

      <h2>9. Propriedade intelectual</h2>
      <p>
        Todo o conteúdo do site (textos, imagens, marca, logotipo, layout, código-fonte) é de
        propriedade da Floratta Express ou de seus licenciantes, sendo vedada qualquer reprodução,
        distribuição ou uso comercial sem autorização prévia e expressa.
      </p>

      <h2>10. Responsabilidades</h2>
      <p>
        A Floratta Express compromete-se a entregar produtos de qualidade e prestar atendimento
        adequado. Não nos responsabilizamos por:
      </p>
      <ul>
        <li>Endereços incorretos ou incompletos fornecidos pelo cliente;</li>
        <li>Ausência do destinatário no endereço informado;</li>
        <li>Atrasos por motivo de força maior (clima, restrições governamentais, etc.);</li>
        <li>Mau uso do produto após o recebimento.</li>
      </ul>

      <h2>11. Privacidade e proteção de dados</h2>
      <p>
        O tratamento de dados pessoais segue nossa{" "}
        <Link to="/politica-de-privacidade">Política de Privacidade</Link>, em conformidade com a LGPD.
      </p>

      <h2>12. Modificações dos termos</h2>
      <p>
        A Floratta Express reserva-se o direito de modificar estes Termos a qualquer momento. As
        alterações entrarão em vigor a partir de sua publicação no site. Recomendamos a leitura
        periódica.
      </p>

      <h2>13. Foro e legislação aplicável</h2>
      <p>
        Estes Termos são regidos pelas leis brasileiras. Fica eleito o foro da Comarca de São Paulo/SP
        para dirimir quaisquer questões decorrentes deste documento, com renúncia de qualquer outro,
        por mais privilegiado que seja.
      </p>

      <h2>14. Contato</h2>
      <p>Em caso de dúvidas sobre estes Termos, entre em contato:</p>
      <ul>
        <li>E-mail: <a href="mailto:contato@florattaexpress.delivery">contato@florattaexpress.delivery</a></li>
        <li>WhatsApp: <a href="https://wa.me/5511998119893">(11) 99811-9893</a></li>
      </ul>
    </LegalPage>
  );
}
