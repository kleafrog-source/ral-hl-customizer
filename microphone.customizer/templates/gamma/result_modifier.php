<?php
if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();

// Используем общий result_modifier из beta для получения HL данных
// Это обеспечивает единый источник данных для всех шаблонов
$betaPath = __DIR__ . '/../beta/result_modifier.php';
if (file_exists($betaPath)) {
    include($betaPath);
} else {
    // Fallback если beta не найден
    echo '<!-- Error: Beta result_modifier not found at ' . htmlspecialchars($betaPath) . ' -->';
}
?>
