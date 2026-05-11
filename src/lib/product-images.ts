import rosas from "@/assets/products/rosas-vermelhas.webp";
import girassois from "@/assets/products/girassois.webp";
import peonias from "@/assets/products/peonias.webp";
import orquidea from "@/assets/products/orquidea.webp";
import cesta from "@/assets/products/cesta-presente.webp";
import campo from "@/assets/products/flores-campo.webp";
import pastel from "@/assets/products/buque-pastel.webp";
import secas from "@/assets/products/flores-secas.webp";
import hero1 from "@/assets/hero-1.webp";

export const imageMap: Record<string, string> = {
  "rosas-vermelhas": rosas,
  "girassois": girassois,
  "peonias": peonias,
  "orquidea": orquidea,
  "cesta-presente": cesta,
  "flores-campo": campo,
  "buque-pastel": pastel,
  "flores-secas": secas,
};

export const heroImage = hero1;

export const resolveImage = (key?: string | null) =>
  (key && imageMap[key]) || pastel;
