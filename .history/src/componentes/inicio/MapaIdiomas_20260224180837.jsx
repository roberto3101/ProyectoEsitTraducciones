import { useState, useEffect, useRef, useCallback } from "react";
import * as d3 from "d3";
import { feature } from "topojson-client";

/*
  Mapa Mundial Interactivo — ESIT Traducciones
  Usa D3 + TopoJSON para renderizar paises reales
  Carga ~30KB de datos del mapa (world-110m)
*/

// Paises por idioma (codigos numericos ISO 3166-1)
const SPANISH = new Set([
  32,68,152,170,188,192,214,218,222,226,320,340,484,
  558,591,600,604,724,858,862,// AR,BO,CL,CO,CR,CU,DO,EC,SV,GQ,GT,HN,MX,NI,PA,PY,PE,ES,UY,VE
]);
const ENGLISH = new Set([
  36,44,52,56,72,84,124,288,328,356,372,388,404,430,454,
  516,554,566,694,710,716,780,800,826,834,840,894,
  // AU,BS,BB,BZ,BW,CA,GH,GY,IN,IE,JM,KE,LR,MW,NA,NZ,NG,SL,ZA,ZW,TT,UG,UK,TZ,US,ZM
]);
const FRENCH = new Set([
  108,120,140,148,174,178,180,204,250,266,324,332,384,
  442,450,466,478,508,562,646,686,694,768,854,
  // BI,CM,CF,TD,KM,CG,CD,BJ,FR,GA,GN,HT,CI,LU,MG,ML,MR,MZ,NE,RW,SN,SL,TG,BF
]);

function getLangs(id) {
  const langs = [];
  if (SPANISH.has(id)) langs.push("es");
  if (ENGLISH.has(id)) langs.push("en");
  if (FRENCH.has(id)) langs.push("fr");
  return langs;
}

const IDIOMAS = {
  es: { nombre: "Español", color: "#F59E0B", colorLight: "#FDE68A", regiones: "América Latina · España", hablantes: "500M+" },
  en: { nombre: "English", color: "#3B82F6", colorLight: "#93C5FD", regiones: "Norteamérica · UK · Asia · Oceanía", hablantes: "1.5B+" },
  fr: { nombre: "Français", color: "#EF4444", colorLight: "#FCA5A5", regiones: "Francia · África · Canadá", hablantes: "320M+" },
};

// Lima, Peru coordinates
const LIMA = [-77.0428, -12.0464];

// Target cities for connection lines
const TARGETS = [
  { coords: [-3.7038, 40.4168], lang: "es", label: "Madrid" },     // Spain
  { coords: [-77.0369, 38.9072], lang: "en", label: "Washington" }, // USA
  { coords: [2.3522, 48.8566], lang: "fr", label: "Paris" },       // France
  { coords: [151.2093, -33.8688], lang: "en", label: "Sydney" },   // Australia
  { coords: [36.8219, -1.2921], lang: "en", label: "Nairobi" },    // Kenya
  { coords: [-17.4677, 14.7167], lang: "fr", label: "Dakar" },     // Senegal
];

const WORLD_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function MapaIdiomas() {
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);
  const [activo, setActivo] = useState(null);
  const [worldData, setWorldData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoverCountry, setHoverCountry] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 900, height: 460 });

  // Cargar datos del mapa
  useEffect(() => {
    fetch(WORLD_URL)
      .then((r) => r.json())
      .then((topo) => {
        const countries = feature(topo, topo.objects.countries);
        setWorldData(countries);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Responsive
  useEffect(() => {
    const container = svgRef.current?.parentElement;
    if (!container) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0].contentRect.width;
      setDimensions({ width: w, height: Math.max(280, w * 0.5) });
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  const getCountryColor = useCallback(
    (id) => {
      const langs = getLangs(+id);
      if (!activo) {
        if (langs.length > 0) return "#1e3a5f";
        return "#152238";
      }
      if (langs.includes(activo)) return IDIOMAS[activo].color;
      return "#0c1525";
    },
    [activo]
  );

  const getCountryOpacity = useCallback(
    (id) => {
      const langs = getLangs(+id);
      if (!activo) return langs.length > 0 ? 0.7 : 0.35;
      return langs.includes(activo) ? 0.85 : 0.12;
    },
    [activo]
  );

  const { width, height } = dimensions;

  // D3 projection
  const projection = d3
    .geoNaturalEarth1()
    .fitSize([width - 40, height - 40], worldData || { type: "Sphere" })
    .translate([width / 2, height / 2]);

  const pathGen = d3.geoPath().projection(projection);

  const limaPos = projection(LIMA);

  return (
    <div style={{ width: "100%", maxWidth: "1000px", margin: "0 auto", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Botones idioma */}
      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
        {Object.entries(IDIOMAS).map(([k, v]) => (
          <button
            key={k}
            onClick={() => setActivo(activo === k ? null : k)}
            style={{
              padding: "10px 22px",
              borderRadius: "12px",
              cursor: "pointer",
              border: `2px solid ${activo === k ? v.color : "#1e2d45"}`,
              background: activo === k ? v.color + "18" : "rgba(12,20,36,0.8)",
              color: activo === k ? "#f1f5f9" : "#7a8fa8",
              fontWeight: 600,
              fontSize: "13px",
              transition: "all 0.3s ease",
              transform: activo === k ? "scale(1.06)" : "scale(1)",
              boxShadow: activo === k ? `0 0 24px ${v.color}30` : "none",
              backdropFilter: "blur(8px)",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: "50%",
                  background: v.color,
                  display: "inline-block",
                  boxShadow: activo === k ? `0 0 8px ${v.color}` : "none",
                }}
              />
              {v.nombre}
            </span>
            {activo === k && (
              <div style={{ fontSize: "10px", opacity: 0.6, marginTop: "3px" }}>
                {v.regiones} · {v.hablantes}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Contenedor del mapa */}
      <div
        style={{
          borderRadius: "16px",
          overflow: "hidden",
          background: "linear-gradient(170deg, #060b16 0%, #0a1220 50%, #060b16 100%)",
          border: "1px solid #14243d",
          boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
          position: "relative",
        }}
      >
        {/* Glow */}
        {activo && (
          <div
            style={{
              position: "absolute",
              top: "40%",
              left: activo === "fr" ? "45%" : activo === "en" ? "30%" : "25%",
              width: "350px",
              height: "350px",
              borderRadius: "50%",
              filter: "blur(120px)",
              transform: "translate(-50%,-50%)",
              background: IDIOMAS[activo].color + "10",
              transition: "all 1s ease",
              pointerEvents: "none",
            }}
          />
        )}

        <div ref={tooltipRef} style={{ position: "relative" }}>
          {loading ? (
            <div
              style={{
                height: "400px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#4a5e78",
                fontSize: "14px",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    border: "3px solid #1e2d45",
                    borderTopColor: "#3B82F6",
                    borderRadius: "50%",
                    margin: "0 auto 12px",
                    animation: "spin 1s linear infinite",
                  }}
                />
                Cargando mapa...
              </div>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : (
            <svg
              ref={svgRef}
              viewBox={`0 0 ${width} ${height}`}
              style={{ width: "100%", height: "auto", display: "block" }}
            >
              {/* Graticule (lineas de latitud/longitud sutiles) */}
              <path
                d={pathGen(d3.geoGraticule10())}
                fill="none"
                stroke="#0f1d30"
                strokeWidth="0.3"
              />

              {/* Contorno del mundo */}
              <path
                d={pathGen({ type: "Sphere" })}
                fill="none"
                stroke="#162440"
                strokeWidth="0.5"
              />

              {/* Paises */}
              {worldData &&
                worldData.features.map((f) => {
                  const id = f.id || f.properties?.id;
                  const isHovered = hoverCountry === id;
                  const langs = getLangs(+id);
                  return (
                    <path
                      key={id}
                      d={pathGen(f)}
                      fill={isHovered && !activo ? "#2a4a6f" : getCountryColor(id)}
                      stroke={
                        activo && langs.includes(activo)
                          ? IDIOMAS[activo].color + "40"
                          : isHovered
                            ? "#4a6a8f"
                            : "#0e1a2e"
                      }
                      strokeWidth={isHovered || (activo && langs.includes(activo)) ? 0.8 : 0.3}
                      opacity={getCountryOpacity(id)}
                      onMouseEnter={() => setHoverCountry(id)}
                      onMouseLeave={() => setHoverCountry(null)}
                      style={{
                        transition: "fill 0.4s ease, opacity 0.4s ease, stroke 0.3s ease",
                        cursor: langs.length > 0 ? "pointer" : "default",
                      }}
                    />
                  );
                })}

              {/* Lineas de conexion desde Lima */}
              {limaPos &&
                TARGETS.map((t, i) => {
                  const show = !activo || t.lang === activo;
                  const targetPos = projection(t.coords);
                  if (!targetPos) return null;

                  // Gran circulo como curva
                  const interp = d3.geoInterpolate(LIMA, t.coords);
                  const points = Array.from({ length: 30 }, (_, j) => j / 29)
                    .map((t2) => projection(interp(t2)))
                    .filter(Boolean);

                  if (points.length < 2) return null;
                  const lineGen = d3.line().curve(d3.curveBasis);

                  return (
                    <g key={i}>
                      <path
                        d={lineGen(points)}
                        fill="none"
                        stroke={IDIOMAS[t.lang].color}
                        strokeWidth={show ? 1.2 : 0.2}
                        opacity={show ? 0.3 : 0.02}
                        strokeDasharray="6 4"
                        style={{ transition: "all 0.6s ease" }}
                      >
                        {show && (
                          <animate
                            attributeName="stroke-dashoffset"
                            from="20"
                            to="0"
                            dur="3s"
                            repeatCount="indefinite"
                          />
                        )}
                      </path>
                      {/* Punto destino */}
                      {show && (
                        <circle
                          cx={targetPos[0]}
                          cy={targetPos[1]}
                          r="3"
                          fill={IDIOMAS[t.lang].color}
                          opacity="0.5"
                          style={{ transition: "opacity 0.5s" }}
                        />
                      )}
                    </g>
                  );
                })}

              {/* Beacon de Lima */}
              {limaPos && (
                <g>
                  <circle cx={limaPos[0]} cy={limaPos[1]} r="12" fill="#F59E0B" opacity="0.05">
                    <animate attributeName="r" values="12;22;12" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.05;0.01;0.05" dur="3s" repeatCount="indefinite" />
                  </circle>
                  <circle cx={limaPos[0]} cy={limaPos[1]} r="5" fill="#F59E0B" opacity="0.15" />
                  <circle cx={limaPos[0]} cy={limaPos[1]} r="3.5" fill="#F59E0B" opacity="0.7" />
                  <circle cx={limaPos[0]} cy={limaPos[1]} r="1.5" fill="#fff" />

                  {/* Etiqueta */}
                  <g transform={`translate(${limaPos[0] + 10}, ${limaPos[1] - 4})`}>
                    <rect x="-2" y="-10" width="88" height="18" rx="4" fill="#0a1220" fillOpacity="0.9" stroke="#F59E0B" strokeWidth="0.5" strokeOpacity="0.4" />
                    <text x="42" y="2" textAnchor="middle" fill="#F59E0B" fontSize="9" fontWeight="700" letterSpacing="0.3">
                      ESIT · Lima, Perú
                    </text>
                  </g>
                </g>
              )}
            </svg>
          )}
        </div>

        {/* Barra inferior */}
        <div
          style={{
            padding: "10px 20px",
            background: "rgba(6,10,20,0.95)",
            borderTop: "1px solid #111d30",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "8px",
            fontSize: "11px",
          }}
        >
          <div style={{ display: "flex", gap: "16px", color: "#4a5e78" }}>
            {Object.entries(IDIOMAS).map(([k, v]) => (
              <span key={k} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: v.color,
                    display: "inline-block",
                  }}
                />
                {v.nombre}
              </span>
            ))}
          </div>
          <span style={{ color: "#354360", fontSize: "10px" }}>
            {activo
              ? `${IDIOMAS[activo].regiones} · ${IDIOMAS[activo].hablantes} hablantes`
              : "Haz clic en un idioma para ver su cobertura global"}
          </span>
        </div>
      </div>
    </div>
  );
}