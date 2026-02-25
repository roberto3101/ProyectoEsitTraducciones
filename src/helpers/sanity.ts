import { createClient } from '@sanity/client';

// CONFIGURAR: Reemplazar con los datos reales del proyecto en Sanity
// 1. Crear cuenta en sanity.io
// 2. Crear proyecto nuevo
// 3. Copiar el Project ID y Dataset

export const sanityCliente = createClient({
  projectId: 'TU_PROJECT_ID', // <-- cambiar esto
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true, // CDN para velocidad (bueno para SEO)
});

// Traer todos los articulos del blog
export async function obtenerArticulos(idioma: string = 'es') {
  const consulta = `*[_type == "articulo" && idioma == $idioma] | order(fecha desc) {
    _id,
    titulo,
    resumen,
    slug,
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
    "imagen": imagen.asset->url
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
