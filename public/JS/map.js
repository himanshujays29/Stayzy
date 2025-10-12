
  document.addEventListener("DOMContentLoaded", function () {
    const map = L.map("map").setView([28.6139, 77.2090], 11); // Delhi coordinates

const baseMaps = {
  "OpenStreetMap": L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"),
  "Stamen Terrain": L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"),
};

baseMaps["OpenStreetMap"].addTo(map); // default
L.control.layers(baseMaps).addTo(map);

    L.marker([28.6139, 77.2090])
      .addTo(map)
      .bindPopup("Hello from Delhi!")
      .openPopup();
  });

