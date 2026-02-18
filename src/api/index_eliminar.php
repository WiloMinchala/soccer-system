<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';

header('Content-Type: application/json');

$pdo = Database::connect();

$path = $_SERVER['REQUEST_URI'];

$path = explode('/api/', $path)[1] ?? '';

$path = explode('?', $path)[0];

switch ($path)
{

    // case 'categorias':

    //     $stmt = $pdo->query("
    //         SELECT id, nombre, color
    //         FROM categorias
    //         ORDER BY id
    //     ");

    //     echo json_encode($stmt->fetchAll());

    //     break;

case 'categorias':

    if ($_SERVER['REQUEST_METHOD'] === 'GET')
    {

        $stmt = $pdo->query("
            SELECT id, nombre, color
            FROM categorias
            ORDER BY id
        ");
        echo('Wilson Minchala Bacuilima');
print_r($stmt->fetchAll());

        echo json_encode($stmt->fetchAll());

        exit;

    }


    if ($_SERVER['REQUEST_METHOD'] === 'POST')
    {

        $data = json_decode(file_get_contents("php://input"), true);

        $stmt = $pdo->prepare("
            INSERT INTO categorias (nombre, color)
            VALUES (?,?)
        ");

        $stmt->execute([
            $data['nombre'],
            $data['color']
        ]);

        echo json_encode([
            'success'=>true
        ]);

        exit;

    }


    if ($_SERVER['REQUEST_METHOD'] === 'PUT')
    {

        $data = json_decode(file_get_contents("php://input"), true);

        $stmt = $pdo->prepare("
            UPDATE categorias
            SET nombre=?, color=?
            WHERE id=?
        ");

        $stmt->execute([
            $data['nombre'],
            $data['color'],
            $data['id']
        ]);

        echo json_encode([
            'success'=>true
        ]);

        exit;

    }


    if ($_SERVER['REQUEST_METHOD'] === 'DELETE')
    {

        $data = json_decode(file_get_contents("php://input"), true);

        $stmt = $pdo->prepare("
            DELETE FROM categorias
            WHERE id=?
        ");

        $stmt->execute([
            $data['id']
        ]);

        echo json_encode([
            'success'=>true
        ]);

        exit;

    }

break;

    case 'equipos':

        $stmt = $pdo->query("
            SELECT id, nombre, categoria_id, costo_inscripcion
            FROM equipos
            ORDER BY id
        ");

        echo json_encode($stmt->fetchAll());

        break;


    case 'encuentros':

        $stmt = $pdo->query("
            SELECT id, categoria_id, equipo_local_id,
                   equipo_visitante_id, fecha,
                   goles_local, goles_visitante,
                   finalizado,
                   pago_arbitraje_local,
                   pago_arbitraje_visitante
            FROM encuentros
            ORDER BY fecha DESC
        ");

        echo json_encode($stmt->fetchAll());

        break;


    case 'jugadores':

        $stmt = $pdo->query("
            SELECT id, cedula, nombres, apellidos,
                   numero_camiseta, equipo_id, categoria_id
            FROM jugadores
            ORDER BY id
        ");

        echo json_encode($stmt->fetchAll());

        break;


    case 'participaciones':

        $stmt = $pdo->query("
            SELECT id, encuentro_id, jugador_id,
                   equipo_id, es_titular,
                   tarjeta_amarilla, tarjeta_roja,
                   goles,
                   amarilla_pagada, roja_pagada
            FROM participaciones
            ORDER BY id
        ");

        echo json_encode($stmt->fetchAll());

        break;


    case 'posiciones':

        $stmt = $pdo->query("
            SELECT id, categoria_id, equipo_id,
                   puntos, partidos_jugados,
                   partidos_ganados, partidos_empatados,
                   partidos_perdidos,
                   goles_a_favor, goles_en_contra,
                   diferencia_goles
            FROM posiciones
            ORDER BY puntos DESC
        ");

        echo json_encode($stmt->fetchAll());

        break;


    default:

        http_response_code(404);

        echo json_encode([
            'error' => 'Endpoint no encontrado'
        ]);

}
