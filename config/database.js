'use strict';

module.exports = ({ env }) => {
  const databaseUrl = env('DATABASE_URL'); // postgresql://russianhelicopters_user:oxUQ3V9qTZrGclw8VnCIjDyL0EJHYbZy@dpg-d2qmbf15pdvs738ch3qg-a/russianhelicopters

  if (databaseUrl) {
    // Прод: PostgreSQL
    return {
      connection: {
        client: 'postgres',
        connection: {
          connectionString: databaseUrl,
          ssl: env.bool('DATABASE_SSL', true) ? { rejectUnauthorized: false } : false,
        },
        pool: { min: 2, max: 10 },
        acquireConnectionTimeout: 60000,
      },
    };
  }

  // Локально: SQLite
  return {
    connection: {
      client: 'sqlite',
      connection: { filename: env('DATABASE_FILENAME', '.tmp/data.db') },
      useNullAsDefault: true,
    },
  };
};
