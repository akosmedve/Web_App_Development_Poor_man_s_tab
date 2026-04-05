<?php
/*delete uploaded tab*/
require 'db.php';
session_start();
header('Content-Type: application/json');

/*logincheck*/
if (!isset($_SESSION['user_id'])) {
    echo json_encode([
        "success" => false,
        "message" => "Not authorized"
    ]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$tab_id = $data['tab_id'] ?? null;

if (!$tab_id) {
    echo json_encode([
        "success" => false,
        "message" => "Missing tab_id"
    ]);
    exit;
}

$user_id = $_SESSION['user_id'];

/*check if user is uploader*/
$stmt = $conn->prepare("
    DELETE FROM tablatures 
    WHERE tab_id = ? AND uploaded_by = ?
");

$stmt->execute([$tab_id, $user_id]);

if ($stmt->rowCount() > 0) {
    echo json_encode([
        "success" => true,
        "message" => "Tab deleted"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Tab not found or not owned by user"
    ]);
}
error_log("TAB_ID: " . $tab_id);
error_log("USER_ID: " . $user_id);
echo json_encode([
    "success" => false,
    "debug_tab_id" => $tab_id,
    "debug_user_id" => $user_id
]);
exit;