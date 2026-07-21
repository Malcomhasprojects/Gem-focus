<?php
declare(strict_types=1);

$config = require __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: ' . ($_SERVER['HTTP_ORIGIN'] ?? '*'));
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

function json_response(mixed $data, int $status = 200): void {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function json_error(string $message, int $status = 400): void {
    json_response(['error' => $message], $status);
}

function db(array $config): PDO {
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }
    $dsn = sprintf(
        'mysql:host=%s;dbname=%s;charset=utf8mb4',
        $config['db_host'],
        $config['db_name']
    );
    $pdo = new PDO($dsn, $config['db_user'], $config['db_pass'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    return $pdo;
}

function map_issue(array $row): array {
    return [
        'id' => (int) $row['id'],
        'title' => $row['title'],
        'description' => $row['description'],
        'ward' => $row['ward'],
        'station' => $row['station'],
        'category' => $row['category'],
        'priority' => $row['priority'],
        'status' => $row['status'],
        'peopleCount' => (int) $row['people_count'],
        'reporterName' => $row['reporter_name'],
        'reporterPhone' => $row['reporter_phone'],
        'adminNotes' => $row['admin_notes'],
        'createdAt' => $row['created_at'],
        'updatedAt' => $row['updated_at'],
    ];
}

function map_event(array $row): array {
    return [
        'id' => (int) $row['id'],
        'title' => $row['title'],
        'ward' => $row['ward'],
        'venue' => $row['venue'],
        'eventDate' => $row['event_date'],
        'eventTime' => $row['event_time'],
        'objective' => $row['objective'],
        'status' => $row['status'],
        'attendance' => isset($row['attendance']) ? (int) $row['attendance'] : null,
        'expectedAttendance' => isset($row['expected_attendance']) ? (int) $row['expected_attendance'] : null,
        'createdAt' => $row['created_at'],
        'updatedAt' => $row['updated_at'],
    ];
}

function build_dashboard(array $issues): array {
    $total = array_sum(array_column($issues, 'peopleCount'));
    $resolved = array_sum(array_map(
        fn($x) => $x['status'] === 'resolved' ? $x['peopleCount'] : 0,
        $issues
    ));
    $inProgress = array_sum(array_map(
        fn($x) => $x['status'] === 'in-progress' ? $x['peopleCount'] : 0,
        $issues
    ));
    $wards = count(array_unique(array_column($issues, 'ward')));
    return [
        'rows' => $issues,
        'total' => $total,
        'resolved' => $resolved,
        'inProgress' => $inProgress,
        'wards' => $wards,
    ];
}

const ADMIN_COOKIE = 'gem_admin_session';

function admin_token(array $config): ?string {
    return $_COOKIE[ADMIN_COOKIE] ?? null;
}

function is_admin(array $config): bool {
    $expected = $config['admin_key'] ?? '';
    $token = admin_token($config);
    if (!$expected || !$token) {
        return false;
    }
    return hash_equals(hash('sha256', $expected), hash('sha256', $token));
}

function set_admin_cookie(array $config): void {
    setcookie(ADMIN_COOKIE, $config['admin_key'], [
        'expires' => time() + 60 * 60 * 8,
        'path' => '/',
        'httponly' => true,
        'samesite' => 'Lax',
        'secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
    ]);
}

function clear_admin_cookie(): void {
    setcookie(ADMIN_COOKIE, '', [
        'expires' => time() - 3600,
        'path' => '/',
        'httponly' => true,
        'samesite' => 'Lax',
        'secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
    ]);
}

function valid_key(array $config, string $value): bool {
    $expected = $config['admin_key'] ?? '';
    if (!$expected || !$value) {
        return false;
    }
    return hash_equals(hash('sha256', $expected), hash('sha256', $value));
}

const WARDS = ['Central Gem', 'East Gem', 'North Gem', 'South Gem', 'West Gem', 'Yala Township'];
const CATEGORIES = ['Water & sanitation', 'Roads & transport', 'Youth & employment', 'Health services', 'Education & bursaries', 'Agriculture', 'Security', 'Other'];
