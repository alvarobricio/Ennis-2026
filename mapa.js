window.ennisMap = null;

function initEnnisMap() {
  // Evitamos duplicar el mapa si ya se ha inicializado previamente
  if (window.ennisMap) return;
  
  // 1. Centramos la cámara del mapa exactamente sobre el núcleo urbano de Ennis con un zoom idóneo (15)
  window.ennisMap = L.map('map').setView([52.8446, -8.9808], 15);

  // 2. Cargamos la capa visual limpia estándar de OpenStreetMap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(window.ennisMap);
}
