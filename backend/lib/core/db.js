import { neon } from "@neondatabase/serverless";

let _sql = null;

export function db() {
  if (!_sql) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not set. Configure it in .env / your platform env vars.");
    }
    _sql = neon(process.env.DATABASE_URL);
  }
  return _sql;
}

export async function query(text, params = []) {
  return db()(text, ...params);
}

export async function runAs(userId, build) {
  const sql = db();
  const queries = build(sql);
  const isArray = Array.isArray(queries);
  const arr = isArray ? queries : [queries];

  const results = await sql.transaction([
    sql`SELECT set_config('app.current_user_id', ${userId}, true)`,
    ...arr,
  ]);

  const real = results.slice(1);
  return isArray ? real : real[0];
}