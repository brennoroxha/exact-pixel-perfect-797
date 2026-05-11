import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/5511999999999?text=Ol%C3%A1!%20Quero%20saber%20sobre%20a%20Flora%20Luxe"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-5 right-5 z-30 inline-flex items-center justify-center rounded-full bg-[#25D366] p-3.5 text-white shadow-elegant transition hover:scale-105"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}
