<?php
// Konfigurasi database
$host = 'localhost';
$user = 'root'; // Ganti dengan username database Anda
$pass = ''; // Ganti dengan password database Anda
$dbname = 'db_webgis'; // Ganti dengan nama database Anda

// Membuat koneksi
$conn = new mysqli($host, $user, $pass, $dbname);

// Cek koneksi
if ($conn->connect_error) {
    die("Koneksi gagal: " . $conn->connect_error);
}

// Mengatur charset ke utf8 untuk mendukung karakter khusus
$conn->set_charset("utf8");

?>