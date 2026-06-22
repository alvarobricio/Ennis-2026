// Base de datos del PDF de Abbla (Ennis 2026)
const DIARIO_PDF_DATA = {
  "2026-07-06": {
    titulo: "Lunes 6 de Julio - ¡Día de Viaje y Salida!",
    bloques: [
      { de: 0, a: 800, tarea: "🎒 Preparativos finales", info: "Revisar que llevas DNI/Pasaporte, la TSE y la autorización policial." },
      { de: 800, a: 1040, tarea: "🛫 Punto de encuentro en Barajas", desc: "Cita a las 08:00 AM en mostradores de Aer Lingus. Facturación del grupo." },
      { de: 1040, a: 1220, tarea: "✈️ Vuelo EI 593 en ruta", info: "Vuelo directo Madrid Barajas -> Aeropuerto de Dublín." },
      { de: 1220, a: 1625, tarea: "🚌 Autobús hacia Ennis", info: "Traslado por carretera directo desde la terminal hasta el destino." },
      { de: 1625, a: 2359, tarea: "🏡 Recibimiento de las Host Families", info: "Llegada al punto de encuentro y presentación con tus anfitriones irlandeses." }
    ]
  },
  "2026-07-07": {
    titulo: "Martes 7 de Julio - Primer día en la Academia",
    bloques: [
      { de: 0, a: 900, tarea: "🍳 Desayuno familiar", info: "Primer desayuno en el hogar y traslado a las clases." },
      { de: 900, a: 1245, tarea: "📋 Orientación e Introducción", info: "Presentación de monitores, normas de convivencia y prueba de nivel." },
      { de: 1245, a: 1345, tarea: "🥪 Almuerzo Pack-Lunch", info: "Comida con el grupo en las zonas habilitadas." },
      { de: 1345, a: 1715, tarea: "📖 Clases de Inglés", info: "Primer bloque formal de lecciones en la academia." },
      { de: 1715, a: 2359, tarea: "🏠 Tarde libre y Cena", info: "Regreso a casa para cenar con los anfitriones." }
    ]
  },
  "2026-07-13": {
    titulo: "Lunes 13 de Julio - Clases de Mañana (Semana 2)",
    bloques: [
      { de: 0, a: 915, tarea: "🚌 Rumbo a la Escuela", info: "Desayuno completado y trayecto puntual hacia el centro educativo." },
      { de: 915, a: 1245, tarea: "📖 Clases de Inglés (Avanzado)", info: "Formación académica por niveles. Recuerda que no se permite español." },
      { de: 1245, a: 1345, tarea: "🥪 Pausa Almuerzo Pack-Lunch", info: "Descanso para comer la bolsa de pícnic preparada por tu host family." },
      { de: 1345, a: 1715, tarea: "👨‍🏫 Actividades dirigidas", info: "Dinámicas grupales en inglés coordinadas por los profesores." },
      { de: 1715, a: 2359, tarea: "🏠 Convivencia Familiar", info: "Regreso ordenado, cena y descanso nocturno." }
    ]
  }
};

// Función que analiza qué día es hoy y actualiza el HTML
function updateDynamicSchedule(ennisTime) {
  const a = ennisTime.getFullYear();
  const m = String(ennisTime.getMonth() + 1).padStart(2, '0');
  const d = String(ennisTime.getDate()).padStart(2, '0');
  const claveHoy = `${a}-${m}-${d}`; // Formato: "2026-07-06"

  const container = document.getElementById("daily-schedule-container");
  const titleEl = document.getElementById("schedule-day-title");
  const badgeEl = document.getElementById("current-date-badge");

  badgeEl.textContent = `${d}/${m}/${a}`;
  const horaNumerica = ennisTime.getHours() * 100 + ennisTime.getMinutes();

  // Sistema anti-aburrimiento: Si ejecutas la web hoy en Junio (fuera de fecha),
  // forzamos que muestre el Lunes 6 de Julio para simular su comportamiento.
  let agenda = DIARIO_PDF_DATA[claveHoy];
  if (!agenda) {
    agenda = DIARIO_PDF_DATA["2026-07-06"];
    titleEl.textContent = `${agenda.titulo} (Demostración Pre-Viaje)`;
  } else {
    titleEl.textContent = agenda.titulo;
  }

  let html = `
    <table class="schedule-table">
      <thead>
        <tr>
          <th>Horario (Local)</th>
          <th>Actividad</th>
          <th>Instrucciones Especiales</th>
        </tr>
      </thead>
      <tbody>
  `;

  let encontrado = false;

  agenda.bloques.forEach(b => {
    const activo = (horaNumerica >= b.de && horaNumerica < b.a);
    const filaClase = activo ? 'class="active-row"' : '';
    
    const fDe = String(Math.floor(b.de / 100)).padStart(2, '0') + ":" + String(b.de % 100).padStart(2, '0');
    const fA = String(Math.floor(b.a / 100)).padStart(2, '0') + ":" + String(b.a % 100).padStart(2, '0');

    html += `
      <tr ${filaClase}>
        <td><b>${fDe} - ${fA}</b></td>
        <td>${b.tarea}</td>
        <td>${b.info || b.desc}</td>
      </tr>
    `;

    if (activo) {
      document.getElementById("realtime-activity").textContent = b.tarea;
      document.getElementById("realtime-desc").textContent = b.info || b.desc;
      document.getElementById("realtime-badge").textContent = "En Curso";
      document.getElementById("realtime-badge").style.background = "#00ffaa";
      encontrado = true;
    }
  });

  html += "</tbody></table>";
  container.innerHTML = html;

  if (!encontrado) {
    document.getElementById("realtime-activity").textContent = "Tiempo de descanso";
    document.getElementById("realtime-desc").textContent = "No hay actividades programadas en este bloque horario.";
    document.getElementById("realtime-badge").textContent = "Libre";
    document.getElementById("realtime-badge").style.background = "#38bdf8";
  }
}
