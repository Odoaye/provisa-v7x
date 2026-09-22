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
const ADMIN_USERNAME = 'pwadmin';
const ADMIN_PASSWORD = 'client123';
const STAFF_STORAGE_KEY = 'provisa-template-2-staff';

const assetPath = (path: string) => {
  if (path.startsWith('data:') || path.startsWith('http') || path.startsWith('/')) return path;
  return `/${path.replace(/^\/+/, '')}`;
};

const routePath = (path: string) => path.startsWith('/') ? path : `/${path}`;

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

const serviceDetails = [
  ['Profile Assessment', 'A structured view of your experience, evidence and the strongest next question.'],
  ['Profile Building', 'Turn a career history into a clear, credible professional narrative.'],
  ['Case Preparation', 'Support for EB-1A and EB-2 NIW preparation, presented as structured documentation support and never as legal advice.'],
  ['Strategy Development', 'A practical route from what you have now to the work that needs to happen next.'],
];

const people = [
  ['Physicians & healthcare professionals', 'Professionals building recognition, mobility and opportunity across borders.'],
  ['Researchers & scientists', 'People whose research, publications and contribution deserve a clearer frame.'],
  ['Engineers & technology professionals', 'Experts positioning technical work for international visibility and growth.'],
  ['Academics & educators', 'Professionals connecting teaching, research and wider contribution to opportunity.'],
  ['Entrepreneurs & executives', 'Leaders documenting impact, expertise and the value they create.'],
  ['Consultants & specialists', 'Independent professionals turning complex work into a credible record.'],
];

const opportunityTypes = [
  'Migration and skilled-worker opportunities for the US, UK, Canada & Australia',
  'International conferences and professional networks',
  'Grants, research funding and scholarships',
  'Fellowships and professional development programs',
  'International career opportunities',
];

const approachStages = [
  ['Discover', 'Identify relevant international opportunities.'],
  ['Understand', 'Clarify the opportunity, requirements and process.'],
  ['Position', 'Present qualifications, achievements and professional value.'],
  ['Prepare', 'Develop the documentation and supporting materials.'],
  ['Pursue', 'Move forward independently or with Provisa support.'],
];

const founderProfile = {
  name: 'Mercy Allison',
  role: 'Global Master Strategist',
  descriptor: 'Legal Professional • Global Opportunities Strategist • Entrepreneur',
  paragraphs: [
    'Mercy Allison is a Nigerian legal professional, entrepreneur, and professional documentation strategist with a strong track record of working with highly skilled professionals and experts pursuing significant international opportunities.',
    'With a background in law, legal research, U.S. legal support, client advisory, professional writing, case strategy, and team management, Mercy has developed a specialized ability to examine a professional’s experience and achievements, identify what makes their profile valuable, determine how that value can be presented strategically, and translate it into clear, persuasive, and professionally structured documentation.',
    'Since 2023, she has worked extensively on global migration applications, supporting professionals across different fields in presenting their qualifications, achievements, evidence, and professional impact. Her work has involved profile assessment, evidence strategy, professional narrative development, petition documentation, recommendation letters, supporting documents, and quality control.',
    'This experience has given her a practical understanding of an important problem faced by many highly skilled professionals: having exceptional expertise is not always enough. You must know how to identify the right opportunity, understand what that opportunity requires, position your expertise appropriately, and present your qualifications convincingly.',
    'That is the problem Mercy founded Provisa Writers Ltd. to solve.',
    'Provisa began with professional documentation and international immigration support, but Mercy’s vision for the company extends far beyond immigration. She is building Provisa into a platform that helps skilled professionals and experts discover, access, and pursue global opportunities — including international professional opportunities, conferences, fellowships, grants and research funding, scholarships, mobility opportunities, and other opportunities aligned with their expertise.',
    'Mercy’s strength lies not simply in writing documents, but in understanding the person behind the documents — their expertise, achievements, professional trajectory, evidence, and potential — and determining how these can be presented to create a stronger opportunity.',
    'Through Provisa Writers Ltd., she is building a business around a simple conviction: exceptional professionals should have access to opportunities that match the value of their expertise, regardless of where they are in the world.',
    'Her long-term goal is to make Provisa a trusted global resource for professionals seeking to take their expertise further — providing the research, strategic positioning, documentation, and practical support required to pursue opportunities beyond their current borders.',
  ],
};

const companyValues = [
  ['Accessibility', 'Make valuable international opportunities easier to discover and access.'],
  ['Excellence', 'Produce thoughtful, accurate and professionally presented work.'],
  ['Integrity', 'Work with honesty, transparency, confidentiality and respect.'],
  ['Professionalism', 'Maintain high standards in communication and service delivery.'],
  ['Opportunity', 'Help talented people build meaningful international careers.'],
];

const team = [
  {
    name: 'Research Analysis Team Lead',
    role: 'Research & analysis',
    image: '/stock/team-research-analysis.jpg',
    text: 'The research lens: turning complex information into clear findings, useful context and stronger decisions.',
  },
  {
    name: 'The writing desk',
    role: 'Narrative & evidence',
    image: '/stock/team-writing.jpg',
    text: 'The careful edit: making important work legible without making it sound borrowed.',
  },
  {
    name: 'The case desk',
    role: 'Preparation & structure',
    image: '/stock/team-case.jpg',
    text: 'The organising eye: turning details, documents and questions into a usable sequence.',
  },
  {
    name: 'The client desk',
    role: 'Guidance & care',
    image: '/stock/team-client.jpg',
    text: 'The steady hand: helping every conversation begin with context and end with a next step.',
  },
];

type StaffMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
};

const seedStaff: StaffMember[] = team.map((member, index) => ({
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
  ['Do you offer legal advice?', 'No. We offer preparation, organisation and structured assessment support, not legal advice or representation.'],
  ['Do you guarantee an outcome?', 'No. We make no guarantees about immigration, employment, admissions or any other decision.'],
  ['How is information handled?', 'This standalone demo uses a browser mail link for the contact request and local browser storage for blog drafts. Production intake and publishing should use an approved secure process.'],
  ['Can I speak to someone directly?', 'Yes. Use the contact details below to begin a direct conversation with the team.'],
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
    return Array.isArray(parsed) ? parsed : seedStaff;
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
  const [staff] = useState<StaffMember[]>(readStaff);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
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
            <img src={assetPath('/stock/founder-mercy.jpg')} alt="Professional portrait representing Mercy Allison, founder of Provisa Writers" className="founder-portrait mb-8 w-full rounded-[1.5rem] object-cover md:float-right md:mb-8 md:ml-12 md:w-[42%]" />
            <div>
              <p className="section-kicker eyebrow text-accent">Founder / Provisa</p>
              <h1 className="mt-5 max-w-3xl font-display text-5xl leading-[.98] tracking-[-.04em] text-foreground md:text-7xl">{founderProfile.name}</h1>
              <p className="mt-5 text-base font-semibold text-primary md:text-lg">{founderProfile.role}</p>
              <p className="mt-2 text-sm">{founderProfile.descriptor}</p>
              <div className="mt-10 border-t border-border md:w-[calc(58%_-_2rem)]" aria-hidden="true" />
              <div className="mt-8 space-y-6">
                {founderProfile.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </div>
          </article>
        </section>
        <section id="team-directory" className="scroll-mt-24 px-5 py-16 md:px-10 md:py-24">
          <div className="mx-auto max-w-[1240px]">
            <p className="section-kicker eyebrow text-accent">Meet the team</p>
            <h2 className="mt-4 font-display text-4xl leading-tight md:text-5xl">The people behind the work.</h2>
            <p className="mt-5 max-w-2xl leading-7 text-muted-foreground">
              A closer look at the desks and people helping professionals turn experience into a clearer next step.
            </p>
            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              {staff.map((member) => (
                <article key={member.id} className="border-t border-border pt-5">
                  <img src={assetPath(member.image || '/stock/team-strategy.jpg')} alt="" className="aspect-[1.25] w-full rounded-[1rem] object-cover" />
                  <p className="mt-5 font-mono-ui text-[10px] uppercase tracking-[.13em] text-accent">{member.role}</p>
                  <h3 className="mt-3 font-display text-3xl">{member.name}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{member.bio}</p>
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
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [posts] = useState<BlogPost[]>(readPosts);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 520);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setMobileOpen(false);
  const openSidebar = (tab: 'blog' | 'faq') => {
    setSidebarTab(tab);
    setSidebarOpen(true);
    setMobileOpen(false);
  };
  const moveTeam = (direction: number) => setTeamIndex((current) => (current + direction + team.length) % team.length);
  const handleTeamTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStartX === null) return;
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
                 <p className="section-kicker eyebrow text-accent">About us / mission</p>
                <h2 className="mt-4 font-display text-4xl leading-tight md:text-6xl">Global opportunities should be easier to see.</h2>
                <p className="mt-6 leading-7 text-muted-foreground">Provisa Writers Ltd. is a remote-first professional documentation and global opportunities company. We help skilled professionals and experts discover, understand and pursue opportunities beyond their borders.</p>
                 <div className="mt-9 border-t border-border pt-5">
                   <span className="font-mono-ui text-xs text-accent">07</span>
                   <h3 className="mt-5 font-display text-2xl">Our vision</h3>
                   <p className="mt-2 text-sm leading-7 text-muted-foreground">To become a trusted global platform through which skilled professionals can discover, understand and pursue international opportunities.</p>
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
               <div className="mt-14">
                 <details className="glass-card group rounded-[1.25rem] p-6 text-primary-foreground">
                   <summary className="cursor-pointer list-none">
                     <span className="flex items-center justify-between font-mono-ui text-xs text-primary-foreground/65">
                       <span>01 / service</span>
                       <Plus size={19} className="text-accent transition-transform group-open:rotate-45" />
                     </span>
                     <span className="mt-10 block">
                       <strong className="block max-w-[520px] font-display text-3xl font-semibold">EB-1A &amp; EB-2 NIW case preparation</strong>
                       <span className="mt-3 block max-w-[620px] text-sm leading-6 text-primary-foreground/70">Click to explore profile assessment, profile building, case preparation and strategy development.</span>
                     </span>
                   </summary>
                   <div className="mt-8 grid gap-4 border-t border-primary-foreground/15 pt-6 md:grid-cols-2">
                     {serviceDetails.map(([title, text], index) => (
                       <div key={title} className="border-t border-primary-foreground/15 pt-5">
                         <span className="font-mono-ui text-xs text-accent">0{index + 1}</span>
                         <h3 className="mt-4 font-display text-2xl">{title}</h3>
                         <p className="mt-2 max-w-[390px] text-sm leading-6 text-primary-foreground/70">{text}</p>
                       </div>
                     ))}
                   </div>
                   <div className="mt-10 border-t border-primary-foreground/15 pt-8">
                     <p className="section-kicker eyebrow text-accent">How we can help</p>
                     <div className="mt-6 grid gap-3 md:grid-cols-3">
                       {people.map(([title, text]) => (
                         <div key={title} className="border border-primary-foreground/15 p-5 transition-colors hover:border-primary-foreground/40">
                           <strong className="block text-sm">{title}</strong>
                           <p className="mt-3 text-xs leading-6 opacity-70">{text}</p>
                         </div>
                       ))}
                     </div>
                   </div>
                 </details>
               </div>
             <div className="mt-16 border-t border-primary-foreground/20 pt-10">
                <div className="glass-card rounded-[1.75rem] p-7 text-primary-foreground md:p-9">
                 <p className="eyebrow text-accent">Global opportunities</p>
                  <h3 className="mt-4 font-display text-3xl">Relevant possibilities, brought into view.</h3>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-primary-foreground/70">We identify, research, verify and share opportunities that skilled professionals can pursue independently or with Provisa support.</p>
                  <ul className="mt-7 grid gap-3 text-sm sm:grid-cols-2">{opportunityTypes.map((item) => <li key={item} className="flex items-start gap-3 border-t border-primary-foreground/15 pt-3"><Check size={15} className="mt-0.5 shrink-0 text-accent" />{item}</li>)}</ul>
               </div>
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
                 <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{approachStages.map(([title, text], index) => <div key={title} className="glass-card min-h-[170px] rounded-[1rem] p-5"><span className="font-mono-ui text-xs text-accent">0{index + 1}</span><h3 className="mt-5 font-display text-2xl">{title}</h3><p className="mt-2 text-xs leading-6 text-primary-foreground/70">{text}</p></div>)}</div>
              </div>
          </div>
        </section>

          <section id="team" className="section-reveal scroll-mt-24 bg-secondary/45 px-5 py-16 md:px-10 md:py-24">
          <div className="mx-auto max-w-[1240px]">
             <p className="section-kicker eyebrow text-accent">Meet the team</p>
               <div className="mt-8 grid gap-7 border-y border-border py-7 md:grid-cols-[.42fr_1fr] md:items-stretch md:gap-10 md:py-9">
                <img src={assetPath('/stock/founder-mercy.jpg')} alt="Professional portrait representing Mercy Allison, founder of Provisa Writers" className="founder-portrait h-full min-h-[360px] w-full rounded-[1.25rem] object-cover" />
               <div className="max-w-2xl">
                   <p className="section-kicker eyebrow text-accent">Founder / Provisa</p>
                   <h2 className="mt-4 font-display text-4xl leading-tight md:text-5xl">{founderProfile.name}</h2>
                   <p className="mt-2 text-sm font-semibold text-primary">{founderProfile.role}</p>
                   <p className="mt-5 text-sm leading-7 text-muted-foreground">{founderProfile.paragraphs[0]}</p>
                   <p className="mt-4 text-sm leading-7 text-muted-foreground">{founderProfile.paragraphs[1]}</p>
                    <a href={routePath('/founder')} className="mt-6 inline-flex items-center gap-2 border-b border-primary/30 pb-2 text-sm font-bold text-primary transition-colors hover:border-accent hover:text-accent">Read Mercy's story <ArrowRight size={16} /></a>
               </div>
             </div>
              <div className="mt-7">
               <div className="team-carousel relative" onTouchStart={(event) => setTouchStartX(event.touches[0].clientX)} onTouchEnd={handleTeamTouchEnd}>
                 <article key={team[teamIndex].name} className="team-slide grid overflow-hidden border border-border bg-background md:grid-cols-[.72fr_1.28fr]">
                     <img src={assetPath(team[teamIndex].image)} alt={`${team[teamIndex].name} team portrait`} className="aspect-[1.15] h-full w-full object-cover md:aspect-auto" />
                   <div className="flex min-h-[270px] flex-col justify-between p-7 md:p-10">
                     <div><span className="font-mono-ui text-[10px] text-accent">0{teamIndex + 1} / {team[teamIndex].role}</span><h3 className="mt-5 max-w-xl font-display text-4xl md:text-6xl">{team[teamIndex].name}</h3><p className="mt-5 max-w-lg leading-7 text-muted-foreground">{team[teamIndex].text}</p></div>
                     <p className="mt-8 text-xs font-semibold text-muted-foreground">Swipe on mobile or use the arrows to explore the team.</p>
                   </div>
                 </article>
                 <button type="button" onClick={() => moveTeam(-1)} className="absolute left-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-border bg-background/95 text-primary shadow-lg transition-transform hover:scale-105" aria-label="Previous team member"><ChevronLeft size={18} /></button>
                 <button type="button" onClick={() => moveTeam(1)} className="absolute right-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-border bg-background/95 text-primary shadow-lg transition-transform hover:scale-105" aria-label="Next team member"><ChevronRight size={18} /></button>
                 <div className="mt-5 flex items-center justify-between gap-5">
                   <div className="flex gap-2" aria-label="Team carousel pagination">{team.map((member, index) => <button key={member.name} type="button" onClick={() => setTeamIndex(index)} className={`h-2.5 rounded-full transition-all ${index === teamIndex ? 'w-9 bg-accent' : 'w-2.5 bg-border hover:bg-primary'}`} aria-label={`Show ${member.name}`} aria-current={index === teamIndex ? 'true' : undefined} />)}</div>
                   <span className="text-xs font-semibold text-muted-foreground">0{teamIndex + 1} / 0{team.length}</span>
                 </div>
               </div>
                <div className="mt-7 flex justify-center">
                   <a href={routePath('/founder#team-directory')} className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5">
                    See more <ArrowRight size={16} />
                  </a>
                </div>
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
             <a href={routePath('/pwadmin')} className="transition-colors hover:text-primary-foreground">Team login</a>
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
  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (username.trim().toLowerCase() === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('That temporary login does not match the project notes.');
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const chooseImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImagePreview(String(reader.result));
    reader.readAsDataURL(file);
  };

  if (!authenticated) {
   return <div className="admin-shell grain min-h-[100dvh]"><div className="mx-auto flex min-h-[100dvh] max-w-[560px] items-center px-5 py-12"><form onSubmit={handleLogin} className="w-full rounded-[2rem] bg-primary p-8 text-primary-foreground shadow-2xl md:p-12"><Logo /><p className="eyebrow mt-16 text-accent">Private field notes</p><h1 className="mt-4 font-display text-5xl">Team desk login.</h1><p className="mt-5 text-sm leading-7 text-primary-foreground/70">Temporary prototype access for the Provisa team. Database authentication will replace this before launch.</p><div className="mt-10 grid gap-5"><label className="grid gap-2 text-sm font-semibold">Username<input autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} className="rounded-xl border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-3 outline-none" placeholder="pwadmin" /></label><label className="grid gap-2 text-sm font-semibold">Password<input autoComplete="current-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="rounded-xl border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-3 outline-none" placeholder="client123" /></label></div>{loginError && <p className="mt-4 text-sm text-accent">{loginError}</p>}<button className="mt-8 inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-accent px-6 text-sm font-bold text-accent-foreground" type="submit">Enter the desk <ArrowRight size={16} /></button><a href="/" className="mt-6 inline-flex text-sm text-primary-foreground/70 hover:text-primary-foreground">← Return to site</a></form></div></div>;
  }

  return <div className="admin-shell grain min-h-[100dvh]"><header className="border-b border-border bg-background/90"><div className="mx-auto flex h-[76px] max-w-[1240px] items-center justify-between px-5 lg:px-8"><Logo /><div className="flex items-center gap-4"><span className="hidden font-mono-ui text-[10px] uppercase tracking-[.13em] text-muted-foreground sm:inline">Local prototype desk</span><button type="button" onClick={() => setAuthenticated(false)} className="inline-flex items-center gap-2 text-sm font-bold text-primary"><LogOut size={15} /> Sign out</button></div></div></header><main className="mx-auto max-w-[1240px] px-5 py-12 md:px-10 md:py-20"><div className="flex flex-wrap items-end justify-between gap-6"><div><p className="eyebrow text-accent">PW admin / blog publishing</p><h1 className="mt-4 font-display text-5xl md:text-7xl">Field notes desk.</h1><p className="mt-5 max-w-xl leading-7 text-muted-foreground">Create, edit, schedule and remove posts. Changes are saved in this browser until a database is connected.</p></div><div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-xs font-bold text-primary"><Sparkles size={14} /> {posts.length} {posts.length === 1 ? 'post' : 'posts'}</div></div><div className="mt-14 grid gap-8 lg:grid-cols-[.85fr_1.15fr]"><form onSubmit={savePost} className="rounded-[1.75rem] bg-primary p-7 text-primary-foreground md:p-9"><div className="flex items-center justify-between"><h2 className="font-display text-3xl">{editingId ? 'Edit a post' : 'Add a post'}</h2>{editingId && <button type="button" onClick={resetForm} className="text-xs font-bold text-primary-foreground/70 hover:text-primary-foreground">Cancel</button>}</div><div className="mt-8 grid gap-5"><label className="grid gap-2 text-xs font-bold uppercase tracking-[.1em]">Title<input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="rounded-xl border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-3 text-sm normal-case tracking-normal outline-none" /></label><label className="grid gap-2 text-xs font-bold uppercase tracking-[.1em]">Short excerpt<textarea required rows={3} value={form.excerpt} onChange={(event) => setForm({ ...form, excerpt: event.target.value })} className="rounded-xl border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-3 text-sm normal-case tracking-normal outline-none" /></label><label className="grid gap-2 text-xs font-bold uppercase tracking-[.1em]">Full note<textarea required rows={6} value={form.body} onChange={(event) => setForm({ ...form, body: event.target.value })} className="rounded-xl border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-3 text-sm normal-case tracking-normal outline-none" /></label><div className="grid gap-5 sm:grid-cols-2"><label className="grid min-w-0 gap-2 text-xs font-bold uppercase tracking-[.1em]"><span className="flex items-center gap-2"><Clock3 size={13} /> Publish from</span><input type="datetime-local" value={form.publishAt} onChange={(event) => setForm({ ...form, publishAt: event.target.value })} className="min-w-0 w-full rounded-xl border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-3 text-xs outline-none" /></label><label className="grid min-w-0 gap-2 text-xs font-bold uppercase tracking-[.1em]"><span className="flex items-center gap-2"><Clock3 size={13} /> Remove after</span><input type="datetime-local" value={form.expiresAt} onChange={(event) => setForm({ ...form, expiresAt: event.target.value })} className="min-w-0 w-full rounded-xl border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-3 text-xs outline-none" /></label></div><label className="grid gap-2 text-xs font-bold uppercase tracking-[.1em]"><span className="flex items-center gap-2"><ImagePlus size={13} /> Feature image</span><input type="file" accept="image/*" onChange={chooseImage} className="block w-full text-xs file:mr-3 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:font-bold file:text-accent-foreground" /></label>{imagePreview && <img src={imagePreview} alt="Selected feature preview" className="aspect-[1.8] w-full rounded-xl object-cover" />}<button type="submit" className="mt-2 inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-accent px-6 text-sm font-bold text-accent-foreground">{editingId ? <Pencil size={16} /> : <Plus size={16} />}{editingId ? 'Save changes' : 'Publish post'}</button></div></form><section><div className="mb-5 flex items-center justify-between"><h2 className="font-display text-3xl">Your posts</h2><span className="font-mono-ui text-[10px] uppercase tracking-[.13em] text-muted-foreground">Browser storage</span></div><div className="grid gap-4">{posts.map((post) => <article key={post.id} className="flex gap-4 border-t border-border py-5"><img src={assetPath(post.image || '/provisa-record.jpg')} alt="" className="h-24 w-28 shrink-0 rounded-xl object-cover" /><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-[.1em] text-muted-foreground"><span className={isVisiblePost(post) ? 'text-accent' : 'text-primary'}>{isVisiblePost(post) ? 'Visible' : 'Scheduled / expired'}</span>{post.expiresAt && <span>Until {new Date(post.expiresAt).toLocaleDateString()}</span>}</div><h3 className="mt-2 font-display text-2xl">{post.title}</h3><p className="mt-1 line-clamp-2 text-xs leading-6 text-muted-foreground">{post.excerpt}</p></div><div className="flex shrink-0 items-start gap-2"><button type="button" onClick={() => editPost(post)} className="grid h-9 w-9 place-items-center rounded-full border border-border text-primary hover:bg-secondary" aria-label={`Edit ${post.title}`}><Pencil size={14} /></button><button type="button" onClick={() => persist(posts.filter((item) => item.id !== post.id))} className="grid h-9 w-9 place-items-center rounded-full border border-border text-accent hover:bg-secondary" aria-label={`Delete ${post.title}`}><Trash2 size={14} /></button></div></article>)}</div></section></div><div className="mt-12 grid gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:grid-cols-3"><p className="flex gap-2"><Users size={15} className="shrink-0 text-accent" /> This editor is a visual prototype for the future admin workflow.</p><p className="flex gap-2"><Clock3 size={15} className="shrink-0 text-accent" /> Posts can be set to appear and disappear at specific times.</p><p className="flex gap-2"><Globe2 size={15} className="shrink-0 text-accent" /> The public Blog section only shows currently visible posts.</p></div></main></div>;
}

function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'posts' | 'staff'>('posts');
  const [posts, setPosts] = useState<BlogPost[]>(readPosts);
  const [staff, setStaff] = useState<StaffMember[]>(readStaff);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [staffImagePreview, setStaffImagePreview] = useState('');
  const [postForm, setPostForm] = useState({ title: '', excerpt: '', body: '', publishAt: '', expiresAt: '' });
  const [staffForm, setStaffForm] = useState({ name: '', role: '', bio: '' });

  const persistPosts = (nextPosts: BlogPost[]) => {
    setPosts(nextPosts);
    window.localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(nextPosts));
  };
  const persistStaff = (nextStaff: StaffMember[]) => {
    setStaff(nextStaff);
    window.localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(nextStaff));
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
  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (username.trim().toLowerCase() === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('That temporary login does not match the project notes.');
    }
  };
  const savePost = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next: BlogPost = {
      id: editingId || `${Date.now()}`,
      ...postForm,
      image: imagePreview || assetPath('/provisa-record.jpg'),
      createdAt: new Date().toISOString(),
    };
    persistPosts(editingId ? posts.map((post) => post.id === editingId ? next : post) : [next, ...posts]);
    resetPostForm();
  };
  const saveStaffMember = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next: StaffMember = {
      id: editingStaffId || `staff-${Date.now()}`,
      ...staffForm,
      image: staffImagePreview || assetPath('/stock/team-strategy.jpg'),
    };
    persistStaff(editingStaffId ? staff.map((member) => member.id === editingStaffId ? next : member) : [next, ...staff]);
    resetStaffForm();
  };
  const editPost = (post: BlogPost) => {
    setActiveTab('posts');
    setEditingId(post.id);
    setImagePreview(post.image);
    setPostForm({ title: post.title, excerpt: post.excerpt, body: post.body, publishAt: post.publishAt, expiresAt: post.expiresAt });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const editStaffMember = (member: StaffMember) => {
    setActiveTab('staff');
    setEditingStaffId(member.id);
    setStaffImagePreview(member.image);
    setStaffForm({ name: member.name, role: member.role, bio: member.bio });
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
            <p className="mt-5 text-sm leading-7 text-primary-foreground/70">Temporary prototype access for the Provisa team. Database authentication will replace this before launch.</p>
            <div className="mt-10 grid gap-5">
              <label className="grid gap-2 text-sm font-semibold">Username
                <input autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} className="rounded-xl border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-3 outline-none" placeholder="pwadmin" />
              </label>
              <label className="grid gap-2 text-sm font-semibold">Password
                <span className="relative">
                  <input autoComplete="current-password" type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-3 pr-12 outline-none" placeholder="client123" />
                  <button type="button" onClick={() => setShowPassword((visible) => !visible)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-primary-foreground/70 hover:text-primary-foreground" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </span>
              </label>
            </div>
            {loginError && <p className="mt-4 text-sm text-accent">{loginError}</p>}
            <button className="mt-8 inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-accent px-6 text-sm font-bold text-accent-foreground" type="submit">Enter the desk <ArrowRight size={16} /></button>
            <a href={routePath('/')} className="mt-6 inline-flex text-sm text-primary-foreground/70 hover:text-primary-foreground">← Return to site</a>
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
            <span className="hidden font-mono-ui text-[10px] uppercase tracking-[.13em] text-muted-foreground md:inline">Local prototype desk</span>
            <button type="button" onClick={() => setAuthenticated(false)} className="inline-flex items-center gap-2 text-sm font-bold text-primary"><LogOut size={15} /> Sign out</button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[1240px] px-5 py-12 md:px-10 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow text-accent">PWADMIN / site administration</p>
            <h1 className="mt-4 font-display text-5xl md:text-7xl">The publishing desk.</h1>
            <p className="mt-5 max-w-xl leading-7 text-muted-foreground">Manage field notes and the public team directory. Changes are saved in this browser until a database is connected.</p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-xs font-bold text-primary"><Sparkles size={14} /> {posts.length} posts · {staff.length} staff</div>
        </div>

        <div className="mt-12 flex flex-wrap gap-2 border-b border-border pb-3">
          <button type="button" onClick={() => setActiveTab('posts')} className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition-colors ${activeTab === 'posts' ? 'bg-primary text-primary-foreground' : 'text-primary hover:bg-secondary'}`}><Pencil size={15} /> Blog posts</button>
          <button type="button" onClick={() => setActiveTab('staff')} className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition-colors ${activeTab === 'staff' ? 'bg-primary text-primary-foreground' : 'text-primary hover:bg-secondary'}`}><Users size={15} /> Staff directory</button>
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
                <button type="submit" className="mt-2 inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground">{editingId ? <Pencil size={16} /> : <Plus size={16} />}{editingId ? 'Save changes' : 'Publish post'}</button>
              </div>
            </form>
            <section>
              <div className="mb-5 flex items-center justify-between"><h2 className="font-display text-3xl">Your posts</h2><span className="font-mono-ui text-[10px] uppercase tracking-[.13em] text-muted-foreground">Browser storage</span></div>
              <div className="grid gap-4">{posts.map((post) => <article key={post.id} className="flex gap-4 border-t border-border py-5"><img src={assetPath(post.image || '/provisa-record.jpg')} alt="" className="h-24 w-28 shrink-0 rounded-xl object-cover" /><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-[.1em] text-muted-foreground"><span className={isVisiblePost(post) ? 'text-accent' : 'text-primary'}>{isVisiblePost(post) ? 'Visible' : 'Scheduled / expired'}</span>{post.expiresAt && <span>Until {new Date(post.expiresAt).toLocaleDateString()}</span>}</div><h3 className="mt-2 font-display text-2xl">{post.title}</h3><p className="mt-1 line-clamp-2 text-xs leading-6 text-muted-foreground">{post.excerpt}</p></div><div className="flex shrink-0 items-start gap-2"><button type="button" onClick={() => editPost(post)} className="grid h-9 w-9 place-items-center rounded-full border border-border text-primary hover:bg-secondary" aria-label={`Edit ${post.title}`}><Pencil size={14} /></button><button type="button" onClick={() => persistPosts(posts.filter((item) => item.id !== post.id))} className="grid h-9 w-9 place-items-center rounded-full border border-border text-accent hover:bg-secondary" aria-label={`Delete ${post.title}`}><Trash2 size={14} /></button></div></article>)}</div>
            </section>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[.85fr_1.15fr]">
            <form onSubmit={saveStaffMember} className="admin-editor-card rounded-[1.75rem] bg-secondary/80 p-7 text-foreground md:p-9">
              <div className="flex items-center justify-between"><h2 className="font-display text-3xl">{editingStaffId ? 'Edit staff member' : 'Add staff member'}</h2>{editingStaffId && <button type="button" onClick={resetStaffForm} className="text-xs font-bold text-primary">Cancel</button>}</div>
              <div className="mt-8 grid gap-5">
                <label className="grid gap-2 text-xs font-bold uppercase tracking-[.1em]">Name<input required value={staffForm.name} onChange={(event) => setStaffForm({ ...staffForm, name: event.target.value })} className="rounded-xl border border-border bg-background px-4 py-3 text-sm normal-case tracking-normal outline-none" placeholder="Team member name" /></label>
                <label className="grid gap-2 text-xs font-bold uppercase tracking-[.1em]">Role<input required value={staffForm.role} onChange={(event) => setStaffForm({ ...staffForm, role: event.target.value })} className="rounded-xl border border-border bg-background px-4 py-3 text-sm normal-case tracking-normal outline-none" placeholder="Role or desk" /></label>
                <label className="grid gap-2 text-xs font-bold uppercase tracking-[.1em]">Short biography<textarea required rows={5} value={staffForm.bio} onChange={(event) => setStaffForm({ ...staffForm, bio: event.target.value })} className="rounded-xl border border-border bg-background px-4 py-3 text-sm normal-case tracking-normal outline-none" placeholder="A short introduction for the public team section." /></label>
                <label className="grid gap-2 text-xs font-bold uppercase tracking-[.1em]"><span className="flex items-center gap-2"><ImagePlus size={13} /> Portrait</span><input type="file" accept="image/*" onChange={(event) => chooseImage(event, 'staff')} className="block w-full text-xs file:mr-3 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:font-bold file:text-accent-foreground" /></label>
                {staffImagePreview && <img src={staffImagePreview} alt="Selected staff portrait preview" className="aspect-[.9] w-full rounded-xl object-cover" />}
                <button type="submit" className="mt-2 inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground">{editingStaffId ? <Pencil size={16} /> : <UserPlus size={16} />}{editingStaffId ? 'Save staff changes' : 'Add staff member'}</button>
              </div>
            </form>
            <section>
              <div className="mb-5 flex items-center justify-between"><h2 className="font-display text-3xl">Staff directory</h2><span className="font-mono-ui text-[10px] uppercase tracking-[.13em] text-muted-foreground">Browser storage</span></div>
              <div className="grid gap-4 sm:grid-cols-2">{staff.map((member) => <article key={member.id} className="border-t border-border pt-5"><div className="flex gap-4"><img src={assetPath(member.image || '/stock/team-strategy.jpg')} alt="" className="h-20 w-20 shrink-0 rounded-xl object-cover" /><div className="min-w-0"><h3 className="font-display text-2xl">{member.name}</h3><p className="mt-1 text-xs font-bold uppercase tracking-[.1em] text-accent">{member.role}</p><p className="mt-3 text-xs leading-6 text-muted-foreground">{member.bio}</p></div></div><div className="mt-4 flex gap-2"><button type="button" onClick={() => editStaffMember(member)} className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-xs font-bold text-primary hover:bg-secondary"><Pencil size={13} /> Edit</button><button type="button" onClick={() => persistStaff(staff.filter((item) => item.id !== member.id))} className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-xs font-bold text-accent hover:bg-secondary"><Trash2 size={13} /> Delete</button></div></article>)}</div>
            </section>
          </div>
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
  return <RoutedErrorBoundary><Switch><Route path="/" component={Home} /><Route path="/founder" component={FounderPage} /><Route path="/pwadmin" component={AdminPage} /><Route component={NotFound} /></Switch></RoutedErrorBoundary>;
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

    if (initialPath === '/pwadmin') {
      return <AdminPage />;
    }

    return <Home />;
  }

  return <WouterRouter base="/"><Router /></WouterRouter>;
}

export default function SiteApp({ initialPath }: { initialPath?: string }) {
  return <App initialPath={initialPath} />;
}