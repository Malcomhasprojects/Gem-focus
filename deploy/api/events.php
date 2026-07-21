<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

$pdo = db($config);
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $rows = $pdo->query('SELECT * FROM campaign_events ORDER BY event_date DESC')->fetchAll();
    json_response(array_map('map_event', $rows));
}

if ($method === 'POST') {
    if (!is_admin($config)) {
        json_error('Unauthorized', 401);
    }

    $id = (int) ($_POST['id'] ?? 0);
    $title = trim($_POST['title'] ?? '');
    $ward = trim($_POST['ward'] ?? '');
    $venue = trim($_POST['venue'] ?? '');
    $eventDate = trim($_POST['eventDate'] ?? '');
    $eventTime = trim($_POST['eventTime'] ?? '');
    $objective = trim($_POST['objective'] ?? '');
    $status = trim($_POST['status'] ?? '') ?: 'scheduled';
    $attendance = ($_POST['attendance'] ?? '') !== '' ? (int) $_POST['attendance'] : null;
    $expectedAttendance = ($_POST['expectedAttendance'] ?? '') !== '' ? (int) $_POST['expectedAttendance'] : null;

    if (!$title || !$ward || !$venue || !$eventDate || !$eventTime) {
        json_error('Complete all required fields.');
    }

    if ($id > 0) {
        $stmt = $pdo->prepare(
            'UPDATE campaign_events
             SET title = ?, ward = ?, venue = ?, event_date = ?, event_time = ?, objective = ?, status = ?, attendance = ?, expected_attendance = ?
             WHERE id = ?'
        );
        $stmt->execute([$title, $ward, $venue, $eventDate, $eventTime, $objective, $status, $attendance, $expectedAttendance, $id]);
    } else {
        $stmt = $pdo->prepare(
            'INSERT INTO campaign_events (title, ward, venue, event_date, event_time, objective, status, attendance, expected_attendance)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([$title, $ward, $venue, $eventDate, $eventTime, $objective, $status, $attendance, $expectedAttendance]);
    }

    json_response(['ok' => true]);
}

if ($method === 'DELETE') {
    if (!is_admin($config)) {
        json_error('Unauthorized', 401);
    }

    $id = (int) ($_GET['id'] ?? 0);
    if ($id < 1) {
        json_error('Missing event id');
    }

    $stmt = $pdo->prepare('DELETE FROM campaign_events WHERE id = ?');
    $stmt->execute([$id]);
    json_response(['ok' => true]);
}

json_error('Method not allowed', 405);
