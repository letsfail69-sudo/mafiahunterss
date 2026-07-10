<?php

declare(strict_types=1);

/*
 * Mafia Hunterss – veřejné statistiky hry
 *
 * Výstup:
 * https://mafiahunterss.eu/api/server-status.php
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Cache-Control: public, max-age=60');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

const GAME_URL = 'http://mafiahunterss.mafiacontrol.com/';
const CACHE_TIME_SECONDS = 60;
const REQUEST_TIMEOUT_SECONDS = 10;

$cacheDirectory = __DIR__ . '/cache';
$cacheFile = $cacheDirectory . '/server-status.json';

/**
 * Odešle JSON odpověď.
 */
function sendJson(array $data, int $statusCode = 200): never
{
    http_response_code($statusCode);

    echo json_encode(
        $data,
        JSON_UNESCAPED_UNICODE
        | JSON_UNESCAPED_SLASHES
        | JSON_PRETTY_PRINT
    );

    exit;
}

/**
 * Převede textové číslo jako "1 797" na integer 1797.
 */
function parseNumber(string $value): int
{
    $number = preg_replace('/[^\d]/u', '', $value);

    return $number !== null && $number !== ''
        ? (int) $number
        : 0;
}

/**
 * Načte herní stránku pomocí cURL.
 */
function downloadGamePage(string $url): string
{
    if (!function_exists('curl_init')) {
        throw new RuntimeException(
            'Na serveru není dostupné PHP rozšíření cURL.'
        );
    }

    $curl = curl_init();

    curl_setopt_array($curl, [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_MAXREDIRS => 5,
        CURLOPT_CONNECTTIMEOUT => REQUEST_TIMEOUT_SECONDS,
        CURLOPT_TIMEOUT => REQUEST_TIMEOUT_SECONDS,
        CURLOPT_ENCODING => '',
        CURLOPT_USERAGENT =>
            'MafiaHunterssStatusBot/1.0 (+https://mafiahunterss.eu)',
        CURLOPT_HTTPHEADER => [
            'Accept: text/html,application/xhtml+xml',
            'Accept-Language: cs,en;q=0.8',
        ],
    ]);

    $html = curl_exec($curl);

    if ($html === false) {
        $error = curl_error($curl);
        curl_close($curl);

        throw new RuntimeException(
            'Herní stránku se nepodařilo načíst: ' . $error
        );
    }

    $httpCode = (int) curl_getinfo($curl, CURLINFO_HTTP_CODE);
    curl_close($curl);

    if ($httpCode < 200 || $httpCode >= 400) {
        throw new RuntimeException(
            'Herní stránka vrátila HTTP kód ' . $httpCode . '.'
        );
    }

    return $html;
}

/**
 * Vytáhne veřejné statistiky z HTML stránky.
 */
function extractStatistics(string $html): array
{
    libxml_use_internal_errors(true);

    $document = new DOMDocument();

    $loaded = $document->loadHTML(
        '<?xml encoding="UTF-8">' . $html,
        LIBXML_NOERROR | LIBXML_NOWARNING
    );

    libxml_clear_errors();

    if (!$loaded) {
        throw new RuntimeException(
            'HTML herní stránky se nepodařilo zpracovat.'
        );
    }

    $xpath = new DOMXPath($document);

    $playersNode = $xpath
        ->query(
            "//*[contains(concat(' ', normalize-space(@class), ' '), " .
            "' outgame_stats_players ')]"
        )
        ?->item(0);

    $onlineNode = $xpath
        ->query(
            "//*[contains(concat(' ', normalize-space(@class), ' '), " .
            "' outgame_stats_online ')]"
        )
        ?->item(0);

    if (!$playersNode || !$onlineNode) {
        throw new RuntimeException(
            'Na herní stránce se nepodařilo najít statistiky hráčů.'
        );
    }

    $registeredText = trim($playersNode->textContent);
    $onlineText = trim($onlineNode->textContent);

    return [
        'registered' => parseNumber($registeredText),
        'online' => parseNumber($onlineText),
    ];
}

/**
 * Vrátí existující cache, pokud ještě není stará.
 */
function loadFreshCache(string $cacheFile): ?array
{
    if (!is_file($cacheFile)) {
        return null;
    }

    $age = time() - (int) filemtime($cacheFile);

    if ($age > CACHE_TIME_SECONDS) {
        return null;
    }

    $content = file_get_contents($cacheFile);

    if ($content === false) {
        return null;
    }

    $data = json_decode($content, true);

    return is_array($data) ? $data : null;
}

/**
 * Vrátí starou cache jako zálohu při nedostupnosti hry.
 */
function loadFallbackCache(string $cacheFile): ?array
{
    if (!is_file($cacheFile)) {
        return null;
    }

    $content = file_get_contents($cacheFile);

    if ($content === false) {
        return null;
    }

    $data = json_decode($content, true);

    return is_array($data) ? $data : null;
}

/**
 * Uloží výsledek do cache.
 */
function saveCache(
    string $cacheDirectory,
    string $cacheFile,
    array $data
): void {
    if (!is_dir($cacheDirectory)) {
        mkdir($cacheDirectory, 0755, true);
    }

    file_put_contents(
        $cacheFile,
        json_encode(
            $data,
            JSON_UNESCAPED_UNICODE
            | JSON_UNESCAPED_SLASHES
            | JSON_PRETTY_PRINT
        ),
        LOCK_EX
    );
}

$cachedData = loadFreshCache($cacheFile);

if ($cachedData !== null) {
    $cachedData['cache'] = true;
    sendJson($cachedData);
}

try {
    $html = downloadGamePage(GAME_URL);
    $statistics = extractStatistics($html);

    $response = [
        'success' => true,

        'server' => [
            'status' => 'online',
            'available' => true,
            'message' => 'Hra je dostupná.',
        ],

        'players' => [
            'registered' => $statistics['registered'],
            'online' => $statistics['online'],
        ],

        'game' => [
            'name' => 'Mafia Hunterss',
            'playUrl' => 'https://mafiahunterss.mafiacontrol.com/',
            'website' => 'https://mafiahunterss.eu/',
        ],

        'updatedAt' => gmdate('c'),
        'cache' => false,
    ];

    saveCache($cacheDirectory, $cacheFile, $response);
    sendJson($response);
} catch (Throwable $exception) {
    $fallback = loadFallbackCache($cacheFile);

    if ($fallback !== null) {
        $fallback['success'] = true;
        $fallback['cache'] = true;
        $fallback['stale'] = true;
        $fallback['warning'] =
            'Aktuální údaje se nepodařilo načíst. ' .
            'Zobrazuje se poslední uložený stav.';

        sendJson($fallback);
    }

    sendJson([
        'success' => false,

        'server' => [
            'status' => 'unknown',
            'available' => false,
            'message' => 'Stav hry se nepodařilo ověřit.',
        ],

        'players' => [
            'registered' => null,
            'online' => null,
        ],

        'error' => $exception->getMessage(),
        'updatedAt' => gmdate('c'),
    ], 503);
}
