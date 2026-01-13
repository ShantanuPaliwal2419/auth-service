import { boolean, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const userTable =  pgTable("users",{
    id:uuid("id").primaryKey().defaultRandom(),
    name :varchar("name",{length:256}).notNull(),
    email:varchar("email",{length:256}).unique().notNull(),
    password:text("password").notNull(),
    isEmailVerified:boolean("isEmailVerified").default(false).notNull(),
    isActive:boolean("isActive").default(true).notNull(),
    created_at:timestamp("created_at",{withTimezone:true}).defaultNow().notNull(),
})