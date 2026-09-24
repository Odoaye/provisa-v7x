import { getDb } from "@workspace/db";
import {
  provisaFounderTable,
  provisaPostsTable,
  provisaStaffTable,
  type InsertProvisaFounder,
  type InsertProvisaPost,
  type InsertProvisaStaff,
} from "@workspace/db";

export const defaultFounder: InsertProvisaFounder = {
  id: "founder",
  name: "Mercy Allison",
  role: "Global Master Strategist",
  descriptor: "Legal Professional • Global Opportunities Strategist • Entrepreneur",
  summary: "Mercy Allison is a Nigerian legal professional, entrepreneur, and professional documentation strategist who works with highly skilled professionals pursuing international opportunities.\n\nWith expertise in law, legal research, U.S. legal support, client advisory, professional writing, case strategy, and team management, she specializes in evaluating professional profiles, identifying their value, and translating expertise and achievements into clear, strategic, and compelling documentation.",
  fullWriteup: "Mercy Allison is a Nigerian legal professional, entrepreneur, and professional documentation strategist with extensive experience supporting highly skilled professionals and experts pursuing international opportunities.\n\nSince 2023, she has worked with professionals across diverse fields, helping them assess their profiles, identify and organize evidence, strengthen their professional narratives, and develop compelling documentation for global migration and professional opportunities. Her experience spans legal research, U.S. legal support, client advisory, case strategy, professional writing, recommendation letters, petition documentation, supporting evidence, and quality control.\n\nThrough this work, Mercy has successfully supported numerous professional cases, developing a practical understanding of how expertise, achievements, evidence, and professional impact can be strategically presented to meet the requirements of significant international opportunities.\n\nShe founded Provisa Writers Ltd. to provide professionals with the research, strategic positioning, and professional documentation support needed to present their expertise effectively and pursue opportunities such as global skilled migration, conferences, fellowships, grants, speaking engagements, and other international opportunities.\n\nHer approach goes beyond writing. Mercy examines each professional’s experience and achievements, identifies the strongest elements of their profile, and translates them into clear, strategic, and persuasive documentation that strengthens how their expertise is presented.",
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
  const [posts, staff, founders] = await Promise.all([
    db.select().from(provisaPostsTable),
    db.select().from(provisaStaffTable),
    db.select().from(provisaFounderTable),
  ]);
  return { posts, staff, founder: founders[0] ?? null };
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

export async function saveContent(payload: { posts?: InsertProvisaPost[]; staff?: InsertProvisaStaff[]; founder?: InsertProvisaFounder }) {
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
  return getContent();
}