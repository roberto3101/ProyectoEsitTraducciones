import { createClient } from '@sanity/client';

const projectId = import.meta.env.SANITY_PROJECT_ID;
const dataset = import.meta.env.SANITY_DATASET;
const apiVersion = import.meta.env.SANITY_API_VERSION;
const token = import.meta.env.SANITY_TOKEN;

export const sanityCliente = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  token,
});

// Construir URL de imagen desde referencia de Sanity
export function urlImagen(ref: string): string {
  if (!ref) return '';
  // Si ya es una URL completa, devolverla
  if (ref.startsWith('http')) return ref;
  // Convertir referencia de asset a URL
  const [, id, dimensiones, formato] = ref.replace('image-', '').split('-');
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensiones}.${formato}`;
}

// Formatear fecha para mostrar
export function formatearFecha(fecha: string, idioma: string = 'es'): string {
  if (!fecha) return '';
  const locales: Record<string, string> = { es: 'es-PE', en: 'en-US', fr: 'fr-FR' };
  return new Date(fecha).toLocaleDateString(locales[idioma] || locales.es, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Traer todos los articulos del blog
export async function obtenerArticulos(idioma: string = 'es') {
  const consulta = `*[_type == "articulo" && idioma == $idioma] | order(fecha desc) {
    _id,
    titulo,
    resumen,
    "slug": slug.current,
    fecha,
    categoria,
    "imagen": imagen.asset->url
  }`;

  return await sanityCliente.fetch(consulta, { idioma });
}

// Traer un articulo por su slug
export async function obtenerArticuloPorSlug(slug: string, idioma: string = 'es') {
  const consulta = `*[_type == "articulo" && slug.current == $slug && idioma == $idioma][0] {
    _id,
    titulo,
    resumen,
    contenido,
    fecha,
    categoria,
    autor,
    "imagen": imagen.asset->url,
    "slug": slug.current
  }`;

  return await sanityCliente.fetch(consulta, { slug, idioma });
}

// Traer categorias disponibles
export async function obtenerCategorias(idioma: string = 'es') {
  const consulta = `*[_type == "articulo" && idioma == $idioma] {
    categoria
  }`;

  const articulos = await sanityCliente.fetch(consulta, { idioma });
  const categorias = [...new Set(articulos.map((a: any) => a.categoria))];
  return categorias.filter(Boolean);
}

// Traer todos los slugs (para generar paginas estaticas)
export async function obtenerTodosSlugs(idioma: string = 'es') {
  const consulta = `*[_type == "articulo" && idioma == $idioma] {
    "slug": slug.current
  }`;

  return await sanityCliente.fetch(consulta, { idioma });
}
