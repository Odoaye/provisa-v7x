import { getDb } from "@workspace/db";
import {
  provisaFounderTable,
  provisaPostsTable,
  provisaStaffTable,
  provisaTestimonialsTable,
  type InsertProvisaFounder,
  type InsertProvisaPost,
  type InsertProvisaStaff,
  type InsertProvisaTestimonial,
} from "@workspace/db";
import { founderDescriptor, founderIntro, founderStory } from "../provisa/content-copy";

export const defaultFounder: InsertProvisaFounder = {
  id: "founder",
  name: "Mercy Allison",
  role: "Global Master Strategist",
  descriptor: founderDescriptor,
  summary: founderIntro,
  fullWriteup: founderStory,
  image: "/stock/founder-mercy.jpg",
};

export const defaultStaff: InsertProvisaStaff = {
  id: "staff-1",
  name: "Research Analysis Team Lead",
  role: "Research & analysis",
  bio: "The research lens: turning complex information into clear findings, useful context and stronger decisions.",
  image: "/stock/team-research-analysis.jpg",
};

export const defaultPost: InsertProvisaPost = {
  id: "first-field-note",
  title: "What makes a professional profile travel well?",
  excerpt: "A short field note on clarity, context and the evidence behind a strong professional record.",
  body: "A profile becomes more useful when the reader can understand not only what happened, but why it mattered. Start with the contribution, then arrange the proof around it.",
  image: "/provisa-record.jpg",
  publishAt: "",
  expiresAt: "",
};

export async function getContent() {
  const db = getDb();
  const [posts, staff, founders, testimonials] = await Promise.all([
    db.select().from(provisaPostsTable),
    db.select().from(provisaStaffTable),
    db.select().from(provisaFounderTable),
    db.select().from(provisaTestimonialsTable),
  ]);
  return { posts, staff, founder: founders[0] ?? null, testimonials };
}

export async function seedContent() {
  const existing = await getContent();
  if (!existing.founder) {
    const db = getDb();
    if (!existing.posts.length) await db.insert(provisaPostsTable).values(defaultPost);
    if (!existing.staff.length) await db.insert(provisaStaffTable).values(defaultStaff);
    await db.insert(provisaFounderTable).values(defaultFounder);
  }
  return getContent();
}

export async function saveContent(payload: { posts?: InsertProvisaPost[]; staff?: InsertProvisaStaff[]; founder?: InsertProvisaFounder; testimonials?: InsertProvisaTestimonial[] }) {
  const db = getDb();
  if (payload.posts) {
    await db.delete(provisaPostsTable);
    if (payload.posts.length) await db.insert(provisaPostsTable).values(payload.posts);
  }
  if (payload.staff) {
    await db.delete(provisaStaffTable);
    if (payload.staff.length) await db.insert(provisaStaffTable).values(payload.staff);
  }
  if (payload.founder) {
    await db.insert(provisaFounderTable).values(payload.founder).onConflictDoUpdate({
      target: provisaFounderTable.id,
      set: { ...payload.founder, updatedAt: new Date() },
    });
  }
  if (payload.testimonials) {
    await db.transaction(async (transaction) => {
      await transaction.delete(provisaTestimonialsTable);
      if (payload.testimonials!.length) {
        await transaction.insert(provisaTestimonialsTable).values(payload.testimonials!);
      }
    });
  }
  return getContent();
}