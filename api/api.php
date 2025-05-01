<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Cache-Control: public, max-age=3600");

$type = isset($_GET['type']) ? filter_var($_GET['type'], FILTER_SANITIZE_STRING) : '';
$geojsonFile = '';

if ($type === 'kelurahan') {
    $geojsonFile = "../database/bataskelurahan.json";
} elseif ($type === 'rw') {
    $geojsonFile = "../database/ALL_RW.json";
} else {
    http_response_code(400);
    echo json_encode(["message" => "Parameter 'type' tidak valid. Gunakan 'kelurahan' atau 'rw'."]);
    exit;
}

if (file_exists($geojsonFile)) {
    $geojsonData = file_get_contents($geojsonFile);
    $data = json_decode($geojsonData, true);
    
    if ($data !== null) {
        http_response_code(200);
        echo json_encode($data);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Gagal memproses data GeoJSON"]);
    }
} else {
    http_response_code(404);
    echo json_encode(["message" => "File GeoJSON tidak ditemukan"]);
}
?>