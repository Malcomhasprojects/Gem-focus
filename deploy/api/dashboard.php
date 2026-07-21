<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_error('Method not allowed', 405);
}

$pdo = db($config);
$rows = $pdo->query('SELECT * FROM issues ORDER BY created_at DESC')->fetchAll();
$issues = array_map('map_issue', $rows);
json_response(build_dashboard($issues));
