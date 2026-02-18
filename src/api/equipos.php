<?php

require_once __DIR__ . '/../config/database.php';

header('Content-Type: application/json');

try {

    $pdo = Database::connect();

    $stmt = $pdo->query("
    SELECT e.id as id_equipo, e.nombre as nombre_equipo, e.categoria_id, c.nombre as nombre_categoria, e.pago_inscripcion, c.costo_inscripcion  
    FROM equipos e
    INNER JOIN categorias c on e.categoria_id = c.id 
    ORDER BY e.id
    ");
    echo json_encode($stmt->fetchAll());
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => $e->getMessage()
    ]);
}
