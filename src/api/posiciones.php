<?php
require_once __DIR__ . '/../config/database.php';
header('Content-Type: application/json');
try {
    $pdo = Database::connect();
    $stmt = $pdo->query("
        SELECT p.id, c.nombre as nombre_categoria, e.nombre as equipo_nombre , p.partidos_jugados, p.partidos_ganados, p.partidos_empatados, p.partidos_perdidos, p.goles_a_favor, p.goles_en_contra, p.diferencia_goles, p.puntos
        FROM posiciones p
        INNER JOIN equipos e ON p.equipo_id = e.id
        INNER JOIN categorias c on p.categoria_id = c.id 
        ORDER BY p.categoria_id, p.puntos DESC, p.diferencia_goles DESC, p.goles_a_favor DESC
    ");
    echo json_encode($stmt->fetchAll());
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => $e->getMessage()
    ]);
}
