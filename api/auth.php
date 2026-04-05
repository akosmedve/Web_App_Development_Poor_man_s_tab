<?php
/*Login authentificator */
require 'db.php';
session_start();
header('Content-Type: application/json');

$action = $_GET['action'] ?? '';

if ($action === 'login') {

    $data = json_decode(file_get_contents("php://input"), true);

    $username = $data['username'] ?? '';
    $password = $data['password'] ?? '';

    $stmt = $conn->prepare("SELECT user_id, user_password FROM user_login_credentials WHERE user_name = ?");
    $stmt->execute([$username]);

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['user_password'])) {

        $_SESSION['user_id'] = $user['user_id'];
        $_SESSION['user_name'] = $username;

        echo json_encode([
            "success" => true,
            "username" => $username
        ]);

    } else {

        echo json_encode([
            "success" => false
        ]);
    }

}
elseif ($action === 'register') {

    $data = json_decode(file_get_contents("php://input"), true);

    $username = trim($data['username'] ?? '');
    $password = trim($data['password'] ?? '');
    $email = trim($data['email'] ?? '');

if (!$username || !$password || !$email) {
    echo json_encode([
        "success" => false,
        "message" => "All fields required"
    ]);
    exit;
}

/*validate email format*/
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid email"
    ]);
    exit;
}

/*Check username OR email exists*/
$stmt = $conn->prepare("
    SELECT user_id FROM user_login_credentials 
    WHERE user_name = ? OR user_email = ?
");

$stmt->execute([$username, $email]);

if ($stmt->fetch()) {
    echo json_encode([
        "success" => false,
        "message" => "Username or email already exists"
    ]);
    exit;
}
/*hashing password*/
$hash = password_hash($password, PASSWORD_DEFAULT);

/*Insert*/
$stmt = $conn->prepare("
    INSERT INTO user_login_credentials (user_name, user_email, user_password)
    VALUES (?, ?, ?)
");

$stmt->execute([$username, $email, $hash]);
    echo json_encode([
        "success" => true
    ]);
}

elseif ($action === 'logout') {

   $_SESSION = [];
session_destroy();

    echo json_encode(["success" => true]);

}

elseif ($action === 'status') {

    if (isset($_SESSION['user_id'])) {

        echo json_encode([
            "loggedIn" => true,
            "username" => $_SESSION['user_name']
        ]);

    } else {

        echo json_encode([
            "loggedIn" => false
        ]);
    }


}