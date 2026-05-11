import { Link } from "@tanstack/react-router";
import { Flower2, Instagram, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 bg-green-deep text-cream">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <Flower2 className="h-6 w-6" />
            <span className="font-display text-2xl">Flora Luxe</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-cream/80">
            Flores frescas, entregues em até 60 minutos nas principais capitais do Brasil.
          </p>
          <div className="mt-4 flex gap-3">
            <a href="#" aria-label="Instagram" className="rounded-full border border-cream/30 p-2 hover:bg-cream/10">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="https://wa.me/5511999999999" aria-label="WhatsApp" className="rounded-full border border-cream/30 p-2 hover:bg-cream/10">
              <MessageCircle className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-display text-lg">Loja</h4>
          <ul className="mt-3 space-y-2 text-sm text-cream/80">
            <li><Link to="/" className="hover:text-cream">Buquês</Link></li>
            <li><Link to="/" className="hover:text-cream">Arranjos</Link></li>
            <li><Link to="/" className="hover:text-cream">Cestas & Presentes</Link></li>
            <li><Link to="/" className="hover:text-cream">Combos</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg">Ocasiões</h4>
          <ul className="mt-3 space-y-2 text-sm text-cream/80">
            <li>Para o Amor</li>
            <li>Aniversário</li>
            <li>Melhoras</li>
            <li>Nascimento</li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg">Ajuda</h4>
          <ul className="mt-3 space-y-2 text-sm text-cream/80">
            <li>Sobre nós</li>
            <li>Contato</li>
            <li>Política de entrega</li>
            <li>Trocas e devoluções</li>
            <li>Privacidade</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-cream/60 sm:flex-row">
          <span>© {new Date().getFullYear()} Flora Luxe · CNPJ 00.000.000/0001-00</span>
          <span>Pagamentos: PIX · Mercado Pago · Visa · Mastercard</span>
        </div>
      </div>
    </footer>
  );
}
