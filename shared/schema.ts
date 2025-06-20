import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema for both suppliers and store managers
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  role: text("role").notNull(), // "supplier" or "storeManager"
  companyName: text("company_name"),
  storeId: integer("store_id"),
  lastLogin: timestamp("last_login"),
  profileImage: text("profile_image"),
});

// Store schema
export const stores = pgTable("stores", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  address: text("address").notNull(),
  contactPhone: text("contact_phone"),
  deliverySchedule: text("delivery_schedule"),
  lastDelivery: timestamp("last_delivery"),
  managerId: integer("manager_id"),
});

// Product schema
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  supplierId: integer("supplier_id").notNull(),
  quantity: integer("quantity").notNull(),
  status: text("status").notNull(), // "requested", "in_transit", "delayed"
  requestDate: timestamp("request_date").notNull(),
  deliveryDate: timestamp("delivery_date"),
  storeId: integer("store_id").notNull(),
});

// Chats schema
export const chats = pgTable("chats", {
  id: serial("id").primaryKey(),
  supplierId: integer("supplier_id").notNull(),
  storeManagerId: integer("store_manager_id").notNull(),
  lastMessageTime: timestamp("last_message_time").notNull(),
  unreadCount: integer("unread_count").notNull().default(0),
});

// Messages schema
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  chatId: integer("chat_id").notNull(),
  senderId: integer("sender_id").notNull(),
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").notNull(),
  isRead: boolean("is_read").notNull().default(false),
});

// Sales data for store managers
export const sales = pgTable("sales", {
  id: serial("id").primaryKey(),
  storeId: integer("store_id").notNull(),
  category: text("category").notNull(),
  amount: integer("amount").notNull(),
  date: timestamp("date").notNull(),
});

// Waste data for store managers
export const waste = pgTable("waste", {
  id: serial("id").primaryKey(),
  storeId: integer("store_id").notNull(),
  amount: integer("amount").notNull(),
  month: text("month").notNull(),
  year: integer("year").notNull(),
});

// Create Zod schemas for insertions
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  role: true,
  companyName: true,
  storeId: true,
});

export const insertStoreSchema = createInsertSchema(stores);
export const insertProductSchema = createInsertSchema(products);
export const insertChatSchema = createInsertSchema(chats);
export const insertMessageSchema = createInsertSchema(messages);
export const insertSaleSchema = createInsertSchema(sales);
export const insertWasteSchema = createInsertSchema(waste);

// Define types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Store = typeof stores.$inferSelect;
export type InsertStore = z.infer<typeof insertStoreSchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Chat = typeof chats.$inferSelect;
export type InsertChat = z.infer<typeof insertChatSchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export type Sale = typeof sales.$inferSelect;
export type InsertSale = z.infer<typeof insertSaleSchema>;

export type Waste = typeof waste.$inferSelect;
export type InsertWaste = z.infer<typeof insertWasteSchema>;

// Type for login data
export type LoginData = {
  userId: string;
  password: string;
  role: "supplier" | "storeManager";
};
