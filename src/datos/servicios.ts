import type { Idioma } from '../helpers/idiomas';

// ── Tipos ──
export interface Servicio {
  id: string;
  slug: Record<Idioma, string>;
  icono: string;
  titulo: Record<Idioma, string>;
  subtitulo: Record<Idioma, string>;
  descripcion: Record<Idioma, string>;
  especialidades: Record<Idioma, string[]>;
  sectores: Record<Idioma, string[]>;
  color: string;
  colorLight: string;
  colorDark: string;
}

// ── 5 servicios reales de ESIT ──
export const servicios: Servicio[] = [
  {
    id: 'traduccion',
    slug: { es: 'traduccion', en: 'translation', fr: 'traduction' },
    icono: `<svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>`,
    titulo: {
      es: 'Traducci\u00f3n de Documentos',
      en: 'Document Translation',
      fr: 'Traduction de Documents',
    },
    subtitulo: {
      es: 'Precisi\u00f3n ling\u00fc\u00edstica y validez legal en cada documento',
      en: 'Linguistic precision and legal validity in every document',
      fr: 'Pr\u00e9cision linguistique et validit\u00e9 juridique dans chaque document',
    },
    descripcion: {
      es: 'Traducci\u00f3n profesional de documentos legales, t\u00e9cnicos, m\u00e9dicos, financieros y acad\u00e9micos. Todos nuestros trabajos son realizados por traductores colegiados con certificaci\u00f3n oficial, garantizando validez para tr\u00e1mites nacionales e internacionales. Trabajamos con contratos, poderes, certificados, informes de auditor\u00eda, estudios de impacto ambiental, manuales de operaci\u00f3n, y toda clase de documentaci\u00f3n especializada.',
      en: 'Professional translation of legal, technical, medical, financial, and academic documents. All our work is performed by licensed translators with official certification, ensuring validity for national and international procedures. We work with contracts, powers of attorney, certificates, audit reports, environmental impact studies, operation manuals, and all types of specialized documentation.',
      fr: 'Traduction professionnelle de documents juridiques, techniques, m\u00e9dicaux, financiers et acad\u00e9miques. Tous nos travaux sont r\u00e9alis\u00e9s par des traducteurs asserment\u00e9s avec certification officielle, garantissant la validit\u00e9 pour les proc\u00e9dures nationales et internationales. Nous travaillons avec des contrats, procurations, certificats, rapports d\'audit, \u00e9tudes d\'impact environnemental, manuels d\'op\u00e9ration et tout type de documentation sp\u00e9cialis\u00e9e.',
    },
    especialidades: {
      es: ['Traducci\u00f3n Legal', 'Traducci\u00f3n T\u00e9cnica', 'Traducci\u00f3n M\u00e9dica', 'Traducci\u00f3n Financiera', 'Traducci\u00f3n Acad\u00e9mica', 'Documentos Certificados'],
      en: ['Legal Translation', 'Technical Translation', 'Medical Translation', 'Financial Translation', 'Academic Translation', 'Certified Documents'],
      fr: ['Traduction Juridique', 'Traduction Technique', 'Traduction M\u00e9dicale', 'Traduction Financi\u00e8re', 'Traduction Acad\u00e9mique', 'Documents Certifi\u00e9s'],
    },
    sectores: {
      es: ['Gobierno', 'Miner\u00eda', 'Energ\u00eda', 'Salud', 'Cooperaci\u00f3n Internacional'],
      en: ['Government', 'Mining', 'Energy', 'Health', 'International Cooperation'],
      fr: ['Gouvernement', 'Mines', '\u00c9nergie', 'Sant\u00e9', 'Coop\u00e9ration Internationale'],
    },
    color: '#2563EB',
    colorLight: '#DBEAFE',
    colorDark: '#1E3A5F',
  },
  {
    id: 'interpretacion',
    slug: { es: 'interpretacion', en: 'interpretation', fr: 'interpretation' },
    icono: `<svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
    </svg>`,
    titulo: {
      es: 'Interpretaci\u00f3n Profesional',
      en: 'Professional Interpretation',
      fr: 'Interpr\u00e9tation Professionnelle',
    },
    subtitulo: {
      es: 'Comunicaci\u00f3n en tiempo real para eventos de alto nivel',
      en: 'Real-time communication for high-level events',
      fr: 'Communication en temps r\u00e9el pour \u00e9v\u00e9nements de haut niveau',
    },
    descripcion: {
      es: 'Servicio de interpretaci\u00f3n simult\u00e1nea y consecutiva para conferencias, seminarios, reuniones bilaterales, talleres y eventos corporativos. Nuestro equipo cuenta con d\u00e9cadas de experiencia trabajando con organismos como la ONU, USAID, la OEA, embajadas y gobiernos. Ofrecemos modalidad presencial, remota (plataformas Zoom, Teams, Webex) e h\u00edbrida, con cobertura en espa\u00f1ol, ingl\u00e9s, franc\u00e9s, alem\u00e1n y m\u00e1s.',
      en: 'Simultaneous and consecutive interpretation service for conferences, seminars, bilateral meetings, workshops, and corporate events. Our team has decades of experience working with organizations such as the UN, USAID, the OAS, embassies, and governments. We offer in-person, remote (Zoom, Teams, Webex platforms), and hybrid modalities, covering Spanish, English, French, German, and more.',
      fr: 'Service d\'interpr\u00e9tation simultan\u00e9e et cons\u00e9cutive pour conf\u00e9rences, s\u00e9minaires, r\u00e9unions bilat\u00e9rales, ateliers et \u00e9v\u00e9nements corporatifs. Notre \u00e9quipe a des d\u00e9cennies d\'exp\u00e9rience avec des organisations telles que l\'ONU, l\'USAID, l\'OEA, des ambassades et gouvernements. Nous offrons des modalit\u00e9s en pr\u00e9sentiel, \u00e0 distance (plateformes Zoom, Teams, Webex) et hybrides, couvrant l\'espagnol, l\'anglais, le fran\u00e7ais, l\'allemand et plus.',
    },
    especialidades: {
      es: ['Simult\u00e1nea', 'Consecutiva', 'Susurrada (Chuchotage)', 'Enlace', 'Remota / Virtual', 'H\u00edbrida'],
      en: ['Simultaneous', 'Consecutive', 'Whispered (Chuchotage)', 'Liaison', 'Remote / Virtual', 'Hybrid'],
      fr: ['Simultan\u00e9e', 'Cons\u00e9cutive', 'Chuchotage', 'De liaison', '\u00c0 distance / Virtuelle', 'Hybride'],
    },
    sectores: {
      es: ['Diplomacia', 'Defensa', 'Desarrollo', 'Sector Privado', 'Justicia'],
      en: ['Diplomacy', 'Defense', 'Development', 'Private Sector', 'Justice'],
      fr: ['Diplomatie', 'D\u00e9fense', 'D\u00e9veloppement', 'Secteur Priv\u00e9', 'Justice'],
    },
    color: '#059669',
    colorLight: '#D1FAE5',
    colorDark: '#134E3A',
  },
  {
    id: 'subtitulado',
    slug: { es: 'subtitulado', en: 'subtitling', fr: 'sous-titrage' },
    icono: `<svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0118 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5" />
    </svg>`,
    titulo: {
      es: 'Subtitulado y Doblaje',
      en: 'Subtitling & Dubbing',
      fr: 'Sous-titrage et Doublage',
    },
    subtitulo: {
      es: 'Contenido audiovisual accesible en cualquier idioma',
      en: 'Audiovisual content accessible in any language',
      fr: 'Contenu audiovisuel accessible dans toutes les langues',
    },
    descripcion: {
      es: 'Subtitulado profesional, doblaje y locuci\u00f3n (voice-over) para videos corporativos, material de capacitaci\u00f3n, documentales, contenido educativo y campa\u00f1as institucionales. Utilizamos software especializado para garantizar sincronizaci\u00f3n perfecta y calidad broadcast. Ofrecemos subt\u00edtulos abiertos, cerrados (CC), y subtitulado para personas con discapacidad auditiva.',
      en: 'Professional subtitling, dubbing, and voice-over for corporate videos, training material, documentaries, educational content, and institutional campaigns. We use specialized software to ensure perfect synchronization and broadcast quality. We offer open subtitles, closed captions (CC), and subtitling for the hearing impaired.',
      fr: 'Sous-titrage professionnel, doublage et voix off pour vid\u00e9os corporatives, mat\u00e9riel de formation, documentaires, contenu \u00e9ducatif et campagnes institutionnelles. Nous utilisons des logiciels sp\u00e9cialis\u00e9s pour garantir une synchronisation parfaite et une qualit\u00e9 broadcast. Nous offrons des sous-titres ouverts, ferm\u00e9s (CC) et pour les malentendants.',
    },
    especialidades: {
      es: ['Subtitulado', 'Doblaje', 'Voice-over', 'Closed Captions', 'E-learning', 'Videos Corporativos'],
      en: ['Subtitling', 'Dubbing', 'Voice-over', 'Closed Captions', 'E-learning', 'Corporate Videos'],
      fr: ['Sous-titrage', 'Doublage', 'Voix off', 'Closed Captions', 'E-learning', 'Vid\u00e9os Corporatives'],
    },
    sectores: {
      es: ['Educaci\u00f3n', 'ONG', 'Medios', 'Corporativo', 'Gobierno'],
      en: ['Education', 'NGOs', 'Media', 'Corporate', 'Government'],
      fr: ['\u00c9ducation', 'ONG', 'M\u00e9dias', 'Corporatif', 'Gouvernement'],
    },
    color: '#7C3AED',
    colorLight: '#EDE9FE',
    colorDark: '#3B1F70',
  },
  {
    id: 'textos',
    slug: { es: 'textos', en: 'text-services', fr: 'services-textes' },
    icono: `<svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>`,
    titulo: {
      es: 'Servicios para Textos',
      en: 'Text Services',
      fr: 'Services pour Textes',
    },
    subtitulo: {
      es: 'Edici\u00f3n, correcci\u00f3n y adaptaci\u00f3n cultural de contenidos',
      en: 'Editing, proofreading, and cultural adaptation of content',
      fr: '\u00c9dition, correction et adaptation culturelle de contenus',
    },
    descripcion: {
      es: 'Edici\u00f3n y correcci\u00f3n de estilo en espa\u00f1ol, ingl\u00e9s y franc\u00e9s. Transcripci\u00f3n de audio y video. Redacci\u00f3n y adaptaci\u00f3n cultural de textos para mercados espec\u00edficos. Localizaci\u00f3n de contenido web, aplicaciones y material de marketing. Revisi\u00f3n de traducciones existentes para asegurar calidad y coherencia terminol\u00f3gica.',
      en: 'Editing and proofreading in Spanish, English, and French. Audio and video transcription. Copywriting and cultural adaptation of texts for specific markets. Localization of web content, applications, and marketing material. Review of existing translations to ensure quality and terminological consistency.',
      fr: '\u00c9dition et correction de style en espagnol, anglais et fran\u00e7ais. Transcription audio et vid\u00e9o. R\u00e9daction et adaptation culturelle de textes pour des march\u00e9s sp\u00e9cifiques. Localisation de contenu web, applications et mat\u00e9riel marketing. R\u00e9vision de traductions existantes pour assurer qualit\u00e9 et coh\u00e9rence terminologique.',
    },
    especialidades: {
      es: ['Edici\u00f3n', 'Correcci\u00f3n de Estilo', 'Transcripci\u00f3n', 'Localizaci\u00f3n', 'Redacci\u00f3n', 'Revisi\u00f3n'],
      en: ['Editing', 'Proofreading', 'Transcription', 'Localization', 'Copywriting', 'Review'],
      fr: ['\u00c9dition', 'Correction', 'Transcription', 'Localisation', 'R\u00e9daction', 'R\u00e9vision'],
    },
    sectores: {
      es: ['Marketing', 'Editorial', 'Tecnolog\u00eda', 'Investigaci\u00f3n', 'Comunicaci\u00f3n'],
      en: ['Marketing', 'Publishing', 'Technology', 'Research', 'Communications'],
      fr: ['Marketing', '\u00c9dition', 'Technologie', 'Recherche', 'Communication'],
    },
    color: '#D97706',
    colorLight: '#FEF3C7',
    colorDark: '#6B3A00',
  },
  {
    id: 'equipamiento',
    slug: { es: 'equipamiento', en: 'equipment', fr: 'equipement' },
    icono: `<svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>`,
    titulo: {
      es: 'Equipamiento T\u00e9cnico',
      en: 'Technical Equipment',
      fr: '\u00c9quipement Technique',
    },
    subtitulo: {
      es: 'Todo lo que necesita para conferencias multiling\u00fces',
      en: 'Everything you need for multilingual conferences',
      fr: 'Tout ce dont vous avez besoin pour des conf\u00e9rences multilingues',
    },
    descripcion: {
      es: 'Alquiler de cabinas de interpretaci\u00f3n simult\u00e1nea (port\u00e1tiles e ISO), equipos de sonido profesional, receptores inal\u00e1mbricos, transmisores y micr\u00f3fonos. Incluye instalaci\u00f3n, pruebas t\u00e9cnicas y soporte durante todo el evento. Servicio disponible para conferencias presenciales, h\u00edbridas y eventos al aire libre.',
      en: 'Rental of simultaneous interpretation booths (portable and ISO), professional sound equipment, wireless receivers, transmitters, and microphones. Includes installation, technical testing, and support throughout the event. Service available for in-person conferences, hybrid events, and outdoor venues.',
      fr: 'Location de cabines d\'interpr\u00e9tation simultan\u00e9e (portables et ISO), \u00e9quipements sonores professionnels, r\u00e9cepteurs sans fil, \u00e9metteurs et microphones. Comprend l\'installation, les tests techniques et le support pendant tout l\'\u00e9v\u00e9nement. Service disponible pour conf\u00e9rences en pr\u00e9sentiel, \u00e9v\u00e9nements hybrides et lieux en plein air.',
    },
    especialidades: {
      es: ['Cabinas ISO', 'Cabinas Port\u00e1tiles', 'Receptores', 'Audio Profesional', 'Soporte T\u00e9cnico', 'Instalaci\u00f3n'],
      en: ['ISO Booths', 'Portable Booths', 'Receivers', 'Professional Audio', 'Tech Support', 'Installation'],
      fr: ['Cabines ISO', 'Cabines Portables', 'R\u00e9cepteurs', 'Audio Professionnel', 'Support Technique', 'Installation'],
    },
    sectores: {
      es: ['Conferencias', 'Cumbres', 'Foros', 'Talleres', 'Eventos Corporativos'],
      en: ['Conferences', 'Summits', 'Forums', 'Workshops', 'Corporate Events'],
      fr: ['Conf\u00e9rences', 'Sommets', 'Forums', 'Ateliers', '\u00c9v\u00e9nements Corporatifs'],
    },
    color: '#0891B2',
    colorLight: '#CFFAFE',
    colorDark: '#164E63',
  },
];

// ── Textos compartidos para la pagina de servicios ──
export const textosServicios: Record<string, Record<Idioma, string>> = {
  badge: { es: 'Nuestros Servicios', en: 'Our Services', fr: 'Nos Services' },
  titulo: { es: 'Servicios Profesionales', en: 'Professional Services', fr: 'Services Professionnels' },
  subtitulo: {
    es: 'M\u00e1s de 33 a\u00f1os ofreciendo soluciones ling\u00fc\u00edsticas integrales a organismos internacionales, gobiernos y empresas l\u00edderes.',
    en: 'Over 33 years offering comprehensive linguistic solutions to international organizations, governments, and leading companies.',
    fr: 'Plus de 33 ans \u00e0 offrir des solutions linguistiques compl\u00e8tes aux organisations internationales, gouvernements et entreprises leaders.',
  },
  especialidades: { es: 'Especialidades', en: 'Specialties', fr: 'Sp\u00e9cialit\u00e9s' },
  sectores: { es: 'Sectores', en: 'Sectors', fr: 'Secteurs' },
  cotizar: { es: 'Solicitar cotizaci\u00f3n', en: 'Request a quote', fr: 'Demander un devis' },
  verDetalle: { es: 'Ver detalles', en: 'View details', fr: 'Voir les d\u00e9tails' },
  volver: { es: 'Volver a servicios', en: 'Back to services', fr: 'Retour aux services' },
  ctaTitulo: { es: '\u00bfListo para empezar?', en: 'Ready to get started?', fr: 'Pr\u00eat \u00e0 commencer ?' },
  ctaDesc: {
    es: 'Cu\u00e9ntenos sobre su proyecto y reciba una cotizaci\u00f3n personalizada en menos de 24 horas.',
    en: 'Tell us about your project and receive a personalized quote within 24 hours.',
    fr: 'Parlez-nous de votre projet et recevez un devis personnalis\u00e9 en moins de 24 heures.',
  },
  ctaBoton: { es: 'Cont\u00e1ctenos ahora', en: 'Contact us now', fr: 'Contactez-nous maintenant' },
  ctaWhatsapp: { es: 'Escribir por WhatsApp', en: 'Message on WhatsApp', fr: '\u00c9crire sur WhatsApp' },
  otrosServicios: { es: 'Otros servicios', en: 'Other services', fr: 'Autres services' },
};

// ── Helpers ──

/** Obtener un servicio por su slug en un idioma determinado */
export function obtenerServicioPorSlug(slug: string, idioma: Idioma): Servicio | undefined {
  return servicios.find((s) => s.slug[idioma] === slug);
}

/** Obtener la ruta de detalle de un servicio */
export function obtenerRutaServicio(servicio: Servicio, idioma: Idioma): string {
  const base: Record<Idioma, string> = {
    es: '/es/servicios',
    en: '/en/services',
    fr: '/fr/services',
  };
  return `${base[idioma]}/${servicio.slug[idioma]}`;
}

/** Obtener todos los slugs para getStaticPaths */
export function obtenerSlugsServicios(idioma: Idioma) {
  return servicios.map((s) => ({ params: { slug: s.slug[idioma] } }));
}
