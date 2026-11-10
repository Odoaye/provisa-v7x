import { getDb } from "@workspace/db";
import {
  provisaFounderTable,
  provisaPostsTable,
  provisaStaffTable,
  provisaTestimonialsTable,
  type InsertProvisaFounder,
  type InsertProvisaPost,
  type InsertProvisaStaff,

} from "@workspace/db";
import { founderDescriptor, founderIntro, founderStory } from "../provisa/content-copy";

export const defaultFounder: InsertProvisaFounder = {
  id: "founder",
  name: "Mercy Allison",
  role: "Founder and Lead Consultant",
  descriptor: founderDescriptor,
  summary: founderIntro,
  fullWriteup: founderStory,
  image: "/stock/founder-mercy.jpg",
};

export const defaultStaff: InsertProvisaStaff[] = [
  {
    id: "staff-1",
    name: "Esther Youpele",
    role: "Research Analyst",
    bio: "Supports focused research and analysis for clear, well-positioned professional profiles.",
    image: "/stock/team-research-analysis.jpg",
  },
  {
    id: "louis-ebitari",
    name: "Louis Ebitari",
    role: "Operations Manager",
    bio: "Coordinates day-to-day operations to support an organized client experience.",
    image: "/no-profile-avatar.svg",
  },
];

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
  const hasLead = staff.some((member) => member.id === "staff-1");
  const currentStaff = staff
    .filter((member) => !["staff-2", "staff-3", "staff-4"].includes(member.id) && !(hasLead && member.id === "esther-youpele"))
    .map((member) => {
      if (member.id === "staff-1") {
        return {
          ...member,
          name: "Esther Youpele",
          role: "Research Analyst",
          bio: member.bio?.trim() || defaultStaff[0].bio,
          image: "/stock/team-research-analysis.jpg",
        };
      }
      if (member.id === "esther-youpele") {
        return {
          ...member,
          name: "Esther Youpele",
          role: "Research Analyst",
          bio: member.bio?.trim() || defaultStaff[0].bio,
          image: "/stock/team-research-analysis.jpg",
        };
      }
      return {
        ...member,
        bio:
          member.bio?.trim() ||
          defaultStaff.find((entry) => entry.role === member.role)?.bio ||
          "",
      };
    });
  const storedFounder = founders[0] ?? null;
  const founder =
    storedFounder?.role === "Global Master Strategist"
      ? { ...storedFounder, role: defaultFounder.role }
      : storedFounder;
  return { posts, staff: currentStaff, founder, testimonials };
}

export async function seedContent() {
  const existing = await getContent();
  const db = getDb();
  if (!existing.founder) {
    if (!existing.posts.length) await db.insert(provisaPostsTable).values(defaultPost);
    await db.insert(provisaFounderTable).values(defaultFounder);
  }
  if (!existing.staff.length) {
    await db.insert(provisaStaffTable).values(defaultStaff);
  } else if (existing.staff.length === 1 && existing.staff[0].id === "staff-1") {
    await db.insert(provisaStaffTable).values(defaultStaff.slice(1)).onConflictDoNothing();
  }
  return getContent();
}

type Row = Record<string, unknown>;

const str = (value: unknown) => (typeof value === "string" ? value : "");

// The admin page sends dates back as text (and sometimes extra fields).
// Keep only real columns and turn dates into Date objects, or the database rejects the save.
function toDate(value: unknown) {
  if (typeof value !== "string" && !(value instanceof Date)) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function cleanPost(row: Row) {
  const createdAt = toDate(row.createdAt);
  return {
    id: str(row.id) || `post-${Date.now()}`,
    title: str(row.title),
    excerpt: str(row.excerpt),
    body: str(row.body),
    image: str(row.image),
    publishAt: str(row.publishAt),
    expiresAt: str(row.expiresAt),
    ...(createdAt ? { createdAt } : {}),
  };
}

function cleanStaff(row: Row) {
  const createdAt = toDate(row.createdAt);
  return {
    id: str(row.id) || `staff-${Date.now()}`,
    name: str(row.name),
    role: str(row.role),
    bio: str(row.bio),
    image: str(row.image),
    ...(createdAt ? { createdAt } : {}),
  };
}

function cleanTestimonial(row: Row) {
  const createdAt = toDate(row.createdAt);
  return {
    id: str(row.id) || `testimonial-${Date.now()}`,
    quote: str(row.quote),
    image: str(row.image),
    attribution: str(row.attribution),
    ...(createdAt ? { createdAt } : {}),
  };
}

function cleanFounder(row: Row) {
  return {
    id: str(row.id) || "founder",
    name: str(row.name),
    role: str(row.role),
    descriptor: str(row.descriptor),
    summary: str(row.summary),
    fullWriteup: str(row.fullWriteup),
    image: str(row.image),
  };
}

const rows = (value: unknown) =>
  Array.isArray(value) ? value.filter((item): item is Row => !!item && typeof item === "object") : null;

export async function saveContent(payload: { posts?: unknown; staff?: unknown; founder?: unknown; testimonials?: unknown }) {
  const db = getDb();
  const posts = rows(payload.posts)?.map(cleanPost);
  const staff = rows(payload.staff)?.map(cleanStaff);
  const testimonials = rows(payload.testimonials)?.map(cleanTestimonial);
  const founder =
    payload.founder && typeof payload.founder === "object" ? cleanFounder(payload.founder as Row) : null;

  // One transaction: if any part fails, nothing is deleted.
  await db.transaction(async (tx) => {
    if (posts) {
      await tx.delete(provisaPostsTable);
      if (posts.length) await tx.insert(provisaPostsTable).values(posts);
    }
    if (staff) {
      await tx.delete(provisaStaffTable);
      if (staff.length) await tx.insert(provisaStaffTable).values(staff);
    }
    if (founder) {
      await tx.insert(provisaFounderTable).values(founder).onConflictDoUpdate({
        target: provisaFounderTable.id,
        set: { ...founder, updatedAt: new Date() },
      });
    }
    if (testimonials) {
      await tx.delete(provisaTestimonialsTable);
      if (testimonials.length) await tx.insert(provisaTestimonialsTable).values(testimonials);
    }
  });
  return getContent();
}
