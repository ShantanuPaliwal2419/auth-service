import { userTable } from "./user";
import { pgTable, uuid,text, boolean, timestamp } from "drizzle-orm/pg-core";
export const refreshTokenTable = pgTable("refresh_tokens", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => userTable.id,{ onDelete:"cascade"}),
    token_hash:text("token_hash").notNull().unique(),
    revoked:boolean("revoked").default(false).notNull(),
    expires_at:timestamp("expires_at",{withTimezone:true}).notNull(),
    created_at:timestamp("created_at",{withTimezone:true}).defaultNow().notNull(),
    replaced_by_token:uuid("replaced_by_token"),
})