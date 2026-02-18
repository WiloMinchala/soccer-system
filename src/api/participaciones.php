<?php

require_once __DIR__ . '/../config/database.php';

header('Content-Type: application/json');

try {

    $pdo = Database::connect();

    $stmt = $pdo->query("
        SELECT id, encuentro_id, jugador_id, equipo_id, es_titular, tarjeta_amarilla, tarjeta_roja, goles, amarilla_pagada, roja_pagada 
        FROM participaciones
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
