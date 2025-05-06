// Inisialisasi peta saat dokumen selesai dimuat
document.addEventListener("DOMContentLoaded", function () {
    // Buat instance peta dan atur tampilan awal ke Surabaya, Indonesia
    const peta = L.map("batas-kelurahan").setView([-7.2575, 112.7521], 12);

    // Tambahkan lapisan ubin dari OpenStreetMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '© <a href="https://www.openstreetmap.org/copyright">Kontributor OpenStreetMap</a>',
    }).addTo(peta);

    // Simpan marker titik kartometrik untuk pengelolaan performa
    const markerMap = new Map();

    // Lapisan untuk batas kelurahan, RW, dan RT
    let batasKelurahanLayer = null;
    let batasRwLayer = null;
    let batasRtLayer = null;
    const kartometrikKelurahanLayerGroup = L.layerGroup();
    const kartometrikRwLayerGroup = L.layerGroup();
    const kartometrikRtLayerGroup = L.layerGroup();

    // Palet warna untuk RW dan RT
    const rwColorPalettes = {
        1: ["#ADD8E6", "#87CEEB", "#4682B4", "#4169E1", "#0000FF"], // Biru
        2: ["#90EE90", "#32CD32", "#228B22", "#006400", "#008000"], // Hijau
        3: ["#FFB6C1", "#FF69B4", "#C71585", "#DB7093", "#FF1493"], // Merah muda
        4: ["#FFD700", "#FFA500", "#FF8C00", "#DAA520", "#B8860B"], // Kuning-Oranye
        5: ["#E6E6FA", "#D8BFD8", "#9932CC", "#8A2BE2", "#4B0082"], // Ungu
        6: ["#FFE4E1", "#F08080", "#DC143C", "#B22222", "#8B0000"], // Merah
        7: ["#98FB98", "#00FF7F", "#00FA9A", "#20B2AA", "#008B8B"], // Hijau muda
        8: ["#F0F8FF", "#B0E0E6", "#5F9EA0", "#4682B4", "#191970"], // Biru tua
        9: ["#FFFACD", "#F5DEB3", "#DEB887", "#D2B48C", "#8B4513"], // Cokelat
    };

    // Fungsi untuk menampilkan pesan error kepada pengguna
    function showError(message) {
        const errorDiv = document.createElement("div");
        errorDiv.style.cssText = "position: fixed; top: 10px; right: 10px; background: #ff4444; color: white; padding: 10px; border-radius: 5px; z-index: 1000;";
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
        setTimeout(() => errorDiv.remove(), 5000);
    }

    // Fungsi untuk mengambil dan menampilkan data batas kelurahan
    function loadBatasKelurahan() {
        fetch("api/api.php?type=kelurahan")
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

                batasKelurahanLayer.data = data;
                if (document.getElementById("toggle-batas-kelurahan").checked) {
                    batasKelurahanLayer.addTo(peta);
                }
            })
            .catch((error) => {
                console.error("Gagal memuat data batas kelurahan:", error);
                showError("Tidak dapat memuat data batas kelurahan. Silakan coba lagi nanti.");
            });
    }

    // Fungsi untuk mengambil dan menampilkan data batas RW
    function loadBatasRw() {
        fetch("api/api.php?type=rw")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Gagal mengambil data batas RW dari API");
                }
                return response.json();
            })
            .then((data) => {
                batasRwLayer = L.geoJSON(data, {
                    style: function (feature) {
                        const rw = feature.properties.RW;
                        const color = rwColorPalettes[rw] ? rwColorPalettes[rw][0] : "#00ff00"; // Warna default hijau
                        return {
                            color: color,
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

                batasRwLayer.data = data;
                if (document.getElementById("toggle-batas-rw").checked) {
                    batasRwLayer.addTo(peta);
                }
            })
            .catch((error) => {
                console.error("Gagal memuat data batas RW:", error);
                showError("Tidak dapat memuat data batas RW. Silakan coba lagi nanti.");
            });
    }

    // Fungsi untuk mengambil dan menampilkan data batas RT
    function loadBatasRt() {
        fetch("api/api.php?type=rt")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Gagal mengambil data batas RT dari API");
                }
                return response.json();
            })
            .then((data) => {
                batasRtLayer = L.geoJSON(data, {
                    style: function (feature) {
                        const rw = feature.properties.RW;
                        const rt = feature.properties.RT;
                        const palette = rwColorPalettes[rw] || ["#00ff00"];
                        const colorIndex = (rt - 1) % palette.length; // Siklus warna dalam palet
                        return {
                            color: palette[colorIndex],
                            weight: 2,
                            opacity: 1,
                            fillOpacity: 0.2,
                            dashArray: "5, 5",
                        };
                    },
                    onEachFeature: function (feature, layer) {
                        if (feature.properties && feature.properties.RW && feature.properties.RT) {
                            layer.bindPopup(
                                `<b>RW:</b> ${feature.properties.RW}<br>` +
                                `<b>RT:</b> ${feature.properties.RT}`
                            );
                        }
                    },
                });

                batasRtLayer.data = data;
                if (document.getElementById("toggle-batas-rt").checked) {
                    batasRtLayer.addTo(peta);
                }
            })
            .catch((error) => {
                console.error("Gagal memuat data batas RT:", error);
                showError("Tidak dapat memuat data batas RT. Silakan coba lagi nanti.");
            });
    }

    // Event listener untuk zoom
    peta.on("zoomend", function () {
        const currentZoom = peta.getZoom();
        const isKelurahanActive = document.getElementById("toggle-batas-kelurahan").checked;
        const isRwActive = document.getElementById("toggle-batas-rw").checked;
        const isRtActive = document.getElementById("toggle-batas-rt").checked;

        // Kelurahan: Tampilkan titik kartometrik
        if (currentZoom >= 15 && isKelurahanActive && batasKelurahanLayer && batasKelurahanLayer.data) {
            batasKelurahanLayer.data.features.forEach((feature) => {
                if (feature.geometry && feature.geometry.type === "Polygon") {
                    const coordinates = feature.geometry.coordinates[0];
                    coordinates.forEach((coord) => {
                        const [lng, lat] = coord;
                        const key = `kelurahan_${lat},${lng}`;
                        if (!markerMap.has(key)) {
                            const marker = L.marker([lat, lng], {
                                icon: L.divIcon({
                                    className: "kartometrik-marker-kelurahan",
                                    html: `
                                        <div style="
                                            width: 12px;
                                            height: 12px;
                                            border-radius: 50%;
                                            background: radial-gradient(circle, black 2px, transparent 2px);
                                            background-size: 4px 4px;
                                            background-color: blue;
                                            border: 1px solid black;
                                        "></div>
                                    `,
                                    iconSize: [12, 12],
                                }),
                            });
                            marker.bindPopup(
                                `<b>Titik Kartometrik Kelurahan</b><br>` +
                                `Lintang: ${lat.toFixed(6)}<br>` +
                                `Bujur: ${lng.toFixed(6)}`
                            );
                            markerMap.set(key, marker);
                            marker.addTo(kartometrikKelurahanLayerGroup);
                        }
                    });
                }
            });
            kartometrikKelurahanLayerGroup.addTo(peta);
        } else {
            kartometrikKelurahanLayerGroup.clearLayers();
            markerMap.forEach((marker, key) => {
                if (key.startsWith("kelurahan_")) {
                    markerMap.delete(key);
                }
            });
        }

        // RW: Tampilkan titik kartometrik
        if (currentZoom >= 15 && isRwActive && batasRwLayer && batasRwLayer.data) {
            batasRwLayer.data.features.forEach((feature) => {
                if (feature.geometry && feature.geometry.type === "Polygon") {
                    const coordinates = feature.geometry.coordinates[0];
                    coordinates.forEach((coord) => {
                        const [lng, lat] = coord;
                        const key = `rw_${lat},${lng}`;
                        if (!markerMap.has(key)) {
                            const marker = L.marker([lat, lng], {
                                icon: L.divIcon({
                                    className: "kartometrik-marker-rw",
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
                                `<b>Titik Kartometrik RW</b><br>` +
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
            kartometrikRwLayerGroup.clearLayers();
            markerMap.forEach((marker, key) => {
                if (key.startsWith("rw_")) {
                    markerMap.delete(key);
                }
            });
        }

        // RT: Tampilkan titik kartometrik
        if (currentZoom >= 15 && isRtActive && batasRtLayer && batasRtLayer.data) {
            batasRtLayer.data.features.forEach((feature) => {
                const coordinates = feature.geometry.type === "Polygon" 
                    ? feature.geometry.coordinates[0] 
                    : feature.geometry.type === "MultiPolygon" 
                        ? feature.geometry.coordinates[0][0] // Ambil poligon pertama
                        : [];
                coordinates.forEach((coord) => {
                    const [lng, lat] = coord;
                    const key = `rt_${lat},${lng}`;
                    if (!markerMap.has(key)) {
                        const rw = feature.properties.RW;
                        const rt = feature.properties.RT;
                        const palette = rwColorPalettes[rw] || ["#00ff00"];
                        const colorIndex = (rt - 1) % palette.length;
                        const marker = L.marker([lat, lng], {
                            icon: L.divIcon({
                                className: "kartometrik-marker-rt",
                                html: `
                                    <div style="
                                        width: 12px;
                                        height: 12px;
                                        border-radius: 50%;
                                        background: radial-gradient(circle, black 2px, transparent 2px);
                                        background-size: 4px 4px;
                                        background-color: ${palette[colorIndex]};
                                        border: 1px solid black;
                                    "></div>
                                `,
                                iconSize: [12, 12],
                            }),
                        });
                        marker.bindPopup(
                            `<b>Titik Kartometrik RT</b><br>` +
                            `RW: ${rw}<br>` +
                            `RT: ${rt}<br>` +
                            `Lintang: ${lat.toFixed(6)}<br>` +
                            `Bujur: ${lng.toFixed(6)}`
                        );
                        markerMap.set(key, marker);
                        marker.addTo(kartometrikRtLayerGroup);
                    }
                });
            });
            kartometrikRtLayerGroup.addTo(peta);
        } else {
            kartometrikRtLayerGroup.clearLayers();
            markerMap.forEach((marker, key) => {
                if (key.startsWith("rt_")) {
                    markerMap.delete(key);
                }
            });
        }
    });

    // Muat data awal
    loadBatasKelurahan();
    loadBatasRw();
    loadBatasRt();

    // Logika toggle untuk batas kelurahan
    document.getElementById("toggle-batas-kelurahan").addEventListener("change", function () {
        if (this.checked) {
            if (batasKelurahanLayer) {
                batasKelurahanLayer.addTo(peta);
                const currentZoom = peta.getZoom();
                if (currentZoom >= 15) {
                    peta.fire("zoomend");
                }
            }
        } else {
            if (batasKelurahanLayer) {
                peta.removeLayer(batasKelurahanLayer);
                kartometrikKelurahanLayerGroup.clearLayers();
                markerMap.forEach((marker, key) => {
                    if (key.startsWith("kelurahan_")) {
                        markerMap.delete(key);
                    }
                });
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
                markerMap.forEach((marker, key) => {
                    if (key.startsWith("rw_")) {
                        markerMap.delete(key);
                    }
                });
            }
        }
    });

    // Logika toggle untuk batas RT
    document.getElementById("toggle-batas-rt").addEventListener("change", function () {
        if (this.checked) {
            if (batasRtLayer) {
                batasRtLayer.addTo(peta);
                const currentZoom = peta.getZoom();
                if (currentZoom >= 15) {
                    peta.fire("zoomend");
                }
            }
        } else {
            if (batasRtLayer) {
                peta.removeLayer(batasRtLayer);
                kartometrikRtLayerGroup.clearLayers();
                markerMap.forEach((marker, key) => {
                    if (key.startsWith("rt_")) {
                        markerMap.delete(key);
                    }
                });
            }
        }
    });
});