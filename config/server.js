'use strict';

module.exports = ({ env }) => {
  // попробуем взять PUBLIC_URL или RENDER_EXTERNAL_URL
  const raw = env('PUBLIC_URL') || env('RENDER_EXTERNAL_URL');

  // безопасная валидация: если невалидный — не ставим вовсе
  const safeUrl = (() => {
    if (!raw) return undefined;
    try {
      const u = new URL(raw);
      // требуем https и без лишних пробелов
      if (u.protocol !== 'https:') return undefined;
      return u.toString().replace(/\/$/, ''); // без хвостового слеша
    } catch {
      return undefined;
    }
  })();

  return {
    host: env('HOST', '0.0.0.0'),
    port: env.int('PORT', 1337),
    app: { keys: env.array('APP_KEYS') },
    ...(safeUrl ? { url: safeUrl } : {}), // добавляем только если валиден
  };
};
