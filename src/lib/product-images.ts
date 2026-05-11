import rosas from "@/assets/products/rosas-vermelhas.jpg";
import girassois from "@/assets/products/girassois.jpg";
import peonias from "@/assets/products/peonias.jpg";
import orquidea from "@/assets/products/orquidea.jpg";
import cesta from "@/assets/products/cesta-presente.jpg";
import campo from "@/assets/products/flores-campo.jpg";
import pastel from "@/assets/products/buque-pastel.jpg";
import secas from "@/assets/products/flores-secas.jpg";
import hero1 from "@/assets/hero-1.jpg";

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
