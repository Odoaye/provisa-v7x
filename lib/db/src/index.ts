import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

function createDb() {
  return drizzle(new Pool({ connectionString: process.env.DATABASE_URL }), { schema });
}

let database: ReturnType<typeof createDb> | undefined;

export function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
  }
  database ??= createDb();
  return database;
}

export * from "./schema";
