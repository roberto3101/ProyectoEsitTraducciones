import { useState, useMemo } from "react";

/*
  Mapa de puntos del mundo para ESIT Traducciones
  Estilo dot-matrix corporativo (Stripe, IBM, etc.)
  Cada "1" = punto de tierra, "0" = agua
  72 cols x 36 rows
*/

const MAPA = [
  "000000000000000000000000000000000111110000000000000000000000000000000000000",
  "000000000001111111100000000000011111111100000000011111111111111111100000000",
  "000000000011111111111000000000011111111110000001111111111111111111110000000",
  "000000001111111111111100000000111111111111000011111111111111111111111100000",
  "000000011111111111111110000001111111111111001111111111111111111111111110000",
  "000000111111111111111110000011111111111111011111111111111111111111111111000",
  "000001111111111111111111000011111111111111111111111111111111111111111111100",
  "000011111111111111111111000011111111111111111111111111111111111111111111110",
  "000011111111111111111111100011111111111111111111111111111111111111111111110",
  "000011111111111111111111000001111111111111111111111111111111111111111111100",
  "000001111111111111111110000001111111111111111111111111111111111111111111000",
  "000001111111111111111100000000111111111110111111111111111111111111111110000",
  "000000111111111111111000000000011111111100011111111111111111111111111000000",
  "000000011111111111110000000000001111111100001111111111111111111111100000000",
  "000000001111111111100000000000001111111000000111111111111111111111000000000",
  "000000000111111111100000000000000111110000000011111111111001111110000000000",
  "000000000011111110000000000000000011100000000001111111110000111100000000000",
  "000000000001111100000000000000000011000000000000111111100000011000000000000",
  "000000000001111000000000000000000001000000000000011111000000000000000000000",
  "000000000000111000000000000000000000000000000000011110000000000000000000000",
  "000000000001111000000000000000000000000000000000001100000000000000000000000",
  "000000000001111100000000000000000000000000000000001000000000000000000000000",
  "000000000001111110000000000000000000000000000000000000000000000000000000000",
  "000000000001111111000000000000000000000000000000000000000000000000000000000",
  "000000000000111111100000000000000000000001100000000000000000000000000000000",
  "000000000000011111110000000000000000000011110000000000000000000000000000000",
  "000000000000001111111000000000000000000111111000000000000000000000000000000",
  "000000000000000111111100000000000000001111111100000000000000000000000000000",
  "000000000000000011111100000000000000001111111110000000000011100000000000000",
  "000000000000000001111000000000000000000111111110000000000111110000000000000",
  "000000000000000000110000000000000000000011111100000000001111111000000000000",
  "000000000000000000010000000000000000000001111000000000001111111100000000000",
  "000000000000000000000000000000000000000000110000000000000111111100000000000",
  "000000000000000000000000000000000000000000000000000000000011111000000000000",
  "000000000000000000000000000000000000000000000000000000000001110000000000000",
  "000000000000000000000000000000000000000000000000000000000000100000000000000",
];

// Determinar region de cada punto segun posicion normalizada
function getRegion(col, row) {
  const x = col / 72;
  const y = row / 36;
  if (x > 0.72 && y > 0.72) return "oc";
  if (x > 0.55 && y < 0.55) return "as";
  if (x > 0.45 && x < 0.56 && y < 0.35) return "as";
  if (x > 0.32 && x < 0.56 && y < 0.28) return "eu";
  if (x > 0.32 && x < 0.56 && y >= 0.28) return "af";
  if (x > 0.12 && x < 0.28 && y > 0.45) return "sa";
  if (x > 0.1 && x < 0.22 && y > 0.35 && y <= 0.45) return "ca";
  if (x < 0.32 && y <= 0.45) return "na";
  return "na";
}

const regionIdiomas = {
  na: ["en", "es", "fr"],
  ca: ["es"],
  sa: ["es", "fr"],
  eu: ["en", "fr", "es"],
  af: ["fr", "en"],
  as: ["en"],
  oc: ["en", "fr"],
};

const regionNames = {
  na: "Norteamérica",
  ca: "Centroamérica",
  sa: "Sudamérica",
  eu: "Europa",
  af: "África",
  as: "Asia",
  oc: "Oceanía",
};

const idiomas = {
  es: { nombre: "Español", color: "#F59E0B", regiones: "América · España", hablantes: "500M+" },
  en: { nombre: "English", color: "#3B82F6", regiones: "Norteamérica · UK · Asia · Oceanía", hablantes: "1.5B+" },
  fr: { nombre: "Français", color: "#EF4444", regiones: "Francia · África · Canadá", hablantes: "320M+" },
};

function parseMapa() {
  const dots = [];
  for (let r = 0; r < MAPA.length; r++) {
    for (let c = 0; c < MAPA[r].length; c++) {
      if (MAPA[r][c] === "1") {
        dots.push({ x: c, y: r, region: getRegion(c, r) });
      }
    }
  }
  return dots;
}

const LIMA = { x: 16, y: 22 };

export default function MapaIdiomas() {
  const [activo, setActivo] = useState(null);
  const [hoverRegion, setHoverRegion] = useState(null);
  const dots = useMemo(() => parseMapa(), []);

  const DOT_SIZE = 5.5;
  const GAP = 7.2;
  const W = 73 * GAP;
  const H = 36 * GAP;
  const PAD = 16;

  const getDotColor = (dot) => {
    const rLangs = regionIdiomas[dot.region] || [];
    if (activo) {
      if (rLangs.includes(activo)) return idiomas[activo].color;
      return "#0d1525";
    }
    if (hoverRegion && dot.region === hoverRegion) {
      return idiomas[rLangs[0]].color;
    }
    return "#2a3a55";
  };

  const getDotOpacity = (dot) => {
    const rLangs = regionIdiomas[dot.region] || [];
    if (activo) return rLangs.includes(activo) ? 0.85 : 0.08;
    if (hoverRegion === dot.region) return 0.9;
    return 0.45;
  };

  const regionCenters = useMemo(() => {
    const centers = {};
    const counts = {};
    dots.forEach((d) => {
      if (!centers[d.region]) { centers[d.region] = { x: 0, y: 0 }; counts[d.region] = 0; }
      centers[d.region].x += d.x;
      centers[d.region].y += d.y;
      counts[d.region]++;
    });
    Object.keys(centers).forEach((k) => {
      centers[k].x = (centers[k].x / counts[k]) * GAP + PAD;
      centers[k].y = (centers[k].y / counts[k]) * GAP + PAD;
    });
    return centers;
  }, [dots]);

  const limaX = LIMA.x * GAP + PAD;
  const limaY = LIMA.y * GAP + PAD;

  const connections = [
    { to: "eu", idioma: "es" },
    { to: "na", idioma: "en" },
    { to: "af", idioma: "fr" },
    { to: "oc", idioma: "en" },
    { to: "as", idioma: "en" },
    { to: "eu", idioma: "fr" },
  ];

  return (
    <div style={{ width: "100%", maxWidth: "1000px", margin: "0 auto", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Botones de idioma */}
      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
        {Object.entries(idiomas).map(([k, v]) => (
          <button
            key={k}
            onClick={() => setActivo(activo === k ? null : k)}
            style={{
              padding: "10px 20px",
              borderRadius: "12px",
              cursor: "pointer",
              border: `2px solid ${activo === k ? v.color : "#253040"}`,
              background: activo === k ? v.color + "14" : "#0f1926",
              color: activo === k ? "#f1f5f9" : "#6b82a0",
              fontWeight: 600,
              fontSize: "13px",
              boxShadow: activo === k ? `0 0 20px ${v.color}22` : "none",
              transition: "all 0.3s ease",
              transform: activo === k ? "scale(1.05)" : "scale(1)",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: v.color, display: "inline-block",
                  boxShadow: activo === k ? `0 0 6px ${v.color}` : "none",
                }}
              />
              {v.nombre}
            </span>
            {activo === k && (
              <div style={{ fontSize: "10px", opacity: 0.6, marginTop: "2px" }}>
                {v.hablantes} hablantes
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
          background: "linear-gradient(170deg, #080d1a 0%, #0c1424 50%, #080d1a 100%)",
          border: "1px solid #16253a",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          position: "relative",
        }}
      >
        {/* Resplandor ambiental */}
        <div
          style={{
            position: "absolute", top: "50%", left: "22%",
            width: "300px", height: "300px",
            borderRadius: "50%", filter: "blur(100px)",
            transform: "translate(-50%,-50%)",
            background: activo ? idiomas[activo].color + "0c" : "#3b82f606",
            transition: "all 1s ease", pointerEvents: "none",
          }}
        />

        <svg
          viewBox={`0 0 ${W + PAD * 2} ${H + PAD * 2 + 8}`}
          style={{ width: "100%", height: "auto", display: "block", position: "relative" }}
        >
          {/* Arcos de conexion */}
          {connections.map((conn, i) => {
            const show = !activo || conn.idioma === activo;
            const target = regionCenters[conn.to];
            if (!target) return null;
            const mx = (limaX + target.x) / 2;
            const my = Math.min(limaY, target.y) - 35 - i * 8;
            return (
              <path
                key={i}
                d={`M${limaX},${limaY} Q${mx},${my} ${target.x},${target.y}`}
                fill="none"
                stroke={idiomas[conn.idioma].color}
                strokeWidth={show ? 1 : 0.2}
                opacity={show ? 0.25 : 0.02}
                strokeDasharray="4 3"
                style={{ transition: "all 0.6s ease" }}
              >
                {show && (
                  <animate
                    attributeName="stroke-dashoffset"
                    from="14" to="0" dur="2.5s"
                    repeatCount="indefinite"
                  />
                )}
              </path>
            );
          })}

          {/* Puntos del mapa */}
          {dots.map((dot, i) => (
            <circle
              key={i}
              cx={dot.x * GAP + PAD}
              cy={dot.y * GAP + PAD}
              r={DOT_SIZE / 2}
              fill={getDotColor(dot)}
              opacity={getDotOpacity(dot)}
              onMouseEnter={() => setHoverRegion(dot.region)}
              onMouseLeave={() => setHoverRegion(null)}
              style={{
                transition: "fill 0.4s ease, opacity 0.4s ease",
                cursor: "pointer",
              }}
            />
          ))}

          {/* Etiqueta de region en hover */}
          {hoverRegion && regionCenters[hoverRegion] && !activo && (
            <g>
              <rect
                x={regionCenters[hoverRegion].x - 36}
                y={regionCenters[hoverRegion].y - 14}
                width="72" height="20" rx="6"
                fill="#0c1424" fillOpacity="0.9"
                stroke="#253040" strokeWidth="0.5"
              />
              <text
                x={regionCenters[hoverRegion].x}
                y={regionCenters[hoverRegion].y}
                textAnchor="middle" fill="#cbd5e1"
                fontSize="8" fontWeight="600"
                style={{ pointerEvents: "none" }}
              >
                {regionNames[hoverRegion]}
              </text>
            </g>
          )}

          {/* Beacon de Lima - ESIT */}
          <circle cx={limaX} cy={limaY} r="10" fill="#F59E0B" opacity="0.06">
            <animate attributeName="r" values="10;18;10" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.06;0.02;0.06" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx={limaX} cy={limaY} r="4.5" fill="#F59E0B" opacity="0.2" />
          <circle cx={limaX} cy={limaY} r="3" fill="#F59E0B" opacity="0.8" />
          <circle cx={limaX} cy={limaY} r="1.2" fill="#fff" />

          {/* Etiqueta Lima */}
          <g>
            <rect
              x={limaX + 6} y={limaY - 9}
              width="72" height="16" rx="4"
              fill="#0c1424" fillOpacity="0.85"
              stroke="#F59E0B" strokeWidth="0.4" strokeOpacity="0.4"
            />
            <text
              x={limaX + 42} y={limaY + 1}
              textAnchor="middle" fill="#F59E0B"
              fontSize="7" fontWeight="700" letterSpacing="0.3"
              style={{ pointerEvents: "none" }}
            >
              ESIT · Lima, Perú
            </text>
          </g>
        </svg>

        {/* Barra inferior */}
        <div
          style={{
            padding: "10px 20px",
            background: "rgba(8,12,24,0.9)",
            borderTop: "1px solid #131f32",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "8px",
            fontSize: "11px",
          }}
        >
          <div style={{ display: "flex", gap: "14px", color: "#4a5e78" }}>
            {Object.entries(idiomas).map(([k, v]) => (
              <span key={k} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <span
                  style={{
                    width: 5, height: 5, borderRadius: "50%",
                    background: v.color, display: "inline-block",
                  }}
                />
                {v.nombre}
              </span>
            ))}
          </div>
          <span style={{ color: "#354360", fontSize: "10px" }}>
            {activo
              ? `${idiomas[activo].regiones} · ${idiomas[activo].hablantes} hablantes`
              : hoverRegion
                ? `${regionNames[hoverRegion]} — ${(regionIdiomas[hoverRegion] || []).map((l) => idiomas[l].nombre).join(", ")}`
                : "Selecciona un idioma o pasa el cursor sobre una región"}
          </span>
        </div>
      </div>
    </div>
  );
}