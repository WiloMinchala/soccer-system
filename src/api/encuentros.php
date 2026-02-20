<?php
require_once __DIR__ . '/../config/database.php';
header('Content-Type: application/json');
try {
    $pdo = Database::connect();
    $stmt = $pdo->query("
        SELECT e.id as id_encuentro, c.nombre as nombre_categoria, eq.nombre as equipo_local, e.goles_local, eq2.nombre as equipo_visitante, e.goles_visitante, e.fecha as fecha_hora_encuentro, e.finalizado, e.pago_arbitraje_local, e.pago_arbitraje_visitante, e.estado
        FROM encuentros e
        INNER JOIN categorias c on e.categoria_id = c.id 
        INNER JOIN equipos eq on e.equipo_local_id = eq.id 
        INNER JOIN equipos eq2 on e.equipo_visitante_id = eq2.id 
        ORDER BY e.id DESC
    ");
    echo json_encode($stmt->fetchAll());
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => $e->getMessage()
    ]);
}
