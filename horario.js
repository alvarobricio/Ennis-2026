// BASE DE DATOS REAL DEL PDF (ENNIS - JULIO 2026)
const DIARIO_PDF_DATA = {
  "2026-07-06": {
    titulo: "Lunes 6 de Julio - ¡Día de Vuelo y Llegada!",
    bloques: [
      { de: 0, a: 1100, tarea: "🎒 Últimos preparativos", info: "Revisar documentación obligatoria: DNI/Pasaporte vigente, Tarjeta Sanitaria Europea (TSE) y autorización de menores de la Policía." },
      { de: 1100, a: 1400, tarea: "🛫 Encuentro en Madrid Barajas T4S", info: "Cita para la facturación y control del grupo en los mostradores de Aer Lingus en la T4S." },
      { de: 1400, a: 1545, tarea: "✈️ Vuelo Aer Lingus en ruta (MAD -> DUB)", info: "Salida del vuelo directo de Aer Lingus desde la T4S de Madrid con destino a la Terminal 2 (T2) de Dublín." },
      { de: 1545, a: 1725, tarea: "🛂 Llegada a Dublín T2", info: "Aterrizaje en Dublín T2, control de inmigración/pasaportes y recogida de maletas del grupo." },
      { de: 1725, a: 2030, tarea: "🚌 Traslado hacia Ennis", info: "Autobús privado desde Dublín T2 directo hacia el punto de encuentro en Ennis." },
      { de: 2030, a: 2359, tarea: "🏡 Recibimiento Host Families", info: "Llegada a Ennis, reparto con los monitores de Abbla y traslado a las casas de los anfitriones." }
    ]
  },
  "2026-07-07": {
    titulo: "Martes 7 de Julio - Orientación y Clases",
    bloques: [
      { de: 0, a: 900, tarea: "🍳 Desayuno en Casa", info: "Primer desayuno con tu Host Family y traslado puntual hacia las aulas." },
      { de: 900, a: 1245, tarea: "📋 Test de Nivel y Orientación", info: "Presentación, test para asignación de grupo académico y recorrido por las instalaciones." },
      { de: 1245, a: 1345, tarea: "🥪 Almuerzo Pack-Lunch", info: "Comida con el grupo usando el almuerzo frío para llevar preparado por tu familia." },
      { de: 1345, a: 1715, tarea: "📖 Clases de Inglés", info: "Bloque lectivo por la tarde en las aulas de Atlas Language School en Ennis." },
      { de: 1715, a: 2359, tarea: "🏠 Cena y Convivencia", info: "Regreso a casa para cenar con tu Host Family y practicar el idioma." }
    ]
  },
  "2026-07-27": {
    titulo: "Lunes 27 de Julio - ¡Vuelo de Regreso!",
    bloques: [
      { de: 0, a: 1130, tarea: "🧳 Despedida y Equipaje", info: "Últimas compras, cierre de maletas y despedida de las familias irlandesas." },
      { de: 1130, a: 1430, tarea: "🚌 Autobús al Aeropuerto", info: "Traslado por carretera desde Ennis de vuelta hacia el Aeropuerto de Dublín." },
      { de: 1430, a: 1730, tarea: "🛂 Facturación en Dublín T2", info: "Llegada a la Terminal 2 de Dublín para facturar el equipaje de grupo en los mostradores de Aer Lingus." },
      { de: 1730, a: 2110, tarea: "✈️ Vuelo de Vuelta (DUB -> MAD T4S)", info: "Embarque y vuelo de Aer Lingus de regreso a Madrid, aterrizando en la Terminal T4S." }
    ]
  }
};

function updateDynamicSchedule(ennisTime) {
  const localTime = new Date();
  const inicioViaje = new Date("2026-07-06T00:00:00+01:00");
  
  const a = ennisTime.getFullYear();
  const m = String(ennisTime.getMonth() + 1).padStart(2, '0');
  const d = String(ennisTime.getDate()).padStart(2, '0');
  const claveHoy = `${a}-${m}-${d}`;

  const container = document.getElementById("daily-schedule-container");
  const titleEl = document.getElementById("schedule-day-title");
  const badgeEl = document.getElementById("current-date-badge");

  if (badgeEl) badgeEl.textContent = `${d}/${m}/${a}`;
  
  // CONTROL DE ESTADO EN EL HOME (PRE-VIAJE VS VIAJE ACTIVO)
  if (localTime < inicioViaje) {
    // Si estamos antes del 6 de Julio
    const diasFaltantes = Math.ceil((inicioViaje - localTime) / (1000 * 60 * 60 * 24));
    
    if (document.getElementById("realtime-badge")) {
      document.getElementById("realtime-badge").textContent = "⏳ PRE-VIAJE";
      document.getElementById("realtime-badge").style.background = "#f59e0b"; // Naranja de espera
      document.getElementById("realtime-activity").textContent = "Preparando maletas y documentos";
      document.getElementById("realtime-desc").textContent = `El programa Abbla Ennis comienza en ${diasFaltantes} días. Revisa tener tu DNI/Pasaporte en regla y la autorización policial firmada.`;
    }
  } else {
    // Si ya estamos dentro de las fechas del viaje
    const horaNumerica = ennisTime.getHours() * 100 + ennisTime.getMinutes();
    let agenda = DIARIO_PDF_DATA[claveHoy];
    
    if (agenda) {
      if (titleEl) titleEl.textContent = agenda.titulo;
      let encontrado = false;

      for (let i = 0; i < agenda.bloques.length; i++) {
        const b = agenda.bloques[i];
        if (horaNumerica >= b.de && horaNumerica < b.a) {
          document.getElementById("realtime-activity").textContent = b.tarea;
          document.getElementById("realtime-desc").textContent = b.info;
          document.getElementById("realtime-badge").textContent = "⚡ EN CURSO";
          document.getElementById("realtime-badge").style.background = "#00ffaa";
          
          // Buscar próxima actividad si existe
          if (i + 1 < agenda.bloques.length) {
            const proxima = agenda.bloques[i+1];
            const fDe = String(Math.floor(proxima.de / 100)).padStart(2, '0') + ":" + String(proxima.de % 100).padStart(2, '0');
            document.getElementById("next-activity-box").innerHTML = `<b>Próxima (${fDe}):</b> ${proxima.tarea}`;
          } else {
            document.getElementById("next-activity-box").innerHTML = "<b>Próxima:</b> Fin del itinerario de hoy";
          }
          encontrado = true;
          break;
        }
      }

      if (!encontrado) {
        document.getElementById("realtime-activity").textContent = "Tiempo Libre / Descanso";
        document.getElementById("realtime-desc").textContent = "Descanso o convivencia en el hogar de la Host Family.";
        document.getElementById("realtime-badge").textContent = "💤 LIBRE";
        document.getElementById("realtime-badge").style.background = "#38bdf8";
        document.getElementById("next-activity-box").innerHTML = "";
      }
    }
  }

  // Renderizar la tabla si estamos en la pestaña del horario de hoy
  let agendaTabla = DIARIO_PDF_DATA[claveHoy] || DIARIO_PDF_DATA["2026-07-06"];
  if (container && agendaTabla) {
    let html = `<table class="schedule-table"><thead><tr><th>Horario</th><th>Actividad</th><th>Detalles</th></tr></thead><tbody>`;
    const horaNumerica = ennisTime.getHours() * 100 + ennisTime.getMinutes();
    
    agendaTabla.bloques.forEach(b => {
      const esHoyMismo = (claveHoy === "2026-07-06" || claveHoy === "2026-07-07" || claveHoy === "2026-07-27");
      const activo = esHoyMismo && (horaNumerica >= b.de && horaNumerica < b.a);
      const filaClase = activo ? 'class="active-row"' : '';
      
      const fDe = String(Math.floor(b.de / 100)).padStart(2, '0') + ":" + String(b.de % 100).padStart(2, '0');
      const fA = String(Math.floor(b.a / 100)).padStart(2, '0') + ":" + String(b.a % 100).padStart(2, '0');

      html += `<tr ${filaClase}><td><b>${fDe} - ${fA}</b></td><td>${b.tarea}</td><td>${b.info}</td></tr>`;
    });
    html += "</tbody></table>";
    container.innerHTML = html;
  }
}
