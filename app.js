const map = L.map("map").setView([51.8, -0.8], 10);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function style(feature) {
  const inGB = feature.properties.in_greybelt === "greybelt";
  return {
    color: inGB ? "#3D33DA" : "#666",
    weight: 1,
    fillOpacity: inGB ? 0.55 : 0.3
  };
}

function popup(feature, layer) {
  const p = feature.properties;
  layer.bindPopup(
    `<strong>${esc(p.ref)}</strong><br>` +
    `${esc(p.description)}<br>` +
    `<small>${esc(p.period)} · ${esc(p.case_type)} · ${esc(p.in_greybelt)}</small>`
  );
}

fetch("data/applications.geojson")
  .then(r => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  })
  .then(data => {
    const layer = L.geoJSON(data, { style, onEachFeature: popup }).addTo(map);
    map.fitBounds(layer.getBounds());
  })
  .catch(err => console.error("Could not load polygons:", err));