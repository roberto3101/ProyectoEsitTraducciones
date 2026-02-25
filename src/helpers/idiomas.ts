import es from '../idiomas/es.json';
import en from '../idiomas/en.json';
import fr from '../idiomas/fr.json';

const idiomas = { es, en, fr } as const;

export type Idioma = keyof typeof idiomas;

export const IDIOMAS: Idioma[] = ['es', 'en', 'fr'];
export const IDIOMA_POR_DEFECTO: Idioma = 'es';

// Obtener todos los textos de un idioma
export function obtenerTextos(idioma: Idioma) {
  return idiomas[idioma] || idiomas[IDIOMA_POR_DEFECTO];
}

// Rutas por idioma (para los links de navegacion)
export function obtenerRutas(idioma: Idioma) {
  const rutas = {
    es: {
      inicio: '/es/',
      nosotros: '/es/nosotros',
      servicios: '/es/servicios',
      blog: '/es/blog',
      contacto: '/es/contacto',
      preguntas: '/es/preguntas',
    },
    en: {
      inicio: '/en/',
      nosotros: '/en/about',
      servicios: '/en/services',
      blog: '/en/blog',
      contacto: '/en/contact',
      preguntas: '/en/faq',
    },
    fr: {
      inicio: '/fr/',
      nosotros: '/fr/a-propos',
      servicios: '/fr/services',
      blog: '/fr/blog',
      contacto: '/fr/contact',
      preguntas: '/fr/faq',
    },
  };
  return rutas[idioma];
}

// Info de las banderas
export function obtenerBanderas() {
  return [
    { codigo: 'es' as Idioma, nombre: 'Español', bandera: '/banderas/es.svg' },
    { codigo: 'en' as Idioma, nombre: 'English', bandera: '/banderas/en.svg' },
    { codigo: 'fr' as Idioma, nombre: 'Français', bandera: '/banderas/fr.svg' },
  ];
}

// Detectar idioma desde la URL
export function detectarIdioma(url: string): Idioma {
  const segmentos = url.split('/').filter(Boolean);
  const primerSegmento = segmentos[0] as Idioma;
  if (IDIOMAS.includes(primerSegmento)) return primerSegmento;
  return IDIOMA_POR_DEFECTO;
}

// Generar URL equivalente en otro idioma
export function cambiarIdioma(urlActual: string, nuevoIdioma: Idioma): string {
  const segmentos = urlActual.split('/').filter(Boolean);
  if (segmentos.length === 0) return `/${nuevoIdioma}/`;

  // Mapa de equivalencias entre rutas
  const equivalencias: Record<string, Record<Idioma, string>> = {
    nosotros: { es: 'nosotros', en: 'about', fr: 'a-propos' },
    about: { es: 'nosotros', en: 'about', fr: 'a-propos' },
    'a-propos': { es: 'nosotros', en: 'about', fr: 'a-propos' },
    servicios: { es: 'servicios', en: 'services', fr: 'services' },
    services: { es: 'servicios', en: 'services', fr: 'services' },
    blog: { es: 'blog', en: 'blog', fr: 'blog' },
    contacto: { es: 'contacto', en: 'contact', fr: 'contact' },
    contact: { es: 'contacto', en: 'contact', fr: 'contact' },
    preguntas: { es: 'preguntas', en: 'faq', fr: 'faq' },
    faq: { es: 'preguntas', en: 'faq', fr: 'faq' },
  };

  // Reemplazar idioma y ruta
  segmentos[0] = nuevoIdioma;
  if (segmentos[1] && equivalencias[segmentos[1]]) {
    segmentos[1] = equivalencias[segmentos[1]][nuevoIdioma];
  }

  return '/' + segmentos.join('/');
}
