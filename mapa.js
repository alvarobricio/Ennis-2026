window.ennisMap = null;

// Base de datos oficial con los Plus Codes decodificados y tus coordenadas reales de Ennis
const INTERES_ENNIS = [
  {
    id: "centro",
    nombre: "O'Connell Square (El Centro)",
    lat: 52.84351, lon: -8.98144, // R2V8+QX
    desc: "📍 <b>Corazón de Ennis:</b> El punto central de reunión peatonal junto al monumento. ¡Eje clave para quedar!",
    apertura: 0, cierre: 2400, dias: [0, 1, 2, 3, 4, 5, 6] // Abierto 24h
  },
  {
    id: "temple",
    nombre: "Temple Gate Car Park (Autobuses)",
    lat: 52.84375, lon: -8.98053, // 52°50'37.5"N 8°58'49.9"W
    desc: "🚌 <b>Punto de Excursiones:</b> El aparcamiento asignado por Abbla para la salida y llegada de los autobuses de los sábados.",
    apertura: 0, cierre: 2400, dias: [0, 1, 2, 3, 4, 5, 6]
  },
  {
    id: "glor",
    nombre: "glór Cultural Centre",
    lat: 52.84534, lon: -8.97925, // R2VF+V5
    desc: "🎭 <b>Centro Cultural:</b> El teatro y espacio de arte de Ennis. Sitio perfecto para resguardarse si llueve, con cafetería y baños limpios.",
    apertura: 1000, cierre: 1700, dias: [1, 2, 3, 4, 5, 6] // Lun a Sáb
  },
  {
    id: "tesco",
    nombre: "Tesco (Ennis Shopping Centre)",
    lat: 52.84578, lon: -8.97910, // R2WF+88
    desc: "🛒 <b>Hipermercado Principal:</b> El sitio ideal para abastecerte de packs de agua, snacks y chocolates para las excursiones.",
    apertura: 700, cierre: 2200, dias: [0, 1, 2, 3, 4, 5, 6]
  },
  {
    id: "dunnes",
    nombre: "Dunnes Stores",
    lat: 52.84382, lon: -8.98215, // R2V9+5M
    desc: "🛍️ <b>Grandes Almacenes:</b> Supermercado muy clásico irlandés. Perfecto si necesitas comprar un paraguas barato o ropa de abrigo de emergencia.",
    apertura: 800, cierre: 2100, dias: [0, 1, 2, 3, 4, 5, 6]
  },
  {
    id: "spar",
    nombre: "Spar Lifford",
    lat: 52.84812, lon: -8.98341, // R2Q8+H5
    desc: "🥪 <b>Tienda de Conveniencia:</b> Cuenta con sección de Deli caliente donde preparan los famosos 'Chicken Fillet Rolls' (bocatas de pollo) tirados de precio.",
    apertura: 700, cierre: 2300, dias: [0, 1, 2, 3, 4, 5, 6]
  },
  {
    id: "biblioteca",
    nombre: "De Valera Library (Biblioteca)",
    lat: 52.84510, lon: -8.97985, // R2VF+R2
    desc: "📚 <b>Biblioteca de Ennis:</b> Entorno silencioso ideal para estudiar, repasar apuntes y conectarte a su red Wi-Fi gratuita de alta velocidad.",
    apertura: 1000, cierre: 1730, dias: [1, 2, 3, 4, 5, 6] // Lun a Sáb (Martes/Jueves cierra a las 20:00)
  },
  {
    id: "museo",
    nombre: "Clare Museum",
    lat: 52.84411, lon: -8.98125, // R2V9+J8
    desc: "🏛️ <b>Museo Histórico:</b> Situado junto al Temple Gate, repasa de forma interactiva la cultura tradicional y arqueología de la región de Clare.",
    apertura: 930, cierre: 1730, dias: [2, 3, 4, 5, 6] // Martes a Sábado
  }
];

// Algoritmo que calcula el estado de apertura usando el reloj en tiempo real
function obtenerEstadoLugar(item, ennisTime) {
  const diaSemana = ennisTime.getDay(); // 0 = Domingo, 1 = Lunes, etc.
  const horaActualNum = ennisTime.getHours() * 100 + ennisTime.getMinutes();

  if (!item.dias.includes(diaSemana)) {
    return `<span style="color:#ef4444; font-weight:bold;">🔴 CERRADO HOY</span>`;
  }
  if (horaActualNum >= item.apertura && horaActualNum < item.cierre) {
    return `<span style="color:#10b981; font-weight:bold;">🟢 ABIERTO AHORA</span>`;
  }
  return `<span style="color:#ef4444; font-weight:bold;">🔴 CERRADO AHORA</span>`;
}

function initEnnisMap() {
  if (window.ennisMap) return;
  
  // Centramos la cámara del mapa exactamente en el centro de los puntos que nos has dado
  window.ennisMap = L.map('map').setView([52.8446, -8.9808], 15);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(window.ennisMap);

  renderMarcadores();
}

function renderMarcadores() {
  const localTime = new Date();
  // Aplicamos el desfase horario respecto a España para calcular la apertura real en Irlanda
  const ennisTime = new Date(localTime.getTime() - 3600000); 

  INTERES_ENNIS.forEach(p => {
    const estadoHtml = obtenerEstadoLugar(p, ennisTime);
    
    const fmtApertura = String(Math.floor(p.apertura / 100)).padStart(2, '0') + ":" + String(p.apertura % 100).padStart(2, '0');
    const fmtCierre = String(Math.floor(p.cierre / 100)).padStart(2, '0') + ":" + String(p.cierre % 100).padStart(2, '0');
    const horarioTexto = p.apertura === 0 && p.cierre === 2400 ? "Abierto 24h" : `${fmtApertura} a ${fmtCierre}`;

    const popupHtml = `
      <div style="color: #1e293b; font-family: Arial, sans-serif; width: 230px; line-height: 1.4;">
        <h4 style="margin:0 0 5px; color:#0f172a; border-bottom:2px solid #00ffaa; padding-bottom:4px; font-size:13px; font-weight:bold;">${p.nombre}</h4>
        <p style="font-size:12px; margin:6px 0; color:#475569;">${p.desc}</p>
        <div style="background:#f1f5f9; padding:6px 8px; border-radius:5px; font-size:11px; margin-top:6px; border-left:3px solid #64748b;">
          <b>Estado actual:</b> ${estadoHtml}<br>
          <b>Horario:</b> ${horarioTexto}
        </div>
      </div>
    `;

    L.marker([p.lat, p.lon]).addTo(window.ennisMap).bindPopup(popupHtml);
  });
}
