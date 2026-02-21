<?php
require_once __DIR__ . '/../config/database.php';
header('Content-Type: application/json');
try {
    $pdo = Database::connect();
    $stmt = $pdo->query("
            SELECT 
                c.nombre as nombre_categoria,
                CONCAT(j.nombres, ' ', j.apellidos) AS jugador, 
                e.nombre AS equipo, 
                SUM(p.goles) AS total_goles
            FROM participaciones p
            JOIN jugadores j ON p.jugador_id = j.id
            JOIN equipos e ON p.equipo_id = e.id
            JOIN encuentros en ON p.encuentro_id = en.id
            JOIN categorias c on j.categoria_id = c.id
            GROUP BY j.id, j.nombres, j.apellidos, e.nombre
            HAVING total_goles > 0
            ORDER BY c.id, total_goles DESC
    ");
    echo json_encode($stmt->fetchAll());
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => $e->getMessage()
    ]);
}
