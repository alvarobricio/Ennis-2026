// Variable global para controlar el mapa
window.ennisMap = null;

function initEnnisMap() {
  const mapaContenedor = document.getElementById('map');
  if (!mapaContenedor) return;

  // 1. Centrar el mapa en Ennis, Irlanda [Latitud, Longitud], con un zoom óptimo
  window.ennisMap = L.map('map').setView([52.8445, -8.9825], 15);

  // 2. Capa visual del mapa basada en OpenStreetMap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(window.ennisMap);

  // 3. Base de datos geográfica y de horarios de los puntos solicitados
  const ubicacionesPuntos = [
    {
      nombre: "Atlas Language School / Clare Area",
      coordenadas: [52.8423, -8.9861],
      categoria: "Educación",
      nota: "🏫 <b>Centro de Estudios:</b> Instalaciones principales de nuestra academia asociada en Ennis donde se imparten las clases matutinas de inglés.",
      horarios: "Abierto de Lunes a Viernes de 09:00h a 17:00h. Sábados y Domingos cerrado."
    },
    {
      nombre: "Tesco Superstore Ennis",
      coordenadas: [52.8465, -8.9855],
      categoria: "Compras",
      nota: "🛒 <b>Supermercado Grande:</b> Ideal para comprar snacks, agua, artículos de aseo personal o cualquier extra que necesites durante el viaje.",
      horarios: "Abierto todos los días de 07:00h a 22:00h."
    },
    {
      nombre: "O'Connell Square (El Centro)",
      coordenadas: [52.8434, -8.9814],
      categoria: "Centro",
      nota: "📍 <b>Corazón de la Ciudad:</b> La plaza principal de Ennis, rodeada de comercios, cafeterías y el monumento central. Zona peatonal de referencia.",
      horarios: "Espacio público. Accesible 24 horas al día."
    },
    {
      nombre: "Temple Gate Car Park (Punto de Encuentro)",
      coordenadas: [52.8451, -8.9811],
      categoria: "Quedadas",
      nota: "🚌 <b>Punto de Excursiones de Abbla:</b> Lugar exacto fijado en las pautas del viaje para la salida y llegada de los autobuses los sábados (Galway, Inis Óirr, etc.).",
      horarios: "Zona de parking pública. Operativa 24 horas."
    },
    {
      nombre: "Clare Museum",
      coordenadas: [52.8441, -8.9813],
      categoria: "Cultura",
      nota: "🏛️ <b>Museo de Historia Local:</b> Ofrece una magnífica exposición sobre la historia, arqueología y cultura tradicional del Condado de Clare.",
      horarios: "Abierto de Martes a Sábado de 09:30h a 13:00h y de 14:00h a 17:30h. Lunes y Domingos cerrado."
    },
    {
      nombre: "De Valera Library (Biblioteca de Ennis)",
      coordenadas: [52.8428, -8.9839],
      categoria: "Cultura",
      nota: "📚 <b>Biblioteca Pública:</b> Espacio ideal si necesitas un entorno silencioso para revisar apuntes, leer o disponer de conexión Wi-Fi estable.",
      horarios: "Lunes, Miércoles y Viernes: 10:00h - 17:30h. Martes y Jueves: 10:00h - 20:00h. Sábados: 10:00h - 14:00h. Domingos cerrado."
    }
  ];

  // 4. Inyectar marcadores clickables en la API del mapa
  ubicacionesPuntos.forEach(p => {
    // Generar la tarjeta informativa en HTML para el interior del globo
    const contenidoPopup = `
      <div style="font-family: Arial, sans-serif; color: #1e293b; min-width: 220px; line-height: 1.4;">
        <h4 style="margin: 0 0 6px 0; color: #0f172a; border-bottom: 2px solid #00ffaa; padding-bottom: 4px; font-size: 14px;">${p.nombre}</h4>
        <p style="font-size: 12.5px; margin-bottom: 8px; color: #334155;">${p.nota}</p>
        <div style="background: #f1f5f9; padding: 6px 8px; border-radius: 6px; font-size: 11.5px;">
          <b style="color: #475569; display: block; margin-bottom: 2px;">🕒 Horarios oficiales:</b>
          <span style="color: #64748b;">${p.horarios}</span>
        </div>
      </div>
    `;

    // Pintar el marcador físico en sus coordenadas
    L.marker(p.coordenadas)
      .addTo(window.ennisMap)
      .bindPopup(contenidoPopup);
  });
}
