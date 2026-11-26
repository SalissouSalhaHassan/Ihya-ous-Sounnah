import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema/awqaf";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/manara_db",
});

export const db = drizzle(pool, { schema });
export * from "./schema/awqaf";
