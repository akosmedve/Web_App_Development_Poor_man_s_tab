<?php
/*database connection basic*/
$host = "localhost";
$dbname = "poormansdatabase";
$user = "root";
$pass = "";
/*defining PDO*/
$conn = new PDO(
    "mysql:host=$host;dbname=$dbname;charset=utf8",
    $user,
    $pass
);

$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

?>