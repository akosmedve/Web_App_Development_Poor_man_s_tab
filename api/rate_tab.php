<?php
/*tab rating RW db*/
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

$tab_id = intval($data['tab_id'] ?? 0);
$rating = floatval($data['rating'] ?? 0);

if ($rating < 1 || $rating > 5) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid rating"
    ]);
    exit;
}

$stmt = $conn->prepare(
"INSERT INTO tab_ratings (user_id, tab_id, rating)
VALUES (?, ?, ?)
ON DUPLICATE KEY UPDATE rating = ?"
);

$ok = $stmt->execute([
    $_SESSION['user_id'],
    $tab_id,
    $rating,
    $rating
]);

echo json_encode([
    "success" => $ok
]);