<?php
/*load user profile data*/
require 'db.php';

session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["error" => "Not logged in"]);
    exit;
}

$user_id = $_SESSION['user_id'];

$stmt = $conn->prepare("
    SELECT user_name, user_email
    FROM user_login_credentials
    WHERE user_id = ?
");
$stmt->execute([$user_id]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

$stmt2 = $conn->prepare("
    SELECT tab_id, song_title, artist_name
    FROM tablatures
    WHERE uploaded_by = ?
");
$stmt2->execute([$user_id]);
$tabs = $stmt2->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    "username" => $user['user_name'],
    "email" => $user['user_email'],
    "tabs" => $tabs
]);