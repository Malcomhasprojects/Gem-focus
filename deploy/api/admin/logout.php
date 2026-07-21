<?php
declare(strict_types=1);

require __DIR__ . '/../bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_error('Method not allowed', 405);
}

clear_admin_cookie();
json_response(['ok' => true]);
