<?php
declare(strict_types=1);

$requestPath = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);

if ($requestPath !== '/') {
    http_response_code(404);
    echo 'Página no encontrada.';
    exit;
}

require dirname(__DIR__) . '/app/Views/landing.php';
