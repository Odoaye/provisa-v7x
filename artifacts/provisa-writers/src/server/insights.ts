import { randomUUID } from "node:crypto";
import { getDb, sql } from "@workspace/db";

// These two tables are created on first use, so no manual database step is
// needed. Creating them never changes any existing table.
let tablesReady: Promise<void> | undefined;

function ensureTables() {
  tablesReady ??= (async () => {
    const db = getDb();
    await db.execute(sql`
      create table if not exists provisa_enquiries (
        id text primary key,
        name text not null,
        email text not null,
        service text not null default '',
        question text not null,
        created_at timestamptz not null default now()
      )
    `);
    await db.execute(sql`
      create table if not exists provisa_daily_visits (
        day date primary key,
        visits integer not null default 0
      )
    `);
  })().catch((error) => {
    tablesReady = undefined;
    throw error;
  });
  return tablesReady;
}

export type Enquiry = {
  id: string;
  name: string;
  email: string;
  service: string;
  question: string;
  createdAt: string;
};

const LIMITS = { name: 120, email: 200, service: 200, question: 4000 };
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function parseEnquiry(body: unknown):
  | { ok: true; value: Omit<Enquiry, "id" | "createdAt"> }
  | { ok: false; error: string } {
  if (!body || typeof body !== "object") return { ok: false, error: "Invalid enquiry." };
  const input = body as Record<string, unknown>;
  const text = (key: keyof typeof LIMITS) =>
    typeof input[key] === "string" ? (input[key] as string).trim() : "";
  const value = {
    name: text("name"),
    email: text("email"),
    service: text("service"),
    question: text("question"),
  };
  if (!value.name || !value.email || !value.question) {
    return { ok: false, error: "Please fill in your name, email and question." };
  }
  if (!EMAIL_PATTERN.test(value.email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }
  for (const key of Object.keys(LIMITS) as (keyof typeof LIMITS)[]) {
    if (value[key].length > LIMITS[key]) {
      return { ok: false, error: "Your message is too long. Please shorten it." };
    }
  }
  return { ok: true, value };
}

export async function saveEnquiry(value: Omit<Enquiry, "id" | "createdAt">) {
  await ensureTables();
  await getDb().execute(sql`
    insert into provisa_enquiries (id, name, email, service, question)
    values (${randomUUID()}, ${value.name}, ${value.email}, ${value.service}, ${value.question})
  `);
}

export async function listEnquiries(): Promise<Enquiry[]> {
  await ensureTables();
  const result = await getDb().execute(sql`
    select id, name, email, service, question, created_at
    from provisa_enquiries
    order by created_at desc
    limit 500
  `);
  return (result.rows as Record<string, unknown>[]).map((row) => ({
    id: String(row.id),
    name: String(row.name),
    email: String(row.email),
    service: String(row.service ?? ""),
    question: String(row.question),
    createdAt: new Date(row.created_at as string).toISOString(),
  }));
}

export async function deleteEnquiry(id: string) {
  await ensureTables();
  await getDb().execute(sql`delete from provisa_enquiries where id = ${id}`);
}

export async function recordVisit() {
  await ensureTables();
  await getDb().execute(sql`
    insert into provisa_daily_visits (day, visits)
    values ((now() at time zone 'Africa/Lagos')::date, 1)
    on conflict (day) do update set visits = provisa_daily_visits.visits + 1
  `);
}

export async function visitSummary() {
  await ensureTables();
  const result = await getDb().execute(sql`
    with today as (select (now() at time zone 'Africa/Lagos')::date as d)
    select
      coalesce(sum(visits) filter (where day = (select d from today)), 0)::int as today,
      coalesce(sum(visits) filter (where day > (select d from today) - 7), 0)::int as last7,
      coalesce(sum(visits) filter (where day > (select d from today) - 30), 0)::int as last30,
      coalesce(sum(visits), 0)::int as total,
      min(day)::text as since
    from provisa_daily_visits
  `);
  const daily = await getDb().execute(sql`
    select day::text as day, visits
    from provisa_daily_visits
    where day > (now() at time zone 'Africa/Lagos')::date - 14
    order by day asc
  `);
  const row = (result.rows[0] ?? {}) as Record<string, unknown>;
  return {
    today: Number(row.today ?? 0),
    last7: Number(row.last7 ?? 0),
    last30: Number(row.last30 ?? 0),
    total: Number(row.total ?? 0),
    since: row.since ? String(row.since) : null,
    daily: (daily.rows as Record<string, unknown>[]).map((entry) => ({
      day: String(entry.day),
      visits: Number(entry.visits),
    })),
  };
}

const hits = new Map<string, { count: number; resetAt: number }>();

// Best-effort limit per server instance, to slow down form spam.
export function tooManyRequests(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const current = hits.get(key);
  if (!current || current.resetAt < now) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  current.count += 1;
  return current.count > max;
}

export function clientIp(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}
