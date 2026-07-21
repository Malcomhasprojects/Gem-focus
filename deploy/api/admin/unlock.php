<?php
declare(strict_types=1);

require __DIR__ . '/../bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_error('Method not allowed', 405);
}

$key = trim($_POST['key'] ?? '');
if (!valid_key($config, $key)) {
    json_response(['ok' => false, 'message' => 'Incorrect access key.']);
}

set_admin_cookie($config);
json_response(['ok' => true, 'message' => 'Unlocked']);
