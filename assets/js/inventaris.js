document.addEventListener("DOMContentLoaded", function () {
    // Pastikan Leaflet tersedia
    if (typeof L === "undefined") {
        console.error("Leaflet tidak dimuat. Pastikan file leaflet.js dimuat sebelum inventaris.js");
        return;
    }

    // Pastikan elemen dengan ID inventarisasi ada
    const mapContainer = document.getElementById("inventarisasi");
    if (!mapContainer) {
        console.error("Elemen dengan ID 'inventarisasi' tidak ditemukan di DOM");
        return;
    }

    // Buat instance peta dan atur tampilan awal ke Surabaya, Indonesia
    const peta = L.map("inventarisasi").setView([-7.2575, 112.7521], 12);

    // Definisikan basemap OpenStreetMap
    const osmLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '© <a href="https://www.openstreetmap.org/copyright">Kontributor OpenStreetMap</a>',
    });

    // Definisikan basemap Imagery (Esri World Imagery)
    const imageryLayer = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
        maxZoom: 19,
        attribution: '© <a href="https://www.esri.com/">Esri</a>, Maxar, Earthstar Geographics, and the GIS User Community',
    });

    // Tambahkan Imagery sebagai basemap default
    imageryLayer.addTo(peta);

    // Tambahkan kontrol layer untuk memilih basemap
    const baseMaps = {
        "OpenStreetMap": osmLayer,
        "Imagery": imageryLayer
    };
    L.control.layers(baseMaps).addTo(peta);

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
        html: '<i class="fas fa-bus" style="color: black; font-size: 24px;"></i>',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
    });

    const pariwisataIcon = L.divIcon({
        className: "pariwisata-icon",
        html: '<i class="fa-solid fa-camera" style="color: black; font-size: 24px;"></i>',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
    });

    const telekomunikasiIcon = L.divIcon({
        className: "telekomunikasi-icon",
        html: '<i class="fa-solid fa-tower-cell" style="color: black; font-size: 24px;"></i>',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
    });

    const sekolahNonFormalIcon = L.divIcon({
        className: "sekolah-non-formal-icon",
        html: '<i class="fa-solid fa-book-open" style="color: black; font-size: 24px;"></i>',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
    });

    const kebudayaanIcon = L.divIcon({
        className: "kebudayaan-icon",
        html: '<i class="fa-solid fa-landmark" style="color: black; font-size: 24px;"></i>',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
    });

    // Lapisan untuk inventarisasi
    let sekolahNonFormalLayer = null;
    let telekomunikasiLayer = null;
    let pariwisataLayer = null;
    let kebudayaanLayer = null;
    let perhubunganLayer = null;

    // Fungsi untuk mengambil dan menampilkan data Sekolah Non-Formal
    function loadSekolahNonFormal() {
        fetch("api/api.php?type=sekolah_non_formal")
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                if (!data || !data.features || data.features.length === 0) {
                    throw new Error("Data kosong atau tidak valid");
                }
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
                if (document.getElementById("toggle-sekolah-non-formal").checked) {
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
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                if (!data || !data.features || data.features.length === 0) {
                    throw new Error("Data kosong atau tidak valid");
                }
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
                if (document.getElementById("toggle-telekomunikasi").checked) {
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
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                if (!data || !data.features || data.features.length === 0) {
                    throw new Error("Data kosong atau tidak valid");
                }
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
                if (document.getElementById("toggle-pariwisata").checked) {
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
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                if (!data || !data.features || data.features.length === 0) {
                    throw new Error("Data kosong atau tidak valid");
                }
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
                if (document.getElementById("toggle-kebudayaan").checked) {
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
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                if (!data || !data.features || data.features.length === 0) {
                    throw new Error("Data kosong atau tidak valid");
                }
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
                if (document.getElementById("toggle-perhubungan").checked) {
                    perhubunganLayer.addTo(peta);
                }
            })
            .catch((error) => {
                console.error("Gagal memuat data Perhubungan:", error);
                showError("Tidak dapat memuat data Perhubungan. Silakan coba lagi nanti.");
            });
    }

    // Muat data inventarisasi
    loadSekolahNonFormal();
    loadTelekomunikasi();
    loadPariwisata();
    loadKebudayaan();
    loadPerhubungan();

    // Logika toggle untuk setiap layer inventarisasi
    document.getElementById("toggle-kebudayaan").addEventListener("change", function () {
        if (this.checked) {
            if (kebudayaanLayer) kebudayaanLayer.addTo(peta);
        } else {
            if (kebudayaanLayer) peta.removeLayer(kebudayaanLayer);
        }
    });

    document.getElementById("toggle-perhubungan").addEventListener("change", function () {
        if (this.checked) {
            if (perhubunganLayer) perhubunganLayer.addTo(peta);
        } else {
            if (perhubunganLayer) peta.removeLayer(perhubunganLayer);
        }
    });

    document.getElementById("toggle-pariwisata").addEventListener("change", function () {
        if (this.checked) {
            if (pariwisataLayer) pariwisataLayer.addTo(peta);
        } else {
            if (pariwisataLayer) peta.removeLayer(pariwisataLayer);
        }
    });

    document.getElementById("toggle-telekomunikasi").addEventListener("change", function () {
        if (this.checked) {
            if (telekomunikasiLayer) telekomunikasiLayer.addTo(peta);
        } else {
            if (telekomunikasiLayer) peta.removeLayer(telekomunikasiLayer);
        }
    });

    document.getElementById("toggle-sekolah-non-formal").addEventListener("change", function () {
        if (this.checked) {
            if (sekolahNonFormalLayer) sekolahNonFormalLayer.addTo(peta);
        } else {
            if (sekolahNonFormalLayer) peta.removeLayer(sekolahNonFormalLayer);
        }
    });
});