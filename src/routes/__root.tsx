import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { LocationGate } from "@/components/LocationGate";
import { CartDrawer } from "@/components/CartDrawer";

import { BottomNav } from "@/components/BottomNav";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl text-green-deep">404</h1>
        <h2 className="mt-4 font-display text-xl text-foreground">Página não encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          A página que você procura pode ter sido movida ou já não existe.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-green-deep px-5 py-2.5 text-sm font-medium text-cream hover:bg-green-mid"
          >
            Voltar para a loja
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl text-foreground">Ops, algo deu errado</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Tente novamente ou volte para a loja.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-full bg-green-deep px-5 py-2.5 text-sm font-medium text-cream hover:bg-green-mid"
          >
            Tentar novamente
          </button>
          <a
            href="/"
            className="rounded-full border border-border bg-cream px-5 py-2.5 text-sm font-medium text-foreground hover:border-green-mid"
          >
            Voltar para a loja
          </a>
        </div>
      </div>
    </div>
  );
}

const SITE_URL = "https://exact-pixel-perfect-797.lovable.app";
const BRAND = "Floratta Express";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#1f4d2b" },
      { name: "robots", content: "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" },
      { name: "googlebot", content: "index,follow" },
      { name: "format-detection", content: "telephone=yes" },
      { httpEquiv: "Content-Language", content: "pt-BR" },
      { title: `${BRAND} — Floricultura Online com Entrega Hoje em todo o Brasil` },
      {
        name: "description",
        content:
          "Floricultura online aberta agora com entrega no mesmo dia em todo o Brasil. Buquês de rosas, flores para presente, aniversário e namorada. Compre flores online com entrega rápida em até 60 minutos.",
      },
      { name: "keywords", content: "floricultura, floricultura aberta, floricultura aberta agora, floricultura 24h, floricultura entregando, floricultura perto de mim, floricultura online, entrega de flores, entrega de flores hoje, comprar flores online, buquê de flores, buquê de rosas vermelhas, flores para namorada, flores para presente, flores para aniversário, enviar flores, flores online, floricultura delivery" },
      { name: "author", content: BRAND },
      { name: "publisher", content: BRAND },
      { property: "og:site_name", content: BRAND },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: `${BRAND} — Floricultura Online com Entrega Hoje` },
      { property: "og:description", content: "Pixel Perfect Replica creates an exact visual copy of a given screenshot, including all elements and their placement." },
      { property: "og:url", content: SITE_URL },
      { property: "og:image", content: `${SITE_URL}/og-default.jpg` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: `${BRAND} — Floricultura Online com Entrega Hoje` },
      { name: "twitter:description", content: "Pixel Perfect Replica creates an exact visual copy of a given screenshot, including all elements and their placement." },
      { name: "twitter:image", content: `${SITE_URL}/og-default.jpg` },
      { title: "Flor Express" },
      { property: "og:title", content: "Flor Express" },
      { name: "twitter:title", content: "Flor Express" },
      { name: "description", content: "Pixel Perfect Replica creates an exact visual copy of a given screenshot, including all elements and their placement." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/P1BGVl6n13e77OYjLdHoAVwk1Nv2/social-images/social-1778612058512-ChatGPT_Image_12_de_mai._de_2026,_15_54_12.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/P1BGVl6n13e77OYjLdHoAVwk1Nv2/social-images/social-1778612058512-ChatGPT_Image_12_de_mai._de_2026,_15_54_12.webp" },
    ],
    links: [
      { rel: "canonical", href: SITE_URL },
      { rel: "alternate", hrefLang: "pt-BR", href: SITE_URL },
      { rel: "alternate", hrefLang: "x-default", href: SITE_URL },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href:
          "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
      },
      { rel: "stylesheet", href: appCss },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": `${SITE_URL}/#organization`,
              name: BRAND,
              url: SITE_URL,
              logo: `${SITE_URL}/logo.webp`,
              sameAs: [],
            },
            {
              "@type": "WebSite",
              "@id": `${SITE_URL}/#website`,
              url: SITE_URL,
              name: BRAND,
              inLanguage: "pt-BR",
              publisher: { "@id": `${SITE_URL}/#organization` },
              potentialAction: {
                "@type": "SearchAction",
                target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/catalogo?q={search_term_string}` },
                "query-input": "required name=search_term_string",
              },
            },
            {
              "@type": "Florist",
              "@id": `${SITE_URL}/#florist`,
              name: BRAND,
              url: SITE_URL,
              image: `${SITE_URL}/og-default.jpg`,
              priceRange: "$$",
              areaServed: { "@type": "Country", name: "Brasil" },
              openingHoursSpecification: [{
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
                opens: "00:00",
                closes: "23:59",
              }],
            },
          ],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="pb-16">
        <Outlet />
      </div>
      <CartDrawer />
      <LocationGate />
      
      <BottomNav />
      <Toaster richColors position="top-center" />
    </QueryClientProvider>
  );
}
