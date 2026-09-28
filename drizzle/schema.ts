import { int, json, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const hotmartEvents = mysqlTable("hotmart_events", {
  id: varchar("id", { length: 191 }).primaryKey(),
  event: varchar("event", { length: 96 }).notNull(),
  version: varchar("version", { length: 32 }).notNull(),
  productUcode: varchar("productUcode", { length: 191 }),
  productName: text("productName"),
  transactionId: varchar("transactionId", { length: 191 }),
  purchaseStatus: varchar("purchaseStatus", { length: 96 }),
  amount: varchar("amount", { length: 64 }),
  currency: varchar("currency", { length: 16 }),
  occurredAt: timestamp("occurredAt"),
  payload: json("payload").notNull(),
  receivedAt: timestamp("receivedAt").defaultNow().notNull(),
  processedAt: timestamp("processedAt"),
  processingError: text("processingError"),
});

export type HotmartEvent = typeof hotmartEvents.$inferSelect;
export type InsertHotmartEvent = typeof hotmartEvents.$inferInsert;

// TODO: Add your tables here
