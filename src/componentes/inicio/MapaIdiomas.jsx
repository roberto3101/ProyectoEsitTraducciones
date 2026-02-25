import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import * as d3 from "d3";
import { feature } from "topojson-client";

/*
  Mapa Mundial Interactivo v5 — ESIT Traducciones
  ✓ 8 idiomas extranjeros (ES, EN, FR, DE, IT, PT, ZH, JA)
  ✓ Light + Dark mode
  ✓ Países verificados por idioma oficial
  ✓ Botón para volver a vista global
  ✓ Tooltip con nombre + idiomas
  ✓ Contadores animados
  ✓ CTA de contacto
  ✓ Responsive
*/

// ── Países por idioma OFICIAL (ISO 3166-1 numeric) ──

const SPANISH_IDS = new Set([
  32, 68, 152, 170, 188, 192, 214, 218, 222, 226,
  320, 340, 484, 558, 591, 600, 604, 724, 858, 862,
]);

const ENGLISH_IDS = new Set([
  36, 44, 52, 84, 72, 124, 242, 288, 328, 356,
  372, 388, 404, 426, 430, 454, 516, 554, 566, 598,
  694, 702, 710, 716, 780, 800, 826, 834, 840, 894,
]);

const FRENCH_IDS = new Set([
  108, 120, 140, 148, 174, 178, 180, 204, 250, 266,
  324, 332, 384, 442, 450, 466, 478, 562, 646, 686,
  768, 854,
]);

const GERMAN_IDS = new Set([
  40,  // Austria
  276, // Alemania
  442, // Luxemburgo
  756, // Suiza
]);

const ITALIAN_IDS = new Set([
  380, // Italia
  756, // Suiza (cooficial)
]);

const PORTUGUESE_IDS = new Set([
  76,  // Brasil
  620, // Portugal
  24,  // Angola
  508, // Mozambique
]);

const CHINESE_IDS = new Set([
  156, // China
  702, // Singapur (cooficial)
]);

const JAPANESE_IDS = new Set([
  392, // Japón
]);

const LANG_SETS = {
  es: SPANISH_IDS, en: ENGLISH_IDS, fr: FRENCH_IDS,
  de: GERMAN_IDS, it: ITALIAN_IDS, pt: PORTUGUESE_IDS,
  zh: CHINESE_IDS, ja: JAPANESE_IDS,
};

function getLangs(id) {
  const n = +id;
  const langs = [];
  for (const [k, set] of Object.entries(LANG_SETS)) {
    if (set.has(n)) langs.push(k);
  }
  return langs;
}

// ── Nombres de países ──
const COUNTRY_NAMES = {
  4:"Afganistán",8:"Albania",12:"Argelia",24:"Angola",32:"Argentina",36:"Australia",40:"Austria",
  44:"Bahamas",50:"Bangladés",52:"Barbados",56:"Bélgica",64:"Bután",68:"Bolivia",70:"Bosnia",
  72:"Botsuana",76:"Brasil",84:"Belice",90:"Islas Salomón",96:"Brunéi",100:"Bulgaria",104:"Myanmar",
  108:"Burundi",116:"Camboya",120:"Camerún",124:"Canadá",140:"Rep. Centroafricana",144:"Sri Lanka",
  148:"Chad",152:"Chile",156:"China",170:"Colombia",174:"Comoras",178:"Congo",180:"R.D. Congo",
  188:"Costa Rica",191:"Croacia",192:"Cuba",196:"Chipre",203:"Chequia",204:"Benín",208:"Dinamarca",
  214:"Rep. Dominicana",218:"Ecuador",222:"El Salvador",226:"Guinea Ecuatorial",231:"Etiopía",
  232:"Eritrea",233:"Estonia",242:"Fiyi",246:"Finlandia",250:"Francia",266:"Gabón",270:"Gambia",
  268:"Georgia",276:"Alemania",288:"Ghana",300:"Grecia",320:"Guatemala",324:"Guinea",328:"Guyana",
  332:"Haití",340:"Honduras",348:"Hungría",352:"Islandia",356:"India",360:"Indonesia",364:"Irán",
  368:"Irak",372:"Irlanda",376:"Israel",380:"Italia",384:"Costa de Marfil",388:"Jamaica",392:"Japón",
  398:"Kazajistán",400:"Jordania",404:"Kenia",408:"Corea del Norte",410:"Corea del Sur",414:"Kuwait",
  417:"Kirguistán",418:"Laos",422:"Líbano",426:"Lesoto",430:"Liberia",434:"Libia",440:"Lituania",
  442:"Luxemburgo",450:"Madagascar",454:"Malaui",458:"Malasia",466:"Malí",478:"Mauritania",
  484:"México",496:"Mongolia",504:"Marruecos",508:"Mozambique",516:"Namibia",
  524:"Nepal",528:"Países Bajos",554:"Nueva Zelanda",558:"Nicaragua",
  562:"Níger",566:"Nigeria",578:"Noruega",586:"Pakistán",591:"Panamá",598:"Papúa N. Guinea",
  600:"Paraguay",604:"Perú",608:"Filipinas",616:"Polonia",620:"Portugal",
  634:"Catar",642:"Rumanía",643:"Rusia",646:"Ruanda",682:"Arabia Saudita",686:"Senegal",
  694:"Sierra Leona",702:"Singapur",703:"Eslovaquia",704:"Vietnam",705:"Eslovenia",706:"Somalia",
  710:"Sudáfrica",716:"Zimbabue",724:"España",728:"Sudán del Sur",729:"Sudán",740:"Surinam",
  748:"Suazilandia",752:"Suecia",756:"Suiza",760:"Siria",762:"Tayikistán",764:"Tailandia",
  768:"Togo",780:"Trinidad y Tobago",788:"Túnez",792:"Turquía",800:"Uganda",
  804:"Ucrania",784:"Emiratos Árabes",826:"Reino Unido",834:"Tanzania",840:"Estados Unidos",
  854:"Burkina Faso",858:"Uruguay",860:"Uzbekistán",862:"Venezuela",887:"Yemen",894:"Zambia"
};

const IDIOMAS = {
  es: { nombre: "Español",    color: "#F59E0B", paises: SPANISH_IDS.size,    hablantes: "500M+" },
  en: { nombre: "Inglés",     color: "#3B82F6", paises: ENGLISH_IDS.size,    hablantes: "1.5B+" },
  fr: { nombre: "Francés",    color: "#EF4444", paises: FRENCH_IDS.size,     hablantes: "320M+" },
  de: { nombre: "Alemán",     color: "#8B5CF6", paises: GERMAN_IDS.size,     hablantes: "130M+" },
  it: { nombre: "Italiano",   color: "#10B981", paises: ITALIAN_IDS.size,    hablantes: "85M+" },
  pt: { nombre: "Portugués",  color: "#06B6D4", paises: PORTUGUESE_IDS.size, hablantes: "260M+" },
  zh: { nombre: "Chino",      color: "#F97316", paises: CHINESE_IDS.size,    hablantes: "1.1B+" },
  ja: { nombre: "Japonés",    color: "#EC4899", paises: JAPANESE_IDS.size,   hablantes: "125M+" },
};

const LANG_LABELS = {
  es: "ES", en: "EN", fr: "FR", de: "DE", it: "IT", pt: "PT", zh: "ZH", ja: "JA",
};

const LIMA = [-77.0428, -12.0464];

const TARGETS = [
  { coords: [-3.7038, 40.4168],   lang: "es" },  // Madrid
  { coords: [-99.1332, 19.4326],  lang: "es" },  // Ciudad de México
  { coords: [-58.3816, -34.6037], lang: "es" },  // Buenos Aires
  { coords: [-77.0369, 38.9072],  lang: "en" },  // Washington
  { coords: [151.2093, -33.8688], lang: "en" },  // Sydney
  { coords: [-0.1278, 51.5074],   lang: "en" },  // Londres
  { coords: [2.3522, 48.8566],    lang: "fr" },  // París
  { coords: [-17.4677, 14.7167],  lang: "fr" },  // Dakar
  { coords: [13.4050, 52.5200],   lang: "de" },  // Berlín
  { coords: [12.4964, 41.9028],   lang: "it" },  // Roma
  { coords: [-43.1729, -22.9068], lang: "pt" },  // Río de Janeiro
  { coords: [-9.1393, 38.7223],   lang: "pt" },  // Lisboa
  { coords: [116.4074, 39.9042],  lang: "zh" },  // Beijing
  { coords: [139.6917, 35.6895],  lang: "ja" },  // Tokio
];

const WORLD_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// ── Detectar dark mode ──
function useIsDark() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const check = () => setDark(document.documentElement.classList.contains("dark"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);
  return dark;
}

// ── Contador animado ──
function AnimatedCounter({ end, suffix = "", duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const animate = (now) => {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
          setCount(Math.floor(eased * end));
          if (p < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function MapaIdiomas({ idioma = "es" }) {
  const containerRef = useRef(null);
  const [activo, setActivo] = useState(null);
  const [worldData, setWorldData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hover, setHover] = useState(null);
  const [dims, setDims] = useState({ w: 960, h: 480 });
  const isDark = useIsDark();

  // Textos multilingüe
  const textos = useMemo(() => ({
    es: {
      badge: "Cobertura Internacional",
      titulo: "Alcance Global",
      subtitulo: "Conectamos culturas a través de traducciones precisas en los idiomas que mueven al mundo. Desde Lima, Perú, hacia todos los continentes.",
      vistaGlobal: "✕ Vista global",
      cargando: "Cargando mapa...",
      explorar: "Seleccione un idioma o explore el mapa",
      paises: "países",
      hablantes: "hablantes",
      sinIdioma: "Sin idioma destacado",
      stats: {
        idiomas: "Idiomas extranjeros",
        paises: "Países cubiertos",
        sectores: "Sectores de especialidad",
        anios: "Años de experiencia",
      },
      cta: {
        titulo: "¿Necesita traducción o interpretación?",
        subtitulo: "Nuestro equipo de profesionales está listo para atenderlo",
        boton: "Conversemos",
        boton2: "Solicitar cotización",
      },
    },
    en: {
      badge: "International Coverage",
      titulo: "Global Reach",
      subtitulo: "We connect cultures through precise translations in the languages that move the world. From Lima, Peru, to every continent.",
      vistaGlobal: "✕ View all",
      cargando: "Loading map...",
      explorar: "Select a language or explore the map",
      paises: "countries",
      hablantes: "speakers",
      sinIdioma: "No featured language",
      stats: {
        idiomas: "Foreign languages",
        paises: "Countries covered",
        sectores: "Specialty sectors",
        anios: "Years of experience",
      },
      cta: {
        titulo: "Need translation or interpretation?",
        subtitulo: "Our team of professionals is ready to assist you",
        boton: "Let's talk",
        boton2: "Request a quote",
      },
    },
    fr: {
      badge: "Couverture Internationale",
      titulo: "Portée Mondiale",
      subtitulo: "Nous connectons les cultures grâce à des traductions précises dans les langues qui font bouger le monde. De Lima, Pérou, vers tous les continents.",
      vistaGlobal: "✕ Voir tous",
      cargando: "Chargement de la carte...",
      explorar: "Sélectionnez une langue ou explorez la carte",
      paises: "pays",
      hablantes: "locuteurs",
      sinIdioma: "Pas de langue en vedette",
      stats: {
        idiomas: "Langues étrangères",
        paises: "Pays couverts",
        sectores: "Secteurs de spécialité",
        anios: "Années d'expérience",
      },
      cta: {
        titulo: "Besoin de traduction ou d'interprétation ?",
        subtitulo: "Notre équipe de professionnels est prête à vous aider",
        boton: "Parlons-en",
        boton2: "Demander un devis",
      },
    },
  }), []);

  const t = textos[idioma] || textos.es;

  // Paleta según modo
  const P = isDark
    ? {
        bg: "linear-gradient(175deg, #050a14 0%, #0a1220 40%, #070d18 100%)",
        border: "#12223a",
        shadow: "0 30px 80px rgba(0,0,0,0.55)",
        countryBase: "#1a3555",
        countryEmpty: "#111e33",
        countryOff: "#080e1a",
        countryHover: "#2a4a70",
        stroke: "#0c1628",
        strokeHover: "#8aa4c0",
        graticule: "#0c1a2e",
        sphere: "#14243d",
        barBg: "rgba(6,10,20,0.95)",
        barBorder: "#111d30",
        textMuted: "#4a5e78",
        textLight: "#3a4f68",
        btnBg: "rgba(8,14,26,0.7)",
        btnBorder: "#182840",
        btnText: "#6a7f9a",
        btnTextActive: "#f1f5f9",
        tooltipBg: "#0c1628",
        tooltipBorder: "#1e3350",
        tooltipText: "#e2e8f0",
        limaBg: "#0a1220",
        counterBg: "rgba(6,10,20,0.6)",
        counterBorder: "#12223a",
      }
    : {
        bg: "linear-gradient(175deg, #f0f4f8 0%, #e8edf3 40%, #f0f4f8 100%)",
        border: "#d1d9e6",
        shadow: "0 20px 60px rgba(0,0,0,0.08)",
        countryBase: "#b8cce0",
        countryEmpty: "#dce4ed",
        countryOff: "#edf1f7",
        countryHover: "#97b3cf",
        stroke: "#c5d0de",
        strokeHover: "#6889a8",
        graticule: "#d8e0ea",
        sphere: "#c5d0de",
        barBg: "rgba(248,250,252,0.95)",
        barBorder: "#d1d9e6",
        textMuted: "#64748b",
        textLight: "#94a3b8",
        btnBg: "rgba(255,255,255,0.8)",
        btnBorder: "#d1d9e6",
        btnText: "#64748b",
        btnTextActive: "#1e293b",
        tooltipBg: "#ffffff",
        tooltipBorder: "#d1d9e6",
        tooltipText: "#1e293b",
        limaBg: "#ffffff",
        counterBg: "rgba(255,255,255,0.7)",
        counterBorder: "#d1d9e6",
      };

  useEffect(() => {
    fetch(WORLD_URL)
      .then((r) => r.json())
      .then((topo) => { setWorldData(feature(topo, topo.objects.countries)); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.offsetWidth;
      setDims({ w, h: Math.max(260, Math.round(w * (w > 640 ? 0.46 : 0.6))) });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const projection = useMemo(() => {
    if (!worldData) return null;
    return d3.geoNaturalEarth1()
      .fitSize([dims.w - 32, dims.h - 32], worldData)
      .translate([dims.w / 2, dims.h / 2]);
  }, [worldData, dims]);

  const pathGen = useMemo(() => projection ? d3.geoPath().projection(projection) : null, [projection]);

  const getColor = useCallback((id) => {
    const langs = getLangs(id);
    if (!activo) return langs.length > 0 ? P.countryBase : P.countryEmpty;
    return langs.includes(activo) ? IDIOMAS[activo].color : P.countryOff;
  }, [activo, P]);

  const getOpacity = useCallback((id) => {
    const langs = getLangs(id);
    if (!activo) return langs.length > 0 ? (isDark ? 0.65 : 0.85) : (isDark ? 0.3 : 0.5);
    return langs.includes(activo) ? (isDark ? 0.8 : 0.9) : (isDark ? 0.08 : 0.2);
  }, [activo, isDark]);

  const getStroke = useCallback((id, isHovered) => {
    const langs = getLangs(id);
    if (isHovered) return P.strokeHover;
    if (activo && langs.includes(activo)) return IDIOMAS[activo].color + (isDark ? "50" : "70");
    return P.stroke;
  }, [activo, isDark, P]);

  const handleCountryEnter = useCallback((e, f) => {
    const rawId = f.id ?? f.properties?.id;
    const id = rawId != null && !isNaN(+rawId) ? +rawId : -1;
    const name = COUNTRY_NAMES[id] || (f.properties?.name) || `País`;
    const langs = getLangs(id);
    const svg = e.currentTarget.closest("svg");
    const pt = svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
    setHover({ id, name, langs, x: svgP.x, y: svgP.y });
  }, []);

  const handleCountryMove = useCallback((e) => {
    const svg = e.currentTarget.closest("svg");
    if (!svg) return;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
    setHover((prev) => prev ? { ...prev, x: svgP.x, y: svgP.y } : null);
  }, []);

  const limaPos = projection ? projection(LIMA) : null;

  // Contar países únicos totales
  const totalPaises = useMemo(() => {
    const all = new Set();
    Object.values(LANG_SETS).forEach(s => s.forEach(id => all.add(id)));
    return all.size;
  }, []);

  return (
    <div ref={containerRef} style={{
      width: "100%", maxWidth: "1100px", margin: "0 auto",
      fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif",
    }}>

      {/* ── Botones de idioma ── */}
      <div style={{
        display: "flex", justifyContent: "center", gap: "6px",
        marginBottom: "20px", flexWrap: "wrap", alignItems: "center",
      }}>
        {Object.entries(IDIOMAS).map(([k, v]) => {
          const isActive = activo === k;
          return (
            <button key={k} onClick={() => setActivo(isActive ? null : k)}
              style={{
                padding: isActive ? "8px 16px" : "7px 14px",
                borderRadius: "10px", cursor: "pointer",
                border: `1.5px solid ${isActive ? v.color : P.btnBorder}`,
                background: isActive ? v.color + (isDark ? "18" : "12") : P.btnBg,
                color: isActive ? P.btnTextActive : P.btnText,
                fontWeight: 600, fontSize: "12px",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                transform: isActive ? "scale(1.05)" : "scale(1)",
                boxShadow: isActive ? `0 0 20px ${v.color}${isDark ? "25" : "18"}` : "0 2px 6px rgba(0,0,0,0.04)",
                backdropFilter: "blur(12px)",
                display: "flex", alignItems: "center", gap: "6px",
              }}
            >
              <span style={{
                width: 8, height: 8, borderRadius: "50%",
                background: v.color, display: "inline-block", flexShrink: 0,
                boxShadow: isActive ? `0 0 8px ${v.color}` : "none",
              }} />
              <span>{v.nombre}</span>
              {isActive && (
                <span style={{
                  fontSize: "10px", opacity: 0.6, marginLeft: "2px",
                  whiteSpace: "nowrap",
                }}>
                  {v.paises} {t.paises}
                </span>
              )}
            </button>
          );
        })}

        {/* Botón reset */}
        {activo && (
          <button onClick={() => setActivo(null)}
            style={{
              padding: "7px 12px", borderRadius: "10px", cursor: "pointer",
              border: `1.5px solid ${isDark ? "#2a3a52" : "#cbd5e1"}`,
              background: isDark ? "rgba(30,45,70,0.5)" : "rgba(255,255,255,0.9)",
              color: isDark ? "#94a3b8" : "#64748b",
              fontWeight: 600, fontSize: "11px",
              transition: "all 0.3s ease",
              backdropFilter: "blur(8px)",
            }}
          >
            {t.vistaGlobal}
          </button>
        )}
      </div>

      {/* ── Mapa ── */}
      <div style={{
        borderRadius: "20px", overflow: "hidden", background: P.bg,
        border: `1px solid ${P.border}`, boxShadow: P.shadow, position: "relative",
      }}>
        {/* Glow */}
        {activo && isDark && (
          <div style={{
            position: "absolute", top: "35%", left: "50%",
            width: "400px", height: "400px", borderRadius: "50%", filter: "blur(130px)",
            transform: "translate(-50%,-50%)",
            background: IDIOMAS[activo].color + "0d",
            transition: "all 1.2s ease", pointerEvents: "none",
          }} />
        )}

        {loading ? (
          <div style={{
            height: "420px", display: "flex", alignItems: "center", justifyContent: "center",
            color: P.textMuted, fontSize: "14px",
          }}>
            <div style={{ textAlign: "center" }}>
              <svg width="36" height="36" viewBox="0 0 36 36" style={{ margin: "0 auto 14px", display: "block" }}>
                <circle cx="18" cy="18" r="15" fill="none" stroke={P.sphere} strokeWidth="3" />
                <circle cx="18" cy="18" r="15" fill="none" stroke="#3B82F6" strokeWidth="3"
                  strokeDasharray="25 70" strokeLinecap="round">
                  <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite" />
                </circle>
              </svg>
              {t.cargando}
            </div>
          </div>
        ) : (
          <svg viewBox={`0 0 ${dims.w} ${dims.h}`}
            style={{ width: "100%", height: "auto", display: "block", position: "relative" }}>

            {pathGen && <path d={pathGen(d3.geoGraticule().step([20, 20])())} fill="none" stroke={P.graticule} strokeWidth="0.25" />}
            {pathGen && <path d={pathGen({ type: "Sphere" })} fill="none" stroke={P.sphere} strokeWidth="0.5" />}

            {/* Países */}
            {worldData && pathGen && worldData.features.map((f, idx) => {
              const rawId = f.id ?? f.properties?.id;
              const id = rawId != null && !isNaN(+rawId) ? +rawId : -(idx + 1);
              const isHovered = hover?.id === id;
              const langs = getLangs(id);
              return (
                <path key={`country-${rawId ?? idx}`} d={pathGen(f)}
                  fill={isHovered ? (activo && langs.includes(activo) ? IDIOMAS[activo].color : P.countryHover) : getColor(id)}
                  stroke={getStroke(id, isHovered)}
                  strokeWidth={isHovered ? 1.2 : (activo && langs.includes(activo)) ? 0.6 : 0.25}
                  opacity={isHovered ? 1 : getOpacity(id)}
                  onMouseEnter={(e) => handleCountryEnter(e, f)}
                  onMouseMove={handleCountryMove}
                  onMouseLeave={() => setHover(null)}
                  style={{ transition: "fill 0.3s, opacity 0.3s, stroke 0.2s", cursor: "pointer" }}
                />
              );
            })}

            {/* Conexiones desde Lima */}
            {limaPos && projection && TARGETS.map((tgt, i) => {
              const show = !activo || tgt.lang === activo;
              const tPos = projection(tgt.coords);
              if (!tPos) return null;
              const interp = d3.geoInterpolate(LIMA, tgt.coords);
              const pts = Array.from({ length: 40 }, (_, j) => j / 39).map((v) => projection(interp(v))).filter(Boolean);
              if (pts.length < 2) return null;
              const line = d3.line().curve(d3.curveBasis);
              return (
                <g key={i} style={{ transition: "opacity 0.6s" }} opacity={show ? 1 : 0.03}>
                  <path d={line(pts)} fill="none" stroke={IDIOMAS[tgt.lang].color}
                    strokeWidth="3" opacity="0.04" />
                  <path d={line(pts)} fill="none" stroke={IDIOMAS[tgt.lang].color}
                    strokeWidth={show ? 1 : 0.15} opacity={show ? (isDark ? 0.3 : 0.4) : 0.02}
                    strokeDasharray="5 4" style={{ transition: "all 0.6s ease" }}>
                    {show && <animate attributeName="stroke-dashoffset" from="18" to="0" dur="3s" repeatCount="indefinite" />}
                  </path>
                  {show && (
                    <g>
                      <circle cx={tPos[0]} cy={tPos[1]} r="4" fill={IDIOMAS[tgt.lang].color} opacity="0.08">
                        <animate attributeName="r" values="4;7;4" dur="3s" repeatCount="indefinite" />
                      </circle>
                      <circle cx={tPos[0]} cy={tPos[1]} r="2" fill={IDIOMAS[tgt.lang].color} opacity="0.5" />
                    </g>
                  )}
                </g>
              );
            })}

            {/* Beacon Lima */}
            {limaPos && (
              <g>
                <circle cx={limaPos[0]} cy={limaPos[1]} r="12" fill="#F59E0B" opacity="0.04">
                  <animate attributeName="r" values="12;22;12" dur="3s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.04;0.01;0.04" dur="3s" repeatCount="indefinite" />
                </circle>
                <circle cx={limaPos[0]} cy={limaPos[1]} r="5" fill="#F59E0B" opacity={isDark ? 0.12 : 0.2} />
                <circle cx={limaPos[0]} cy={limaPos[1]} r="3.5" fill="#F59E0B" opacity={isDark ? 0.6 : 0.8} />
                <circle cx={limaPos[0]} cy={limaPos[1]} r="1.5" fill="#fff" />
                <g transform={`translate(${limaPos[0] + 10}, ${limaPos[1] - 5})`}>
                  <rect x="-3" y="-10" width="90" height="18" rx="5"
                    fill={P.limaBg} fillOpacity="0.92"
                    stroke="#F59E0B" strokeWidth="0.6" strokeOpacity={isDark ? 0.35 : 0.5} />
                  <text x="42" y="2" textAnchor="middle" fill="#F59E0B"
                    fontSize="8.5" fontWeight="700" letterSpacing="0.4"
                    style={{ fontFamily: "'Sora', system-ui, sans-serif" }}>
                    ESIT · Lima, Perú
                  </text>
                </g>
              </g>
            )}

            {/* Tooltip */}
            {hover && (
              <g transform={`translate(${Math.min(hover.x + 14, dims.w - 170)}, ${Math.max(hover.y - 60, 10)})`}
                style={{ pointerEvents: "none" }}>
                <rect x="0" y="0" width="160" height={hover.langs.length > 0 ? 56 : 36} rx="8"
                  fill={P.tooltipBg} fillOpacity="0.95" stroke={P.tooltipBorder} strokeWidth="0.8" />
                <text x="12" y="18" fill={P.tooltipText} fontSize="11" fontWeight="700"
                  style={{ fontFamily: "'Sora', system-ui" }}>
                  {hover.name}
                </text>
                {hover.langs.length > 0 ? (
                  <g transform="translate(12, 28)">
                    {hover.langs.map((lang, j) => (
                      <g key={lang} transform={`translate(${j * 36}, 0)`}>
                        <rect x="0" y="0" width="32" height="18" rx="4"
                          fill={IDIOMAS[lang].color + (isDark ? "20" : "15")}
                          stroke={IDIOMAS[lang].color + (isDark ? "50" : "40")} strokeWidth="0.6" />
                        <circle cx="9" cy="9" r="2.5" fill={IDIOMAS[lang].color} />
                        <text x="16" y="12.5" fill={IDIOMAS[lang].color} fontSize="8" fontWeight="700">
                          {LANG_LABELS[lang]}
                        </text>
                      </g>
                    ))}
                  </g>
                ) : (
                  <text x="12" y="30" fill={P.textMuted} fontSize="9" fontStyle="italic">
                    {t.sinIdioma}
                  </text>
                )}
              </g>
            )}
          </svg>
        )}

        {/* Barra inferior del mapa */}
        <div style={{
          padding: "10px 20px", background: P.barBg,
          borderTop: `1px solid ${P.barBorder}`,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: "6px",
        }}>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {Object.entries(IDIOMAS).map(([k, v]) => (
              <span key={k} style={{
                display: "flex", alignItems: "center", gap: "4px",
                fontSize: "10px",
                color: activo === k ? v.color : P.textMuted,
                fontWeight: activo === k ? 700 : 400,
                transition: "all 0.3s",
                cursor: "pointer",
                opacity: activo && activo !== k ? 0.4 : 1,
              }} onClick={() => setActivo(activo === k ? null : k)}>
                <span style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: v.color, display: "inline-block",
                  boxShadow: activo === k ? `0 0 6px ${v.color}` : "none",
                }} />
                {v.nombre}
              </span>
            ))}
          </div>
          <span style={{ color: P.textLight, fontSize: "10px", fontStyle: "italic" }}>
            {activo
              ? `${IDIOMAS[activo].paises} ${t.paises} · ${IDIOMAS[activo].hablantes} ${t.hablantes}`
              : hover
                ? `${hover.name}${hover.langs.length > 0 ? " — " + hover.langs.map(l => IDIOMAS[l].nombre).join(", ") : ""}`
                : t.explorar
            }
          </span>
        </div>
      </div>

      {/* ── Contadores animados ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "12px",
        marginTop: "20px",
      }}>
        {[
          { valor: 8, sufijo: "+", label: t.stats.idiomas, icon: "🌐" },
          { valor: totalPaises, sufijo: "+", label: t.stats.paises, icon: "🗺️" },
          { valor: 12, sufijo: "+", label: t.stats.sectores, icon: "🏛️" },
          { valor: 33, sufijo: "+", label: t.stats.anios, icon: "📅" },
        ].map((stat, i) => (
          <div key={i} style={{
            textAlign: "center", padding: "20px 12px",
            borderRadius: "14px",
            background: isDark ? P.counterBg : P.counterBg,
            border: `1px solid ${isDark ? P.counterBorder : P.counterBorder}`,
            backdropFilter: "blur(10px)",
          }}>
            <div style={{ fontSize: "20px", marginBottom: "6px" }}>{stat.icon}</div>
            <div style={{
              fontSize: "28px", fontWeight: 800, lineHeight: 1,
              color: isDark ? "#e2e8f0" : "#1e293b",
              fontFamily: "'Sora', system-ui, sans-serif",
            }}>
              <AnimatedCounter end={stat.valor} suffix={stat.sufijo} />
            </div>
            <div style={{
              fontSize: "11px", marginTop: "6px",
              color: isDark ? "#64748b" : "#94a3b8",
              fontWeight: 500,
            }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* ── CTA ── */}
      <div style={{
        marginTop: "24px", textAlign: "center",
        padding: "28px 24px",
        borderRadius: "16px",
        background: isDark
          ? "linear-gradient(135deg, rgba(37,99,235,0.08) 0%, rgba(37,99,235,0.03) 100%)"
          : "linear-gradient(135deg, rgba(37,99,235,0.05) 0%, rgba(37,99,235,0.02) 100%)",
        border: `1px solid ${isDark ? "rgba(37,99,235,0.15)" : "rgba(37,99,235,0.12)"}`,
      }}>
        <p style={{
          fontSize: "18px", fontWeight: 700,
          color: isDark ? "#e2e8f0" : "#1e293b",
          fontFamily: "'Sora', system-ui, sans-serif",
          margin: "0 0 6px 0",
        }}>
          {t.cta.titulo}
        </p>
        <p style={{
          fontSize: "13px", color: isDark ? "#64748b" : "#94a3b8",
          margin: "0 0 18px 0",
        }}>
          {t.cta.subtitulo}
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
          <a href="https://wa.link/1ox3xw" target="_blank" rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "12px 28px", borderRadius: "10px",
              background: "#25D366", color: "#fff",
              fontWeight: 700, fontSize: "14px",
              textDecoration: "none",
              boxShadow: "0 4px 16px rgba(37,211,102,0.25)",
              transition: "all 0.3s",
              fontFamily: "'Sora', system-ui, sans-serif",
            }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.75.75 0 00.917.918l4.462-1.498A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.296 0-4.429-.67-6.24-1.822l-.436-.29-2.65.89.887-2.637-.318-.462A9.935 9.935 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
            </svg>
            {t.cta.boton}
          </a>
          <a href={`/${idioma === "es" ? "es/contacto" : idioma === "en" ? "en/contact" : "fr/contact"}`}
            style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              padding: "12px 28px", borderRadius: "10px",
              background: "transparent",
              color: isDark ? "#93c5fd" : "#2563eb",
              fontWeight: 600, fontSize: "14px",
              textDecoration: "none",
              border: `1.5px solid ${isDark ? "rgba(96,165,250,0.3)" : "rgba(37,99,235,0.2)"}`,
              transition: "all 0.3s",
              fontFamily: "'Sora', system-ui, sans-serif",
            }}>
            {t.cta.boton2}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}