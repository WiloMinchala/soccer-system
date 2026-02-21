<?php
require_once __DIR__ . '/../config/database.php';
header('Content-Type: application/json');
try {
    $pdo = Database::connect();
    $stmt = $pdo->query("
        SELECT 
            e.fecha,
            el.nombre as equipo_local, 
            CONCAT(e.goles_local, ' - ', e.goles_visitante) as resultado, 
            ev.nombre as equipo_visitante,
            e.pago_arbitraje_local, 
            e.pago_arbitraje_visitante,
            e.estado
        FROM encuentros e
        JOIN equipos el ON e.equipo_local_id = el.id
        JOIN equipos ev ON e.equipo_visitante_id = ev.id
        WHERE e.finalizado = 1
        ORDER BY e.fecha DESC
    ");
    echo json_encode($stmt->fetchAll());
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => $e->getMessage()
    ]);
}
