document.addEventListener("DOMContentLoaded", function () {
    // Pastikan Leaflet tersedia
    if (typeof L === "undefined") {
        console.error("Leaflet tidak dimuat. Pastikan file leaflet.js dimuat sebelum peta.js");
        return;
    }

    // Pastikan elemen dengan ID batas-kelurahan ada
    const mapContainer = document.getElementById("batas-kelurahan");
    if (!mapContainer) {
        console.error("Elemen dengan ID 'batas-kelurahan' tidak ditemukan di DOM");
        return;
    }

    // Buat instance peta dan atur tampilan awal ke Surabaya, Indonesia
    const peta = L.map("batas-kelurahan").setView([-7.2575, 112.7521], 12);

    // Tambahkan lapisan ubin dari OpenStreetMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '© <a href="https://www.openstreetmap.org/copyright">Kontributor OpenStreetMap</a>',
    }).addTo(peta);

    // Lapisan untuk batas kelurahan, RW, RT, dan Patok Batas Keputih
    let batasKelurahanLayer = null;
    let batasRwLayer = null;
    let batasRtLayer = null;
    let batasPatokBatasKeputihLayer = null;

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

    // Fungsi untuk mengambil dan menampilkan data batas Patok Batas Keputih
    function loadBatasPatokBatasKeputih() {
        fetch("api/api.php?type=patok_batas_keputih")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Gagal mengambil data batas Patok Batas Keputih dari API");
                }
                return response.json();
            })
            .then((data) => {
                batasPatokBatasKeputihLayer = L.geoJSON(data, {
                    style: function (feature) {
                        return {
                            color: "#800080", // Warna ungu untuk Patok Batas Keputih
                            weight: 2,
                            opacity: 1,
                            fillOpacity: 0.2,
                            dashArray: "5, 5",
                        };
                    },
                    onEachFeature: function (feature, layer) {
                        if (feature.properties) {
                            layer.bindPopup(
                                `<b>Patok Batas Keputih</b><br>` +
                                (feature.properties.NAMA ? `<b>Nama:</b> ${feature.properties.NAMA}<br>` : "") +
                                (feature.properties.KETERANGAN ? `<b>Keterangan:</b> ${feature.properties.KETERANGAN}<br>` : "")
                            );
                        }
                    },
                });

                batasPatokBatasKeputihLayer.data = data;
                if (document.getElementById("toggle-batas-patok-batas-keputih").checked) {
                    batasPatokBatasKeputihLayer.addTo(peta);
                }
            })
            .catch((error) => {
                console.error("Gagal memuat data batas Patok Batas Keputih:", error);
                showError("Tidak dapat memuat data batas Patok Batas Keputih. Silakan coba lagi nanti.");
            });
    }

    // Muat data awal
    loadBatasKelurahan();
    loadBatasRw();
    loadBatasRt();
    loadBatasPatokBatasKeputih();

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
            }
        } else {
            if (batasRwLayer) {
                peta.removeLayer(batasRwLayer);
            }
        }
    });

    // Logika toggle untuk batas RT
    document.getElementById("toggle-batas-rt").addEventListener("change", function () {
        if (this.checked) {
            if (batasRtLayer) {
                batasRtLayer.addTo(peta);
            }
        } else {
            if (batasRtLayer) {
                peta.removeLayer(batasRtLayer);
            }
        }
    });

    // Logika toggle untuk batas Patok Batas Keputih
    document.getElementById("toggle-batas-patok-batas-keputih").addEventListener("change", function () {
        if (this.checked) {
            if (batasPatokBatasKeputihLayer) {
                batasPatokBatasKeputihLayer.addTo(peta);
            }
        } else {
            if (batasPatokBatasKeputihLayer) {
                peta.removeLayer(batasPatokBatasKeputihLayer);
            }
        }
    });
});