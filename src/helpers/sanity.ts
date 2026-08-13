import { createClient } from '@sanity/client';

const projectId = import.meta.env.SANITY_PROJECT_ID;
const dataset = import.meta.env.SANITY_DATASET;
const apiVersion = import.meta.env.SANITY_API_VERSION;

/**
 * El token es OPCIONAL: el dataset `production` es publico, asi que las
 * lecturas de contenido publicado funcionan sin credenciales.
 *
 * Solo hace falta si algun dia se marca el dataset como privado o se
 * necesitan leer borradores. Mientras no sea el caso, no conviene
 * guardarlo en ningun sitio: un secreto que no existe no se filtra.
 */
const token = import.meta.env.SANITY_TOKEN || undefined;

export const sanityCliente = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  ...(token ? { token } : {}),
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

/**
 * Pide a la CDN de Sanity la imagen ya recortada al tamano de entrega.
 *
 * Sin esto se sirve el asset original: un archivo de 300x300 estirado a
 * 976x480 se ve roto, y uno de 4000px penaliza la carga sin necesidad.
 *
 * - `fit=max` nunca amplia por encima del original, asi que una imagen
 *   pequena se entrega a su tamano real en vez de pixelada.
 * - `auto=format` negocia WebP/AVIF segun el navegador.
 */
export function imagenEntrega(
  url: string,
  opciones: { ancho?: number; alto?: number; recortar?: boolean } = {},
): string {
  if (!url) return '';

  const { ancho = 1600, alto, recortar = false } = opciones;
  const params = new URLSearchParams({ w: String(ancho), auto: 'format', q: '82' });

  if (alto) params.set('h', String(alto));

  if (recortar && alto) {
    params.set('fit', 'crop');
    // `entropy` elige la zona con mas informacion visual en vez del centro
    // geometrico: evita encuadres vacios cuando suben capturas con margenes.
    params.set('crop', 'entropy');
  } else {
    params.set('fit', 'max');
  }

  return `${url}${url.includes('?') ? '&' : '?'}${params.toString()}`;
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

// Traer articulos paginados con total
const POSTS_POR_PAGINA = 9;

export async function obtenerArticulosPaginados(
  idioma: string = 'es',
  pagina: number = 1,
  categoria: string = '',
) {
  const filtroCategoria = categoria ? ' && categoria == $categoria' : '';
  const inicio = (pagina - 1) * POSTS_POR_PAGINA;
  const fin = inicio + POSTS_POR_PAGINA;

  const consultaArticulos = `*[_type == "articulo" && idioma == $idioma${filtroCategoria}] | order(fecha desc) [$inicio...$fin] {
    _id,
    titulo,
    resumen,
    "slug": slug.current,
    fecha,
    categoria,
    "imagen": imagen.asset->url
  }`;

  const consultaTotal = `count(*[_type == "articulo" && idioma == $idioma${filtroCategoria}])`;

  const params: Record<string, any> = { idioma, inicio, fin };
  if (categoria) params.categoria = categoria;

  const [articulos, total] = await Promise.all([
    sanityCliente.fetch(consultaArticulos, params),
    sanityCliente.fetch(consultaTotal, params),
  ]);

  return {
    articulos,
    total,
    pagina,
    totalPaginas: Math.ceil(total / POSTS_POR_PAGINA),
    porPagina: POSTS_POR_PAGINA,
  };
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
