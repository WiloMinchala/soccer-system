<?php

require_once __DIR__ . '/../config/database.php';

header('Content-Type: application/json');

try {

    $pdo = Database::connect();

    $stmt = $pdo->query("
    SELECT j.id as id_jugador, j.cedula, j.nombres, j.apellidos, j.numero_camiseta, j.equipo_id, e.nombre as nombre_equipo, j.categoria_id, c.nombre as nombre_categoria, j.estado
    FROM jugadores j
    inner join equipos e on j.equipo_id = e.id
    inner join categorias c on j.categoria_id = c.id  
    ORDER BY j.categoria_id, j.equipo_id, j.id 
    ");
    echo json_encode($stmt->fetchAll());
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => $e->getMessage()
    ]);
}
