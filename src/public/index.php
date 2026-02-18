<?php

declare(strict_types=1);
require_once __DIR__ . '/../config/database.php';

error_reporting(E_ALL);
ini_set('display_errors', '1');

/*
|--------------------------------------------------------------------------
| CONFIGURACIÓN BASE
|--------------------------------------------------------------------------
*/

$modulo = $_GET['modulo'] ?? 'inicio';

$modulosPermitidos = [
    'inicio',
    'categorias',
    'equipos',
    'jugadores',
    'encuentros',
    'participaciones', //psoiblemente hay que eliminar
    'posiciones', // posiblemente hay que eliminar
    'reportes',
    'goleadores_general',
    'resultados' // analizar que no duplique lo que muestra Reportes o Goleadores General
];

// Si la condición es verdadera (es decir, si $modulo no es un módulo permitido), se asigna el valor 'inicio' a la variable $modulo. 
// Esto asegura que, si se intenta acceder a un módulo no permitido, el sistema redirige al módulo por defecto, que en este caso es 'inicio'.
if (!in_array($modulo, $modulosPermitidos)) {
    $modulo = 'inicio';
}

$viewFile = __DIR__ . "/../app/views/{$modulo}.php";

?>
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Sistema Soccer</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Base URL -->
    <base href="/">
    <!-- CSS -->
    <link rel="stylesheet" href="assets/css/app.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">

</head>

<body>
    <div class="app">
        <!-- SIDEBAR -->
        <aside class="sidebar">
            <div class="sidebar-header">
                <!--  -->
                <a href="?modulo=inicio"
                    class="menu-item <?= $modulo === 'inicio' ?: '' ?>">
                    ⚽ Soccer System CR
                </a>
            </div>
            <nav class="menu">
                <a href="?modulo=inicio"
                    class="menu-item <?= $modulo === 'inicio' ? 'active' : '' ?>">
                    Inicio
                </a>
                <a href="?modulo=categorias"
                    class="menu-item <?= $modulo === 'categorias' ? 'active' : '' ?>">
                    Categorias
                </a>
                <a href="?modulo=equipos"
                    class="menu-item <?= $modulo === 'equipos' ? 'active' : '' ?>">
                    Equipos
                </a>
                <a href="?modulo=jugadores"
                    class="menu-item <?= $modulo === 'jugadores' ? 'active' : '' ?>">
                    Jugadores
                </a>
                <a href="?modulo=encuentros"
                    class="menu-item <?= $modulo === 'encuentros' ? 'active' : '' ?>">
                    Encuentros
                </a>
                <a href="?modulo=participaciones"
                    class="menu-item <?= $modulo === 'participaciones' ? 'active' : '' ?>">
                    Participaciones
                </a>
                <a href="?modulo=posiciones"
                    class="menu-item <?= $modulo === 'posiciones' ? 'active' : '' ?>">
                    Posiciones
                </a>
                <a href="?modulo=reportes"
                    class="menu-item <?= $modulo === 'reportes' ? 'active' : '' ?>">
                    Reportes
                </a>
                <a href="?modulo=goleadores_general"
                    class="menu-item <?= $modulo === 'goleadores_general' ? 'active' : '' ?>">
                    Goleadores General
                </a>
                <a href="?modulo=resultados"
                    class="menu-item <?= $modulo === 'resultados' ? 'active' : '' ?>">
                    Resultados
                </a>
            </nav>
        </aside>

        <!-- MAIN -->
        <main class="main">

            <!-- HEADER -->
            <header class="header">
                <div>
                    <strong>Módulo:</strong>
                    <?= ucwords(str_replace('_', ' ', $modulo)) ?>
                </div>

                <div id="clock"></div>

                <div class="social-icons">
                    <a href="https://www.facebook.com" target="_blank" aria-label="Facebook">
                        <i class="fab fa-facebook-f"></i>
                    </a>
                    <a href="https://www.twitter.com" target="_blank" aria-label="Twitter">
                        <i class="fab fa-twitter"></i>
                    </a>
                    <a href="https://www.instagram.com" target="_blank" aria-label="Instagram">
                        <i class="fab fa-instagram"></i>
                    </a>
                    <a href="https://www.linkedin.com" target="_blank" aria-label="LinkedIn">
                        <i class="fab fa-linkedin-in"></i>
                    </a>
                    <a href="https://www.youtube.com" target="_blank" aria-label="YouTube">
                        <i class="fab fa-youtube"></i>
                    </a>
                    <a href="https://www.pinterest.com" target="_blank" aria-label="Pinterest">
                        <i class="fab fa-pinterest"></i>
                    </a>
                </div>
            </header>

            <!-- CONTENT -->
            <section class="content">
                <?php
                if (file_exists($viewFile)) {
                    require $viewFile;
                } else {
                    echo "<div class='card'>Vista no encontrada</div>";
                }
                ?>
            </section>

        </main>

    </div>

    <!-- JS -->
    <script src="assets/js/app.js"></script>

    </div>

</body>

<footer class="footer">
    <div class="container">
        <div class="footer-bottom">
            <p>&copy; 2026 Empresa Wilson Minchala B. Todos los derechos reservados.</p>
        </div>
    </div>
</footer>

</html>