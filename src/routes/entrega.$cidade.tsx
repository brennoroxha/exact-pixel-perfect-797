import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/entrega/$cidade")({
  head: ({ params }) => ({
    meta: [
      { title: `Entrega de flores em ${params.cidade.replace(/-/g, " ")} — Flora Luxe` },
      { name: "description", content: `Buquês entregues em ${params.cidade.replace(/-/g, " ")} em até 60 minutos.` },
    ],
  }),
  component: CityPage,
});

function CityPage() {
  const { cidade } = Route.useParams();
  const name = cidade.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="font-display text-4xl text-green-deep md:text-5xl">Entrega de flores em {name}</h1>
        <p className="mt-4 text-muted-foreground">
          A Flora Luxe entrega buquês frescos em {name} em até 60 minutos.
          Confira nossa seleção de rosas, peônias, orquídeas e arranjos editoriais.
        </p>
        <Link to="/" className="mt-6 inline-block rounded-full bg-green-deep px-6 py-3 text-sm text-cream">
          Ver buquês para {name} →
        </Link>
      </div>
      <Footer />
    </div>
  );
}
