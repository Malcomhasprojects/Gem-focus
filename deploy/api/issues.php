<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

$pdo = db($config);
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $rows = $pdo->query('SELECT * FROM issues ORDER BY created_at DESC')->fetchAll();
    json_response(array_map('map_issue', $rows));
}

if ($method === 'POST') {
    $title = trim($_POST['title'] ?? '');
    $description = trim($_POST['description'] ?? '');
    $ward = trim($_POST['ward'] ?? '');
    $category = trim($_POST['category'] ?? '');
    $peopleCount = (int) ($_POST['peopleCount'] ?? 0);

    if (
        strlen($title) < 5 ||
        strlen($description) < 10 ||
        !in_array($ward, WARDS, true) ||
        !in_array($category, CATEGORIES, true) ||
        $peopleCount < 1
    ) {
        json_error('Please provide valid issue details.');
    }

    $stmt = $pdo->prepare(
        'INSERT INTO issues (title, description, ward, station, category, people_count, reporter_name, reporter_phone)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([
        $title,
        $description,
        $ward,
        trim($_POST['station'] ?? '') ?: null,
        $category,
        $peopleCount,
        trim($_POST['reporterName'] ?? '') ?: null,
        trim($_POST['reporterPhone'] ?? '') ?: null,
    ]);

    json_response(['ok' => true]);
}

json_error('Method not allowed', 405);
