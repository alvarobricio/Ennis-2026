const MADRID_AIRPORT_CITA = new Date("2026-07-06T12:45:00+02:00").getTime();
const ENNIS_TIME_OFFSET = -3600000; 

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

function runCoreClockLoop() {
  const localTime = new Date();
  document.getElementById('clock-madrid').textContent = localTime.toLocaleTimeString('es-ES');

  const ennisTime = new Date(localTime.getTime() + ENNIS_TIME_OFFSET);
  document.getElementById('clock-ennis').textContent = ennisTime.toLocaleTimeString('es-ES', { timeZone: 'Europe/Dublin' });

  if (typeof updateDynamicSchedule === "function") {
    updateDynamicSchedule(ennisTime);
  }

  const remainingTime = MADRID_AIRPORT_CITA - localTime.getTime();
  if (remainingTime > 0) {
    document.getElementById('days').textContent = Math.floor(remainingTime / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
    document.getElementById('hours').textContent = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
    document.getElementById('minutes').textContent = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
    document.getElementById('seconds').textContent = Math.floor((remainingTime % (1000 * 60)) / 1000).toString().padStart(2, '0');
  } else {
    document.getElementById('countdown').innerHTML = "<p style='color:var(--accent); font-weight:bold; font-size:15px;'>✈️ ¡PROGRAMA ENNIS EN CURSO! 🇮🇪</p>";
  }
}

window.onload = function() {
  if (typeof initEnnisMap === "function") {
    initEnnisMap();
  }
  setInterval(runCoreClockLoop, 1000);
  runCoreClockLoop();
};
