<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    header('Allow: POST');
    echo json_encode(['ok' => false, 'error' => 'Method not allowed.']);
    exit;
}

if ((int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 65536) {
    http_response_code(413);
    echo json_encode(['ok' => false, 'error' => 'Registration request is too large.']);
    exit;
}

$appsScriptUrl = 'https://script.google.com/macros/s/AKfycbzX8p4bNGWZ_AKu0wtKVtjDa28DkIE2MXSt_DB8BO-0WYZPJB93v6f89aINa4ZTeUtv/exec';

$allowedFields = [
    'formType', 'programId', 'sessionId', 'requestId', 'category', 'division',
    'athleteName', 'athleteDob', 'athletePosition', 'experienceYears',
    'parentName', 'parentEmail', 'parentPhone', 'comments', 'website', 'sourceUrl'
];

$payload = [];
foreach ($allowedFields as $field) {
    if (isset($_POST[$field]) && is_scalar($_POST[$field])) {
        $payload[$field] = (string)$_POST[$field];
    }
}

$encodedPayload = http_build_query($payload, '', '&', PHP_QUERY_RFC3986);

if (!function_exists('curl_init')) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Registration service is temporarily unavailable.']);
    exit;
}

$ch = curl_init($appsScriptUrl);
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $encodedPayload,
    CURLOPT_HTTPHEADER => ['Content-Type: application/x-www-form-urlencoded'],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_MAXREDIRS => 5,
    CURLOPT_CONNECTTIMEOUT => 10,
    CURLOPT_TIMEOUT => 40,
    CURLOPT_USERAGENT => 'AllianceVBC-Registration/1.0'
]);

$responseBody = curl_exec($ch);
$statusCode = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($responseBody === false || $curlError !== '') {
    http_response_code(502);
    echo json_encode(['ok' => false, 'error' => 'Registration service could not be reached. Please try again.']);
    exit;
}

$decoded = json_decode($responseBody, true);
if ($statusCode < 200 || $statusCode >= 300 || !is_array($decoded)) {
    http_response_code(502);
    echo json_encode(['ok' => false, 'error' => 'Registration service returned an invalid response. Please try again.']);
    exit;
}

http_response_code(!empty($decoded['ok']) ? 200 : 400);
echo json_encode($decoded, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
