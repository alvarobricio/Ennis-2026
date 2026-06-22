// CONFIGURACIÓN DE CONTEXTO - ABBLA ENNIS 2026
const MADRID_AIRPORT_CITA = new Date("2026-07-06T08:00:00+02:00").getTime();
let ennisTimeCorrection = -3600000; // Desfase por defecto en verano (Madrid es GMT+2, Irlanda es GMT+1 -> 1 hora menos)

function switchTab(tabId, btn) {
  document.querySelectorAll('.section-view').forEach(view => view.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
  btn.classList.add('active');
  document.getElementById('nav-title').textContent = btn.textContent.trim().substring(2);
}

// SINCRONIZACIÓN DINÁMICA CON LA API DE HORA OFICIAL
async function syncEnnisClock() {
  try {
    const response = await fetch("https://worldtimeapi.org/api/timezone/Europe/Dublin");
    if (response.ok) {
      const data = await response.json();
      const serverTime = new Date(data.datetime).getTime();
      const clientTime = new Date().getTime();
      ennisTimeCorrection = serverTime - clientTime; 
      console.log("Reloj oficial sincronizado correctamente.");
    }
  } catch (e) {
    console.warn("Error de conexión con WorldTimeAPI. Empleando desfase estático de verano (-1h).");
    ennisTimeCorrection = -3600000; 
  }
}

// CLIMA REAL MEDIANTE OPEN-METEO
async function syncEnnisWeather() {
  try {
    const lat = "52.8436";
    const lon = "-8.9805";
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
    if (response.ok) {
      const data = await response.json();
      document.getElementById('weather-temp').textContent = `${Math.round(data.current_weather.temperature)}°C`;
      document.getElementById('weather-wind').textContent = `Viento: ${Math.round(data.current_weather.windspeed)} km/h`;
      document.getElementById('weather-status').textContent = parseWeatherCode(data.current_weather.weathercode);
    }
  } catch (error) {
    document.getElementById('weather-status').textContent = "Servicio fuera de línea";
  }
}

function parseWeatherCode(code) {
  if (code === 0) return "☀️ Despejado";
  if (code >= 1 && code <= 3) return "⛅ Intervalos Nubosos";
  if (code >= 51 && code <= 65) return "🌧️ Llovizna Irlandesa";
  if (code >= 80 && code <= 82) return "🌦️ Chubascos Variables";
  return "🌦️ Variable";
}

// MOTOR DINÁMICO DEL HORARIO Y MONITOREO EN TIEMPO REAL
function runDashboardLoop() {
  const localTime = new Date();
  document.getElementById('clock-madrid').textContent = localTime.toLocaleTimeString('es-ES');

  // Ajuste perfecto: Hora de Irlanda computada según desfase real de verano (GMT+1)
  const ennisTime = new Date(localTime.getTime() + ennisTimeCorrection);
  document.getElementById('clock-ennis').textContent = ennisTime.toLocaleTimeString('es-ES', { timeZone: 'Europe/Dublin' });

  // CUENTA ATRÁS
  const remainingTime = MADRID_AIRPORT_CITA - localTime.getTime();
  if (remainingTime > 0) {
    document.getElementById('days').textContent = Math.floor(remainingTime / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
    document.getElementById('hours').textContent = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
    document.getElementById('minutes').textContent = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
    document.getElementById('seconds').textContent = Math.floor((remainingTime % (1000 * 60)) / 1000).toString().padStart(2, '0');
    document.getElementById('countdown-status').textContent = "Todo listo para el despegue.";
  } else {
    document.getElementById('countdown').innerHTML = "<p style='font-size:16px; color:var(--accent); font-weight:bold;'>🇮🇪 ¡AVENTURA EN ENNIS EN CURSO! 🇮🇪</p>";
    document.getElementById('countdown-status').textContent = "";
  }

  // CÁLCULO PRECISO DE ACTIVIDADES
  const hour = ennisTime.getHours();
  const min = ennisTime.getMinutes();
  const numericTime = hour * 100 + min;
  const day = ennisTime.getDay(); // 0: Dom, 2: Mar...

  let badge = document.getElementById('activity-badge');
  let name = document.getElementById('activity-name');
  let desc = document.getElementById('activity-desc');
  let nextAct = document.getElementById('next-activity');

  document.querySelectorAll('.schedule-table tr').forEach(r => r.classList.remove('active-row'));

  if (day === 0 || day === 6) {
    badge.className = "status-pill free";
    badge.textContent = "Fin de Semana";
    name.textContent = "Excursiones de día completo o Convivencia";
    desc.textContent = "Días de exploración grupal planificados por abbla (Cliffs of Moher, Galway, etc.) o inmersión con tus anfitriones.";
    nextAct.textContent = "Lunes a las 07:45 - Desayuno en Familia";
  } else {
    // Cronograma exacto de Lunes a Viernes
    if (numericTime >= 745 && numericTime < 845) {
      setActiveState("home", "Desayuno", "Desayuno en Familia", "Interactúa en la mesa y repasa las frases del día.", "row-0745", "08:45 - Traslado a la Academia");
    } 
    else if (numericTime >= 845 && numericTime < 900) {
      setActiveState("free", "Traslado", "Camino a las Clases", "Desplazamiento puntual hacia las instalaciones lectivas.", "row-0845", "09:00 - Comienzo de Clases de Inglés");
    } 
    else if (numericTime >= 900 && numericTime < 1245) {
      setActiveState("accent", "Academia", "Clases de Inglés Activas", "Desarrollo de competencias lingüísticas. ¡Evita hablar español!", "row-0900", "12:45 - Almuerzo (Pack-Lunch)");
    } 
    else if (numericTime >= 1245 && numericTime < 1400) {
      setActiveState("free", "Almuerzo", "Tiempo de Pack-Lunch", "Comida ligera preparada por tu Host Family y convivencia grupal.", "row-1245", "14:00 - Bloque de Actividades de Tarde");
    } 
    else if (numericTime >= 1400 && numericTime < 1745) {
      const isTuesday = (day === 2);
      setActiveState(
        "accent", 
        "Actividades", 
        isTuesday ? "📌 Tuesday Tour Extendido" : "Programa de Deportes y Cultura", 
        isTuesday ? "Excursión especial extendida de los martes." : "Ocio guiado por monitores en el entorno de Ennis.", 
        "row-1400", 
        "17:45 - Traslado de regreso a las viviendas"
      );
    } 
    else if (numericTime >= 1745 && numericTime < 1830) {
      setActiveState("free", "En Ruta", "Regreso a Casa", "Desplazamiento ordenado hacia las viviendas asignadas.", "row-1745", "18:30 - Cena con la Host Family");
    } 
    else if (numericTime >= 1830 && numericTime < 2000) {
      setActiveState("home", "Cena", "Cena Familiar Irlandesa", "Inmersión cultural activa. Prohibido el uso de dispositivos en la mesa.", "row-1830", "20:00 - Tiempo Libre Personal");
    } 
    else if (numericTime >= 2000 && numericTime < 2215) {
      setActiveState("home", "Tiempo Libre", "Organización y Descanso Corto", "Ducha obligatoria, preparar la mochila y contacto controlado con España.", "row-2000", "22:15 - Descanso Obligatorio Nocturno");
    } 
    else {
      setActiveState("sleep", "Dormir", "Silencio y Descanso Nocturno", "Luz apagada. Respeta las normas estrictas de convivencia de abbla.", "row-sleep", "Mañana a las 07:45 - Desayuno en Familia");
    }
  }

  function setActiveState(type, badgeText, title, description, rowId, nextText) {
    badge.className = `status-pill ${type}`;
    badge.textContent = ` ${badgeText} `;
    name.textContent = title;
    desc.textContent = description;
    nextAct.textContent = nextText;
    document.getElementById(rowId)?.classList.add('active-row');
  }
}

// INICIALIZACIÓN
async function main() {
  await syncEnnisClock();
  await syncEnnisWeather();
  setInterval(runDashboardLoop, 1000);
  setInterval(syncEnnisWeather, 900000);
  runDashboardLoop();
}

window.onload = main;
