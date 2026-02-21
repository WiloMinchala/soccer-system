<?php
require_once __DIR__ . '/../config/database.php';
header('Content-Type: application/json');
try {
    $pdo = Database::connect();
    $stmt = $pdo->query("
        SELECT p.id, 
    j.nombres || ' ' || j.apellidos AS jugador, 
    e.nombre AS equipo,
    el.nombre || ' vs ' || ev.nombre AS encuentro, 
    en.fecha,
    CASE 
        WHEN p.tarjeta_amarilla = 1 THEN 'Amarilla'
        WHEN p.tarjeta_roja = 1 THEN 'Roja'
    END AS tipo_tarjeta,
    CASE 
        WHEN p.tarjeta_amarilla = 1 AND p.amarilla_pagada = 1 THEN 'Sí'
        WHEN p.tarjeta_roja = 1 AND p.roja_pagada = 1 THEN 'Sí'
        ELSE 'No'
    END AS pagada,
    p.estado
FROM participaciones p
JOIN jugadores j ON p.jugador_id = j.id
JOIN equipos e ON p.equipo_id = e.id
JOIN encuentros en ON p.encuentro_id = en.id
JOIN equipos el ON en.equipo_local_id = el.id
JOIN equipos ev ON en.equipo_visitante_id = ev.id
WHERE (p.tarjeta_amarilla = 1 OR p.tarjeta_roja = 1) 
ORDER BY en.categoria_id, en.fecha DESC
    ");
    echo json_encode($stmt->fetchAll());
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => $e->getMessage()
    ]);
}
