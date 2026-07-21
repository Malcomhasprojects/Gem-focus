<?php
declare(strict_types=1);

$config = require __DIR__ . '/config.php';
$key = trim($_GET['key'] ?? '');
$hostNum = (int) ($_GET['n'] ?? 207);

header('Content-Type: text/plain; charset=utf-8');

if (!$key || !hash_equals(hash('sha256', (string) $config['admin_key']), hash('sha256', $key))) {
    http_response_code(403);
    echo "Forbidden\n";
    exit;
}

$host = "sql{$hostNum}.infinityfree.com";

try {
    $pdo = new PDO(
        sprintf('mysql:host=%s;charset=utf8mb4', $host),
        $config['db_user'],
        $config['db_pass'],
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_TIMEOUT => 3]
    );
    echo "AUTH OK: {$host}\n";
    try {
        $pdo = new PDO(
            sprintf('mysql:host=%s;dbname=%s;charset=utf8mb4', $host, $config['db_name']),
            $config['db_user'],
            $config['db_pass'],
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_TIMEOUT => 3]
        );
        echo "DB OK: {$config['db_name']}\n";
    } catch (Throwable $e) {
        echo "DB FAIL: " . $e->getMessage() . "\n";
    }
} catch (Throwable $e) {
    echo "AUTH FAIL {$host}: " . $e->getMessage() . "\n";
}
