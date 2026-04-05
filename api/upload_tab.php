<?php
/*upload tabs to db*/
require 'db.php';
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode([
        "success" => false,
        "message" => "Login required"
    ]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$song_title = trim($data['song_title'] ?? '');
$artist_name = trim($data['artist_name'] ?? '');
$tablature = trim($data['tablature'] ?? '');
$type = trim($data['type'] ?? 'Tab');

if (!$song_title || !$artist_name || !$tablature) {
    echo json_encode([
        "success" => false,
        "message" => "All fields required"
    ]);
    exit;
}

$stmt = $conn->prepare(
"INSERT INTO tablatures
(song_title, artist_name, tablature, type, uploaded_by)
VALUES (?, ?, ?, ?, ?)"
);

$ok = $stmt->execute([
    $song_title,
    $artist_name,
    $tablature,
    $type,
    $_SESSION['user_id']
]);

echo json_encode([
    "success" => $ok,
    "message" => $ok ? "Tab uploaded" : "Database error"
]);