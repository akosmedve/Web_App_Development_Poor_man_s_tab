<?php
/*load tabs from db*/
session_start();

require 'db.php';
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {

    $search = $_GET['search'] ?? '';
    $id = $_GET['id'] ?? '';

    /*SINGLE TAB*/
    
    if ($id) {

        $stmt = $conn->prepare("
            SELECT 
                t.tab_id,
                t.artist_name,
                t.song_title,
                t.tablature,
                t.uploaded_by,
                ROUND(AVG(r.rating),1) AS rating
            FROM tablatures t
            LEFT JOIN tab_ratings r ON t.tab_id = r.tab_id
            WHERE t.tab_id = ?
            GROUP BY t.tab_id, t.artist_name, t.song_title, t.tablature, t.uploaded_by
        ");

        $stmt->execute([$id]);
        $tab = $stmt->fetch(PDO::FETCH_ASSOC);

        /*Add user rating*/
        $user_id = $_SESSION['user_id'] ?? 0;

        if ($user_id && $tab) {
            $stmt2 = $conn->prepare("
                SELECT rating FROM tab_ratings 
                WHERE user_id = ? AND tab_id = ?
            ");
            $stmt2->execute([$user_id, $id]);
            $tab['user_rating'] = $stmt2->fetchColumn() ?: 0;
        } else {
            $tab['user_rating'] = 0;
        }

        echo json_encode($tab ?: []);
    }

    /*search*/

    else if ($search) {

        $stmt = $conn->prepare("
            SELECT 
                t.tab_id,
                t.artist_name,
                t.song_title,
                t.uploaded_by,
                ROUND(AVG(r.rating),1) AS rating
            FROM tablatures t
            LEFT JOIN tab_ratings r ON t.tab_id = r.tab_id
            WHERE t.song_title LIKE ? OR t.artist_name LIKE ?
            GROUP BY t.tab_id, t.artist_name, t.song_title, t.uploaded_by
            ORDER BY t.date_of_creation DESC
        ");

        $stmt->execute(["%$search%", "%$search%"]);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    /*ALL TABS*/

    else {

        $stmt = $conn->query("
            SELECT 
                t.tab_id,
                t.artist_name,
                t.song_title,
                t.uploaded_by,
                ROUND(AVG(r.rating),1) AS rating
            FROM tablatures t
            LEFT JOIN tab_ratings r ON t.tab_id = r.tab_id
            GROUP BY t.tab_id, t.artist_name, t.song_title, t.uploaded_by
            ORDER BY t.date_of_creation DESC
        ");

        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    }
} 