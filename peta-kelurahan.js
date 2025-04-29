var map = L.map('map').setView([-7.2819, 112.7965], 16);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

var boundary = L.polygon([
  [-7.2825, 112.794],
  [-7.281, 112.797],
  [-7.283, 112.799],
  [-7.284, 112.796]
], {
  color: 'red', 
  weight: 2,
  dashArray: '5, 5',
  fillColor: 'rgba(255,0,0,0.2)',
  fillOpacity: 0.3
}).addTo(map);

var marker = L.circleMarker([-7.282, 112.796], {
  radius: 8,
  fillColor: 'black',
  color: 'red',
  weight: 2,
  opacity: 1,
  fillOpacity: 0.8
}).addTo(map);

marker.bindPopup('<b>Kode Titik: KRT-01</b><br>Dokumentasi: Titik Kartometrik Utama');
