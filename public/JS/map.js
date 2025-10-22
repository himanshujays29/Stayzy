document.addEventListener("DOMContentLoaded", function () {
  const [lon, lat] = listing.geometry.coordinates;
  const map = L.map("map").setView([lat, lon], 13);

  const baseMaps = {
    "OpenStreetMap": L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    ),
     "Carto Dark": L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"),
    "WorldImagery": L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    ),
  };

  const redIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  baseMaps["OpenStreetMap"].addTo(map);
  L.control.layers(baseMaps).addTo(map);
  console.log("Coordinates in map.js:", listing.geometry.coordinates);
  L.marker([lat, lon], { icon: redIcon })
    .addTo(map)
    .bindPopup(
      `<h5>${listing.location}</h5> <p>Exact Location will be provided after booking.</p>`
    );
});
