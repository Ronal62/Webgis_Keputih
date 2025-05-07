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

    // Lapisan untuk batas kelurahan, RW, RT, Patok Batas Keputih, dan inventarisasi
    let batasKelurahanLayer = null;
    let batasRwLayer = null;
    let batasRtLayer = null;
    let batasPatokBatasKeputihLayer = null;
    let sekolahNonFormalLayer = null;
    let telekomunikasiLayer = null;
    let pariwisataLayer = null;
    let kebudayaanLayer = null;
    let perhubunganLayer = null;

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

    // Definisi ikon untuk setiap jenis inventarisasi
    const perhubunganIcon = L.divIcon({
        className: "perhubungan-icon",
        html: '<i class="fas fa-bus" style="color: blue; font-size: 24px;"></i>',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
    });

    const pariwisataIcon = L.divIcon({
        className: "pariwisata-icon",
        html: '<i class="fas fa-tree" style="color: green; font-size: 24px;"></i>',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
    });

    const telekomunikasiIcon = L.divIcon({
        className: "telekomunikasi-icon",
        html: '<i class="fas fa-broadcast-tower" style="color: purple; font-size: 24px;"></i>',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
    });

    const sekolahNonFormalIcon = L.divIcon({
        className: "sekolah-non-formal-icon",
        html: '<i class="fas fa-book" style="color: yellow; font-size: 24px;"></i>',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
    });

    const kebudayaanIcon = L.divIcon({
        className: "kebudayaan-icon",
        html: '<i class="fas fa-paint-brush" style="color: red; font-size: 24px;"></i>',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
    });

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
                        const nama = feature.properties.NAMA || "Tidak Diketahui";
                        const keterangan = feature.properties.KETERANGAN || "";
                        layer.bindPopup(
                            `<b>Nama Objek:</b> ${nama}<br>` +
                            `<b>Jenis Objek:</b> Patok Batas Keputih<br>` +
                            (keterangan ? `<b>Keterangan:</b> ${keterangan}<br>` : "")
                        );
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

    // Fungsi untuk mengambil dan menampilkan data Sekolah Non-Formal
    function loadSekolahNonFormal() {
        fetch("api/api.php?type=sekolah_non_formal")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Gagal mengambil data Sekolah Non-Formal dari API");
                }
                return response.json();
            })
            .then((data) => {
                sekolahNonFormalLayer = L.geoJSON(data, {
                    pointToLayer: function (feature, latlng) {
                        return L.marker(latlng, { icon: sekolahNonFormalIcon });
                    },
                    onEachFeature: function (feature, layer) {
                        const nama = feature.properties.Objek || "Tidak Diketahui";
                        layer.bindPopup(
                            `<b>Nama Objek:</b> ${nama}<br>` +
                            `<b>Jenis Objek:</b> Sekolah Non-Formal<br>` +
                            `<img src="https://its.id/m/InventarisasiKEL2" alt="Foto Dokumentasi" style="max-width: 200px; height: auto;" onerror="this.src='https://via.placeholder.com/200x150?text=Foto+Tidak+Tersedia';">`
                        );
                    },
                });
                if (document.getElementById("toggle-inventarisasi").checked) {
                    sekolahNonFormalLayer.addTo(peta);
                }
            })
            .catch((error) => {
                console.error("Gagal memuat data Sekolah Non-Formal:", error);
                showError("Tidak dapat memuat data Sekolah Non-Formal. Silakan coba lagi nanti.");
            });
    }

    // Fungsi untuk mengambil dan menampilkan data Telekomunikasi
    function loadTelekomunikasi() {
        fetch("api/api.php?type=telekomunikasi")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Gagal mengambil data Telekomunikasi dari API");
                }
                return response.json();
            })
            .then((data) => {
                telekomunikasiLayer = L.geoJSON(data, {
                    pointToLayer: function (feature, latlng) {
                        return L.marker(latlng, { icon: telekomunikasiIcon });
                    },
                    onEachFeature: function (feature, layer) {
                        const nama = feature.properties.Nama || "Tidak Diketahui";
                        layer.bindPopup(
                            `<b>Nama Objek:</b> ${nama}<br>` +
                            `<b>Jenis Objek:</b> Telekomunikasi<br>` +
                            `<img src="https://its.id/m/InventarisasiKEL2" alt="Foto Dokumentasi" style="max-width: 200px; height: auto;" onerror="this.src='https://via.placeholder.com/200x150?text=Foto+Tidak+Tersedia';">`
                        );
                    },
                });
                if (document.getElementById("toggle-inventarisasi").checked) {
                    telekomunikasiLayer.addTo(peta);
                }
            })
            .catch((error) => {
                console.error("Gagal memuat data Telekomunikasi:", error);
                showError("Tidak dapat memuat data Telekomunikasi. Silakan coba lagi nanti.");
            });
    }

    // Fungsi untuk mengambil dan menampilkan data Pariwisata
    function loadPariwisata() {
        fetch("api/api.php?type=pariwisata")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Gagal mengambil data Pariwisata dari API");
                }
                return response.json();
            })
            .then((data) => {
                pariwisataLayer = L.geoJSON(data, {
                    pointToLayer: function (feature, latlng) {
                        return L.marker(latlng, { icon: pariwisataIcon });
                    },
                    onEachFeature: function (feature, layer) {
                        const nama = feature.properties.Objek || "Tidak Diketahui";
                        layer.bindPopup(
                            `<b>Nama Objek:</b> ${nama}<br>` +
                            `<b>Jenis Objek:</b> Pariwisata<br>` +
                            `<img src="https://its.id/m/InventarisasiKEL2" alt="Foto Dokumentasi" style="max-width: 200px; height: auto;" onerror="this.src='https://via.placeholder.com/200x150?text=Foto+Tidak+Tersedia';">`
                        );
                    },
                });
                if (document.getElementById("toggle-inventarisasi").checked) {
                    pariwisataLayer.addTo(peta);
                }
            })
            .catch((error) => {
                console.error("Gagal memuat data Pariwisata:", error);
                showError("Tidak dapat memuat data Pariwisata. Silakan coba lagi nanti.");
            });
    }

    // Fungsi untuk mengambil dan menampilkan data Kebudayaan
    function loadKebudayaan() {
        fetch("api/api.php?type=kebudayaan")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Gagal mengambil data Kebudayaan dari API");
                }
                return response.json();
            })
            .then((data) => {
                kebudayaanLayer = L.geoJSON(data, {
                    pointToLayer: function (feature, latlng) {
                        return L.marker(latlng, { icon: kebudayaanIcon });
                    },
                    onEachFeature: function (feature, layer) {
                        const nama = feature.properties.Nama || "Tidak Diketahui";
                        layer.bindPopup(
                            `<b>Nama Objek:</b> ${nama}<br>` +
                            `<b>Jenis Objek:</b> Kebudayaan<br>` +
                            `<img src="https://its.id/m/InventarisasiKEL2" alt="Foto Dokumentasi" style="max-width: 200px; height: auto;" onerror="this.src='https://via.placeholder.com/200x150?text=Foto+Tidak+Tersedia';">`
                        );
                    },
                });
                if (document.getElementById("toggle-inventarisasi").checked) {
                    kebudayaanLayer.addTo(peta);
                }
            })
            .catch((error) => {
                console.error("Gagal memuat data Kebudayaan:", error);
                showError("Tidak dapat memuat data Kebudayaan. Silakan coba lagi nanti.");
            });
    }

    // Fungsi untuk mengambil dan menampilkan data Perhubungan
    function loadPerhubungan() {
        fetch("api/api.php?type=perhubungan")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Gagal mengambil data Perhubungan dari API");
                }
                return response.json();
            })
            .then((data) => {
                perhubunganLayer = L.geoJSON(data, {
                    pointToLayer: function (feature, latlng) {
                        return L.marker(latlng, { icon: perhubunganIcon });
                    },
                    onEachFeature: function (feature, layer) {
                        const nama = feature.properties.Objek || "Tidak Diketahui";
                        layer.bindPopup(
                            `<b>Nama Objek:</b> ${nama}<br>` +
                            `<b>Jenis Objek:</b> Perhubungan<br>` +
                            `<img src="https://its.id/m/InventarisasiKEL2" alt="Foto Dokumentasi" style="max-width: 200px; height: auto;" onerror="this.src='https://via.placeholder.com/200x150?text=Foto+Tidak+Tersedia';">`
                        );
                    },
                });
                if (document.getElementById("toggle-inventarisasi").checked) {
                    perhubunganLayer.addTo(peta);
                }
            })
            .catch((error) => {
                console.error("Gagal memuat data Perhubungan:", error);
                showError("Tidak dapat memuat data Perhubungan. Silakan coba lagi nanti.");
            });
    }

    // Muat data awal
    loadBatasKelurahan();
    loadBatasRw();
    loadBatasRt();
    loadBatasPatokBatasKeputih();
    loadSekolahNonFormal();
    loadTelekomunikasi();
    loadPariwisata();
    loadKebudayaan();
    loadPerhubungan();

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

    // Logika toggle untuk Inventarisasi (mengontrol semua layer inventarisasi)
    document.getElementById("toggle-inventarisasi").addEventListener("change", function () {
        if (this.checked) {
            if (sekolahNonFormalLayer) sekolahNonFormalLayer.addTo(peta);
            if (telekomunikasiLayer) telekomunikasiLayer.addTo(peta);
            if (pariwisataLayer) pariwisataLayer.addTo(peta);
            if (kebudayaanLayer) kebudayaanLayer.addTo(peta);
            if (perhubunganLayer) perhubunganLayer.addTo(peta);
        } else {
            if (sekolahNonFormalLayer) peta.removeLayer(sekolahNonFormalLayer);
            if (telekomunikasiLayer) peta.removeLayer(telekomunikasiLayer);
            if (pariwisataLayer) peta.removeLayer(pariwisataLayer);
            if (kebudayaanLayer) peta.removeLayer(kebudayaanLayer);
            if (perhubunganLayer) peta.removeLayer(perhubunganLayer);
        }
    });
});