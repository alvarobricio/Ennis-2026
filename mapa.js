window.ennisMap = null;

const INTERES_ENNIS = [
  {
    id: "atlas",
    nombre: "Atlas Language School (Clare Area)",
    lat: 52.84232, lon: -8.98612,
    desc: "🏫 Academia donde se efectúan las clases matutinas de inglés.",
    apertura: 900, cierre: 1700, dias: [1, 2, 3, 4, 5] // Lun a Vie
  },
  {
    id: "tesco",
    nombre: "Tesco Superstore",
    lat: 52.84365, lon: -8.99021,
    desc: "🛒 Superficie comercial principal para provisiones, snacks y aseo.",
    apertura: 700, cierre: 2200, dias: [0, 1, 2, 3, 4, 5, 6] // Todos los días
  },
  {
    id: "centro",
    nombre: "O'Connell Square (El Centro)",
    lat: 52.84342, lon: -8.98144,
    desc: "📍 Punto peatonal del centro y eje de reunión recurrente.",
    apertura: 0, cierre: 2400, dias: [0, 1, 2, 3, 4, 5, 6]
  },
  {
    id: "temple",
    nombre: "Temple Gate Car Park (Quedadas)",
    lat: 52.84515, lon: -8.98110,
    desc: "🚌 Zona fijada para salidas y llegadas de los autobuses de excursiones de Abbla.",
    apertura: 0, cierre: 2400, dias: [0, 1, 2, 3, 4, 5, 6]
  },
  {
    id: "museo",
    nombre: "Clare Museum",
    lat: 52.84414, lon: -8.98132,
    desc: "🏛️ Espacio de exposiciones e historia local del condado.",
    apertura: 930, cierre: 1730, dias: [2, 3, 4, 5, 6] // Mar a Sáb
  },
  {
    id: "biblioteca",
    nombre: "De Valera Library",
    lat: 52.84288, lon: -8.98391,
    desc: "📚 Biblioteca municipal de Ennis. Zona apta para estudio y Wi-Fi.",
    apertura: 1000, cierre: 1730, dias: [1, 2, 3, 4, 5, 6]
  }
];

// Comprueba dinámicamente el estado usando la hora de Irlanda
function obtenerEstadoLugar(item, ennisTime) {
  const diaSemana = ennisTime.getDay(); // 0 = Domingo, 1 = Lunes...
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
  
  // Vista centrada justo en el núcleo urbano de Ennis
  window.ennisMap = L.map('map').setView([52.8438, -8.9835], 15);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(window.ennisMap);

  renderMarcadores();
}

function renderMarcadores() {
  const localTime = new Date();
  // El huso de Irlanda está sincronizado por el reloj oficial restando el desfase
  const ennisTime = new Date(localTime.getTime() - 3600000); 

  INTERES_ENNIS.forEach(p => {
    const estadoHtml = obtenerEstadoLugar(p, ennisTime);
    
    const fmtApertura = String(Math.floor(p.apertura / 100)).padStart(2, '0') + ":" + String(p.apertura % 100).padStart(2, '0');
    const fmtCierre = String(Math.floor(p.cierre / 100)).padStart(2, '0') + ":" + String(p.cierre % 100).padStart(2, '0');
    const horarioTexto = p.apertura === 0 && p.cierre === 2400 ? "24h" : `${fmtApertura} a ${fmtCierre}`;

    const popupHtml = `
      <div style="color: #1e293b; font-family: sans-serif; width: 220px; line-height: 1.4;">
        <h4 style="margin:0 0 4px; color:#0f172a; border-bottom:2px solid #00ffaa; padding-bottom:3px; font-size:13px;">${p.nombre}</h4>
        <p style="font-size:12px; margin:5px 0; color:#475569;">${p.desc}</p>
        <div style="background:#f1f5f9; padding:6px; border-radius:4px; font-size:11px; margin-top:5px;">
          <b>Estado:</b> ${estadoHtml}<br>
          <b>Horario:</b> ${horarioTexto}
        </div>
      </div>
    `;

    L.marker([p.lat, p.lon]).addTo(window.ennisMap).bindPopup(popupHtml);
  });
}
