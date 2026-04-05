<?php
/*delete user account*/
require 'db.php';
session_start();

$user_id = $_SESSION['user_id'] ?? 0;

$conn->prepare("DELETE FROM tablatures WHERE uploaded_by=?")
     ->execute([$user_id]);

$conn->prepare("DELETE FROM user_login_credentials WHERE user_id=?")
     ->execute([$user_id]);

session_destroy();

echo json_encode(["success" => true]);