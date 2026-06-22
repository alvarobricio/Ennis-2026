// BASE DE DATOS REAL DEL VIAJE (JULIO 2026)
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
      { de: 1345, a: 1715, tarea: "📖 Clases de Inglés", info: "Bloque lectivo por la tarde en las aulas de la academia en Ennis." },
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
  
  // 1. CONTROL LOGICO PARA EL HOME (MÓDULO GENERAL)
  if (localTime < inicioViaje) {
    const diasFaltantes = Math.ceil((inicioViaje - localTime) / (1000 * 60 * 60 * 24));
    
    if (document.getElementById("realtime-badge")) {
      document.getElementById("realtime-badge").textContent = "⏳ PRE-VIAJE";
      document.getElementById("realtime-badge").style.background = "#f59e0b";
      document.getElementById("realtime-activity").textContent = "Fase de Preparativos";
      document.getElementById("realtime-desc").textContent = `Faltan ${diasFaltantes} días para el inicio del programa Abbla Ennis. Asegúrate de tener toda tu documentación lista.`;
      document.getElementById("next-activity-box").innerHTML = "<b>Próximo hito:</b> Presentación en el aeropuerto de Madrid Barajas T4S.";
    }
  } else {
    // Lógica activa durante el viaje
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
          
          if (i + 1 < agenda.bloques.length) {
            const proxima = agenda.bloques[i+1];
            const fDe = String(Math.floor(proxima.de / 100)).padStart(2, '0') + ":" + String(proxima.de % 100).padStart(2, '0');
            document.getElementById("next-activity-box").innerHTML = `<b>Próxima (${fDe}):</b> ${proxima.tarea}`;
          } else {
            document.getElementById("next-activity-box").innerHTML = "<b>Próxima:</b> Fin de la jornada de hoy";
          }
          encontrado = true;
          break;
        }
      }

      if (!encontrado) {
        document.getElementById("realtime-activity").textContent = "Tiempo Libre / Descanso";
        document.getElementById("realtime-desc").textContent = "Convivencia con la Host Family o tiempo de descanso.";
        document.getElementById("realtime-badge").textContent = "💤 LIBRE";
        document.getElementById("realtime-badge").style.background = "#38bdf8";
        document.getElementById("next-activity-box").innerHTML = "";
      }
    }
  }

  // 2. CORRECCIÓN CRÍTICA DE LA PESTAÑA: HORARIO DE HOY
  if (container) {
    let agendaHoy = DIARIO_PDF_DATA[claveHoy];

    if (!agendaHoy) {
      // SI NO ESTAMOS EN DÍA DE VIAJE, NO SE MUESTRA NINGUNA TABLA FALSAMENTE
      if (titleEl) titleEl.textContent = "Itinerario de Control";
      container.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
          <span style="font-size: 48px; display: block; margin-bottom: 15px;">🗓️</span>
          <p style="font-size: 16px; font-weight: bold; color: #fff; margin-bottom: 5px;">No hay actividades programadas para hoy</p>
          <p style="font-size: 13px; max-width: 400px; margin: 0 auto;">El calendario detallado paso a paso se activará de forma automática el <b>Lunes 6 de Julio de 2026</b> al comenzar el viaje.</p>
        </div>
      `;
    } else {
      // Si es un día del viaje (ej: 6 de julio), se pinta su respectiva tabla real
      if (titleEl) titleEl.textContent = agendaHoy.titulo;
      let html = `<table class="schedule-table"><thead><tr><th>Horario</th><th>Actividad</th><th>Detalles</th></tr></thead><tbody>`;
      const horaNumerica = ennisTime.getHours() * 100 + ennisTime.getMinutes();
      
      agendaHoy.bloques.forEach(b => {
        const activo = (horaNumerica >= b.de && horaNumerica < b.a);
        const filaClase = activo ? 'class="active-row"' : '';
        
        const fDe = String(Math.floor(b.de / 100)).padStart(2, '0') + ":" + String(b.de % 100).padStart(2, '0');
        const fA = String(Math.floor(b.a / 100)).padStart(2, '0') + ":" + String(b.a % 100).padStart(2, '0');

        html += `<tr ${filaClase}><td><b>${fDe} - ${fA}</b></td><td>${b.tarea}</td><td>${b.info}</td></tr>`;
      });
      html += "</tbody></table>";
      container.innerHTML = html;
    }
  }
}
