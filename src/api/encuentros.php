<?php

require_once __DIR__ . '/../config/database.php';

header('Content-Type: application/json');

try {

    $pdo = Database::connect();

    $stmt = $pdo->query("
        SELECT id, categoria_id, equipo_local_id, equipo_visitante_id, fecha, goles_local, goles_visitante, finalizado, pago_arbitraje_local, pago_arbitraje_visitante 
        FROM encuentros
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
