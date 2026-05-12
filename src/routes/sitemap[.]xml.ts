import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

const BASE_URL = "https://exact-pixel-perfect-797.lovable.app";

// SEO landing pages with high-intent keywords (each is a real route below)
const LANDING_PATHS: { path: string; priority: string }[] = [
  { path: "/floricultura-aberta-agora", priority: "0.9" },
  { path: "/floricultura-24h", priority: "0.9" },
  { path: "/buque-de-rosas-vermelhas", priority: "0.9" },
  { path: "/dia-das-maes", priority: "0.9" },
  { path: "/dia-dos-namorados", priority: "0.9" },
  { path: "/flores-para-aniversario", priority: "0.85" },
  { path: "/flores-para-namorada", priority: "0.85" },
];

const STATIC_PATHS: { path: string; changefreq: string; priority: string }[] = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/catalogo", changefreq: "daily", priority: "0.9" },
  { path: "/sobre", changefreq: "monthly", priority: "0.5" },
  { path: "/contato", changefreq: "monthly", priority: "0.5" },
  { path: "/politica-de-entrega", changefreq: "yearly", priority: "0.3" },
  { path: "/politica-de-devolucao", changefreq: "yearly", priority: "0.3" },
  { path: "/politica-de-privacidade", changefreq: "yearly", priority: "0.3" },
  { path: "/termos-e-condicoes", changefreq: "yearly", priority: "0.3" },
];

// Backup city list — guarantees the 55 highest-intent cities are always indexed
// even if the cities table only has a subset enabled.
const FALLBACK_CITIES = [
  "sao-paulo","rio-de-janeiro","belo-horizonte","brasilia","salvador","fortaleza","curitiba",
  "porto-alegre","recife","manaus","belem","goiania","sao-luis","maceio","natal","teresina",
  "joao-pessoa","aracaju","cuiaba","campo-grande","florianopolis","vitoria","palmas","macapa",
  "boa-vista","rio-branco","porto-velho","guarulhos","campinas","sao-bernardo-do-campo",
  "santo-andre","osasco","sorocaba","ribeirao-preto","sao-jose-dos-campos","santos","niteroi",
  "duque-de-caxias","nova-iguacu","sao-goncalo","contagem","uberlandia","juiz-de-fora",
  "londrina","maringa","joinville","blumenau","caxias-do-sul","pelotas","feira-de-santana",
  "vila-velha","praia-grande","novo-hamburgo","sao-jose-do-rio-preto","jundiai","anapolis",
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const supabase = createClient(
          process.env.VITE_SUPABASE_URL!,
          process.env.VITE_SUPABASE_PUBLISHABLE_KEY!,
        );

        const today = new Date().toISOString().slice(0, 10);

        let products: { slug: string; created_at: string | null }[] = [];
        let dbCities: { slug: string }[] = [];
        try {
          const [p, c] = await Promise.all([
            supabase.from("products").select("slug, created_at").eq("active", true),
            supabase.from("cities").select("slug").eq("active", true),
          ]);
          products = p.data ?? [];
          dbCities = c.data ?? [];
        } catch {}

        const citySlugs = Array.from(
          new Set([...FALLBACK_CITIES, ...dbCities.map((c) => c.slug)]),
        );

        const urls: string[] = [];
        const push = (loc: string, lastmod = today, changefreq = "weekly", priority = "0.7") => {
          urls.push(
            `  <url>\n    <loc>${BASE_URL}${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`,
          );
        };

        for (const s of STATIC_PATHS) push(s.path, today, s.changefreq, s.priority);
        for (const l of LANDING_PATHS) push(l.path, today, "weekly", l.priority);
        for (const c of citySlugs) push(`/entrega/${c}`, today, "weekly", "0.8");
        for (const p of products) {
          const lm = p.created_at ? p.created_at.slice(0, 10) : today;
          push(`/produto/${p.slug}`, lm, "weekly", "0.8");
        }

        const xml =
          `<?xml version="1.0" encoding="UTF-8"?>\n` +
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
          urls.join("\n") +
          `\n</urlset>`;

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
