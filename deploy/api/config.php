<?php
declare(strict_types=1);

$config = [
    'db_host' => getenv('DB_HOST') ?: 'sqlXXX.infinityfree.com',
    'db_user' => getenv('DB_USER') ?: 'if0_XXXXXXX',
    'db_pass' => getenv('DB_PASSWORD') ?: '',
    'db_name' => getenv('DB_NAME') ?: 'if0_XXXXXXX_gemfocus',
    'admin_key' => getenv('ADMIN_ACCESS_KEY') ?: '1111',
];

$local = __DIR__ . '/config.local.php';
if (is_file($local)) {
    $config = array_merge($config, require $local);
}

return $config;
