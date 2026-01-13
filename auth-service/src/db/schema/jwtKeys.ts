import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
export const jwtKeysTable = pgTable("jwt_keys", {
  kid: varchar("kid", { length: 56 }).primaryKey(),

  publicKey: text("public_key").notNull(),
  privateKey: text("private_key").notNull(),

  algorithm: varchar("algorithm", { length: 10 }).notNull(), 

  status: varchar("status", { length: 10 })
    .$type<"ACTIVE" | "ROTATED" | "REVOKED">()
    .notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),

  expiresAt: timestamp("expires_at", { withTimezone: true }),
});
