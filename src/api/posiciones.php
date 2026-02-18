<?php

require_once __DIR__ . '/../config/database.php';

header('Content-Type: application/json');

try {

    $pdo = Database::connect();

    $stmt = $pdo->query("
        SELECT id, categoria_id, equipo_id, puntos, partidos_jugados, partidos_ganados, partidos_empatados, partidos_perdidos, goles_a_favor, goles_en_contra, diferencia_goles 
        FROM posiciones
        ORDER BY id
    ");
    echo json_encode($stmt->fetchAll());
}
catch (Exception $e)
{
    http_response_code(500);
    echo json_encode([
        'error' => $e->getMessage()
    ]);
}
