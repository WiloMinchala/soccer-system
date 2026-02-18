<?php

declare(strict_types=1);

class Env
{
  private static array $vars = [];

  public static function load(string $path): void
  {
    if (!file_exists($path))
      throw new Exception(".env no encontrado");

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

    foreach ($lines as $line) {
      if (str_starts_with(trim($line), '#'))
        continue;

      [$key, $value] = explode('=', $line, 2);

      self::$vars[$key] = trim($value, "\"'");
    }
  }

  public static function get(string $key, $default = null)
  {
    return self::$vars[$key] ?? $default;
  }
}
