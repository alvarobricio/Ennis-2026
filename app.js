// CONFIGURACIÓN DE CONTEXTO GLOBAL
const MADRID_AIRPORT_CITA = new Date("2026-07-06T08:00:00+02:00").getTime();
const ENNIS_TIME_OFFSET = -3600000; // Horario de verano: Irlanda (GMT+1) tiene 1 hora menos que España (GMT+2)

// Sistema de pestañas lateral
function switchTab(tabId, btn) {
  document.querySelectorAll('.section-view').forEach(view => view.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  
  document.getElementById(tabId).classList.add('active');
  btn.classList.add('active');
  document.getElementById('nav-title').textContent = btn.textContent.trim().substring(2);

  // Si abrimos la pestaña del mapa, forzamos la actualización de su tamaño para que cargue bien
  if (tabId === 'mapa' && window.ennisMap) {
    setTimeout(() => { window.ennisMap.invalidateSize(); }, 200);
  }
}

// Relojes sincronizados y bucle general
function runCoreClockLoop() {
  const localTime = new Date();
  document.getElementById('clock-madrid').textContent = localTime.toLocaleTimeString('es-ES');

  // Calcular hora exacta de Ennis aplicando la corrección de huso horario
  const ennisTime = new Date(localTime.getTime() + ENNIS_TIME_OFFSET);
  document.getElementById('clock-ennis').textContent = ennisTime.toLocaleTimeString('es-ES', { timeZone: 'Europe/Dublin' });

  // Ejecutar el motor de itinerario diario (definido en horario.js)
  if (typeof updateDynamicSchedule === "function") {
    updateDynamicSchedule(ennisTime);
  }

  // Lógica de la Cuenta Atrás
  const remainingTime = MADRID_AIRPORT_CITA - localTime.getTime();
  if (remainingTime > 0) {
    document.getElementById('days').textContent = Math.floor(remainingTime / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
    document.getElementById('hours').textContent = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
    document.getElementById('minutes').textContent = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
    document.getElementById('seconds').textContent = Math.floor((remainingTime % (1000 * 60)) / 1000).toString().padStart(2, '0');
  } else {
    document.getElementById('countdown').innerHTML = "<p style='color:var(--accent); font-weight:bold; font-size:16px;'>🇮🇪 ¡EL VIAJE A ENNIS ESTÁ EN CURSO! 🇮🇪</p>";
  }
}

// Inicializador maestro cuando la ventana cargue
window.onload = function() {
  // Inicializar mapa (definido en mapa.js)
  if (typeof initEnnisMap === "function") {
    initEnnisMap();
  }
  
  // Arrancar bucle de relojes cada segundo
  setInterval(runCoreClockLoop, 1000);
  runCoreClockLoop();
};
