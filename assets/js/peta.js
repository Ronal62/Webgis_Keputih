// Inisialisasi peta saat dokumen selesai dimuat
document.addEventListener("DOMContentLoaded", function () {
    // Buat instance peta dan atur tampilan awal ke lokasi tertentu (Surabaya, Indonesia)
    const peta = L.map("batas-kelurahan").setView([-7.2575, 112.7521], 12);

    // Tambahkan lapisan ubin (tile layer) dari OpenStreetMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
            '© <a href="https://www.openstreetmap.org/copyright">Kontributor OpenStreetMap</a>',
    }).addTo(peta);

    // Simpan marker titik kartometrik untuk pengelolaan performa (untuk batas RW)
    const markerMap = new Map();

    // Lapisan untuk batas kelurahan dan batas RW
    let batasKelurahanLayer = null;
    let batasRwLayer = null;
    let kartometrikRwLayerGroup = L.layerGroup(); // Layer group untuk marker kartometrik RW

    // Fungsi untuk mengambil dan menampilkan data batas kelurahan
    function loadBatasKelurahan() {
        fetch("api/api.php?type=kelurahan") // Ubah URL ke api.php
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Gagal mengambil data batas kelurahan dari API");
                }
                return response.json();
            })
            .then((data) => {
                batasKelurahanLayer = L.geoJSON(data, {
                    style: function (feature) {
                        return {
                            color: "#ff0000",
                            weight: 2,
                            opacity: 1,
                            fillOpacity: 0.2,
                            dashArray: "5, 5",
                        };
                    },
                    onEachFeature: function (feature, layer) {
                        if (feature.properties && feature.properties.NAMOBJ) {
                            layer.bindPopup(
                                `<b>Kelurahan:</b> ${feature.properties.NAMOBJ}<br>` +
                                `<b>Kecamatan:</b> ${feature.properties.WADMKC}<br>` +
                                `<b>Kota:</b> ${feature.properties.WADMKK}`
                            );
                        }
                    },
                });

                // Tambahkan lapisan ke peta jika toggle aktif
                if (document.getElementById("toggle-batas-kelurahan").checked) {
                    batasKelurahanLayer.addTo(peta);
                }
            })
            .catch((error) => console.error("Gagal memuat data batas kelurahan:", error));
    }

    // Fungsi untuk mengambil dan menampilkan data batas RW
    function loadBatasRw() {
        fetch("api/api.php?type=rw") // Ubah URL ke api.php
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Gagal mengambil data batas RW dari API");
                }
                return response.json();
            })
            .then((data) => {
                batasRwLayer = L.geoJSON(data, {
                    style: function (feature) {
                        return {
                            color: "#00ff00",
                            weight: 2,
                            opacity: 1,
                            fillOpacity: 0.2,
                            dashArray: "5, 5",
                        };
                    },
                    onEachFeature: function (feature, layer) {
                        if (feature.properties && feature.properties.RW) {
                            layer.bindPopup(
                                `<b>RW:</b> ${feature.properties.RW}<br>` +
                                `<b>Shape Length:</b> ${feature.properties.Shape_Leng}<br>` +
                                `<b>Shape Area:</b> ${feature.properties.Shape_Area}`
                            );
                        }
                    },
                });

                // Tambahkan lapisan ke peta jika toggle aktif
                if (document.getElementById("toggle-batas-rw").checked) {
                    batasRwLayer.addTo(peta);
                }

                // Tambahkan event listener untuk zoom (untuk titik kartometrik RW)
                peta.on("zoomend", function () {
                    const currentZoom = peta.getZoom();
                    const isRwActive = document.getElementById("toggle-batas-rw").checked;

                    if (currentZoom >= 15 && isRwActive) {
                        // Tampilkan marker hanya jika zoom >= 15 dan toggle RW aktif
                        data.features.forEach((feature) => {
                            if (feature.geometry && feature.geometry.type === "Polygon") {
                                const coordinates = feature.geometry.coordinates[0];
                                coordinates.forEach((coord) => {
                                    const [lng, lat] = coord;
                                    const key = `${lat},${lng}`;
                                    if (!markerMap.has(key)) {
                                        const marker = L.marker([lat, lng], {
                                            icon: L.divIcon({
                                                className: "kartometrik-marker",
                                                html: `
                                                    <div style="
                                                        width: 12px;
                                                        height: 12px;
                                                        border-radius: 50%;
                                                        background: radial-gradient(circle, black 2px, transparent 2px);
                                                        background-size: 4px 4px;
                                                        background-color: red;
                                                        border: 1px solid black;
                                                    "></div>
                                                `,
                                                iconSize: [12, 12],
                                            }),
                                        });
                                        marker.bindPopup(
                                            `<b>Titik Kartometrik</b><br>` +
                                            `Lintang: ${lat.toFixed(6)}<br>` +
                                            `Bujur: ${lng.toFixed(6)}`
                                        );
                                        markerMap.set(key, marker);
                                        marker.addTo(kartometrikRwLayerGroup);
                                    }
                                });
                            }
                        });
                        kartometrikRwLayerGroup.addTo(peta);
                    } else {
                        // Hapus marker jika zoom < 15 atau toggle RW nonaktif
                        kartometrikRwLayerGroup.clearLayers();
                        markerMap.clear();
                    }
                });
            })
            .catch((error) => console.error("Gagal memuat data batas RW:", error));
    }

    // Muat data awal
    loadBatasKelurahan();
    loadBatasRw();

    // Logika toggle untuk batas kelurahan
    document.getElementById("toggle-batas-kelurahan").addEventListener("change", function () {
        if (this.checked) {
            if (batasKelurahanLayer) {
                batasKelurahanLayer.addTo(peta);
            }
        } else {
            if (batasKelurahanLayer) {
                peta.removeLayer(batasKelurahanLayer);
            }
        }
    });

    // Logika toggle untuk batas RW
    document.getElementById("toggle-batas-rw").addEventListener("change", function () {
        if (this.checked) {
            if (batasRwLayer) {
                batasRwLayer.addTo(peta);
                const currentZoom = peta.getZoom();
                if (currentZoom >= 15) {
                    peta.fire("zoomend");
                }
            }
        } else {
            if (batasRwLayer) {
                peta.removeLayer(batasRwLayer);
                kartometrikRwLayerGroup.clearLayers();
                markerMap.clear();
            }
        }
    });
});