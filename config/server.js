'use strict';

module.exports = ({ env }) => {
  const publicUrl = env('PUBLIC_URL'); // может быть undefined

  return {
    host: env('HOST', '0.0.0.0'),
    port: env.int('PORT', 1337),
    app: { keys: env.array('APP_KEYS') },

    // ВАЖНО: добавляем url только если он реально задан
    ...(publicUrl ? { url: publicUrl } : {}),
  };
};
