import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, MessageCircle, Clock, MapPin } from "lucide-react";
import { LegalPage } from "@/components/LegalPage";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Fale Conosco — Floratta Express" },
      {
        name: "description",
        content:
          "Atendimento Floratta Express por e-mail e WhatsApp. Pedidos, dúvidas, trocas e suporte de segunda a sábado, 08h às 18h.",
      },
      { property: "og:title", content: "Fale Conosco — Floratta Express" },
      { property: "og:description", content: "Atendimento por e-mail e WhatsApp. Resposta em até 2h." },
    ],
  }),
  component: ContatoPage,
});

function ContatoPage() {
  return (
    <LegalPage
      title="Fale Conosco"
      subtitle="Estamos prontos para ajudar com pedidos, dúvidas e sugestões"
    >
      <div className="not-prose mb-6 grid gap-3 sm:grid-cols-2">
        <a
          href="mailto:contato@florattaexpress.delivery"
          className="flex items-start gap-3 rounded-xl border border-border bg-cream p-4 transition hover:border-green-mid"
        >
          <Mail className="mt-0.5 h-5 w-5 text-green-mid" />
          <div>
            <div className="text-xs font-bold tracking-wider text-muted-foreground">E-MAIL</div>
            <div className="text-sm font-semibold text-green-deep">
              contato@florattaexpress.delivery
            </div>
          </div>
        </a>
        <a
          href="https://wa.me/5511998119893"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start gap-3 rounded-xl border border-border bg-cream p-4 transition hover:border-green-mid"
        >
          <MessageCircle className="mt-0.5 h-5 w-5 text-green-mid" />
          <div>
            <div className="text-xs font-bold tracking-wider text-muted-foreground">WHATSAPP</div>
            <div className="text-sm font-semibold text-green-deep">(11) 99811-9893</div>
          </div>
        </a>
        <div className="flex items-start gap-3 rounded-xl border border-border bg-cream p-4">
          <Clock className="mt-0.5 h-5 w-5 text-green-mid" />
          <div>
            <div className="text-xs font-bold tracking-wider text-muted-foreground">
              HORÁRIO DE ATENDIMENTO
            </div>
            <div className="text-sm font-semibold text-green-deep">
              Segunda a Sábado — 08:00 às 18:00
            </div>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-xl border border-border bg-cream p-4">
          <MapPin className="mt-0.5 h-5 w-5 text-green-mid" />
          <div>
            <div className="text-xs font-bold tracking-wider text-muted-foreground">LOCALIZAÇÃO</div>
            <div className="text-sm font-semibold text-green-deep">São Paulo — SP, Brasil</div>
          </div>
        </div>
      </div>

      <h2>Como podemos ajudar?</h2>
      <p>Nossa equipe está disponível para auxiliar com:</p>
      <ul>
        <li><strong>Acompanhamento de pedidos</strong> — informações sobre status e prazo de entrega;</li>
        <li>
          <strong>Trocas e devoluções</strong> — solicitações cobertas pela nossa{" "}
          <Link to="/politica-de-devolucao">Política de Troca e Devolução</Link>;
        </li>
        <li><strong>Pedidos personalizados</strong> — buquês e arranjos sob medida para datas especiais;</li>
        <li><strong>Pedidos corporativos</strong> — entregas recorrentes para empresas e eventos;</li>
        <li><strong>Dúvidas em geral</strong> — sobre produtos, áreas atendidas e formas de pagamento.</li>
      </ul>

      <h2>Tempo de resposta</h2>
      <p>
        Respondemos e-mails e mensagens de WhatsApp em até <strong>2 horas</strong> dentro do horário
        comercial. Mensagens enviadas fora do expediente serão respondidas no próximo dia útil.
      </p>
    </LegalPage>
  );
}
