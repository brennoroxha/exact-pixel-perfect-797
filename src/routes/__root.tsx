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
import { WhatsAppButton } from "@/components/WhatsAppButton";
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

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Flora Luxe — Floricultura Delivery em até 60 min" },
      {
        name: "description",
        content:
          "Buquês de luxo entregues em até 60 minutos nas principais capitais do Brasil. Flores frescas, embalagem editorial e WhatsApp 24h.",
      },
      { name: "author", content: "Flora Luxe" },
      { property: "og:title", content: "Flora Luxe — Floricultura Delivery em até 60 min" },
      {
        property: "og:description",
        content: "Floricultura delivery premium. Buquês de rosas, peônias, orquídeas e mais.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Flora Luxe — Floricultura Delivery em até 60 min" },
      { name: "description", content: "Pixel Perfect Replica creates an exact visual copy of a given screenshot, including all elements and their placement." },
      { property: "og:description", content: "Pixel Perfect Replica creates an exact visual copy of a given screenshot, including all elements and their placement." },
      { name: "twitter:description", content: "Pixel Perfect Replica creates an exact visual copy of a given screenshot, including all elements and their placement." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/cf227ddd-7fb0-4d86-a3d5-c49a8735facf/id-preview-c093a98d--010a785f-deca-446d-afb1-b386e7004a4e.lovable.app-1778513681228.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/cf227ddd-7fb0-4d86-a3d5-c49a8735facf/id-preview-c093a98d--010a785f-deca-446d-afb1-b386e7004a4e.lovable.app-1778513681228.png" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href:
          "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
      },
      { rel: "stylesheet", href: appCss },
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
      <Outlet />
      <CartDrawer />
      <LocationGate />
      <WhatsAppButton />
      <Toaster richColors position="top-center" />
    </QueryClientProvider>
  );
}
