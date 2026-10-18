import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

function getDatabaseUrl() {
  const connectionString =
    process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "SUPABASE_DATABASE_URL or DATABASE_URL must be set before accessing the database.",
    );
  }
  return connectionString;
}

function createDb() {
  return drizzle(
    new Pool({
      connectionString: getDatabaseUrl(),
      ...(process.env.SUPABASE_DATABASE_URL ? { max: 1 } : {}),
    }),
    { schema },
  );
}

let database: ReturnType<typeof createDb> | undefined;

export function getDb() {
  getDatabaseUrl();
  database ??= createDb();
  return database;
}

export * from "./schema";
