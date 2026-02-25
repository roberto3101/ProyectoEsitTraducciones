import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import * as d3 from "d3";
import { feature } from "topojson-client";

/*
  Mapa Mundial Interactivo v3 — ESIT Traducciones
  D3 + TopoJSON | Tooltips | Responsive | Elegante
*/

// ── Datos de paises por idioma (ISO 3166-1 numeric) ──
const SPANISH_IDS = new Set([
  32,68,152,170,188,192,214,218,222,226,320,340,484,558,591,600,604,724,858,862
]);
const ENGLISH_IDS = new Set([
  36,44,52,72,84,124,242,288,328,344,356,372,388,404,426,430,454,
  480,508,516,554,566,598,694,702,710,716,780,800,826,834,840,882,894
]);
const FRENCH_IDS = new Set([
  108,120,140,148,174,178,180,204,250,266,324,332,384,442,450,466,478,562,646,686,768,854
]);

function getLangs(id) {
  const n = +id;
  const langs = [];
  if (SPANISH_IDS.has(n)) langs.push("es");
  if (ENGLISH_IDS.has(n)) langs.push("en");
  if (FRENCH_IDS.has(n)) langs.push("fr");
  return langs;
}

// ── Nombres de paises ──
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
  480:"Mauricio",484:"México",496:"Mongolia",504:"Marruecos",508:"Mozambique",516:"Namibia",
  524:"Nepal",528:"Países Bajos",540:"Nueva Caledonia",554:"Nueva Zelanda",558:"Nicaragua",
  562:"Níger",566:"Nigeria",578:"Noruega",586:"Pakistán",591:"Panamá",598:"Papúa N. Guinea",
  600:"Paraguay",604:"Perú",608:"Filipinas",616:"Polonia",620:"Portugal",630:"Puerto Rico",
  634:"Catar",642:"Rumanía",643:"Rusia",646:"Ruanda",682:"Arabia Saudita",686:"Senegal",
  694:"Sierra Leona",702:"Singapur",703:"Eslovaquia",704:"Vietnam",705:"Eslovenia",706:"Somalia",
  710:"Sudáfrica",716:"Zimbabue",724:"España",728:"Sudán del Sur",729:"Sudán",740:"Surinam",
  748:"Suazilandia",752:"Suecia",756:"Suiza",760:"Siria",762:"Tayikistán",764:"Tailandia",
  768:"Togo",780:"Trinidad y Tobago",788:"Túnez",792:"Turquía",795:"Turkmenistán",800:"Uganda",
  804:"Ucrania",784:"Emiratos Árabes",826:"Reino Unido",834:"Tanzania",840:"Estados Unidos",
  854:"Burkina Faso",858:"Uruguay",860:"Uzbekistán",862:"Venezuela",882:"Samoa",887:"Yemen",
  894:"Zambia"
};

const IDIOMAS = {
  es: { nombre: "Español", color: "#F59E0B", bg: "#F59E0B15", border: "#F59E0B50", regiones: "América Latina · España", hablantes: "500M+", paises: SPANISH_IDS.size },
  en: { nombre: "English", color: "#3B82F6", bg: "#3B82F615", border: "#3B82F650", regiones: "Norteamérica · UK · Asia · Oceanía", hablantes: "1.5B+", paises: ENGLISH_IDS.size },
  fr: { nombre: "Français", color: "#EF4444", bg: "#EF444415", border: "#EF444450", regiones: "Francia · África · Canadá", hablantes: "320M+", paises: FRENCH_IDS.size },
};

const LIMA = [-77.0428, -12.0464];

const TARGETS = [
  { coords: [-3.7038, 40.4168], lang: "es", label: "Madrid" },
  { coords: [-77.0369, 38.9072], lang: "en", label: "Washington" },
  { coords: [2.3522, 48.8566], lang: "fr", label: "París" },
  { coords: [151.2093, -33.8688], lang: "en", label: "Sídney" },
  { coords: [36.8219, -1.2921], lang: "en", label: "Nairobi" },
  { coords: [-17.4677, 14.7167], lang: "fr", label: "Dakar" },
  { coords: [-99.1332, 19.4326], lang: "es", label: "CDMX" },
  { coords: [-58.3816, -34.6037], lang: "es", label: "Buenos Aires" },
];

const WORLD_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function MapaIdiomas() {
  const containerRef = useRef(null);
  const [activo, setActivo] = useState(null);
  const [worldData, setWorldData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hover, setHover] = useState(null); // { id, name, langs, x, y }
  const [dims, setDims] = useState({ w: 960, h: 480 });

  // Cargar mapa
  useEffect(() => {
    fetch(WORLD_URL)
      .then((r) => r.json())
      .then((topo) => {
        setWorldData(feature(topo, topo.objects.countries));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Responsive
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.offsetWidth;
      // Aspect ratio mas panoramico en desktop, mas cuadrado en mobile
      const ratio = w > 640 ? 0.46 : 0.6;
      setDims({ w, h: Math.max(260, Math.round(w * ratio)) });
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

  const pathGen = useMemo(() => {
    if (!projection) return null;
    return d3.geoPath().projection(projection);
  }, [projection]);

  const getColor = useCallback((id) => {
    const langs = getLangs(id);
    if (!activo) return langs.length > 0 ? "#1a3555" : "#111e33";
    return langs.includes(activo) ? IDIOMAS[activo].color : "#080e1a";
  }, [activo]);

  const getOpacity = useCallback((id) => {
    const langs = getLangs(id);
    if (!activo) return langs.length > 0 ? 0.65 : 0.3;
    return langs.includes(activo) ? 0.8 : 0.08;
  }, [activo]);

  const getStroke = useCallback((id, isHovered) => {
    const langs = getLangs(id);
    if (isHovered) return "#8aa4c0";
    if (activo && langs.includes(activo)) return IDIOMAS[activo].color + "50";
    return "#0c1628";
  }, [activo]);

  const handleCountryEnter = useCallback((e, f) => {
    const id = +(f.id || f.properties?.id);
    const name = COUNTRY_NAMES[id] || `País ${id}`;
    const langs = getLangs(id);
    const svg = e.currentTarget.closest("svg");
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
    setHover({ id, name, langs, x: svgP.x, y: svgP.y });
  }, []);

  const handleCountryMove = useCallback((e) => {
    const svg = e.currentTarget.closest("svg");
    if (!svg) return;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
    setHover((prev) => prev ? { ...prev, x: svgP.x, y: svgP.y } : null);
  }, []);

  const limaPos = projection ? projection(LIMA) : null;

  const langBadge = (lang) => {
    const i = IDIOMAS[lang];
    return `<span style="display:inline-block;padding:2px 7px;border-radius:4px;font-size:10px;font-weight:600;background:${i.color}22;color:${i.color};border:1px solid ${i.color}40;margin-right:3px;">${i.nombre}</span>`;
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        maxWidth: "1100px",
        margin: "0 auto",
        fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif",
      }}
    >
      {/* ── Botones de idioma ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "8px",
          marginBottom: "24px",
          flexWrap: "wrap",
        }}
      >
        {Object.entries(IDIOMAS).map(([k, v]) => {
          const isActive = activo === k;
          return (
            <button
              key={k}
              onClick={() => setActivo(isActive ? null : k)}
              style={{
                padding: isActive ? "12px 24px" : "10px 20px",
                borderRadius: "14px",
                cursor: "pointer",
                border: `2px solid ${isActive ? v.color : "#182840"}`,
                background: isActive ? v.bg : "rgba(8,14,26,0.7)",
                color: isActive ? "#f1f5f9" : "#6a7f9a",
                fontWeight: 600,
                fontSize: "13px",
                transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                transform: isActive ? "scale(1.06)" : "scale(1)",
                boxShadow: isActive ? `0 0 28px ${v.color}25, 0 4px 16px rgba(0,0,0,0.3)` : "0 2px 8px rgba(0,0,0,0.2)",
                backdropFilter: "blur(12px)",
                minWidth: isActive ? "150px" : "auto",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }}>
                <span
                  style={{
                    width: 10, height: 10, borderRadius: "50%",
                    background: v.color, display: "inline-block",
                    boxShadow: isActive ? `0 0 10px ${v.color}` : "none",
                    transition: "box-shadow 0.3s",
                  }}
                />
                {v.nombre}
              </span>
              {isActive && (
                <div style={{ marginTop: "5px", fontSize: "10px", opacity: 0.65, lineHeight: 1.3 }}>
                  {v.paises} países · {v.hablantes} hablantes
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Mapa ── */}
      <div
        style={{
          borderRadius: "20px",
          overflow: "hidden",
          background: "linear-gradient(175deg, #050a14 0%, #0a1220 40%, #070d18 100%)",
          border: "1px solid #12223a",
          boxShadow: "0 30px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.02) inset",
          position: "relative",
        }}
      >
        {/* Glow ambiental */}
        <div
          style={{
            position: "absolute",
            top: "35%",
            left: activo === "fr" ? "50%" : activo === "as" ? "70%" : "30%",
            width: "400px", height: "400px",
            borderRadius: "50%", filter: "blur(130px)",
            transform: "translate(-50%,-50%)",
            background: activo ? IDIOMAS[activo].color + "0d" : "transparent",
            transition: "all 1.2s ease", pointerEvents: "none",
          }}
        />

        {loading ? (
          <div style={{
            height: "420px", display: "flex", alignItems: "center", justifyContent: "center",
            color: "#3a5070", fontSize: "14px",
          }}>
            <div style={{ textAlign: "center" }}>
              <svg width="36" height="36" viewBox="0 0 36 36" style={{ margin: "0 auto 14px", display: "block" }}>
                <circle cx="18" cy="18" r="15" fill="none" stroke="#162440" strokeWidth="3" />
                <circle cx="18" cy="18" r="15" fill="none" stroke="#3B82F6" strokeWidth="3"
                  strokeDasharray="25 70" strokeLinecap="round">
                  <animateTransform attributeName="transform" type="rotate"
                    from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite" />
                </circle>
              </svg>
              Cargando mapa mundial...
            </div>
          </div>
        ) : (
          <svg
            viewBox={`0 0 ${dims.w} ${dims.h}`}
            style={{ width: "100%", height: "auto", display: "block", position: "relative" }}
          >
            {/* Graticule */}
            {pathGen && (
              <path
                d={pathGen(d3.geoGraticule().step([20, 20])())}
                fill="none" stroke="#0c1a2e" strokeWidth="0.25"
              />
            )}

            {/* Esfera */}
            {pathGen && (
              <path d={pathGen({ type: "Sphere" })} fill="none" stroke="#14243d" strokeWidth="0.5" />
            )}

            {/* Paises */}
            {worldData && pathGen && worldData.features.map((f) => {
              const id = +(f.id || f.properties?.id);
              const isHovered = hover?.id === id;
              const langs = getLangs(id);
              return (
                <path
                  key={id}
                  d={pathGen(f)}
                  fill={isHovered ? (activo && langs.includes(activo) ? IDIOMAS[activo].color : "#2a4a70") : getColor(id)}
                  stroke={getStroke(id, isHovered)}
                  strokeWidth={isHovered ? 1.2 : (activo && langs.includes(activo)) ? 0.6 : 0.25}
                  opacity={isHovered ? 1 : getOpacity(id)}
                  onMouseEnter={(e) => handleCountryEnter(e, f)}
                  onMouseMove={handleCountryMove}
                  onMouseLeave={() => setHover(null)}
                  style={{
                    transition: "fill 0.3s, opacity 0.3s, stroke 0.2s, stroke-width 0.2s",
                    cursor: "pointer",
                  }}
                />
              );
            })}

            {/* Conexiones desde Lima */}
            {limaPos && projection && TARGETS.map((t, i) => {
              const show = !activo || t.lang === activo;
              const tPos = projection(t.coords);
              if (!tPos) return null;
              const interp = d3.geoInterpolate(LIMA, t.coords);
              const pts = Array.from({ length: 40 }, (_, j) => j / 39)
                .map((v) => projection(interp(v)))
                .filter(Boolean);
              if (pts.length < 2) return null;
              const line = d3.line().curve(d3.curveBasis);

              return (
                <g key={i} style={{ transition: "opacity 0.6s" }} opacity={show ? 1 : 0.03}>
                  {/* Sombra de la linea */}
                  <path d={line(pts)} fill="none" stroke={IDIOMAS[t.lang].color}
                    strokeWidth="3" opacity="0.04" filter="blur(3px)" />
                  {/* Linea principal */}
                  <path d={line(pts)} fill="none" stroke={IDIOMAS[t.lang].color}
                    strokeWidth={show ? 1.2 : 0.15} opacity={show ? 0.35 : 0.02}
                    strokeDasharray="6 4" style={{ transition: "all 0.6s ease" }}>
                    {show && <animate attributeName="stroke-dashoffset" from="20" to="0" dur="3s" repeatCount="indefinite" />}
                  </path>
                  {/* Punto destino */}
                  {show && (
                    <g>
                      <circle cx={tPos[0]} cy={tPos[1]} r="5" fill={IDIOMAS[t.lang].color} opacity="0.08">
                        <animate attributeName="r" values="5;9;5" dur="3s" repeatCount="indefinite" />
                      </circle>
                      <circle cx={tPos[0]} cy={tPos[1]} r="2.5" fill={IDIOMAS[t.lang].color} opacity="0.5" />
                    </g>
                  )}
                </g>
              );
            })}

            {/* ── Beacon Lima ── */}
            {limaPos && (
              <g>
                <circle cx={limaPos[0]} cy={limaPos[1]} r="14" fill="#F59E0B" opacity="0.04">
                  <animate attributeName="r" values="14;26;14" dur="3s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.04;0.01;0.04" dur="3s" repeatCount="indefinite" />
                </circle>
                <circle cx={limaPos[0]} cy={limaPos[1]} r="6" fill="#F59E0B" opacity="0.12" />
                <circle cx={limaPos[0]} cy={limaPos[1]} r="4" fill="#F59E0B" opacity="0.6" />
                <circle cx={limaPos[0]} cy={limaPos[1]} r="1.8" fill="#fff" />

                {/* Etiqueta */}
                <g transform={`translate(${limaPos[0] + 12}, ${limaPos[1] - 6})`}>
                  <rect x="-3" y="-11" width="100" height="20" rx="5"
                    fill="#0a1220" fillOpacity="0.92" stroke="#F59E0B" strokeWidth="0.6" strokeOpacity="0.35" />
                  <text x="47" y="3" textAnchor="middle" fill="#F59E0B"
                    fontSize="9.5" fontWeight="700" letterSpacing="0.4"
                    style={{ fontFamily: "'Sora', system-ui, sans-serif" }}>
                    ESIT · Lima, Perú
                  </text>
                </g>
              </g>
            )}

            {/* ── Tooltip ── */}
            {hover && (
              <g
                transform={`translate(${Math.min(hover.x + 14, dims.w - 160)}, ${Math.max(hover.y - 50, 10)})`}
                style={{ pointerEvents: "none" }}
              >
                <rect x="0" y="0" width="150" height={hover.langs.length > 0 ? 56 : 36} rx="8"
                  fill="#0c1628" fillOpacity="0.95" stroke="#1e3350" strokeWidth="0.8" />
                {/* Nombre del pais */}
                <text x="12" y="18" fill="#e2e8f0" fontSize="11.5" fontWeight="700"
                  style={{ fontFamily: "'Sora', system-ui" }}>
                  {hover.name}
                </text>
                {/* Idiomas */}
                {hover.langs.length > 0 ? (
                  <g transform="translate(12, 28)">
                    {hover.langs.map((lang, j) => {
                      const offsetX = j * 52;
                      return (
                        <g key={lang} transform={`translate(${offsetX}, 0)`}>
                          <rect x="0" y="0" width="48" height="18" rx="4"
                            fill={IDIOMAS[lang].color + "20"} stroke={IDIOMAS[lang].color + "50"} strokeWidth="0.6" />
                          <circle cx="10" cy="9" r="3" fill={IDIOMAS[lang].color} />
                          <text x="17" y="12" fill={IDIOMAS[lang].color} fontSize="8.5" fontWeight="600">
                            {lang === "es" ? "ES" : lang === "en" ? "EN" : "FR"}
                          </text>
                        </g>
                      );
                    })}
                  </g>
                ) : (
                  <text x="12" y="30" fill="#4a5e78" fontSize="9" fontStyle="italic">
                    Sin idioma destacado
                  </text>
                )}
              </g>
            )}
          </svg>
        )}

        {/* ── Barra inferior ── */}
        <div style={{
          padding: "12px 24px",
          background: "linear-gradient(180deg, rgba(6,10,20,0.95) 0%, rgba(8,12,22,1) 100%)",
          borderTop: "1px solid #111d30",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: "8px",
        }}>
          <div style={{ display: "flex", gap: "16px" }}>
            {Object.entries(IDIOMAS).map(([k, v]) => (
              <span key={k} style={{
                display: "flex", alignItems: "center", gap: "6px",
                fontSize: "11px",
                color: activo === k ? v.color : "#4a5e78",
                fontWeight: activo === k ? 700 : 400,
                transition: "all 0.3s",
              }}>
                <span style={{
                  width: 7, height: 7, borderRadius: "50%",
                  background: v.color, display: "inline-block",
                  boxShadow: activo === k ? `0 0 6px ${v.color}` : "none",
                }} />
                {v.nombre}
              </span>
            ))}
          </div>
          <span style={{ color: "#3a4f68", fontSize: "10.5px", fontStyle: "italic" }}>
            {activo
              ? `${IDIOMAS[activo].paises} países · ${IDIOMAS[activo].regiones} · ${IDIOMAS[activo].hablantes}`
              : hover
                ? `${hover.name}${hover.langs.length > 0 ? " — " + hover.langs.map(l => IDIOMAS[l].nombre).join(", ") : ""}`
                : "Haz clic en un idioma o explora el mapa"}
          </span>
        </div>
      </div>
    </div>
  );
}