import pg from 'pg';

const { Pool } = pg;

export const poll = new Pool({
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT!, 10),
  database: process.env.DATABASE_DB,
  ssl: { rejectUnauthorized: false },
});

export const PostgresHelper = {
  query: async (query, params) => {
    const client = await poll.connect();
    const results = await client.query(query, params);
    await client.release();
    return results.rows;
  },
};
