import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { schema } from "../db/schema/schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,                 // max concurrent connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

export const db = drizzle(pool,{schema:schema});

export async function testDatabaseConnection() {
  try {
    await pool.query("SELECT 1");
    console.log("Database connected ");
  } catch (err) {
    console.error("Database connection failed ", err);
    process.exit(1);
  }
}
