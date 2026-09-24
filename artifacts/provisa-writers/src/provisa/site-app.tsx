'use client';

import { type ChangeEvent, type FormEvent, type ReactNode, type TouchEvent, useEffect, useState } from 'react';
import {
  ArrowRight,
  ArrowUp,
  BookOpen,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  ClipboardCheck,
  Eye,
  EyeOff,
  Globe2,
  ImagePlus,
  LogOut,
  Mail,
  Menu,
  MessageCircle,
  Pencil,
  Plus,
  Sparkles,
  Trash2,
  Users,
  UserPlus,
  X,
} from 'lucide-react';
import { ErrorBoundary } from './error-boundary';
import NotFound from './not-found-view';
import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter';

const BLOG_STORAGE_KEY = 'provisa-template-2-blog-posts';
const STAFF_STORAGE_KEY = 'provisa-template-2-staff';

const assetPath = (path: string) => {
  if (path.startsWith('data:') || path.startsWith('http') || path.startsWith('/')) return path;
  return `/${path.replace(/^\/+/, '')}`;
};

const routePath = (path: string) => path.startsWith('/') ? path : `/${path}`;
const firstParagraph = (text: string) => text.split(/\n\s*\n/)[0]?.trim() || '';

type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  body: string;
  image: string;
  publishAt: string;
  expiresAt: string;
  createdAt: string;
};

const services = [
  {
    title: 'U.S. Skilled Worker Migration',
    description: 'Professional support for skilled workers exploring U.S. migration pathways.',
    offerings: [
      'Profile Assessment',
      'Profile Building',
      'EB-1A Application Support',
      'EB-2 NIW Application Support',
    ],
  },
  {
    title: 'Global Opportunities Consulting',
    description:
      'We connect professionals to global opportunities including speaking engagements, grants, conferences, fellowships, awards, and more, alongside Global Skilled Worker Migration Consulting for professionals exploring international career and migration pathways.',
    offerings: [],
  },
  {
    title: 'Visa Application Support',
    description: 'Professional support with preparing visa applications.',
    offerings: [],
  },
];

const people = [
  ['Healthcare & Life Sciences', 'Physicians, dentists, pharmacists, nurses, public health professionals, biomedical professionals and other healthcare specialists.'],
  ['Science, Engineering & Technology', 'Scientists, researchers, engineers, software professionals, data scientists, technologists and innovators.'],
  ['Academia, Education & Research', 'Professors, lecturers, educators, academic researchers, scholars and education professionals.'],
  ['Business, Finance & Entrepreneurship', 'Founders, entrepreneurs, executives, business leaders, economists, finance professionals and management professionals.'],
  ['Law, Policy & Professional Services', 'Lawyers, consultants, analysts, policy professionals, accountants and other specialized professional-services practitioners.'],
  ['Arts, Media, Communications & Creative Industries', 'Writers, journalists, artists, designers, media professionals, communicators and other creative professionals.'],
  ['Social Sciences & Public Impact', 'Social scientists, development professionals, NGO leaders, public-sector professionals, community leaders and specialists whose work creates broader social impact.'],
];

const approachStages = [
  ['Discover', 'Identify relevant international opportunities.'],
  ['Position', 'Present qualifications, achievements and professional value.'],
  ['Pursue', 'Move forward independently or with Provisa support.'],
];

const founderProfile = {
  name: 'Mercy Allison',
  role: 'Global Master Strategist',
  descriptor: 'Legal Professional • Global Opportunities Strategist • Entrepreneur',
  image: '/stock/founder-mercy.jpg',
  summary: [
    'Mercy Allison is a Nigerian legal professional, entrepreneur, and professional documentation strategist who works with highly skilled professionals pursuing international opportunities.',
    'With expertise in law, legal research, U.S. legal support, client advisory, professional writing, case strategy, and team management, she specializes in evaluating professional profiles, identifying their value, and translating expertise and achievements into clear, strategic, and compelling documentation.',
  ],
  paragraphs: [
    'Mercy Allison is a Nigerian legal professional, entrepreneur, and professional documentation strategist with extensive experience supporting highly skilled professionals and experts pursuing international opportunities.',
    'Since 2023, she has worked with professionals across diverse fields, helping them assess their profiles, identify and organize evidence, strengthen their professional narratives, and develop compelling documentation for global migration and professional opportunities. Her experience spans legal research, U.S. legal support, client advisory, case strategy, professional writing, recommendation letters, petition documentation, supporting evidence, and quality control.',
    'Through this work, Mercy has successfully supported numerous professional cases, developing a practical understanding of how expertise, achievements, evidence, and professional impact can be strategically presented to meet the requirements of significant international opportunities.',
    'She founded Provisa Writers Ltd. to provide professionals with the research, strategic positioning, and professional documentation support needed to present their expertise effectively and pursue opportunities such as global skilled migration, conferences, fellowships, grants, speaking engagements, and other international opportunities.',
    'Her approach goes beyond writing. Mercy examines each professional’s experience and achievements, identifies the strongest elements of their profile, and translates them into clear, strategic, and persuasive documentation that strengthens how their expertise is presented.',
  ],
};

const companyValues = [
  ['Access', 'We make valuable global opportunities easier to discover, understand, and pursue.'],
  ['Strategic Excellence', 'We combine research, insight, and strategy to deliver work that creates meaningful professional value.'],
  ['Integrity', 'We operate with honesty, transparency, confidentiality, and accountability in every engagement.'],
  ['Professional Impact', 'We help professionals communicate their expertise, achievements, and value with clarity and credibility.'],
  ['Opportunity', 'We connect expertise with opportunities that enable professionals to grow, contribute, and advance globally.'],
];

const seedTeam = [
  {
    name: 'Research Analysis Team Lead',
    role: 'Research & analysis',
    image: '/stock/team-research-analysis.jpg',
    text: 'The research lens: turning complex information into clear findings, useful context and stronger decisions.',
  },
];

type StaffMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
};

const seedStaff: StaffMember[] = seedTeam.map((member, index) => ({
  id: `staff-${index + 1}`,
  name: member.name,
  role: member.role,
  bio: member.text,
  image: member.image,
}));

const navItems = [
  ['About Us', 'about'],
  ['Meet the Team', 'team'],
  ['Our Services', 'services'],
  ['Results', 'results'],
  ['Contact Us', 'contact'],
];

const seedPosts: BlogPost[] = [
  {
    id: 'first-field-note',
    title: 'What makes a professional profile travel well?',
    excerpt: 'A short field note on clarity, context and the evidence behind a strong professional record.',
    body: 'A profile becomes more useful when the reader can understand not only what happened, but why it mattered. Start with the contribution, then arrange the proof around it.',
    image: assetPath('/provisa-record.jpg'),
    publishAt: '',
    expiresAt: '',
    createdAt: '2026-09-03T00:00:00.000Z',
  },
];

const faqs = [
  ['What is Provisa?', 'Provisa is a global professional services firm that helps accomplished professionals strategically present their expertise, achievements and impact for international opportunities, recognition and professional mobility.'],
  ['Who is Provisa for?', 'We work with professionals, entrepreneurs, researchers, executives and other accomplished individuals seeking to expand their professional reach internationally.'],
  ['What kinds of opportunities can Provisa help me pursue?', 'Depending on your profile, we may help you pursue global career and mobility pathways, international conferences, fellowships, professional memberships, recognition opportunities and other international professional opportunities.'],
  ['Does Provisa only work on U.S. immigration?', 'No. U.S. immigration pathways are one area of our work. Our broader focus is helping professionals translate their achievements into credible global opportunities.'],
  ['Do I need to already be highly accomplished to work with Provisa?', 'Our services are designed primarily for professionals with meaningful education, expertise, achievements or professional impact. We assess your profile to determine which opportunities may be appropriate for you.'],
  ['Can Provisa guarantee that I will receive an opportunity?', 'No. We cannot guarantee admission, selection, approval, membership, funding, employment or any other third-party decision. Our role is to help you strategically position your profile and prepare strong, evidence-based submissions.'],
  ['What does “global professional positioning” mean?', 'It means strategically communicating your expertise, achievements, impact and professional identity in a way that makes your profile understandable and compelling to relevant international institutions and opportunity providers.'],
  ['Does Provisa write applications for clients?', 'We develop and refine professional materials and supporting narratives as part of our services. Our work goes beyond writing: we examine your achievements, identify relevant evidence and help position your profile for the objective you are pursuing.'],
  ['Can someone outside Africa use Provisa?', 'Yes. Provisa’s vision is global. While we are rooted in Africa, our services and long-term network are designed for professionals and institutions operating across international markets.'],
  ['What is Provisa Global Network?', 'Provisa Global Network is our emerging professional ecosystem designed to connect accomplished professionals with relevant institutions, professional communities and international opportunities.'],
  ['How do I know which Provisa service is right for me?', 'Start with a professional profile assessment. We can review your background, achievements and objectives and identify the areas where Provisa may be able to support you.'],
];

function readPosts(): BlogPost[] {
  if (typeof window === 'undefined') return seedPosts;
  try {
    const saved = window.localStorage.getItem(BLOG_STORAGE_KEY);
    if (!saved) return seedPosts;
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : seedPosts;
  } catch {
    return seedPosts;
  }
}

function readStaff(): StaffMember[] {
  if (typeof window === 'undefined') return seedStaff;
  try {
    const saved = window.localStorage.getItem(STAFF_STORAGE_KEY);
    if (!saved) return seedStaff;
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return seedStaff;

    // Older prototype data included three placeholder team members. Remove those
    // seeded entries while preserving anything the client added in the admin.
    const currentStaff = parsed.filter(
      (member: StaffMember) => !['staff-2', 'staff-3', 'staff-4'].includes(member.id),
    );
    if (currentStaff.length !== parsed.length) {
      window.localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(currentStaff));
    }
    return currentStaff;
  } catch {
    return seedStaff;
  }
}

function isVisiblePost(post: BlogPost) {
  const now = Date.now();
  const publish = post.publishAt ? new Date(post.publishAt).getTime() : 0;
  const expires = post.expiresAt ? new Date(post.expiresAt).getTime() : Infinity;
  return Number.isFinite(publish) && publish > now ? false : now < expires;
}

function Logo() {
  return (
    <a href={routePath('/')} className="flex items-center gap-3 text-primary" aria-label="Provisa Writers home">
      <span className="grid h-9 w-9 place-items-center rounded-full border border-current">
        <span className="h-3 w-3 rounded-full bg-accent" />
      </span>
      <span className="leading-none">
        <strong className="block text-[15px] tracking-[-.03em]">PROVISA</strong>
        <small className="mt-1 block font-mono-ui text-[8px] tracking-[.19em] opacity-70">WRITERS LTD.</small>
      </span>
    </a>
  );
}

function FieldGuideSidebar({ open, tab, posts, onClose, onTabChange }: { open: boolean; tab: 'blog' | 'faq'; posts: BlogPost[]; onClose: () => void; onTabChange: (tab: 'blog' | 'faq') => void }) {
  if (!open) return null;
  const visiblePosts = posts.filter(isVisiblePost);
  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Blog and FAQ field guide">
      <button type="button" onClick={onClose} className="absolute inset-0 cursor-default bg-primary/35 backdrop-blur-sm" aria-label="Close field guide" />
      <aside className="sidebar-panel absolute right-0 top-0 flex h-full w-full max-w-[560px] flex-col overflow-y-auto bg-background px-5 py-6 shadow-2xl sm:px-8 md:px-10">
        <div className="flex items-center justify-between border-b border-border pb-5">
          <div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground"><BookOpen size={16} /></span><div><p className="eyebrow text-accent">Provisa field guide</p><p className="mt-1 text-xs text-muted-foreground">Notes and useful answers</p></div></div>
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full border border-border text-primary" aria-label="Close field guide"><X size={18} /></button>
        </div>
        <div className="mt-7 flex gap-2">
          <button type="button" onClick={() => onTabChange('blog')} className={`rounded-full px-4 py-2.5 text-xs font-bold ${tab === 'blog' ? 'bg-primary text-primary-foreground' : 'text-primary hover:bg-secondary'}`}>Blog</button>
          <button type="button" onClick={() => onTabChange('faq')} className={`rounded-full px-4 py-2.5 text-xs font-bold ${tab === 'faq' ? 'bg-primary text-primary-foreground' : 'text-primary hover:bg-secondary'}`}>FAQ</button>
        </div>
        {tab === 'blog' ? (
          <div className="mt-9">
            <p className="eyebrow text-accent">From the field notes</p>
            <h2 className="mt-4 font-display text-4xl leading-tight">Notes for the next move.</h2>
            {visiblePosts.length ? <div className="mt-8 grid gap-5">{visiblePosts.map((post) => <article key={post.id} className="overflow-hidden border border-border bg-secondary/40"><img src={assetPath(post.image || '/provisa-record.jpg')} alt="" className="aspect-[1.7] w-full object-cover" /><div className="p-5"><div className="flex items-center gap-2 font-mono-ui text-[10px] uppercase tracking-[.12em] text-accent"><CalendarDays size={13} /> Field note</div><h3 className="mt-4 font-display text-2xl">{post.title}</h3><p className="mt-2 text-sm leading-7 text-muted-foreground">{post.excerpt}</p><details className="mt-4 border-t border-border pt-4"><summary className="cursor-pointer text-sm font-bold">Read the note</summary><p className="mt-4 text-sm leading-7 text-muted-foreground">{post.body}</p></details></div></article>)}</div> : <p className="mt-8 border-y border-border py-8 text-sm text-muted-foreground">New field notes are being prepared.</p>}
          </div>
        ) : (
          <div className="mt-9">
            <p className="eyebrow text-accent">Frequently asked</p>
            <h2 className="mt-4 font-display text-4xl leading-tight">The questions worth asking before you begin.</h2>
            <div className="mt-8 divide-y divide-border border-y border-border">{faqs.map(([question, answer]) => <details key={question} className="py-5"><summary className="cursor-pointer pr-4 text-base font-bold">{question}</summary><p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">{answer}</p></details>)}</div>
          </div>
        )}
        <a href="#contact" onClick={onClose} className="mt-10 inline-flex min-h-12 w-fit items-center gap-3 rounded-full bg-accent px-6 text-sm font-bold text-accent-foreground">Talk to the team <ArrowRight size={16} /></a>
      </aside>
    </div>
  );
}

function FounderPage() {
  const [staff, setStaff] = useState<StaffMember[]>(readStaff);
  const [profile, setProfile] = useState(founderProfile);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    void fetch('/provisa-api/content').then((response) => response.ok ? response.json() : null).then((content) => {
      if (content?.staff) setStaff(content.staff);
      if (content?.founder) {
        setProfile({
          name: content.founder.name,
          role: content.founder.role,
          descriptor: content.founder.descriptor,
          image: content.founder.image,
          summary: String(content.founder.summary).split(/\n\n+/),
          paragraphs: String(content.founder.fullWriteup).split(/\n\n+/),
        });
      }
    }).catch(() => undefined);
    const handleScroll = () => setShowScrollTop(window.scrollY > 520);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="template-two grain min-h-[100dvh]">
      <header className="border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1240px] items-center justify-between px-5 lg:px-8">
          <Logo />
          <a href={routePath('/#team')} className="inline-flex items-center gap-2 text-sm font-bold text-primary transition-colors hover:text-accent"><ArrowRight className="rotate-180" size={16} /> Back to Meet the team</a>
        </div>
      </header>
      <main>
        <section className="border-b border-border bg-secondary/35 px-5 py-16 md:px-10 md:py-24">
          <article className="mx-auto flow-root max-w-[1240px] text-base leading-8 text-muted-foreground md:text-lg">
            <img src={assetPath(profile.image)} alt="Professional portrait representing Mercy Allison, founder of Provisa Writers" className="founder-portrait mb-8 w-full rounded-[1.5rem] object-cover md:float-right md:mb-8 md:ml-12 md:w-[42%]" />
            <div>
              <p className="section-kicker eyebrow text-accent">Founder / Provisa</p>
               <h1 className="mt-5 max-w-3xl font-display text-5xl leading-[.98] tracking-[-.04em] text-foreground md:text-7xl">{profile.name}</h1>
               <p className="mt-5 text-base font-semibold text-primary md:text-lg">{profile.role}</p>
               <p className="mt-2 text-sm">{profile.descriptor}</p>
              <div className="mt-10 border-t border-border md:w-[calc(58%_-_2rem)]" aria-hidden="true" />
              <div className="mt-8 space-y-6">
                 {profile.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </div>
          </article>
        </section>
        <section id="team-directory" className="scroll-mt-24 px-5 py-16 md:px-10 md:py-24">
          <div className="mx-auto max-w-[1240px]">
            <p className="section-kicker eyebrow text-accent">Meet the team</p>
            <div className="mt-8 grid gap-8">
              {staff.map((member) => (
                <article key={member.id} className="grid gap-8 border-t border-border pt-8 md:grid-cols-[.8fr_1.2fr] md:items-start md:gap-12">
                  <img src={assetPath(member.image || '/stock/team-strategy.jpg')} alt={`${member.name} team portrait`} className="aspect-[1.25] w-full rounded-[1rem] object-cover" />
                  <div>
                    <p className="font-mono-ui text-[10px] uppercase tracking-[.13em] text-accent">{member.role}</p>
                    <h2 className="mt-3 font-display text-3xl md:text-5xl">{member.name}</h2>
                    <p className="mt-5 whitespace-pre-line text-base leading-8 text-muted-foreground">{member.bio}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-primary px-5 pb-10 text-primary-foreground/70 md:px-10">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-5 border-t border-primary-foreground/15 pt-8 text-xs">
          <span>© 2026 Provisa Writers Ltd. Company details placeholder.</span>
          <a href={routePath('/')} className="font-semibold transition-colors hover:text-primary-foreground">Return to site</a>
        </div>
      </footer>
      {showScrollTop && <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="fixed bottom-5 right-5 z-30 grid h-12 w-12 place-items-center rounded-full bg-accent text-accent-foreground shadow-2xl transition-transform hover:-translate-y-1" aria-label="Back to top"><ArrowUp size={18} /></button>}
    </div>
  );
}

function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<'blog' | 'faq'>('blog');
  const [teamIndex, setTeamIndex] = useState(0);
  const [team, setTeam] = useState<StaffMember[]>(() => [{
    id: 'founder',
    name: founderProfile.name,
    role: founderProfile.role,
    bio: founderProfile.summary[0],
    image: '/stock/founder-mercy.jpg',
  }, ...readStaff()]);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [posts, setPosts] = useState<BlogPost[]>(readPosts);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 520);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const syncTeam = () => setTeam([{ id: 'founder', name: founderProfile.name, role: founderProfile.role, bio: founderProfile.summary[0], image: '/stock/founder-mercy.jpg' }, ...readStaff()]);
    window.addEventListener('storage', syncTeam);
    void fetch('/provisa-api/content').then((response) => response.ok ? response.json() : null).then((content) => {
      if (!content) return;
      const founder = content.founder;
      setTeam([{ id: 'founder', name: founder?.name || founderProfile.name, role: founder?.role || founderProfile.role, bio: firstParagraph(founder?.summary || founderProfile.summary.join('\n\n')), image: founder?.image || '/stock/founder-mercy.jpg' }, ...(content.staff || [])]);
      if (content.posts) setPosts(content.posts);
    }).catch(() => undefined);
    return () => window.removeEventListener('storage', syncTeam);
  }, []);

  useEffect(() => {
    setTeamIndex((current) => Math.min(current, Math.max(team.length - 1, 0)));
  }, [team.length]);

  const closeMenu = () => setMobileOpen(false);
  const openSidebar = (tab: 'blog' | 'faq') => {
    setSidebarTab(tab);
    setSidebarOpen(true);
    setMobileOpen(false);
  };
  const moveTeam = (direction: number) => setTeamIndex((current) => (
    team.length > 1 ? (current + direction + team.length) % team.length : 0
  ));
  const handleTeamTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStartX === null || team.length < 2) return;
    const distance = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(distance) > 40) moveTeam(distance > 0 ? -1 : 1);
    setTouchStartX(null);
  };
  const submitContact = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = encodeURIComponent(`Assessment request from ${String(data.get('name') || 'website visitor')}`);
    const body = encodeURIComponent(
      `Name: ${String(data.get('name') || '')}\nEmail: ${String(data.get('email') || '')}\n\nQuestion:\n${String(data.get('question') || '')}`,
    );
    window.location.href = `mailto:info@provisawriters.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  return (
    <div id="top" className="template-two grain min-h-[100dvh]">
      <div className="bg-primary px-5 py-2.5 text-center text-[10px] font-semibold tracking-[.04em] text-primary-foreground sm:text-[11px]">
        A considered starting point for your next international move <span className="ml-2 text-accent">·</span>
      </div>

      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1240px] items-center justify-between px-5 lg:px-8">
          <Logo />
          <nav className="hidden items-center gap-5 lg:flex" aria-label="Primary navigation">
            {navItems.map(([label, href]) => (
              <a key={href} href={`#${href}`} className="text-[11px] font-semibold text-muted-foreground transition-colors hover:text-primary">{label}</a>
            ))}
          </nav>
          <div className="hidden items-center gap-4 md:flex">
            <button type="button" onClick={() => openSidebar('blog')} className="inline-flex items-center gap-2 text-[11px] font-semibold text-muted-foreground transition-colors hover:text-primary"><BookOpen size={14} /> Field guide</button>
            <a href="#contact" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-accent px-5 text-[12px] font-bold text-accent-foreground transition-transform hover:-translate-y-0.5">
              Request an assessment <ArrowRight size={15} />
            </a>
          </div>
          <button type="button" className="grid h-10 w-10 place-items-center rounded-full border border-border lg:hidden" onClick={() => setMobileOpen((open) => !open)} aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={mobileOpen}>
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
        {mobileOpen && (
          <nav className="border-t border-border bg-background px-5 py-5 lg:hidden" aria-label="Mobile navigation">
            <div className="grid gap-1">
              {navItems.map(([label, href]) => (
                <a onClick={closeMenu} key={href} href={`#${href}`} className="rounded-xl px-3 py-3 text-sm font-semibold transition-colors hover:bg-muted">{label}</a>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button type="button" onClick={() => openSidebar('blog')} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border text-sm font-semibold text-primary"><BookOpen size={15} /> Blog</button>
              <button type="button" onClick={() => openSidebar('faq')} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border text-sm font-semibold text-primary">FAQ</button>
            </div>
            <a onClick={closeMenu} href="#contact" className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-accent text-sm font-bold text-accent-foreground">Request an assessment <ArrowRight size={15} /></a>
          </nav>
        )}
      </header>

      <main>
         <section className="border-b border-border bg-secondary/35 px-5 py-14 md:px-10 md:py-20">
          <div className="mx-auto grid max-w-[1240px] items-end gap-12 md:grid-cols-[.95fr_1.05fr]">
            <div className="reveal">
              <p className="eyebrow text-accent">Field note / 01 · a professional record</p>
                <h1 className="hero-title mt-6 max-w-3xl font-display text-[clamp(3.25rem,7vw,7rem)] leading-[.94] tracking-[-.055em]">Connecting <span className="text-accent">Professionals to Global Opportunities</span></h1>
              <p className="mt-8 max-w-lg text-lg leading-8 text-muted-foreground">We make global opportunities visible &amp; help skilled professionals access them.</p>
              <div className="mt-9 flex flex-wrap gap-4">
                <button type="button" onClick={() => openSidebar('blog')} className="inline-flex min-h-12 items-center gap-3 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5">Open the field guide <ArrowRight size={16} /></button>
              </div>
            </div>
             <div className="reveal reveal-delay-2 relative">
              <div className="absolute -left-3 top-8 z-10 max-w-[190px] rotate-[-3deg] bg-accent p-4 text-xs font-bold leading-5 text-accent-foreground shadow-quiet sm:-left-5">Good work leaves clues. We help you connect them.</div>
               <div className="hero-record-frame">
                  <img src={assetPath('/provisa-record.jpg')} alt="Printed professional documents and a green editorial record book arranged for careful review" className="aspect-[1.05] w-full rounded-[1rem] object-cover md:rotate-2" />
                  <div className="hero-record-label">
                   <span className="font-mono-ui text-[9px] tracking-[.18em]">PROVISA / FIELD RECORD</span>
                   <span className="mt-1 block text-[10px] font-semibold leading-4 text-primary-foreground/70">Editorial object · not a government document</span>
                 </div>
               </div>
            </div>
          </div>
        </section>

          <section id="about" className="section-reveal scroll-mt-24 mx-auto max-w-[1240px] px-5 py-16 md:px-10 md:py-20">
           <div className="grid gap-12 md:grid-cols-[.7fr_1.3fr]">
             <div>
                  <p className="section-kicker eyebrow text-accent">About us / purpose</p>
                <h2 className="mt-4 font-display text-4xl leading-tight md:text-6xl">Global opportunities should be easier to see.</h2>
                  <h3 className="mt-6 font-display text-2xl">Our mission</h3>
                 <p className="mt-2 leading-7 text-muted-foreground">Our mission is to help talented professionals and ambitious individuals access global opportunities by strategically positioning their expertise, achievements, and professional credentials for opportunities beyond their home countries.</p>
                 <div className="mt-9 border-t border-border pt-5">
                   <span className="font-mono-ui text-xs text-accent">07</span>
                   <h3 className="mt-5 font-display text-2xl">Our vision</h3>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">To become the trusted global bridge between exceptional talent and exceptional opportunity. We envision a world where geography does not limit professional ambition, and where talented individuals can access the visibility, networks, recognition, and opportunities they need to thrive on the global stage.</p>
                 </div>
             </div>
             <div>
               <p className="eyebrow text-accent">Our values</p>
               <div className="mt-6 grid gap-4 sm:grid-cols-2">
                 {companyValues.map(([title, text], index) => (
                   <div key={title} className={`border-t border-border pt-5 ${index === 1 ? 'sm:mt-12' : ''}`}>
                     <span className="font-mono-ui text-xs text-accent">0{index + 1}</span>
                     <h3 className="mt-5 font-display text-2xl">{title}</h3>
                     <p className="mt-2 text-sm leading-7 text-muted-foreground">{text}</p>
                   </div>
                 ))}
               </div>
             </div>
           </div>
        </section>

           <section id="services" className="section-reveal scroll-mt-24 bg-primary px-5 py-16 text-primary-foreground md:px-10 md:py-24">
          <div className="mx-auto max-w-[1240px]">
            <div className="flex flex-wrap items-end justify-between gap-8">
              <div>
                  <p className="section-kicker eyebrow text-accent">Our services</p>
                  <h2 className="mt-4 max-w-2xl font-display text-4xl leading-tight md:text-6xl">From opportunity discovery to professional support.</h2>
                  <p className="mt-5 max-w-xl leading-7 text-primary-foreground/70">We operate across two connected areas: helping people find relevant global opportunities, and helping them present their qualifications and contributions effectively.</p>
              </div>
              <a href="#contact" className="inline-flex items-center gap-2 border-b border-primary-foreground/40 pb-2 text-sm font-bold transition-colors hover:text-accent">Start a conversation <ArrowRight size={16} /></a>
            </div>
                <div className="mt-14 grid gap-4 lg:grid-cols-3">
                  {services.map((service, index) => (
                    <article key={service.title} className="glass-card rounded-[1.25rem] p-6 text-primary-foreground">
                      <span className="font-mono-ui text-xs text-accent">0{index + 1} / service</span>
                      <h3 className="mt-8 font-display text-2xl leading-tight">{service.title}</h3>
                      <p className="mt-4 text-sm leading-7 text-primary-foreground/70">{service.description}</p>
                      {service.offerings.length > 0 && (
                        <ul className="mt-6 space-y-3 border-t border-primary-foreground/15 pt-5 text-sm">
                          {service.offerings.map((offering) => (
                            <li key={offering} className="flex items-start gap-3">
                              <Check size={15} className="mt-0.5 shrink-0 text-accent" />
                              <span>{offering}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </article>
                  ))}
                </div>
                <div className="mt-16 border-t border-primary-foreground/20 pt-10">
                  <p className="section-kicker eyebrow text-accent">How we can help</p>
                  <div className="mt-6 grid gap-3 md:grid-cols-3">
                    {people.map(([title, text]) => (
                      <article key={title} className="border border-primary-foreground/15 p-5 transition-colors hover:border-primary-foreground/40">
                        <h3 className="text-sm font-bold">{title}</h3>
                        <p className="mt-3 text-xs leading-6 opacity-70">{text}</p>
                      </article>
                    ))}
                  </div>
                  <p className="mt-6 max-w-3xl text-sm leading-7 text-primary-foreground/70">
                    If your profession is not listed, get in touch to discuss how Provisa may support your international goals.
                  </p>
                </div>
             <div className="mt-20 grid gap-8 border-t border-primary-foreground/20 pt-10 md:grid-cols-[.7fr_1.3fr] md:items-center">
                <div><p className="section-kicker eyebrow text-accent">How we begin</p><h3 className="mt-4 font-display text-4xl">No grand promises. Just a better next conversation.</h3></div>
                <div className="glass-card rounded-[1.75rem] p-7 text-primary-foreground md:p-9">
                  <ClipboardCheck className="text-accent" size={28} />
                 <h3 className="mt-6 font-display text-3xl">The profile assessment</h3>
                  <p className="mt-4 max-w-lg leading-7 text-primary-foreground/70">A short intake helps us understand your work, recognition, documentation and the question you are really trying to answer.</p>
                  <div className="mt-7 grid gap-3 border-t border-primary-foreground/15 pt-5 text-sm sm:grid-cols-3">{['Your context', 'Your evidence', 'Your next step'].map((item) => <span key={item} className="flex items-center gap-2 font-semibold"><Check size={15} className="text-accent" />{item}</span>)}</div>
               </div>
             </div>
                <div className="mt-16 rounded-[1.75rem] border-t border-primary-foreground/20 pt-10">
                  <p className="section-kicker eyebrow text-accent">Our approach</p>
                  <div className="mt-7 grid gap-3 sm:grid-cols-3">{approachStages.map(([title, text], index) => <div key={title} className="glass-card min-h-[170px] rounded-[1rem] p-5"><span className="font-mono-ui text-xs text-accent">0{index + 1}</span><h3 className="mt-5 font-display text-2xl">{title}</h3><p className="mt-2 text-xs leading-6 text-primary-foreground/70">{text}</p></div>)}</div>
              </div>
          </div>
        </section>

          <section id="team" className="section-reveal scroll-mt-24 bg-secondary/45 px-5 py-16 md:px-10 md:py-24">
          <div className="mx-auto max-w-[1240px]">
             <p className="section-kicker eyebrow text-accent">Meet the team</p>
                <div className="mt-8">
                {team.length === 1 && team.map((member, index) => (
                  <article key={member.id} className="grid overflow-hidden border border-border bg-background md:h-[420px] md:grid-cols-[.72fr_1.28fr]">
                    <img src={assetPath(member.image)} alt={`${member.name} team portrait`} className="h-[300px] w-full object-cover md:h-full" />
                    <div className="flex min-h-[270px] flex-col justify-center p-7 md:p-10">
                      <span className="font-mono-ui text-[10px] text-accent">{String(index + 1).padStart(2, '0')} / {member.role}</span>
                      <h3 className="mt-5 max-w-xl font-display text-4xl md:text-6xl">{member.name}</h3>
                      <p className="mt-5 max-w-lg whitespace-pre-line leading-7 text-muted-foreground">{member.id === 'founder' ? firstParagraph(member.bio) : member.bio}</p>
                       {member.id === 'founder' && <a href={routePath('/founder')} className="mt-6 inline-flex items-center gap-2 border-b border-primary/30 pb-2 text-sm font-bold text-primary transition-colors hover:border-accent hover:text-accent">Read Mercy&apos;s story <ArrowRight size={16} /></a>}
                    </div>
                  </article>
                ))}
                {team.length > 1 && (
                  <div className="team-carousel relative" onTouchStart={(event) => setTouchStartX(event.touches[0].clientX)} onTouchEnd={handleTeamTouchEnd}>
                    <article key={team[teamIndex].id} className="team-slide grid overflow-hidden border border-border bg-background md:h-[420px] md:grid-cols-[.72fr_1.28fr]" aria-live="polite">
                      <img src={assetPath(team[teamIndex].image)} alt={`${team[teamIndex].name} team portrait`} className="h-[300px] w-full object-cover md:h-full" />
                      <div className="flex min-h-[270px] flex-col justify-between p-7 md:p-10">
                        <div>
                          <span className="font-mono-ui text-[10px] text-accent">{String(teamIndex + 1).padStart(2, '0')} / {team[teamIndex].role}</span>
                          <h3 className="mt-5 max-w-xl font-display text-4xl md:text-6xl">{team[teamIndex].name}</h3>
                          <p className="mt-5 max-w-lg whitespace-pre-line leading-7 text-muted-foreground">{team[teamIndex].id === 'founder' ? firstParagraph(team[teamIndex].bio) : team[teamIndex].bio}</p>
                           {team[teamIndex].id === 'founder' && <a href={routePath('/founder')} className="mt-6 inline-flex items-center gap-2 border-b border-primary/30 pb-2 text-sm font-bold text-primary transition-colors hover:border-accent hover:text-accent">Read Mercy&apos;s story <ArrowRight size={16} /></a>}
                        </div>
                        <p className="mt-8 text-xs font-semibold text-muted-foreground">Swipe on mobile or use the arrows to explore the team.</p>
                      </div>
                    </article>
                    <button type="button" onClick={() => moveTeam(-1)} className="absolute left-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-border bg-background/95 text-primary shadow-lg transition-transform hover:scale-105" aria-label="Previous team member"><ChevronLeft size={18} /></button>
                    <button type="button" onClick={() => moveTeam(1)} className="absolute right-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-border bg-background/95 text-primary shadow-lg transition-transform hover:scale-105" aria-label="Next team member"><ChevronRight size={18} /></button>
                    <div className="mt-5 flex items-center justify-between gap-5">
                      <div className="flex gap-2" aria-label="Team carousel pagination">{team.map((member, index) => <button key={member.id} type="button" onClick={() => setTeamIndex(index)} className={`h-2.5 rounded-full transition-all ${index === teamIndex ? 'w-9 bg-accent' : 'w-2.5 bg-border hover:bg-primary'}`} aria-label={`Show ${member.name}`} aria-current={index === teamIndex ? 'true' : undefined} />)}</div>
                      <span className="text-xs font-semibold text-muted-foreground">{String(teamIndex + 1).padStart(2, '0')} / {String(team.length).padStart(2, '0')}</span>
                    </div>
                  </div>
                )}
                {team.length === 0 && (
                  <p className="border border-border bg-background p-8 text-sm leading-7 text-muted-foreground">
                    No team members are listed yet. Please check back soon.
                  </p>
                )}
                {team.length > 1 && (
                  <div className="mt-7 flex justify-center">
                    <a href={routePath('/founder#team-directory')} className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5">
                      See more <ArrowRight size={16} />
                    </a>
                  </div>
                )}
              </div>
          </div>
        </section>

          <section id="results" className="section-reveal scroll-mt-24 bg-secondary/45 px-5 py-16 md:px-10 md:py-20">
          <div className="mx-auto max-w-[1240px]">
              <p className="section-kicker eyebrow text-accent">Results</p>
              <div className="mt-4"><h2 className="max-w-2xl font-display text-4xl md:text-6xl">Useful outcomes begin with honest expectations.</h2></div>
            <div className="mt-16 grid gap-4 sm:grid-cols-3">{[['01', 'Clearer language', 'A record that lets the substance of your work travel.'], ['02', 'Better questions', 'A more useful conversation with the right specialist.'], ['03', 'A steady next step', 'Preparation that respects both ambition and uncertainty.']].map(([number, title, text]) => <div key={number} className="glass-card-light rounded-[1.25rem] p-6"><span className="font-mono-ui text-xs text-accent">{number}</span><h3 className="mt-4 font-display text-2xl text-primary">{title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p></div>)}</div>
          </div>
        </section>

          <section id="contact" className="section-reveal scroll-mt-24 bg-primary px-5 py-16 text-primary-foreground md:px-10 md:py-20">
          <div className="mx-auto grid max-w-[1240px] gap-14 lg:grid-cols-[.9fr_1.1fr]">
             <div><p className="section-kicker eyebrow text-accent">Contact the team</p><h2 className="mt-4 max-w-3xl font-display text-4xl md:text-6xl">Bring us the question you are carrying.</h2><p className="mt-6 max-w-md leading-7 opacity-70">Tell us enough to begin a useful conversation. We work primarily with skilled professionals, experts, researchers and internationally minded people seeking mobility, recognition or further development.</p><div className="mt-8 grid gap-4 text-sm font-semibold"><a href="mailto:info@provisawriters.com" className="inline-flex items-center gap-2 transition-colors hover:text-accent"><Mail size={15} /> info@provisawriters.com</a><a href="tel:+2348160550258" className="inline-flex items-center gap-2 transition-colors hover:text-accent"><MessageCircle size={15} /> +234 816 055 0258</a><a href="https://wa.me/2348160550258?text=Hello%20Provisa%20Writers%2C%20I%27d%20like%20to%20ask%20a%20question." target="_blank" rel="noreferrer" className="inline-flex w-fit items-center gap-2 border-b border-primary-foreground/40 pb-2 transition-colors hover:text-accent"><MessageCircle size={15} /> Chat to support on WhatsApp</a></div></div>
            <div className="rounded-[1.75rem] bg-primary-foreground p-7 text-foreground md:p-9">
              {submitted ? <div className="flex min-h-[300px] flex-col justify-center"><span className="grid h-11 w-11 place-items-center rounded-full bg-secondary text-primary"><Check size={20} /></span><h3 className="mt-7 font-display text-3xl">Your email draft is ready.</h3><p className="mt-3 max-w-sm leading-7 text-muted-foreground">Your mail app should open with the details filled in. If it did not, email info@provisawriters.com directly.</p><button type="button" onClick={() => setSubmitted(false)} className="mt-7 w-fit text-sm font-bold text-primary underline decoration-accent decoration-2 underline-offset-4">Send another note</button></div> : <form onSubmit={submitContact} className="grid gap-5"><div><label htmlFor="name" className="eyebrow text-primary">Your name</label><input id="name" required name="name" className="mt-2 w-full border-b border-border bg-transparent px-0 py-3 text-sm outline-none placeholder:text-muted-foreground/70" placeholder="How should we address you?" /></div><div><label htmlFor="email" className="eyebrow text-primary">Email address</label><input id="email" required type="email" name="email" className="mt-2 w-full border-b border-border bg-transparent px-0 py-3 text-sm outline-none placeholder:text-muted-foreground/70" placeholder="Where can we reply?" /></div><div><label htmlFor="question" className="eyebrow text-primary">The question</label><textarea id="question" required name="question" rows={3} className="mt-2 w-full resize-none border-b border-border bg-transparent px-0 py-3 text-sm outline-none placeholder:text-muted-foreground/70" placeholder="What would you like to make clearer?" /></div><button type="submit" className="mt-3 inline-flex min-h-12 w-fit items-center gap-3 rounded-full bg-accent px-6 text-sm font-bold text-accent-foreground transition-transform hover:-translate-y-0.5">Prepare an email <ArrowRight size={16} /></button><p className="text-[11px] leading-5 text-muted-foreground">This prototype opens your email app with a pre-filled request. A server-side mailing workflow can be connected later.</p></form>}
            </div>
          </div>
        </section>
      </main>

       <FieldGuideSidebar open={sidebarOpen} tab={sidebarTab} posts={posts} onClose={() => setSidebarOpen(false)} onTabChange={setSidebarTab} />
       <footer className="bg-primary px-5 pb-10 text-primary-foreground/70 md:px-10">
          <div className="mx-auto max-w-[1240px] border-t border-primary-foreground/15 pt-8 text-xs">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center"><span>© 2026 Provisa Writers Ltd. Company details placeholder.</span></div>
           <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 text-primary-foreground/80">
             {navItems.map(([label, href]) => <a key={href} href={`#${href}`} className="transition-colors hover:text-primary-foreground">{label}</a>)}
             <button type="button" onClick={() => openSidebar('blog')} className="transition-colors hover:text-primary-foreground">Blog</button>
             <button type="button" onClick={() => openSidebar('faq')} className="transition-colors hover:text-primary-foreground">FAQ</button>
              <a href={routePath('/admin')} className="transition-colors hover:text-primary-foreground">Admin login</a>
           </div>
         </div>
      </footer>
       {showScrollTop && <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="fixed bottom-5 right-5 z-30 grid h-12 w-12 place-items-center rounded-full bg-accent text-accent-foreground shadow-2xl transition-transform hover:-translate-y-1" aria-label="Back to top"><ArrowUp size={18} /></button>}
    </div>
  );
}

function LegacyAdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [posts, setPosts] = useState<BlogPost[]>(readPosts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [form, setForm] = useState({ title: '', excerpt: '', body: '', publishAt: '', expiresAt: '' });

  const persist = (nextPosts: BlogPost[]) => {
    setPosts(nextPosts);
    window.localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(nextPosts));
  };
  const resetForm = () => {
    setEditingId(null);
    setImagePreview('');
    setForm({ title: '', excerpt: '', body: '', publishAt: '', expiresAt: '' });
  };
  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await fetch('/provisa-api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) });
    if (response.ok) {
      setAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError((await response.json().catch(() => null))?.error || 'Unable to sign in.');
    }
  };
  const savePost = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next: BlogPost = { id: editingId || `${Date.now()}`, ...form, image: imagePreview || assetPath('/provisa-record.jpg'), createdAt: new Date().toISOString() };
    persist(editingId ? posts.map((post) => post.id === editingId ? next : post) : [next, ...posts]);
    resetForm();
  };
  const editPost = (post: BlogPost) => {
    setEditingId(post.id);
    setImagePreview(post.image);
    setForm({ title: post.title, excerpt: post.excerpt, body: post.body, publishAt: post.publishAt, expiresAt: post.expiresAt });
  };
  const chooseImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImagePreview(String(reader.result));
    reader.readAsDataURL(file);
  };

  if (!authenticated) {
   return <div className="admin-shell grain min-h-[100dvh]"><div className="mx-auto flex min-h-[100dvh] max-w-[560px] items-center px-5 py-12"><form onSubmit={handleLogin} className="w-full rounded-[2rem] bg-primary p-8 text-primary-foreground shadow-2xl md:p-12"><Logo /><p className="eyebrow mt-16 text-accent">Private field notes</p><h1 className="mt-4 font-display text-5xl">Team desk login.</h1><p className="mt-5 text-sm leading-7 text-primary-foreground/70">Sign in to manage Provisa content.</p><div className="mt-10 grid gap-5"><label className="grid gap-2 text-sm font-semibold">Username<input autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} className="rounded-xl border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-3 outline-none" placeholder="Admin username" /></label><label className="grid gap-2 text-sm font-semibold">Password<input autoComplete="current-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="rounded-xl border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-3 outline-none" placeholder="Admin password" /></label></div>{loginError && <p className="mt-4 text-sm text-accent">{loginError}</p>}<button className="mt-8 inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-accent px-6 text-sm font-bold text-accent-foreground" type="submit">Enter the desk <ArrowRight size={16} /></button><a href="/" className="mt-6 inline-flex text-sm text-primary-foreground/70 hover:text-primary-foreground">← Return to site</a></form></div></div>;
  }

  return <div className="admin-shell grain min-h-[100dvh]"><header className="border-b border-border bg-background/90"><div className="mx-auto flex h-[76px] max-w-[1240px] items-center justify-between px-5 lg:px-8"><Logo /><div className="flex items-center gap-4"><span className="hidden font-mono-ui text-[10px] uppercase tracking-[.13em] text-muted-foreground sm:inline">Local prototype desk</span><button type="button" onClick={() => setAuthenticated(false)} className="inline-flex items-center gap-2 text-sm font-bold text-primary"><LogOut size={15} /> Sign out</button></div></div></header><main className="mx-auto max-w-[1240px] px-5 py-12 md:px-10 md:py-20"><div className="flex flex-wrap items-end justify-between gap-6"><div><p className="eyebrow text-accent">PW admin / blog publishing</p><h1 className="mt-4 font-display text-5xl md:text-7xl">Field notes desk.</h1><p className="mt-5 max-w-xl leading-7 text-muted-foreground">Create, edit, schedule and remove posts. Changes are saved in this browser until a database is connected.</p></div><div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-xs font-bold text-primary"><Sparkles size={14} /> {posts.length} {posts.length === 1 ? 'post' : 'posts'}</div></div><div className="mt-14 grid gap-8 lg:grid-cols-[.85fr_1.15fr]"><form onSubmit={savePost} className="rounded-[1.75rem] bg-primary p-7 text-primary-foreground md:p-9"><div className="flex items-center justify-between"><h2 className="font-display text-3xl">{editingId ? 'Edit a post' : 'Add a post'}</h2>{editingId && <button type="button" onClick={resetForm} className="text-xs font-bold text-primary-foreground/70 hover:text-primary-foreground">Cancel</button>}</div><div className="mt-8 grid gap-5"><label className="grid gap-2 text-xs font-bold uppercase tracking-[.1em]">Title<input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="rounded-xl border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-3 text-sm normal-case tracking-normal outline-none" /></label><label className="grid gap-2 text-xs font-bold uppercase tracking-[.1em]">Short excerpt<textarea required rows={3} value={form.excerpt} onChange={(event) => setForm({ ...form, excerpt: event.target.value })} className="rounded-xl border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-3 text-sm normal-case tracking-normal outline-none" /></label><label className="grid gap-2 text-xs font-bold uppercase tracking-[.1em]">Full note<textarea required rows={6} value={form.body} onChange={(event) => setForm({ ...form, body: event.target.value })} className="rounded-xl border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-3 text-sm normal-case tracking-normal outline-none" /></label><div className="grid gap-5 sm:grid-cols-2"><label className="grid min-w-0 gap-2 text-xs font-bold uppercase tracking-[.1em]"><span className="flex items-center gap-2"><Clock3 size={13} /> Publish from</span><input type="datetime-local" value={form.publishAt} onChange={(event) => setForm({ ...form, publishAt: event.target.value })} className="min-w-0 w-full rounded-xl border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-3 text-xs outline-none" /></label><label className="grid min-w-0 gap-2 text-xs font-bold uppercase tracking-[.1em]"><span className="flex items-center gap-2"><Clock3 size={13} /> Remove after</span><input type="datetime-local" value={form.expiresAt} onChange={(event) => setForm({ ...form, expiresAt: event.target.value })} className="min-w-0 w-full rounded-xl border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-3 text-xs outline-none" /></label></div><label className="grid gap-2 text-xs font-bold uppercase tracking-[.1em]"><span className="flex items-center gap-2"><ImagePlus size={13} /> Feature image</span><input type="file" accept="image/*" onChange={chooseImage} className="block w-full text-xs file:mr-3 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:font-bold file:text-accent-foreground" /></label>{imagePreview && <img src={imagePreview} alt="Selected feature preview" className="aspect-[1.8] w-full rounded-xl object-cover" />}<button type="submit" className="mt-2 inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-accent px-6 text-sm font-bold text-accent-foreground">{editingId ? <Pencil size={16} /> : <Plus size={16} />}{editingId ? 'Save changes' : 'Publish post'}</button></div></form><section><div className="mb-5 flex items-center justify-between"><h2 className="font-display text-3xl">Your posts</h2><span className="font-mono-ui text-[10px] uppercase tracking-[.13em] text-muted-foreground">Browser storage</span></div><div className="grid gap-4">{posts.map((post) => <article key={post.id} className="flex gap-4 border-t border-border py-5"><img src={assetPath(post.image || '/provisa-record.jpg')} alt="" className="h-24 w-28 shrink-0 rounded-xl object-cover" /><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-[.1em] text-muted-foreground"><span className={isVisiblePost(post) ? 'text-accent' : 'text-primary'}>{isVisiblePost(post) ? 'Visible' : 'Scheduled / expired'}</span>{post.expiresAt && <span>Until {new Date(post.expiresAt).toLocaleDateString()}</span>}</div><h3 className="mt-2 font-display text-2xl">{post.title}</h3><p className="mt-1 line-clamp-2 text-xs leading-6 text-muted-foreground">{post.excerpt}</p></div><div className="flex shrink-0 items-start gap-2"><button type="button" onClick={() => editPost(post)} className="grid h-9 w-9 place-items-center rounded-full border border-border text-primary hover:bg-secondary" aria-label={`Edit ${post.title}`}><Pencil size={14} /></button><button type="button" onClick={() => persist(posts.filter((item) => item.id !== post.id))} className="grid h-9 w-9 place-items-center rounded-full border border-border text-accent hover:bg-secondary" aria-label={`Delete ${post.title}`}><Trash2 size={14} /></button></div></article>)}</div></section></div><div className="mt-12 grid gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:grid-cols-3"><p className="flex gap-2"><Users size={15} className="shrink-0 text-accent" /> This editor is a visual prototype for the future admin workflow.</p><p className="flex gap-2"><Clock3 size={15} className="shrink-0 text-accent" /> Posts can be set to appear and disappear at specific times.</p><p className="flex gap-2"><Globe2 size={15} className="shrink-0 text-accent" /> The public Blog section only shows currently visible posts.</p></div></main></div>;
}

function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [contentLoading, setContentLoading] = useState(true);
  const [contentReady, setContentReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [saveError, setSaveError] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'posts' | 'staff' | 'founder'>('posts');
  const [posts, setPosts] = useState<BlogPost[]>(readPosts);
  const [staff, setStaff] = useState<StaffMember[]>(readStaff);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [staffImagePreview, setStaffImagePreview] = useState('');
  const [postForm, setPostForm] = useState({ title: '', excerpt: '', body: '', publishAt: '', expiresAt: '' });
  const [staffForm, setStaffForm] = useState({ name: '', role: '', bio: '' });
  const [founderForm, setFounderForm] = useState({ name: founderProfile.name, role: founderProfile.role, descriptor: founderProfile.descriptor, summary: founderProfile.summary[0], fullWriteup: founderProfile.paragraphs.join('\n\n'), image: '/stock/founder-mercy.jpg' });

  useEffect(() => {
    void Promise.all([
      fetch('/provisa-api/auth/session').then((response) =>
        response.ok ? response.json() : null,
      ),
      fetch('/provisa-api/content').then((response) =>
        response.ok ? response.json() : null,
      ),
    ])
      .then(([session, content]) => {
        if (session?.authenticated) setAuthenticated(true);
        if (!content) throw new Error('Content unavailable');
        if (content.posts) setPosts(content.posts);
        if (content.staff) setStaff(content.staff);
        if (content.founder) setFounderForm({ ...content.founder, summary: firstParagraph(content.founder.summary) });
        setContentReady(true);
      })
      .catch(() => setSaveError('Unable to load the current site content. Please reload before editing.'))
      .finally(() => setContentLoading(false));
  }, []);

  const saveChanges = async (payload: object, section: 'posts' | 'staff' | 'founder') => {
    if (saving || !contentReady) return false;
    setSaving(true);
    setSaveError('');
    setSaveMessage('');
    try {
      const response = await fetch('/provisa-api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.error || 'Could not save changes. Please try again.');
      }
      const content = await response.json();
      setPosts(content.posts);
      setStaff(content.staff);
      setFounderForm({ ...content.founder, summary: firstParagraph(content.founder.summary) });
      setSaveMessage(`${section === 'founder' ? 'Founder profile' : section === 'staff' ? 'Staff directory' : 'Blog posts'} saved. The public site will show the update on reload.`);
      return true;
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Could not save changes. Please try again.');
      return false;
    } finally {
      setSaving(false);
    }
  };
  const resetPostForm = () => {
    setEditingId(null);
    setImagePreview('');
    setPostForm({ title: '', excerpt: '', body: '', publishAt: '', expiresAt: '' });
  };
  const resetStaffForm = () => {
    setEditingStaffId(null);
    setStaffImagePreview('');
    setStaffForm({ name: '', role: '', bio: '' });
  };
  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await fetch('/provisa-api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) });
    if (response.ok) {
      setAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError((await response.json().catch(() => null))?.error || 'Unable to sign in.');
    }
  };
  const handleLogout = async () => {
    await fetch('/provisa-api/auth/logout', { method: 'POST' }).catch(
      () => undefined,
    );
    setAuthenticated(false);
    setPassword('');
  };
  const savePost = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next: BlogPost = {
      id: editingId || `${Date.now()}`,
      ...postForm,
      image: imagePreview || assetPath('/provisa-record.jpg'),
      createdAt: new Date().toISOString(),
    };
    if (await saveChanges({ posts: editingId ? posts.map((post) => post.id === editingId ? next : post) : [next, ...posts] }, 'posts')) resetPostForm();
  };
  const saveStaffMember = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next: StaffMember = {
      id: editingStaffId || `staff-${Date.now()}`,
      ...staffForm,
      image: staffImagePreview || assetPath('/stock/team-strategy.jpg'),
    };
    if (await saveChanges({ staff: editingStaffId ? staff.map((member) => member.id === editingStaffId ? next : member) : [next, ...staff] }, 'staff')) resetStaffForm();
  };
  const editPost = (post: BlogPost) => {
    setActiveTab('posts');
    setEditingId(post.id);
    setImagePreview(post.image);
    setPostForm({ title: post.title, excerpt: post.excerpt, body: post.body, publishAt: post.publishAt, expiresAt: post.expiresAt });
  };
  const editStaffMember = (member: StaffMember) => {
    setActiveTab('staff');
    setEditingStaffId(member.id);
    setStaffImagePreview(member.image);
    setStaffForm({ name: member.name, role: member.role, bio: member.bio });
  };
  const chooseImage = (event: ChangeEvent<HTMLInputElement>, kind: 'post' | 'staff') => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => kind === 'post' ? setImagePreview(String(reader.result)) : setStaffImagePreview(String(reader.result));
    reader.readAsDataURL(file);
  };

  if (!authenticated) {
    return (
      <div className="admin-shell grain min-h-[100dvh]">
        <div className="mx-auto flex min-h-[100dvh] max-w-[560px] items-center px-5 py-12">
          <form onSubmit={handleLogin} className="w-full rounded-[2rem] bg-primary p-8 text-primary-foreground shadow-2xl md:p-12">
            <Logo />
            <p className="eyebrow mt-16 text-accent">Private field notes</p>
            <h1 className="mt-4 font-display text-5xl">Team desk login.</h1>
            <p className="mt-5 text-sm leading-7 text-primary-foreground/70">Sign in to manage Provisa blog posts and team profiles.</p>
            <div className="mt-10 grid gap-5">
              <label className="grid gap-2 text-sm font-semibold">Username
                <input required autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} className="rounded-xl border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-3 outline-none" placeholder="Admin username" />
              </label>
              <label className="grid gap-2 text-sm font-semibold">Password
                <span className="relative">
                  <input required autoComplete="current-password" type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-3 pr-12 outline-none" placeholder="Admin password" />
                  <button type="button" onClick={() => setShowPassword((visible) => !visible)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-primary-foreground/70 hover:text-primary-foreground" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </span>
              </label>
            </div>
            {loginError && <p className="mt-4 text-sm text-accent">{loginError}</p>}
            <button className="mt-8 inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-accent px-6 text-sm font-bold text-accent-foreground" type="submit">Enter the desk <ArrowRight size={16} /></button>
             <div><a href={routePath('/')} className="mt-6 inline-flex text-sm text-primary-foreground/70 hover:text-primary-foreground">← Return to site</a></div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-shell grain min-h-[100dvh]">
      <header className="border-b border-border bg-background/90">
        <div className="mx-auto flex h-[76px] max-w-[1240px] items-center justify-between px-5 lg:px-8">
          <Logo />
          <div className="flex items-center gap-4">
            <a href={routePath('/')} className="hidden text-sm font-bold text-primary hover:text-accent sm:inline">View site</a>
             <span className="hidden font-mono-ui text-[10px] uppercase tracking-[.13em] text-muted-foreground md:inline">Site content desk</span>
            <button type="button" onClick={handleLogout} className="inline-flex items-center gap-2 text-sm font-bold text-primary"><LogOut size={15} /> Sign out</button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[1240px] px-5 py-12 md:px-10 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow text-accent">PWADMIN / site administration</p>
            <h1 className="mt-4 font-display text-5xl md:text-7xl">The publishing desk.</h1>
              <p className="mt-5 max-w-xl leading-7 text-muted-foreground">Manage field notes, the public team directory, and the founder profile. Changes are saved to the site database.</p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-xs font-bold text-primary"><Sparkles size={14} /> {posts.length} posts · {staff.length} staff</div>
        </div>
        <div role="status" aria-live="polite" className="mt-6">
          {contentLoading && <p className="rounded-xl bg-secondary px-5 py-3 text-sm text-primary">Loading current site content…</p>}
          {saveError && <p className="rounded-xl border border-accent/40 bg-accent/10 px-5 py-3 text-sm font-semibold text-foreground">{saveError}</p>}
          {saveMessage && <p className="rounded-xl border border-primary/20 bg-secondary px-5 py-3 text-sm font-semibold text-primary">{saveMessage}</p>}
        </div>

        <div className="mt-12 flex flex-wrap gap-2 border-b border-border pb-3">
          <button type="button" onClick={() => setActiveTab('posts')} className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition-colors ${activeTab === 'posts' ? 'bg-primary text-primary-foreground' : 'text-primary hover:bg-secondary'}`}><Pencil size={15} /> Blog posts</button>
           <button type="button" onClick={() => setActiveTab('staff')} className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition-colors ${activeTab === 'staff' ? 'bg-primary text-primary-foreground' : 'text-primary hover:bg-secondary'}`}><Users size={15} /> Staff directory</button>
           <button type="button" onClick={() => setActiveTab('founder')} className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition-colors ${activeTab === 'founder' ? 'bg-primary text-primary-foreground' : 'text-primary hover:bg-secondary'}`}><Pencil size={15} /> Founder</button>
        </div>

        {activeTab === 'posts' ? (
          <div className="mt-8 grid gap-8 lg:grid-cols-[.85fr_1.15fr]">
            <form onSubmit={savePost} className="admin-editor-card rounded-[1.75rem] bg-secondary/80 p-7 text-foreground md:p-9">
              <div className="flex items-center justify-between"><h2 className="font-display text-3xl">{editingId ? 'Edit a post' : 'Add a post'}</h2>{editingId && <button type="button" onClick={resetPostForm} className="text-xs font-bold text-primary">Cancel</button>}</div>
              <div className="mt-8 grid gap-5">
                <label className="grid gap-2 text-xs font-bold uppercase tracking-[.1em]">Title<input required value={postForm.title} onChange={(event) => setPostForm({ ...postForm, title: event.target.value })} className="rounded-xl border border-border bg-background px-4 py-3 text-sm normal-case tracking-normal outline-none" /></label>
                <label className="grid gap-2 text-xs font-bold uppercase tracking-[.1em]">Short excerpt<textarea required rows={3} value={postForm.excerpt} onChange={(event) => setPostForm({ ...postForm, excerpt: event.target.value })} className="rounded-xl border border-border bg-background px-4 py-3 text-sm normal-case tracking-normal outline-none" /></label>
                <label className="grid gap-2 text-xs font-bold uppercase tracking-[.1em]">Full note<textarea required rows={6} value={postForm.body} onChange={(event) => setPostForm({ ...postForm, body: event.target.value })} className="rounded-xl border border-border bg-background px-4 py-3 text-sm normal-case tracking-normal outline-none" /></label>
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="grid min-w-0 gap-2 text-xs font-bold uppercase tracking-[.1em]"><span className="flex items-center gap-2"><Clock3 size={13} /> Publish from</span><input type="datetime-local" value={postForm.publishAt} onChange={(event) => setPostForm({ ...postForm, publishAt: event.target.value })} className="min-w-0 w-full rounded-xl border border-border bg-background px-3 py-3 text-xs outline-none" /></label>
                  <label className="grid min-w-0 gap-2 text-xs font-bold uppercase tracking-[.1em]"><span className="flex items-center gap-2"><Clock3 size={13} /> Remove after</span><input type="datetime-local" value={postForm.expiresAt} onChange={(event) => setPostForm({ ...postForm, expiresAt: event.target.value })} className="min-w-0 w-full rounded-xl border border-border bg-background px-3 py-3 text-xs outline-none" /></label>
                </div>
                <label className="grid gap-2 text-xs font-bold uppercase tracking-[.1em]"><span className="flex items-center gap-2"><ImagePlus size={13} /> Feature image</span><input type="file" accept="image/*" onChange={(event) => chooseImage(event, 'post')} className="block w-full text-xs file:mr-3 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:font-bold file:text-accent-foreground" /></label>
                {imagePreview && <img src={imagePreview} alt="Selected feature preview" className="aspect-[1.8] w-full rounded-xl object-cover" />}
                 <button type="submit" disabled={saving || !contentReady} className="mt-2 inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50">{editingId ? <Pencil size={16} /> : <Plus size={16} />}{saving ? 'Saving…' : editingId ? 'Save changes' : 'Publish post'}</button>
              </div>
            </form>
            <section>
               <div className="mb-5 flex items-center justify-between"><h2 className="font-display text-3xl">Your posts</h2><span className="font-mono-ui text-[10px] uppercase tracking-[.13em] text-muted-foreground">Site database</span></div>
               <div className="grid gap-4">{posts.map((post) => <article key={post.id} className="flex gap-4 border-t border-border py-5"><img src={assetPath(post.image || '/provisa-record.jpg')} alt="" className="h-24 w-28 shrink-0 rounded-xl object-cover" /><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-[.1em] text-muted-foreground"><span className={isVisiblePost(post) ? 'text-accent' : 'text-primary'}>{isVisiblePost(post) ? 'Visible' : 'Scheduled / expired'}</span>{post.expiresAt && <span>Until {new Date(post.expiresAt).toLocaleDateString()}</span>}</div><h3 className="mt-2 font-display text-2xl">{post.title}</h3><p className="mt-1 line-clamp-2 text-xs leading-6 text-muted-foreground">{post.excerpt}</p></div><div className="flex shrink-0 items-start gap-2"><button type="button" onClick={() => editPost(post)} className="grid h-9 w-9 place-items-center rounded-full border border-border text-primary hover:bg-secondary" aria-label={`Edit ${post.title}`}><Pencil size={14} /></button><button type="button" disabled={saving} onClick={() => { if (window.confirm(`Delete ${post.title}?`)) void saveChanges({ posts: posts.filter((item) => item.id !== post.id) }, 'posts'); }} className="grid h-9 w-9 place-items-center rounded-full border border-border text-accent hover:bg-secondary" aria-label={`Delete ${post.title}`}><Trash2 size={14} /></button></div></article>)}</div>
            </section>
          </div>
        ) : activeTab === 'staff' ? (
          <div className="mt-8 grid gap-8 lg:grid-cols-[.85fr_1.15fr]">
            <form onSubmit={saveStaffMember} className="admin-editor-card rounded-[1.75rem] bg-secondary/80 p-7 text-foreground md:p-9">
              <div className="flex items-center justify-between"><h2 className="font-display text-3xl">{editingStaffId ? 'Edit staff member' : 'Add staff member'}</h2>{editingStaffId && <button type="button" onClick={resetStaffForm} className="text-xs font-bold text-primary">Cancel</button>}</div>
              <div className="mt-8 grid gap-5">
                <label className="grid gap-2 text-xs font-bold uppercase tracking-[.1em]">Name<input required value={staffForm.name} onChange={(event) => setStaffForm({ ...staffForm, name: event.target.value })} className="rounded-xl border border-border bg-background px-4 py-3 text-sm normal-case tracking-normal outline-none" placeholder="Team member name" /></label>
                <label className="grid gap-2 text-xs font-bold uppercase tracking-[.1em]">Role / area of work<input required value={staffForm.role} onChange={(event) => setStaffForm({ ...staffForm, role: event.target.value })} className="rounded-xl border border-border bg-background px-4 py-3 text-sm normal-case tracking-normal outline-none" placeholder="For example: Research & Analysis" /></label>
                <label className="grid gap-2 text-xs font-bold uppercase tracking-[.1em]">Full profile write-up<textarea required rows={7} value={staffForm.bio} onChange={(event) => setStaffForm({ ...staffForm, bio: event.target.value })} className="rounded-xl border border-border bg-background px-4 py-3 text-sm normal-case tracking-normal outline-none" placeholder="Enter the complete introduction to display on the team profile." /></label>
                <p className="-mt-3 text-xs leading-5 text-muted-foreground">The role and full write-up appear on the public team profile.</p>
                <label className="grid gap-2 text-xs font-bold uppercase tracking-[.1em]"><span className="flex items-center gap-2"><ImagePlus size={13} /> Portrait</span><input type="file" accept="image/*" onChange={(event) => chooseImage(event, 'staff')} className="block w-full text-xs file:mr-3 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:font-bold file:text-accent-foreground" /></label>
                {staffImagePreview && <img src={staffImagePreview} alt="Selected staff portrait preview" className="aspect-[.9] w-full rounded-xl object-cover" />}
                 <button type="submit" disabled={saving || !contentReady} className="mt-2 inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50">{editingStaffId ? <Pencil size={16} /> : <UserPlus size={16} />}{saving ? 'Saving…' : editingStaffId ? 'Save staff changes' : 'Add staff member'}</button>
              </div>
            </form>
            <section>
               <div className="mb-5 flex items-center justify-between"><h2 className="font-display text-3xl">Staff directory</h2><span className="font-mono-ui text-[10px] uppercase tracking-[.13em] text-muted-foreground">Site database</span></div>
               <div className="grid gap-4 sm:grid-cols-2">{staff.map((member) => <article key={member.id} className="border-t border-border pt-5"><div className="flex gap-4"><img src={assetPath(member.image || '/stock/team-strategy.jpg')} alt="" className="h-20 w-20 shrink-0 rounded-xl object-cover" /><div className="min-w-0"><h3 className="font-display text-2xl">{member.name}</h3><p className="mt-1 text-xs font-bold uppercase tracking-[.1em] text-accent">{member.role}</p><p className="mt-3 text-xs leading-6 text-muted-foreground">{member.bio}</p></div></div><div className="mt-4 flex gap-2"><button type="button" onClick={() => editStaffMember(member)} className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-xs font-bold text-primary hover:bg-secondary"><Pencil size={13} /> Edit</button><button type="button" disabled={saving} onClick={() => { if (window.confirm(`Delete ${member.name}?`)) void saveChanges({ staff: staff.filter((item) => item.id !== member.id) }, 'staff'); }} className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-xs font-bold text-accent hover:bg-secondary"><Trash2 size={13} /> Delete</button></div></article>)}</div>
            </section>
          </div>
        ) : (
           <form onSubmit={(event) => { event.preventDefault(); void saveChanges({ founder: { id: 'founder', ...founderForm, summary: firstParagraph(founderForm.summary) } }, 'founder'); }} className="admin-editor-card mt-8 max-w-3xl rounded-[1.75rem] bg-secondary/80 p-7 text-foreground md:p-9">
            <h2 className="font-display text-3xl">Founder profile</h2>
            <div className="mt-8 grid gap-5">
              <label className="grid gap-2 text-xs font-bold uppercase tracking-[.1em]">Name<input required value={founderForm.name} onChange={(event) => setFounderForm({ ...founderForm, name: event.target.value })} className="rounded-xl border border-border bg-background px-4 py-3 text-sm normal-case tracking-normal outline-none" /></label>
              <label className="grid gap-2 text-xs font-bold uppercase tracking-[.1em]">Role<input required value={founderForm.role} onChange={(event) => setFounderForm({ ...founderForm, role: event.target.value })} className="rounded-xl border border-border bg-background px-4 py-3 text-sm normal-case tracking-normal outline-none" /></label>
              <label className="grid gap-2 text-xs font-bold uppercase tracking-[.1em]">Descriptor<input required value={founderForm.descriptor} onChange={(event) => setFounderForm({ ...founderForm, descriptor: event.target.value })} className="rounded-xl border border-border bg-background px-4 py-3 text-sm normal-case tracking-normal outline-none" /></label>
               <label className="grid gap-2 text-xs font-bold uppercase tracking-[.1em]">Homepage carousel introduction<textarea required rows={4} value={founderForm.summary} onChange={(event) => setFounderForm({ ...founderForm, summary: event.target.value })} className="rounded-xl border border-border bg-background px-4 py-3 text-sm normal-case tracking-normal outline-none" /></label>
               <p className="-mt-3 text-xs leading-5 text-muted-foreground">This is the exact paragraph shown on Mercy&apos;s homepage slide. The “Read Mercy&apos;s story” link opens the separate full write-up below.</p>
              <label className="grid gap-2 text-xs font-bold uppercase tracking-[.1em]">Founder page full write-up<textarea required rows={10} value={founderForm.fullWriteup} onChange={(event) => setFounderForm({ ...founderForm, fullWriteup: event.target.value })} className="rounded-xl border border-border bg-background px-4 py-3 text-sm normal-case tracking-normal outline-none" /></label>
               <label className="grid gap-2 text-xs font-bold uppercase tracking-[.1em]">Portrait image URL<input required value={founderForm.image} onChange={(event) => setFounderForm({ ...founderForm, image: event.target.value })} className="rounded-xl border border-border bg-background px-4 py-3 text-sm normal-case tracking-normal outline-none" /></label>
               <p className="-mt-3 text-xs leading-5 text-muted-foreground">Shown on both the homepage carousel and founder page.</p>
               <button type="submit" disabled={saving || !contentReady} className="inline-flex min-h-12 w-fit items-center justify-center gap-3 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"><Pencil size={16} /> {saving ? 'Saving…' : 'Save founder profile'}</button>
            </div>
          </form>
        )}

        <div className="mt-12 grid gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:grid-cols-3">
          <p className="flex gap-2"><Users size={15} className="shrink-0 text-accent" /> Add, edit and remove people from the public team directory.</p>
          <p className="flex gap-2"><Clock3 size={15} className="shrink-0 text-accent" /> Schedule posts to appear and disappear at specific times.</p>
          <p className="flex gap-2"><Globe2 size={15} className="shrink-0 text-accent" /> Public content updates after the browser reloads.</p>
        </div>
      </main>
    </div>
  );
}

function Router() {
  return <RoutedErrorBoundary><Switch><Route path="/" component={Home} /><Route path="/founder" component={FounderPage} /><Route path="/admin" component={AdminPage} /><Route path="/pwadmin" component={AdminPage} /><Route component={NotFound} /></Switch></RoutedErrorBoundary>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App({ initialPath = '/' }: { initialPath?: string }) {
  if (typeof window === 'undefined') {
    if (initialPath === '/founder') {
      return <FounderPage />;
    }

    if (initialPath === '/pwadmin' || initialPath === '/admin') {
      return <AdminPage />;
    }

    return <Home />;
  }

  return <WouterRouter base="/"><Router /></WouterRouter>;
}

export default function SiteApp({ initialPath }: { initialPath?: string }) {
  return <App initialPath={initialPath} />;
}