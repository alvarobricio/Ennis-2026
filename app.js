// CONSTANTES GLOBALES
const MADRID_AIRPORT_CITA = new Date("2026-07-06T11:00:00+02:00").getTime();
let lastWeatherFetch = 0;

function switchTab(tabId, btn) {
  document.querySelectorAll('.section-view').forEach(view => view.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  
  document.getElementById(tabId).classList.add('active');
  btn.classList.add('active');
  document.getElementById('nav-title').textContent = btn.textContent.trim().substring(2);

  if (tabId === 'mapa' && window.ennisMap) {
    setTimeout(() => { window.ennisMap.invalidateSize(); }, 200);
  }
}

// FUNCIÓN PARA LLAMAR A LA API DEL TIEMPO (Open-Meteo - Ennis: Lat 52.84, Lon -8.98)
async function fetchEnnisWeather() {
  const now = Date.now();
  // Evitamos llamadas excesivas (solo una cada 30 minutos)
  if (now - lastWeatherFetch < 30 * 60 * 1000) return;
  
  try {
    const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=52.8436&longitude=-8.9805&current=temperature_2m,weather_code");
    if (!response.ok) throw new Error("Error en la API");
    
    const data = await response.json();
    const temp = Math.round(data.current.temperature_2m);
    const code = data.current.weather_code;
    
    // Mapeo básico de WMO Weather Codes a Emojis
    let icon = "🌤️";
    let desc = "Nublado";
    
    if (code === 0) { icon = "☀️"; desc = "Despejado"; }
    else if (code >= 1 && code <= 3) { icon = "⛅"; desc = "Intervalos nubosos"; }
    else if (code >= 45 && code <= 48) { icon = "🌫️"; desc = "Niebla"; }
    else if (code >= 51 && code <= 67) { icon = "🌧️"; desc = "Chispeando / Lluvia"; } // ¡Clásico irlandés!
    else if (code >= 71 && code <= 77) { icon = "❄️"; desc = "Nieve"; }
    else if (code >= 80 && code <= 82) { icon = "🌦️"; desc = "Chubascos"; }
    else if (code >= 95) { icon = "⛈️"; desc = "Tormenta"; }

    // Inyectamos los datos en el HTML
    document.getElementById("weather-temp").textContent = `${temp}°C`;
    document.getElementById("weather-desc").textContent = desc;
    document.getElementById("weather-icon").textContent = icon;
    
    lastWeatherFetch = now;
  } catch (error) {
    console.error("No se pudo obtener el clima de Ennis:", error);
    document.getElementById("weather-desc").textContent = "Clima no disponible";
  }
}

function runCoreClockLoop() {
  const localTime = new Date();
  
  // 1. Hora de Madrid
  document.getElementById('clock-madrid').textContent = localTime.toLocaleTimeString('es-ES');

  // 2. Hora de Ennis nativa
  const ennisTimeString = localTime.toLocaleTimeString('es-ES', { timeZone: 'Europe/Dublin' });
  document.getElementById('clock-ennis').textContent = ennisTimeString;

  // 3. Crear fecha Ennis para pasarla al gestor de horarios
  const ennisParts = localTime.toLocaleString('en-US', { timeZone: 'Europe/Dublin' }).split(', ');
  const ennisTime = new Date(ennisParts[0] + ' ' + ennisTimeString);

  if (typeof updateDynamicSchedule === "function") {
    updateDynamicSchedule(ennisTime);
  }

  // 4. Cuenta atrás matemática exacta
  const remainingTime = MADRID_AIRPORT_CITA - localTime.getTime();
  if (remainingTime > 0) {
    document.getElementById('days').textContent = Math.floor(remainingTime / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
    document.getElementById('hours').textContent = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
    document.getElementById('minutes').textContent = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
    document.getElementById('seconds').textContent = Math.floor((remainingTime % (1000 * 60)) / 1000).toString().padStart(2, '0');
  } else {
    document.getElementById('countdown').innerHTML = "<p style='color:var(--accent); font-weight:bold; font-size:15px; text-align:center; padding:10px;'>✈️ ¡PROGRAMA ENNIS EN CURSO! 🇮🇪</p>";
  }

  // 5. Ejecutar consulta del tiempo en cada ciclo del reloj (la función interna ya controla el spam)
  fetchEnnisWeather();
}

window.onload = function() {
  if (typeof initEnnisMap === "function") {
    initEnnisMap();
  }
  // Ejecución inmediata al cargar
  fetchEnnisWeather();
  setInterval(runCoreClockLoop, 1000);
  runCoreClockLoop();
};
