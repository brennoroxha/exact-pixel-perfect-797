import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/LegalPage";

export const Route = createFileRoute("/politica-de-privacidade")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade — Floratta Express" },
      {
        name: "description",
        content:
          "Como tratamos seus dados pessoais conforme a LGPD (Lei nº 13.709/18). Direitos do titular, cookies e segurança.",
      },
      { property: "og:title", content: "Política de Privacidade — Floratta Express" },
      { property: "og:description", content: "Tratamento de dados pessoais conforme a LGPD." },
    ],
  }),
  component: PoliticaPrivacidadePage,
});

function PoliticaPrivacidadePage() {
  return (
    <LegalPage
      title="Política de Privacidade"
      subtitle="Como tratamos seus dados pessoais conforme a LGPD (Lei nº 13.709/18)"
    >
      <h2>1. Quem somos</h2>
      <p>
        A <strong>Floratta Express</strong> ("nós") é responsável pelo tratamento dos dados pessoais
        coletados em nosso site, atuando como controladora nos termos da Lei Geral de Proteção de
        Dados (LGPD).
      </p>

      <h2>2. Quais dados coletamos</h2>
      <ul>
        <li><strong>Dados de cadastro:</strong> nome, e-mail, telefone, CPF.</li>
        <li><strong>Dados de entrega:</strong> endereço completo, nome do destinatário e telefone do destinatário.</li>
        <li><strong>Dados de pagamento:</strong> processados de forma segura por nosso parceiro financeiro (não armazenamos dados completos de cartão).</li>
        <li><strong>Dados de navegação:</strong> endereço IP, tipo de navegador, páginas visitadas, cookies e dados analíticos.</li>
      </ul>

      <h2>3. Para que usamos seus dados</h2>
      <ul>
        <li>Processar e entregar seu pedido;</li>
        <li>Emitir nota fiscal;</li>
        <li>Enviar comunicações sobre o status do pedido;</li>
        <li>Prestar atendimento e suporte;</li>
        <li>Cumprir obrigações legais e regulatórias;</li>
        <li>Melhorar nossos produtos e serviços;</li>
        <li>Prevenir fraudes e garantir a segurança das transações;</li>
        <li>Enviar comunicações de marketing (somente com seu consentimento).</li>
      </ul>

      <h2>4. Base legal</h2>
      <p>
        Tratamos seus dados com base nas seguintes hipóteses previstas na LGPD: execução de contrato,
        cumprimento de obrigação legal, legítimo interesse e consentimento (quando aplicável).
      </p>

      <h2>5. Compartilhamento de dados</h2>
      <p>Seus dados podem ser compartilhados com:</p>
      <ul>
        <li><strong>Empresas de logística e entrega</strong> — para realizar a entrega do pedido;</li>
        <li><strong>Processadores de pagamento</strong> — para validar e processar transações;</li>
        <li><strong>Autoridades públicas</strong> — quando exigido por lei ou ordem judicial.</li>
      </ul>
      <p>Não vendemos seus dados pessoais a terceiros.</p>

      <h2>6. Cookies e tecnologias de rastreamento de terceiros</h2>
      <p>
        Utilizamos cookies próprios e de terceiros para melhorar sua experiência de navegação, analisar
        tráfego, mensurar a performance de campanhas publicitárias e personalizar conteúdo e anúncios.
        Você pode gerenciar as preferências de cookies nas configurações do seu navegador.
      </p>
      <p>Especificamente, utilizamos as seguintes tecnologias de terceiros:</p>
      <ul>
        <li>
          <strong>Google Analytics e Google Ads</strong> — para análise de tráfego, mensuração de
          conversões e remarketing. Consulte a{" "}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
            Política de Privacidade do Google
          </a>.
        </li>
        <li>
          <strong>Meta Pixel (Facebook/Instagram)</strong> — para mensuração de conversões e
          otimização de campanhas. Consulte a{" "}
          <a href="https://www.facebook.com/privacy/policy" target="_blank" rel="noopener noreferrer">
            Política de Privacidade da Meta
          </a>.
        </li>
        <li>
          <strong>TikTok Pixel (TikTok Ads)</strong> — para mensurar conversões, otimizar a entrega
          de anúncios e realizar remarketing em campanhas no TikTok. Consulte a{" "}
          <a href="https://www.tiktok.com/legal/page/row/privacy-policy/pt" target="_blank" rel="noopener noreferrer">
            Política de Privacidade do TikTok
          </a>.
        </li>
        <li>
          <strong>Snap Pixel (Snapchat Ads)</strong> — para mensuração de conversões e otimização de
          campanhas no Snapchat. Consulte a{" "}
          <a href="https://snap.com/pt-BR/privacy/privacy-policy" target="_blank" rel="noopener noreferrer">
            Política de Privacidade do Snap
          </a>.
        </li>
      </ul>
      <p>
        Esses parceiros podem coletar identificadores de dispositivo, endereço IP e dados de eventos
        (visita à página, adição ao carrinho, início de checkout, compra). Quando aplicável, dados
        de contato (e-mail e telefone) podem ser enviados de forma <em>hasheada</em> (criptografada
        de forma irreversível) para fins de mensuração avançada (Advanced Matching). Você pode optar
        por não receber anúncios personalizados nas configurações de privacidade de cada plataforma.
      </p>

      <h2>7. Segurança</h2>
      <p>
        Adotamos medidas técnicas e administrativas para proteger seus dados contra acessos não
        autorizados, perda, alteração ou divulgação indevida, incluindo criptografia, controle de
        acesso e monitoramento contínuo.
      </p>

      <h2>8. Retenção de dados</h2>
      <p>
        Mantemos seus dados pelo tempo necessário para cumprir as finalidades para as quais foram
        coletados e para atender obrigações legais (ex.: dados fiscais por 5 anos, conforme legislação
        tributária).
      </p>

      <h2>9. Seus direitos (LGPD)</h2>
      <p>Você tem direito a:</p>
      <ul>
        <li>Confirmar a existência de tratamento de seus dados;</li>
        <li>Acessar seus dados;</li>
        <li>Corrigir dados incompletos, inexatos ou desatualizados;</li>
        <li>Solicitar anonimização, bloqueio ou eliminação de dados desnecessários;</li>
        <li>Solicitar portabilidade;</li>
        <li>Revogar consentimento;</li>
        <li>Ser informado sobre compartilhamento de dados.</li>
      </ul>
      <p>
        Para exercer qualquer desses direitos, envie um e-mail para{" "}
        <a href="mailto:contato@florattaexpress.delivery">contato@florattaexpress.delivery</a>.
      </p>

      <h2>10. Encarregado pelo tratamento de dados (DPO)</h2>
      <p>
        Em caso de dúvidas, reclamações ou solicitações relacionadas aos seus dados pessoais, entre
        em contato com nosso encarregado por:{" "}
        <a href="mailto:contato@florattaexpress.delivery">contato@florattaexpress.delivery</a>.
      </p>

      <h2>11. Alterações nesta política</h2>
      <p>
        Esta Política poderá ser atualizada periodicamente. Recomendamos a verificação regular desta
        página. Alterações relevantes serão comunicadas pelos nossos canais oficiais.
      </p>
    </LegalPage>
  );
}
