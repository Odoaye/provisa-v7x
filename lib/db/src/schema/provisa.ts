import { createInsertSchema } from "drizzle-zod";
import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const provisaPostsTable = pgTable("provisa_posts", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  body: text("body").notNull(),
  image: text("image").notNull(),
  publishAt: text("publish_at").notNull().default(""),
  expiresAt: text("expires_at").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const provisaStaffTable = pgTable("provisa_staff", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  bio: text("bio").notNull(),
  image: text("image").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const provisaFounderTable = pgTable("provisa_founder", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  descriptor: text("descriptor").notNull(),
  summary: text("summary").notNull(),
  fullWriteup: text("full_writeup").notNull(),
  image: text("image").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const provisaTestimonialsTable = pgTable("provisa_testimonials", {
  id: text("id").primaryKey(),
  quote: text("quote").notNull().default(""),
  image: text("image").notNull().default(""),
  attribution: text("attribution").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertProvisaPostSchema = createInsertSchema(provisaPostsTable).omit({
  createdAt: true,
});
export const insertProvisaStaffSchema = createInsertSchema(provisaStaffTable).omit({
  createdAt: true,
});
export const insertProvisaFounderSchema = createInsertSchema(provisaFounderTable).omit({
  updatedAt: true,
});
export const insertProvisaTestimonialSchema = createInsertSchema(provisaTestimonialsTable).omit({
  createdAt: true,
});

export type ProvisaPost = typeof provisaPostsTable.$inferSelect;
export type InsertProvisaPost = z.infer<typeof insertProvisaPostSchema>;
export type ProvisaStaff = typeof provisaStaffTable.$inferSelect;
export type InsertProvisaStaff = z.infer<typeof insertProvisaStaffSchema>;
export type ProvisaFounder = typeof provisaFounderTable.$inferSelect;
export type InsertProvisaFounder = z.infer<typeof insertProvisaFounderSchema>;
export type ProvisaTestimonial = typeof provisaTestimonialsTable.$inferSelect;
export type InsertProvisaTestimonial = z.infer<typeof insertProvisaTestimonialSchema>;