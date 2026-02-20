<?php

declare(strict_types=1);

error_reporting(E_ALL);
ini_set('display_errors', '1');

header('Content-Type: application/json');

require_once __DIR__ . '/../config/database.php';

try {

    $pdo = Database::connect();

    $stmt = $pdo->query("
        SELECT id as id_categoria, nombre, descripcion, color, costo_inscripcion, estado
        FROM categorias
        ORDER BY id
    ");

    echo json_encode(
        $stmt->fetchAll(PDO::FETCH_ASSOC)
    );
} catch (Throwable $e) {
    http_response_code(500);

    echo json_encode([
        'error' => $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine()
    ]);
}
