// app/lib/db.ts
import postgres from 'postgres';


// Evitar múltiples conexiones por HMR en dev
const globalForSql = global as unknown as { sql?: ReturnType<typeof postgres> };

export const sql =
  globalForSql.sql ??
  postgres(process.env.DATABASE_URL!, {
    max: 10,
    idle_timeout: 20,
    ssl: 'require', // Neon lo exige
  });

if (process.env.NODE_ENV !== 'production') globalForSql.sql = sql;

export default sql;


