<?php
declare(strict_types=1);

/**
 * One-time database setup on InfinityFree.
 * Visit /api/setup.php?key=YOUR_ADMIN_ACCESS_KEY then delete this file.
 */

$config = require __DIR__ . '/config.php';
$key = trim($_GET['key'] ?? '');

header('Content-Type: text/plain; charset=utf-8');

if (!$key || !hash_equals(hash('sha256', (string) $config['admin_key']), hash('sha256', $key))) {
    http_response_code(403);
    echo "Forbidden\n";
    exit;
}

$sqlFile = dirname(__DIR__) . '/schema.sql';
if (!is_file($sqlFile)) {
    http_response_code(500);
    echo "schema.sql not found\n";
    exit;
}

$dsn = sprintf(
    'mysql:host=%s;dbname=%s;charset=utf8mb4',
    $config['db_host'],
    $config['db_name']
);

try {
    $pdo = new PDO($dsn, $config['db_user'], $config['db_pass'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);
    $sql = file_get_contents($sqlFile);
    foreach (array_filter(array_map('trim', explode(';', $sql))) as $statement) {
        if ($statement !== '') {
            $pdo->exec($statement);
        }
    }
    echo "MySQL tables created.\nDelete api/setup.php and schema.sql from the server when done.\n";
} catch (Throwable $e) {
    http_response_code(500);
    echo 'Database error: ' . $e->getMessage() . "\n";
}
