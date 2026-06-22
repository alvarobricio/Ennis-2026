// CONFIGURACIÓN TEMPORAL DE ABBLA ENNIS 2026
const MADRID_AIRPORT_CITA = new Date("2026-07-06T08:00:00+02:00").getTime();
let ennisTimeCorrection = 0; 

// NAVEGACIÓN ENTRE SECCIONES
function switchTab(tabId, btn) {
  document.querySelectorAll('.section-view').forEach(view => view.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  
  document.getElementById(tabId).classList.add('active');
  btn.classList.add('active');
  
  document.getElementById('nav-title').textContent = btn.textContent.trim().substring(2);
}

// SINCRONIZACIÓN CON HORA REAL DE IRLANDA MEDIANTE WORLD TIME API
async function syncEnnisClock() {
  try {
    const response = await fetch("https://worldtimeapi.org/api/timezone/Europe/Dublin");
    if (response.ok) {
      const data = await response.json();
      const serverTime = new Date(data.datetime).getTime();
      const clientTime = new Date().getTime();
      ennisTimeCorrection = serverTime - clientTime;
      console.log("Reloj de Irlanda sincronizado dinámicamente mediante API.");
    }
  } catch (e) {
    console.warn("API de hora inaccesible. Usando cálculo local estático (-1 hora).");
    ennisTimeCorrection = -3600000;
  }
}

// CONSULTA DE CLIMA REAL MEDIANTE COORDENADAS PARA ENNIS (OPEN-METEO)
async function syncEnnisWeather() {
  try {
    const lat = "52.8436";
    const lon = "-8.9805";
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
    if (response.ok) {
      const data = await response.json();
      const temperature = Math.round(data.current_weather.temperature);
      const windspeed = Math.round(data.current_weather.windspeed);
      const conditionCode = data.current_weather.weathercode;

      document.getElementById('weather-temp').textContent = `${temperature}°C`;
      document.getElementById('weather-wind').textContent = `Viento: ${windspeed} km/h`;
      document.getElementById('weather-status').textContent = parseWeatherCode(conditionCode);
    }
  } catch (error) {
    document.getElementById('weather-status').textContent = "Servicio meteorológico fuera de línea";
  }
}

function parseWeatherCode(code) {
  if (code === 0) return "☀️ Completamente Despejado";
  if (code >= 1 && code <= 3) return "⛅ Intervalos Nubosos";
  if (code >= 45 && code <= 48) return "🌫️ Presencia de Niebla";
  if (code >= 51 && code <= 65) return "🌧️ Llovizna Frecuente";
  if (code >= 80 && code <= 82) return "🌦️ Chubascos Rápidos";
  return "🌦️ Inestable / Variable";
}

// BUCLE DE ACTUALIZACIÓN DEL PANEL
function runDashboardLoop() {
  const localTime = new Date();
  document.getElementById('clock-madrid').textContent = localTime.toLocaleTimeString('es-ES');

  const ennisCalculatedTime = new Date(localTime.getTime() + ennisTimeCorrection);
  document.getElementById('clock-ennis').textContent = ennisCalculatedTime.toLocaleTimeString('es-ES', { timeZone: 'Europe/Dublin' });

  // CUENTA ATRÁS
  const remainingTime = MADRID_AIRPORT_CITA - localTime.getTime();
  if (remainingTime > 0) {
    const d = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
    const h = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((remainingTime % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = d.toString().padStart(2, '0');
    document.getElementById('hours').textContent = h.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = m.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = s.toString().padStart(2, '0');
    document.getElementById('countdown-status').textContent = "Aventura programada y lista.";
  } else {
    document.getElementById('countdown').innerHTML = "<p style='font-size:18px; color:var(--accent); font-weight:bold;'>🇮🇪 INMERSIÓN EN CURSO EN ENNIS 🇮🇪</p>";
    document.getElementById('countdown-status').textContent = "";
  }

  // LÓGICA INTERACTIVA DE HORARIOS DE ENNIS
  const currentHour = ennisCalculatedTime.getHours();
  const currentMin = ennisCalculatedTime.getMinutes();
  const numericTime = currentHour * 100 + currentMin; 
  const currentDay = ennisCalculatedTime.getDay(); // 0: Dom, 1: Lun, 2: Mar...

  let badge = document.getElementById('activity-badge');
  let name = document.getElementById('activity-name');
  let desc = document.getElementById('activity-desc');
  let sleep = document.getElementById('sleep-recommendation');

  document.querySelectorAll('.schedule-table tr').forEach(r => r.classList.remove('active-row'));

  if (currentDay === 0 || currentDay === 6) {
    badge.className = "status-pill free";
    badge.textContent = " Fin de Semana ";
    name.textContent = "Excursiones de día completo / Convivencia Familiar";
    desc.textContent = "Sábados y domingos dedicados al ocio grupal con abbla (ej. Cliffs of Moher) o inmersión con tus anfitriones.";
    sleep.textContent = "Descanso más flexible, pero respeta siempre los límites pactados con la casa.";
  } else {
    // Rutina de lunes a viernes
    if (numericTime >= 745 && numericTime < 845) {
      badge.className = "status-pill home";
      badge.textContent = " Desayuno ";
      name.textContent = "Desayunando con la Host Family";
      desc.textContent = "Momento idóneo para repasar planes y charlar en inglés matutino.";
      document.getElementById('row-0745')?.classList.add('active-row');
      sleep.textContent = "Recomendación: Acostarse antes de las 22:15 hoy para mantener la energía.";
    } 
    else if (numericTime >= 845 && numericTime < 1245) {
      badge.className = "status-pill";
      badge.textContent = " Academia ";
      name.textContent = "Clases Académicas de Inglés";
      desc.textContent = "Bloque lectivo formal enfocado en fluidez verbal y dinámicas comunicativas (9:00 a 12:45).";
      document.getElementById('row-0900')?.classList.add('active-row');
      sleep.textContent = "Mantén el enfoque en la escuela. ¡Prohibido hablar español en clase!";
    } 
    else if (numericTime >= 1245 && numericTime < 1400) {
      badge.className = "status-pill free";
      badge.textContent = " Almuerzo ";
      name.textContent = "Tiempo de Pack-Lunch";
      desc.textContent = "Comiendo el almuerzo frío con tus compañeros del grupo de inmersión.";
      document.getElementById('row-1245')?.classList.add('active-row');
      sleep.textContent = "Hidrátate de cara a las caminatas de la tarde.";
    } 
    else if (numericTime >= 1400 && numericTime < 1745) {
      badge.className = "status-pill";
      badge.textContent = " Actividades ";
      name.textContent = currentDay === 2 ? "📌 Tuesday Tour Extendido" : "Programa de Deportes y Visitas Culturales";
      desc.textContent = currentDay === 2 ? "Los martes las actividades de tarde se alargan para visitar puntos emblemáticos." : "Talleres lúdicos, excursiones locales y juegos organizados por Ennis.";
      document.getElementById('row-1400')?.classList.add('active-row');
      sleep.textContent = "¡Día de mucha actividad! Descansar bien esta noche es fundamental.";
    } 
    else if (numericTime >= 1745 && numericTime < 1830) {
      badge.className = "status-pill free";
      badge.textContent = " En Ruta ";
      name.textContent = "Regreso a Casa";
      desc.textContent = "Trayecto de vuelta hacia la vivienda de tu familia anfitriona.";
      document.getElementById('row-1745')?.classList.add('active-row');
      sleep.textContent = "Sé extremadamente puntual para no hacer esperar a la familia.";
    } 
    else if (numericTime >= 1830 && numericTime < 2000) {
      badge.className = "status-pill home";
      badge.textContent = " Cena ";
      name.textContent = "Cena Familiar Irlandesa";
      desc.textContent = "Inmersión total. Momento idóneo para conversar de manera distendida con los anfitriones.";
      document.getElementById('row-1830')?.classList.add('active-row');
      sleep.textContent = "Deja a un lado las pantallas y céntrate en la conversación familiar.";
    } 
    else if (numericTime >= 2000 && numericTime < 2215) {
      badge.className = "status-pill home";
      badge.textContent = " Tiempo Propio ";
      name.textContent = "Ducha, Mochila y Charlas con España";
      desc.textContent = "Organiza tu chubasquero, calzado y dispositivos para el día de mañana.";
      document.getElementById('row-2000')?.classList.add('active-row');
      sleep.textContent = "Empieza a atenuar luces. Quedan pocos minutos para el apagado general.";
    } 
    else {
      badge.className = "status-pill sleep";
      badge.textContent = " Dormir ";
      name.textContent = "Descanso Obligatorio Nocturno";
      desc.textContent = "Silencio absoluto en el inmueble respetando las normas de convivencia de abbla idiomas.";
      document.getElementById('row-sleep')?.classList.add('active-row');
      sleep.textContent = "🚨 ALERTA: Debes estar en la cama con luces apagadas. ¡A descansar!";
    }
  }
}

// INICIALIZADOR GLOBAL
async function main() {
  await syncEnnisClock();
  await syncEnnisWeather();
  
  setInterval(runDashboardLoop, 1000);
  setInterval(syncEnnisWeather, 900000); // Sincroniza clima cada 15 min
  
  runDashboardLoop();
}

window.onload = main;
