<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Cache-Control: public, max-age=3600");

$type = isset($_GET['type']) ? $_GET['type'] : '';
$allowedTypes = ['kelurahan', 'rw', 'rt', 'patok_batas_keputih'];

if (!in_array($type, $allowedTypes)) {
    http_response_code(400);
    echo json_encode(["message" => "Parameter 'type' tidak valid. Gunakan 'kelurahan', 'rw', 'rt', atau 'patok_batas_keputih'."]);
    exit;
}

$baseDir = __DIR__ . '/../database/';
$geojsonFile = '';

switch ($type) {
    case 'kelurahan':
        $geojsonFile = $baseDir . 'bataskelurahan.json';
        break;
    case 'rw':
        $geojsonFile = $baseDir . 'ALL_RW.json';
        break;
    case 'rt':
        $geojsonFile = $baseDir . 'ALLRT.json';
        break;
    case 'patok_batas_keputih':
        $geojsonFile = $baseDir . 'PatokBatasKeputih.json';
        break;
}

$geojsonFile = realpath($geojsonFile);
if ($geojsonFile === false || strpos($geojsonFile, realpath($baseDir)) !== 0) {
    http_response_code(400);
    echo json_encode(["message" => "Path file tidak valid"]);
    exit;
}

if (file_exists($geojsonFile)) {
    $geojsonData = file_get_contents($geojsonFile);
    $data = json_decode($geojsonData, true);

    if ($data !== null && isset($data['type']) && $data['type'] === 'FeatureCollection') {
        http_response_code(200);
        if (ob_start("ob_gzhandler")) {
            echo json_encode($data);
            ob_end_flush();
        } else {
            echo json_encode($data);
        }
    } else {
        error_log("Gagal memproses GeoJSON: " . json_last_error_msg() . " untuk file: $geojsonFile");
        http_response_code(500);
        echo json_encode([
            "message" => "File bukan GeoJSON FeatureCollection yang valid",
            "error" => json_last_error_msg()
        ]);
    }
} else {
    http_response_code(404);
    echo json_encode(["message" => "File GeoJSON tidak ditemukan"]);
}
?>