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

