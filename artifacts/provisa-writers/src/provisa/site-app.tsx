'use client';

import { upload } from '@vercel/blob/client';
import { type ChangeEvent, type FormEvent, type ReactNode, type TouchEvent, useEffect, useState } from 'react';
import {
  ArrowRight,
  ArrowUp,
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  ClipboardCheck,
  Eye,
  EyeOff,
  Globe2,
  ImagePlus,
  Instagram,
  Linkedin,
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
import { founderDescriptor, founderIntro, founderStory } from './content-copy';
import { legalDocuments, legalReviewNote, type LegalDocumentSlug, getLegalDocumentBySlug } from './legal-content';
import { serviceCatalog, type ServiceSlug, getServiceBySlug } from './service-catalog';
import {
  DEMO_TESTIMONIALS_STORAGE_KEY,
  readDemoTestimonials,
  releaseDemoTestimonialUrls,
  saveDemoTestimonialImage,
  writeDemoTestimonials,
  type DemoTestimonial,
} from './testimonial-demo-storage';

const BLOG_STORAGE_KEY = 'provisa-template-2-blog-posts';
const STAFF_STORAGE_KEY = 'provisa-template-2-staff';
const DEMO_MODE_STORAGE_KEY = 'provisa-site-black-background-demo';
const TESTIMONIAL_DEMO_MODE =
  process.env.NODE_ENV !== 'production' ||
  process.env.NEXT_PUBLIC_TESTIMONIAL_DEMO_MODE === 'true';

const assetPath = (path: string) => {
  if (path.startsWith('data:') || path.startsWith('http') || path.startsWith('blob:') || path.startsWith('/')) return path;
  return `/${path.replace(/^\/+/, '')}`;
};

const routePath = (path: string) => path.startsWith('/') ? path : `/${path}`;
const firstParagraph = (text: string) => text.split(/\n\s*\n/)[0]?.trim() || '';

function useScrollReveals() {
  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      document.documentElement.classList.remove('js');
      return;
    }

    document.documentElement.classList.add('js');
    const observedTargets = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('is-visible', entry.isIntersecting);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.04 });

    const observeTarget = (target: Element) => {
      if (!(target instanceof HTMLElement) || observedTargets.has(target)) return;
      observedTargets.add(target);
      observer.observe(target);
    };
    const observeTree = (node: Node) => {
      if (!(node instanceof HTMLElement)) return;
      if (node.matches('.reveal')) observeTarget(node);
      node.querySelectorAll('.reveal').forEach(observeTarget);
    };

    observeTree(document.documentElement);
    const mutations = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach(observeTree);
      });
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, []);
}

async function requestAdminLogin(username: string, password: string): Promise<string | null> {
  let response: Response;
  try {
    response = await fetch('/provisa-api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
  } catch {
    return 'Unable to connect to the sign-in service. Check your connection and try again.';
  }

  const body = await response.json().catch(() => null) as { error?: string } | null;
  if (response.ok) return null;
  if (typeof body?.error === 'string') return body.error;
  if (response.status >= 500) {
    return 'The sign-in service is temporarily unavailable. Please try again shortly.';
  }
  return 'Unable to sign in. Please check the username and password.';
}

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

type Testimonial = DemoTestimonial;
type TestimonialForm = Omit<Testimonial, 'id'>;
const MAX_HOME_TESTIMONIALS = 4;

const services = serviceCatalog;

const people = [
  { title: 'Healthcare & Life Sciences', text: 'Physicians, dentists, pharmacists, nurses, public health professionals, biomedical professionals and other healthcare specialists.', image: '/stock/who-we-can-help/healthcare.webp', imageAlt: 'Portrait of a professional woman in business attire' },
  { title: 'Science, Engineering & Technology', text: 'Scientists, researchers, engineers, software professionals, data scientists, technologists and innovators.', image: '/stock/who-we-can-help/science-technology.webp', imageAlt: 'Professionals collaborating around laptops' },
  { title: 'Academia, Education & Research', text: 'Professors, lecturers, educators, academic researchers, scholars and education professionals.', image: '/stock/who-we-can-help/academia.webp', imageAlt: 'Colleagues reviewing notes around a table' },
  { title: 'Business & Finance', text: 'Executives, business leaders, economists, finance professionals and management professionals.', image: '/stock/who-we-can-help/business-finance.webp', imageAlt: 'Portrait of a professional man' },
  { title: 'Law, Policy & Professional Services', text: 'Lawyers, consultants, analysts, policy professionals, accountants and other specialized professional-services practitioners.', image: '/stock/who-we-can-help/law-policy.webp', imageAlt: 'Portrait of Provisa founder Mercy Allison' },
  { title: 'Arts, Media, Communications & Creative Industries', text: 'Writers, journalists, artists, designers, media professionals, communicators and other creative professionals.', image: '/stock/who-we-can-help/arts-media.webp', imageAlt: 'Notebook, pen and professional documents on a desk' },
  { title: 'Social Sciences & Public Impact', text: 'Social scientists, development professionals, NGO leaders, public-sector professionals, community leaders and specialists whose work creates broader social impact.', image: '/stock/who-we-can-help/social-impact.webp', imageAlt: 'A group sitting together outdoors by the water' },
];

const founderProfile = {
  name: 'Mercy Allison',
  role: 'Founder and Lead Consultant',
  descriptor: founderDescriptor,
  image: '/stock/founder-mercy.jpg',
  summary: [founderIntro],
  paragraphs: founderStory.split('\n\n'),
};

type StaffMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
};

const defaultStaffBios: Record<string, string> = {
  'Research Analyst': 'Supports focused research and analysis for clear, well-positioned professional profiles.',
  'Operations Manager': 'Coordinates day-to-day operations to support an organized client experience.',
};

const seedStaff: StaffMember[] = [
  { id: 'staff-1', name: 'Esther Youpele', role: 'Research Analyst', bio: defaultStaffBios['Research Analyst'], image: '/stock/team-research-analysis.jpg' },
  { id: 'louis-ebitari', name: 'Louis Ebitari', role: 'Operations Manager', bio: defaultStaffBios['Operations Manager'], image: '/no-profile-avatar.svg' },
];

function normalizeStaff(staff: StaffMember[]): StaffMember[] {
  const hasLead = staff.some((member) => member.id === 'staff-1');
  return staff
    .filter((member) => !['staff-2', 'staff-3', 'staff-4'].includes(member.id) && !(hasLead && member.id === 'esther-youpele'))
    .map((member) => {
      let normalized = member;
      if (member.id === 'staff-1') {
        normalized = { ...member, name: 'Esther Youpele', role: 'Research Analyst', image: '/stock/team-research-analysis.jpg' };
      } else if (member.id === 'esther-youpele') {
        normalized = { ...member, name: 'Esther Youpele', role: 'Research Analyst', image: '/stock/team-research-analysis.jpg' };
      }
      return {
        ...normalized,
        bio: normalized.bio?.trim() || defaultStaffBios[normalized.role] || '',
      };
    });
}

const navItems = [
  { label: 'About Us', href: '#about', children: [
    { label: 'About Provisa Writers Ltd.', href: '#about' },
    { label: 'Our Team', href: '#team' },
  ] },
  { label: 'Our Services', href: '#services', children: [
    { label: 'All Services', href: '/services' },
    { label: 'Global Opportunities Consulting', href: '#global-opportunities-consulting' },
    { label: 'US Skilled Worker Migration', href: '#us-skilled-worker-migration' },
    { label: 'Visa Application Support', href: '#visa-application-support' },
  ] },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Blog', href: '#blog' },
  { label: 'FAQ', href: '#faq' },
];

function NavigationLinks({ mobile = false, onNavigate, onOpenSidebar }: { mobile?: boolean; onNavigate?: () => void; onOpenSidebar: (tab: 'blog' | 'faq') => void }) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const closeDropdowns = () => setOpenDropdown(null);
    window.addEventListener('scroll', closeDropdowns, { passive: true });
    return () => window.removeEventListener('scroll', closeDropdowns);
  }, []);

  return navItems.map((item) => item.href === '#blog' || item.href === '#faq' ? (
    <button key={item.href} type="button" onClick={() => onOpenSidebar(item.href === '#blog' ? 'blog' : 'faq')} className={`text-left font-semibold text-foreground transition-colors hover:text-primary ${mobile ? 'rounded-xl px-3 py-3 text-sm hover:bg-muted' : 'text-[11px]'}`}>
      {item.label}
    </button>
  ) : item.children ? (
    <details
      key={item.label}
      open={openDropdown === item.label}
      onMouseEnter={() => { if (!mobile) setOpenDropdown(item.label); }}
      onMouseLeave={() => { if (!mobile) setOpenDropdown((current) => current === item.label ? null : current); }}
      className={`nav-dropdown relative ${mobile ? 'border-b border-border' : ''}`}
    >
      <summary
        aria-expanded={openDropdown === item.label}
        onClick={(event) => {
          event.preventDefault();
          setOpenDropdown((current) => current === item.label ? null : item.label);
        }}
        className={`flex cursor-pointer items-center gap-1.5 font-semibold text-foreground transition-colors hover:text-primary ${mobile ? 'px-3 py-3 text-sm' : 'py-4 text-[11px]'}`}
      >
        {item.label}<ChevronDown size={14} className="nav-chevron transition-transform" />
      </summary>
      <div className={mobile ? 'grid gap-1 pb-3 pl-4' : 'absolute left-0 top-full z-50 grid min-w-[240px] gap-1 rounded-xl border border-border bg-background p-2 shadow-xl'}>
        {item.children.map((child) => (
          <a key={child.href} href={child.href} onClick={onNavigate} className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary">
            {child.label}
          </a>
        ))}
      </div>
    </details>
  ) : (
    <a key={item.href} href={item.href} onClick={onNavigate} className={`font-semibold text-foreground transition-colors hover:text-primary ${mobile ? 'rounded-xl px-3 py-3 text-sm hover:bg-muted' : 'text-[11px]'}`}>
      {item.label}
    </a>
  ));
}

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
  ['Who is Provisa for?', 'We work with professionals, researchers, executives and other accomplished individuals seeking to expand their professional reach internationally.'],
  ['What kinds of opportunities can Provisa help me pursue?', 'Depending on your profile, we may help you pursue global career and mobility pathways, international conferences, fellowships, professional memberships, recognition opportunities and other international professional opportunities.'],
  ['Does Provisa only work on U.S. immigration?', 'No. U.S. immigration pathways are one area of our work. Our broader focus is helping professionals translate their achievements into credible global opportunities.'],
  ['Do I need to already be highly accomplished to work with Provisa?', 'Our services are designed primarily for professionals with meaningful education, expertise, achievements or professional impact. We assess your profile to determine which opportunities may be appropriate for you.'],
  ['Can Provisa guarantee that I will receive an opportunity?', 'No. We cannot guarantee admission, selection, approval, membership, funding, employment or any other third-party decision. Our role is to help you strategically position your profile and prepare strong, evidence-based submissions.'],
  ['What does “global professional positioning” mean?', 'It means strategically communicating your expertise, achievements, impact and professional identity in a way that makes your profile understandable and compelling to relevant international institutions and opportunity providers.'],
  ['Does Provisa write applications for clients?', 'We develop and refine professional materials and supporting narratives as part of our services. Our work goes beyond writing: we examine your achievements, identify relevant evidence and help position your profile for the objective you are pursuing.'],
  ['What documents do I need to get started?', 'The documents you need depend on the service you are interested in. Generally, we begin with your professional profile, CV or résumé, academic and professional credentials, evidence of your achievements, and any relevant supporting documents. After an initial assessment, we will let you know exactly what is required for your specific service.'],
  ['Can I work with Provisa remotely?', 'Yes. Provisa works with professionals remotely, regardless of their location. Our consultations, document reviews, profile development, and other services can be handled online, allowing you to work with us from anywhere.'],
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
    const updatedStaff = normalizeStaff(currentStaff);
    if (updatedStaff.length === 1 && updatedStaff[0].id === 'staff-1') {
      updatedStaff.push(seedStaff[1]);
    }
    if (JSON.stringify(updatedStaff) !== JSON.stringify(parsed)) {
      window.localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(updatedStaff));
    }
    return updatedStaff;
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
      <span className="grid h-11 w-11 place-items-center rounded-full border-2 border-current">
        <span className="h-4 w-4 rounded-full bg-accent" />
      </span>
      <span className="leading-none">
        <strong className="block text-[18px] font-black tracking-[-.04em]">PROVISA</strong>
        <small className="mt-1 block text-[9px] font-extrabold tracking-[.16em]">WRITERS LTD.</small>
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
          <div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground"><BookOpen size={16} /></span><div><p className="eyebrow text-accent">Provisa Field Guide</p><p className="mt-1 text-xs text-muted-foreground">Notes and useful answers</p></div></div>
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full border border-border text-primary" aria-label="Close field guide"><X size={18} /></button>
        </div>
        <div className="mt-7 flex gap-2">
          <button type="button" onClick={() => onTabChange('blog')} className={`rounded-full px-4 py-2.5 text-xs font-bold ${tab === 'blog' ? 'bg-primary text-primary-foreground' : 'text-primary hover:bg-secondary'}`}>Blog</button>
          <button type="button" onClick={() => onTabChange('faq')} className={`rounded-full px-4 py-2.5 text-xs font-bold ${tab === 'faq' ? 'bg-primary text-primary-foreground' : 'text-primary hover:bg-secondary'}`}>FAQ</button>
        </div>
        {tab === 'blog' ? (
          <div className="mt-9">
            <p className="eyebrow text-accent">From the Field Notes</p>
            <h2 className="mt-4 font-display text-4xl leading-tight">Notes for the Next Move.</h2>
            {visiblePosts.length ? <div className="mt-8 grid gap-5">{visiblePosts.map((post) => <article key={post.id} className="overflow-hidden border border-border bg-secondary/40"><img src={assetPath(post.image || '/provisa-record.jpg')} alt="" className="aspect-[1.7] w-full object-cover" /><div className="p-5"><div className="flex items-center gap-2 font-mono-ui text-[10px] uppercase tracking-[.12em] text-accent"><CalendarDays size={13} /> Field note</div><h3 className="mt-4 font-display text-2xl">{post.title}</h3><p className="mt-2 text-sm leading-7 text-muted-foreground">{post.excerpt}</p><details className="mt-4 border-t border-border pt-4"><summary className="cursor-pointer text-sm font-bold">Read the note</summary><p className="mt-4 text-sm leading-7 text-muted-foreground">{post.body}</p></details></div></article>)}</div> : <p className="mt-8 border-y border-border py-8 text-sm text-muted-foreground">New field notes are being prepared.</p>}
          </div>
        ) : (
          <div className="mt-9">
            <p className="eyebrow text-accent">Frequently Asked</p>
            <h2 className="mt-4 font-display text-4xl leading-tight">The Questions Worth Asking Before You Begin.</h2>
            <div className="mt-8 divide-y divide-border border-y border-border">{faqs.map(([question, answer]) => <details key={question} className="group py-5"><summary className="flex cursor-pointer items-center justify-between gap-4 text-base font-bold"><span>{question}</span><ChevronDown size={18} className="shrink-0 text-primary transition-transform group-open:rotate-180" aria-hidden="true" /></summary><p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">{answer}</p></details>)}</div>
          </div>
        )}
        <a href="#contact" onClick={onClose} className="mt-10 inline-flex min-h-12 w-fit items-center gap-3 rounded-full bg-accent px-6 text-sm font-bold text-accent-foreground">Talk to the Team <ArrowRight size={16} /></a>
      </aside>
    </div>
  );
}

function TestimonialCard({ testimonial, index }: { testimonial: Testimonial; index: number }) {
  const delayClass = index % 3 === 1
    ? 'reveal-delay-1'
    : index % 3 === 2
      ? 'reveal-delay-2'
      : '';

  return (
    <article className={`rounded-[1.25rem] border border-border bg-background p-6 md:p-8 reveal ${delayClass}`}>
      {testimonial.image && (
        <img
          src={assetPath(testimonial.image)}
          alt={testimonial.attribution ? `Testimonial screenshot: ${testimonial.attribution}` : 'Client testimonial screenshot'}
          loading="lazy"
          decoding="async"
          className="mx-auto mb-5 max-h-48 w-full rounded-lg bg-secondary/30 object-contain"
        />
      )}
      {testimonial.attribution && (
        <h3 className="font-display text-lg leading-snug md:text-xl">{testimonial.attribution}</h3>
      )}
      {testimonial.quote && (
        <blockquote className="mt-3 whitespace-pre-line text-sm leading-7 text-muted-foreground md:text-base">
          “{testimonial.quote}”
        </blockquote>
      )}
    </article>
  );
}

function FounderPage() {
  useScrollReveals();
  const [staff, setStaff] = useState<StaffMember[]>(readStaff);
  const [profile, setProfile] = useState(founderProfile);

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
  }, []);

  return (
    <div className="template-two grain min-h-[100dvh]">
      <header className="border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1240px] items-center justify-between px-5 lg:px-8">
          <Logo />
          <a href={routePath('/#team')} className="inline-flex items-center gap-2 text-sm font-bold text-primary transition-colors hover:text-accent"><ArrowRight className="rotate-180" size={16} /> Back to Meet the Team</a>
        </div>
      </header>
      <main>
        <section className="border-b border-border bg-secondary/35 px-5 py-16 md:px-10 md:py-24">
          <article className="mx-auto flow-root max-w-[1240px] text-base leading-8 text-muted-foreground md:text-lg">
            <img src={assetPath(profile.image)} alt="Professional portrait representing Mercy Allison, founder of Provisa Writers" className="founder-portrait reveal mb-8 w-full rounded-[1.5rem] object-cover md:float-right md:mb-8 md:ml-12 md:w-[42%]" />
            <div className="reveal reveal-delay-1">
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
            <p className="section-kicker eyebrow text-accent reveal">Meet the Team</p>
            <div className="mt-8 grid gap-8">
              {staff.map((member) => (
                <article key={member.id} className="grid gap-8 border-t border-border pt-8 md:grid-cols-[1.2fr_.8fr] md:items-start md:gap-12 reveal">
                  <div className="md:py-3">
                    <h2 className="font-display text-3xl md:text-5xl">{member.name}</h2>
                    <p className="mt-2 text-xs font-extrabold uppercase tracking-[.04em] text-primary md:text-sm">{member.role}</p>
                    {member.bio && <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground">{firstParagraph(member.bio)}</p>}
                  </div>
                  <img src={assetPath(member.image || '/no-profile-avatar.svg')} alt={member.image.includes('no-profile-avatar') ? `Default avatar for ${member.name}` : `${member.name} team portrait`} loading="lazy" decoding="async" className="aspect-[1.25] w-full rounded-[1rem] object-cover" />
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
    </div>
  );
}

function Home() {
  useScrollReveals();
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
  const [questionExpanded, setQuestionExpanded] = useState(false);
  const [posts, setPosts] = useState<BlogPost[]>(readPosts);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [testimonialStorageError, setTestimonialStorageError] = useState('');

  useEffect(() => {
    let active = true;
    let demoTestimonials: Testimonial[] = [];
    const syncTeam = () => setTeam([{ id: 'founder', name: founderProfile.name, role: founderProfile.role, bio: founderProfile.summary[0], image: '/stock/founder-mercy.jpg' }, ...readStaff()]);
    const syncDemoTestimonials = (event?: StorageEvent) => {
      if (
        event &&
        event.key !== null &&
        event.key !== DEMO_TESTIMONIALS_STORAGE_KEY
      ) {
        return;
      }
      void readDemoTestimonials()
        .then((saved) => {
          if (!active) {
            releaseDemoTestimonialUrls(saved);
            return;
          }
          releaseDemoTestimonialUrls(demoTestimonials);
          demoTestimonials = saved;
          setTestimonials(saved);
          setTestimonialStorageError('');
        })
        .catch((error) => {
          if (active) {
            setTestimonialStorageError(
              error instanceof Error
                ? error.message
                : 'Demo testimonials could not be loaded from this browser.',
            );
          }
        });
    };
    window.addEventListener('storage', syncTeam);
    if (TESTIMONIAL_DEMO_MODE) {
      syncDemoTestimonials();
      window.addEventListener('storage', syncDemoTestimonials);
    }
    void fetch('/provisa-api/content').then((response) => response.ok ? response.json() : null).then((content) => {
      if (!content) return;
      const founder = content.founder;
      setTeam([{ id: 'founder', name: founder?.name || founderProfile.name, role: founder?.role || founderProfile.role, bio: firstParagraph(founder?.summary || founderProfile.summary.join('\n\n')), image: founder?.image || '/stock/founder-mercy.jpg' }, ...normalizeStaff(content.staff || [])]);
      if (content.posts) setPosts(content.posts);
      if (content.testimonials && !TESTIMONIAL_DEMO_MODE) {
        setTestimonials(content.testimonials);
      }
    }).catch(() => undefined);
    return () => {
      active = false;
      releaseDemoTestimonialUrls(demoTestimonials);
      window.removeEventListener('storage', syncTeam);
      window.removeEventListener('storage', syncDemoTestimonials);
    };
  }, []);

  useEffect(() => {
    setTeamIndex((current) => Math.min(current, Math.max(team.length - 1, 0)));
  }, [team.length]);

  useEffect(() => {
    const teamSection = document.getElementById('team');
    if (!teamSection) return;

    const preloadStaffPortraits = () => {
      team
        .filter((member) => member.id !== 'founder' && member.image)
        .forEach((member) => {
          const image = new window.Image();
          image.decoding = 'async';
          image.fetchPriority = 'low';
          image.src = assetPath(member.image);
          void image.decode().catch(() => undefined);
        });
    };

    if (!('IntersectionObserver' in window)) {
      preloadStaffPortraits();
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      preloadStaffPortraits();
      observer.disconnect();
    }, { rootMargin: '360px 0px' });
    observer.observe(teamSection);
    return () => observer.disconnect();
  }, [team]);

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
    const subject = encodeURIComponent(`Consultation request from ${String(data.get('name') || 'website visitor')}`);
    const body = encodeURIComponent(
      `Service of interest: ${String(data.get('service') || '')}\nName: ${String(data.get('name') || '')}\nEmail: ${String(data.get('email') || '')}\n\nQuestion:\n${String(data.get('question') || '')}`,
    );
    window.location.href = `mailto:info@provisawriters.com?subject=${subject}&body=${body}`;
    setQuestionExpanded(false);
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
            <NavigationLinks onOpenSidebar={openSidebar} />
          </nav>
          <div className="hidden items-center gap-4 md:flex">
            <a href="#contact" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-accent px-5 text-[12px] font-bold text-accent-foreground transition-transform hover:-translate-y-0.5">
              Book a consultation <ArrowRight size={15} />
            </a>
          </div>
          <button type="button" className="grid h-10 w-10 place-items-center rounded-full border border-border lg:hidden" onClick={() => setMobileOpen((open) => !open)} aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={mobileOpen}>
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
        {mobileOpen && (
          <nav className="border-t border-border bg-background px-5 py-5 lg:hidden" aria-label="Mobile navigation">
            <div className="grid gap-1">
               <NavigationLinks mobile onNavigate={closeMenu} onOpenSidebar={openSidebar} />
            </div>
            <a onClick={closeMenu} href="#contact" className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-accent text-sm font-bold text-accent-foreground">Book a consultation <ArrowRight size={15} /></a>
          </nav>
        )}
      </header>

      <main>
         <section className="border-b border-border bg-secondary/35 px-5 py-14 md:px-10 md:py-20">
          <div className="mx-auto grid max-w-[1240px] items-end gap-12 md:grid-cols-[.95fr_1.05fr]">
            <div className="reveal">
              <p className="eyebrow text-accent">Field Note / 01 · A Professional Record</p>
                <h1 className="hero-title mt-6 max-w-3xl font-display text-[clamp(2.5rem,4.25vw,4.25rem)] leading-[.96] tracking-[-.05em]">Connecting <span className="text-accent">Professionals to Global Opportunities</span></h1>
               <p className="mt-8 max-w-lg text-lg font-bold leading-8 text-foreground">Discover • Access • Pursue</p>
              <div className="mt-9 flex flex-wrap gap-4">
                <button type="button" onClick={() => openSidebar('blog')} className="inline-flex min-h-12 items-center gap-3 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5">Open the field guide <ArrowRight size={16} /></button>
              </div>
            </div>
              <div className="reveal reveal-delay-2 relative mx-auto w-full max-w-[560px] md:mx-0 md:ml-auto">
              <div className="absolute -left-3 top-8 z-10 max-w-[190px] rotate-[-3deg] bg-accent p-4 text-xs font-bold leading-5 text-accent-foreground shadow-quiet sm:-left-5">Good work leaves clues. We help you connect them.</div>
               <div className="hero-record-frame">
                    <img src={assetPath('/provisa-global-opportunities.webp')} alt="A globe and passport on a desk overlooking international landmarks as an airplane flies overhead" className="aspect-[1.12] w-full rounded-[1rem] object-cover md:rotate-2" />
               </div>
            </div>
          </div>
        </section>

            <section id="about" className="scroll-mt-24 mx-auto max-w-[1240px] px-5 py-16 md:px-10 md:py-20">
              <div className="reveal">
                <p className="section-kicker eyebrow text-accent">About Provisa</p>
                <h2 className="mt-4 max-w-3xl font-display text-4xl leading-tight md:text-6xl">Global Opportunities Should Be Easier to See.</h2>
              </div>
             <div className="mt-12 grid gap-10 border-t border-border pt-8 md:grid-cols-2 md:gap-16">
                <div className="reveal">
                  <h3 className="font-display text-3xl">Our Mission.</h3>
                  <p className="mt-4 text-sm leading-8 text-muted-foreground md:text-base">To help professionals access global opportunities by strategically positioning their expertise, achievements and professional credentials for opportunities beyond their home countries.</p>
               </div>
                <div className="reveal reveal-delay-1">
                  <h3 className="font-display text-3xl">Our Vision.</h3>
                  <p className="mt-4 text-sm leading-8 text-muted-foreground md:text-base">We envision a world where geography does not limit professional ambition, and where talented individuals can access the visibility, networks, recognition and opportunities they need to thrive on the global stage.</p>
               </div>
             </div>
           </section>

            <section id="services" className="scroll-mt-24 bg-primary px-5 py-16 text-primary-foreground md:px-10 md:py-24">
          <div className="mx-auto max-w-[1240px]">
             <div className="flex flex-wrap items-end justify-between gap-8">
               <div className="reveal">
                  <p className="section-kicker eyebrow text-accent">Our Services</p>
                  <h2 className="mt-4 max-w-2xl font-display text-4xl leading-tight md:text-6xl">From Opportunity Discovery to Professional Support.</h2>
              </div>
            </div>
                <div className="mt-14 grid gap-4 lg:grid-cols-3">
                  {services.map((service, index) => (
                      <article key={service.slug} id={service.slug} className={`glass-card flex flex-col scroll-mt-28 rounded-[1.25rem] p-6 text-primary-foreground reveal ${index === 1 ? 'reveal-delay-1' : index > 1 ? 'reveal-delay-2' : ''}`}>
                       <span className="font-mono-ui text-xs text-accent">0{index + 1} / Service</span>
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
                        <div className="mt-auto pt-7">
                          <a href={routePath(`/services#${service.slug}`)} aria-label={`Learn more about ${service.title}`} className="inline-flex items-center gap-2 text-sm font-bold text-accent transition-colors hover:text-primary-foreground">Learn More <ArrowRight size={16} /></a>
                        </div>
                    </article>
                  ))}
                </div>
                 <div className="mt-7 flex flex-wrap items-end justify-between gap-5 border-l-2 border-accent pl-5 text-primary-foreground reveal">
                   <p className="max-w-3xl text-sm leading-7 text-primary-foreground/85">We operate across two connected areas: helping professionals find relevant global opportunities and helping them secure those global opportunities.</p>
                   <a href="#contact" className="inline-flex items-center gap-2 border-b border-primary-foreground/40 pb-2 text-sm font-bold transition-colors hover:text-accent">Start a conversation <ArrowRight size={16} /></a>
                 </div>
                <div className="mt-16 border-t border-primary-foreground/20 pt-10">
                     <p className="section-kicker eyebrow text-primary-foreground reveal">Who We Can Help</p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                     {people.map(({ title, text, image, imageAlt }, index) => (
                       <article key={title} className={`grid min-h-[152px] grid-cols-[38%_minmax(0,1fr)] items-stretch overflow-hidden border border-primary-foreground/15 transition-colors hover:border-primary-foreground/40 reveal ${index === 1 ? 'reveal-delay-1' : index > 1 ? 'reveal-delay-2' : ''}`}>
                        <img src={assetPath(image)} alt={imageAlt} loading="lazy" decoding="async" className="h-full min-h-[152px] w-full object-cover" />
                         <div className="flex min-w-0 flex-col justify-center p-4 text-primary-foreground">
                           <h3 className="text-sm font-bold leading-snug">{title}</h3>
                           <p className="mt-2 text-xs leading-5">{text}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                   <p className="mt-6 max-w-3xl text-sm leading-7 text-primary-foreground">
                    If your profession is not listed, get in touch to discuss how Provisa may support your international goals.
                  </p>
                </div>
             <div className="mt-20 grid gap-8 border-t border-primary-foreground/20 pt-10 md:grid-cols-[.7fr_1.3fr] md:items-center">
                 <div className="reveal"><p className="section-kicker eyebrow text-accent">How We Begin</p><h3 className="mt-4 font-display text-4xl">No Grand Promises. Just a Better Next Conversation.</h3></div>
                 <div className="glass-card rounded-[1.75rem] p-7 text-primary-foreground md:p-9 reveal reveal-delay-1">
                  <ClipboardCheck className="text-accent" size={28} />
                  <h3 className="mt-6 font-display text-3xl">The Profile Assessment</h3>
                  <p className="mt-4 max-w-lg leading-7 text-primary-foreground/70">A short intake helps us understand your work, recognition, documentation and the question you are really trying to answer.</p>
                  <div className="mt-7 grid gap-3 border-t border-primary-foreground/15 pt-5 text-sm sm:grid-cols-3">{['Your context', 'Your evidence', 'Your next step'].map((item) => <span key={item} className="flex items-center gap-2 font-semibold"><Check size={15} className="text-accent" />{item}</span>)}</div>
               </div>
             </div>
          </div>
        </section>

          <section id="team" className="scroll-mt-24 bg-secondary/45 px-5 py-16 md:px-10 md:py-24">
             <div className="mx-auto max-w-[1240px]">
               <p className="section-kicker eyebrow text-accent reveal">Our Team</p>
               <div className="mt-8 reveal reveal-delay-1">
                 {team.length > 0 && (
                   <div className="team-carousel relative" onTouchStart={(event) => setTouchStartX(event.touches[0].clientX)} onTouchEnd={handleTeamTouchEnd}>
                     <article key={team[teamIndex].id} className="team-slide grid overflow-hidden border border-border bg-background md:h-[420px] md:grid-cols-[.72fr_1.28fr]" aria-live="polite">
                        <img src={assetPath(team[teamIndex].image)} alt={team[teamIndex].image.includes('no-profile-avatar') ? `Default avatar for ${team[teamIndex].name}` : `${team[teamIndex].name} team portrait`} loading="lazy" decoding="async" fetchPriority="high" className="h-[300px] w-full object-cover md:h-full" />
                         <div className="flex min-h-[270px] flex-col items-start justify-start p-7 text-left md:p-10">
                           <div className="w-full">
                             <h3 className="max-w-xl font-display text-3xl md:text-5xl">{team[teamIndex].name}</h3>
                             <p className="mt-2 text-xs font-extrabold uppercase tracking-[.04em] text-accent md:text-sm">{team[teamIndex].role}</p>
                             {team[teamIndex].bio && <p className="mt-5 max-w-lg whitespace-pre-line text-sm leading-7 text-muted-foreground">{firstParagraph(team[teamIndex].bio)}</p>}
                             {team[teamIndex].id === 'founder' && <a href={routePath('/founder')} className="mt-6 inline-flex items-center gap-2 border-b border-primary/30 pb-2 text-sm font-bold text-primary transition-colors hover:border-accent hover:text-accent">Read Mercy&apos;s Story <ArrowRight size={16} /></a>}
                          </div>
                        </div>
                     </article>
                     {team.length > 1 && <>
                        <button type="button" onClick={() => moveTeam(-1)} className="absolute left-3 top-[150px] z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-border bg-background/95 text-primary shadow-lg transition-transform hover:scale-105 md:top-[210px]" aria-label="Previous team member"><ChevronLeft size={18} /></button>
                        <button type="button" onClick={() => moveTeam(1)} className="absolute right-3 top-[150px] z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-border bg-background/95 text-primary shadow-lg transition-transform hover:scale-105 md:top-[210px]" aria-label="Next team member"><ChevronRight size={18} /></button>
                       <div className="mt-5 flex items-center justify-between gap-5">
                         <div className="flex gap-2" aria-label="Team carousel pagination">{team.map((member, index) => <button key={member.id} type="button" onClick={() => setTeamIndex(index)} className={`h-2.5 rounded-full transition-all ${index === teamIndex ? 'w-9 bg-accent' : 'w-2.5 bg-border hover:bg-primary'}`} aria-label={`Show ${member.name}`} aria-current={index === teamIndex ? 'true' : undefined} />)}</div>
                         <span className="text-xs font-semibold text-muted-foreground">{String(teamIndex + 1).padStart(2, '0')} / {String(team.length).padStart(2, '0')}</span>
                       </div>
                        <div className="mt-7 flex justify-center"><a href={routePath('/founder#team-directory')} className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground">See More <ArrowRight size={16} /></a></div>
                     </>}
                   </div>
                 )}
                 {team.length === 0 && <p className="border border-border bg-background p-8 text-sm text-muted-foreground">No team members are listed yet. Please check back soon.</p>}
               </div>
             </div>
           </section>

          <section id="testimonials" className="scroll-mt-24 bg-secondary/45 px-5 py-16 md:px-10 md:py-20">
            <div className="mx-auto max-w-[1240px]">
              <div className="reveal">
                <p className="section-kicker eyebrow text-accent">Testimonials</p>
               <h2 className="mt-4 max-w-2xl font-display text-4xl md:text-6xl">Words From the People We Support.</h2>
              {testimonialStorageError && <p role="status" className="mt-5 rounded-xl border border-accent/40 bg-accent/10 px-4 py-3 text-sm">{testimonialStorageError}</p>}
              </div>
              {testimonials.length ? (
                <div className="mt-12 grid gap-5 md:grid-cols-2">
                  {testimonials.slice(0, MAX_HOME_TESTIMONIALS).map((testimonial, index) => (
                    <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
                  ))}
                </div>
              ) : <p className="mt-10 max-w-xl text-sm leading-7 text-muted-foreground reveal">Client stories will appear here when they are available.</p>}
              <div className="mt-9 flex justify-center reveal">
                <a href={routePath('/testimonials')} className="inline-flex min-h-12 items-center gap-3 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5">See More <ArrowRight size={16} /></a>
              </div>
            </div>
          </section>

          <section id="contact" className="scroll-mt-24 bg-primary px-5 py-16 text-primary-foreground md:px-10 md:py-20">
          <div className="mx-auto grid max-w-[1240px] gap-14 lg:grid-cols-[.9fr_1.1fr]">
              <div className="reveal"><p className="section-kicker eyebrow text-accent">Contact the Team</p><h2 className="mt-4 max-w-3xl font-display text-4xl md:text-6xl">Take Your Career Global</h2><p className="mt-6 max-w-md leading-7 opacity-70">We work with professionals in diverse fields seeking global opportunities, international recognition and further career advancement</p><div className="mt-8 grid gap-4 text-sm font-semibold"><a href="mailto:info@provisawriters.com" className="inline-flex items-center gap-2 transition-colors hover:text-accent"><Mail size={15} /> info@provisawriters.com</a><a href="tel:+2348160550258" className="inline-flex items-center gap-2 transition-colors hover:text-accent"><MessageCircle size={15} /> +234 816 055 0258</a><a href="https://wa.me/2348160550258?text=Hello%20Provisa%20Writers%2C%20I%27d%20like%20to%20ask%20a%20question." target="_blank" rel="noreferrer" className="inline-flex w-fit items-center gap-2 border-b border-primary-foreground/40 pb-2 transition-colors hover:text-accent"><MessageCircle size={15} /> Chat on WhatsApp</a><a href="https://www.instagram.com/provisa_writers/" target="_blank" rel="noreferrer" className="inline-flex w-fit items-center gap-2 transition-colors hover:text-accent" aria-label="Provisa Writers on Instagram"><Instagram size={15} /> Instagram</a><a href="https://www.linkedin.com/company/provisa-writers-ltd-086111367/" target="_blank" rel="noreferrer" className="inline-flex w-fit items-center gap-2 transition-colors hover:text-accent" aria-label="Provisa Writers on LinkedIn"><Linkedin size={15} /> LinkedIn</a></div></div>
            <div className="rounded-[1.75rem] bg-primary-foreground p-7 text-foreground md:p-9 reveal reveal-delay-1">
              {submitted ? <div className="flex min-h-[300px] flex-col justify-center"><span className="grid h-11 w-11 place-items-center rounded-full bg-secondary text-primary"><Check size={20} /></span><h3 className="mt-7 font-display text-3xl">Your Email Is Ready to Send.</h3><p className="mt-3 max-w-sm leading-7 text-muted-foreground">Your mail app should open with the details filled in. If it did not, email info@provisawriters.com directly.</p><button type="button" onClick={() => setSubmitted(false)} className="mt-7 w-fit text-sm font-bold text-primary underline decoration-accent decoration-2 underline-offset-4">Send another note</button></div> : <form onSubmit={submitContact} className="grid gap-5"><div><label htmlFor="service" className="eyebrow text-primary">Service interested in</label><input id="service" required name="service" className="mt-2 w-full border-b border-border bg-transparent px-0 py-3 text-sm outline-none placeholder:text-muted-foreground/70" placeholder="What service are you interested in?" /></div><div><label htmlFor="name" className="eyebrow text-primary">Your name</label><input id="name" required name="name" className="mt-2 w-full border-b border-border bg-transparent px-0 py-3 text-sm outline-none placeholder:text-muted-foreground/70" placeholder="How should we address you?" /></div><div><label htmlFor="email" className="eyebrow text-primary">Email address</label><input id="email" required type="email" name="email" className="mt-2 w-full border-b border-border bg-transparent px-0 py-3 text-sm outline-none placeholder:text-muted-foreground/70" placeholder="example@email.com" /></div><div><label htmlFor="question" className="eyebrow text-primary">The question</label><textarea id="question" required name="question" rows={questionExpanded ? 3 : 1} onFocus={() => setQuestionExpanded(true)} onBlur={(event) => { if (!event.currentTarget.value.trim()) setQuestionExpanded(false); }} className={`mt-2 w-full resize-none border-b border-border bg-transparent px-0 py-3 text-sm leading-5 outline-none placeholder:text-muted-foreground/70 transition-[height] duration-200 ${questionExpanded ? 'h-24' : 'h-11'}`} placeholder="Brief description of what you need." /></div><button type="submit" className="mt-3 inline-flex min-h-12 w-fit items-center gap-3 rounded-full bg-accent px-6 text-sm font-bold text-accent-foreground transition-transform hover:-translate-y-0.5">Send an email <ArrowRight size={16} /></button></form>}
            </div>
          </div>
        </section>
      </main>

       <FieldGuideSidebar open={sidebarOpen} tab={sidebarTab} posts={posts} onClose={() => setSidebarOpen(false)} onTabChange={setSidebarTab} />
       <footer className="bg-primary px-5 pb-10 text-primary-foreground/70 md:px-10">
          <div className="mx-auto max-w-[1240px] border-t border-primary-foreground/15 pt-8 text-xs">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center"><span>© 2026 Provisa Writers Ltd. Company details placeholder.</span></div>
             <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 text-primary-foreground/80">
              {navItems.map((item) => item.href === '#blog' || item.href === '#faq'
                ? <button key={item.href} type="button" onClick={() => openSidebar(item.href === '#blog' ? 'blog' : 'faq')} className="transition-colors hover:text-primary-foreground">{item.label}</button>
                : <a key={item.href} href={item.href} className="transition-colors hover:text-primary-foreground">{item.label}</a>)}
              <span className="font-bold text-primary-foreground">Legal</span>
              {legalDocuments.map((document) => (
                <a key={document.slug} href={routePath(`/legal/${document.slug}`)} className="transition-colors hover:text-primary-foreground">
                  {document.title === 'Privacy Policy' ? 'Privacy Policy' : document.title === 'Terms of Use' ? 'Terms of Use' : 'Disclaimer'}
                </a>
              ))}
           </div>
         </div>
      </footer>
    </div>
  );
}

function ServicesOverviewPage() {
  useScrollReveals();

  return (
    <div className="template-two grain min-h-[100dvh]">
      <header className="border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1240px] items-center justify-between px-5 lg:px-8">
          <Logo />
          <a href={routePath('/')} className="inline-flex items-center gap-2 text-sm font-bold text-primary transition-colors hover:text-accent">
            <ArrowRight className="rotate-180" size={16} /> Back to Provisa
          </a>
        </div>
      </header>
      <main>
        <section className="border-b border-border bg-secondary/35 px-5 py-16 md:px-10 md:py-24">
          <div className="mx-auto max-w-[1240px]">
            <p className="section-kicker eyebrow text-accent">Our Services</p>
            <h1 className="mt-5 max-w-4xl font-display text-4xl leading-[1.02] tracking-[-.04em] md:text-6xl">Support for each step toward a global opportunity.</h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">Explore our three areas of support, from finding opportunities that fit your professional goals to preparing application materials and next steps.</p>
            <nav aria-label="Jump to a service" className="mt-9 flex flex-wrap gap-3">
              {serviceCatalog.map((service) => (
                <a key={service.slug} href={`#${service.slug}`} className="rounded-full border border-border bg-background px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:border-accent hover:text-accent">
                  {service.title}
                </a>
              ))}
            </nav>
          </div>
        </section>
        {serviceCatalog.map((service, index) => (
          <section key={service.slug} id={service.slug} className={`scroll-mt-8 border-b border-border px-5 py-16 md:px-10 md:py-24 ${index % 2 === 1 ? 'bg-secondary/25' : ''}`}>
            <div className="mx-auto grid max-w-[1240px] gap-10 md:grid-cols-[.75fr_1.25fr] md:gap-16">
              <div className="reveal">
                <p className="section-kicker eyebrow text-accent">Service 0{index + 1}</p>
                <h2 className="mt-4 font-display text-3xl leading-tight md:text-5xl">{service.title}</h2>
                <p className="mt-5 text-sm leading-7 text-muted-foreground md:text-base">{service.description}</p>
                <a href={routePath('/#contact')} className="mt-7 inline-flex min-h-12 items-center gap-3 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5">
                  Ask about this service <ArrowRight size={16} />
                </a>
              </div>
              <div className="reveal reveal-delay-1">
                <div className="space-y-5 text-sm leading-8 text-muted-foreground md:text-base">
                  {service.overview.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
                <div className="mt-8 border-t border-border pt-6">
                  <h3 className="font-display text-2xl">Ways we can support you</h3>
                  <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                    {service.offerings.map((offering) => (
                      <li key={offering} className="flex items-start gap-3 border-b border-border/70 py-3 text-sm leading-6">
                        <Check size={16} className="mt-1 shrink-0 text-accent" />
                        <span>{offering}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        ))}
        <section className="bg-primary px-5 py-16 text-primary-foreground md:px-10 md:py-20">
          <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-8">
            <div>
              <p className="section-kicker eyebrow text-accent">Start a Conversation</p>
              <h2 className="mt-4 max-w-2xl font-display text-3xl md:text-5xl">Not sure which service fits your goals?</h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-primary-foreground/75">Tell us what you are working toward, and we can discuss a suitable next step.</p>
            </div>
            <a href={routePath('/#contact')} className="inline-flex min-h-12 items-center gap-3 rounded-full bg-accent px-6 text-sm font-bold text-accent-foreground transition-transform hover:-translate-y-0.5">
              Contact the team <ArrowRight size={16} />
            </a>
          </div>
        </section>
      </main>
      <footer className="bg-primary px-5 py-8 text-primary-foreground/80 md:px-10">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-4 text-xs">
          <span>© 2026 Provisa Writers Ltd.</span>
          <nav aria-label="Legal information" className="flex flex-wrap gap-x-5 gap-y-3">
            {legalDocuments.map((document) => (
              <a key={document.slug} href={routePath(`/legal/${document.slug}`)} className="transition-colors hover:text-primary-foreground">{document.title}</a>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}

function ServiceDetailPage({ serviceSlug }: { serviceSlug: ServiceSlug }) {
  useScrollReveals();
  const service = getServiceBySlug(serviceSlug);
  if (!service) return <NotFound />;

  const serviceNumber = serviceCatalog.findIndex((entry) => entry.slug === service.slug) + 1;

  return (
    <div className="template-two grain min-h-[100dvh]">
      <header className="border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1240px] items-center justify-between px-5 lg:px-8">
          <Logo />
          <a href={routePath('/services')} className="inline-flex items-center gap-2 text-sm font-bold text-primary transition-colors hover:text-accent">
            <ArrowRight className="rotate-180" size={16} /> Back to Services
          </a>
        </div>
      </header>
      <main>
        <section className="border-b border-border bg-secondary/35 px-5 py-16 md:px-10 md:py-24">
          <div className="mx-auto max-w-[1240px]">
            <p className="section-kicker eyebrow text-accent">Service 0{serviceNumber}</p>
            <h1 className="mt-5 max-w-4xl font-display text-4xl leading-[1.02] tracking-[-.04em] md:text-6xl">{service.title}</h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">{service.detail}</p>
            <div className="mt-9 flex flex-wrap gap-4">
              <a href={routePath('/#contact')} className="inline-flex min-h-12 items-center gap-3 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5">
                Discuss this service <ArrowRight size={16} />
              </a>
              <a href={routePath('/services')} className="inline-flex min-h-12 items-center gap-2 border-b border-border px-1 text-sm font-bold text-primary transition-colors hover:text-accent">
                All services
              </a>
            </div>
          </div>
        </section>
        <section className="px-5 py-16 md:px-10 md:py-24">
          <div className="mx-auto grid max-w-[1240px] gap-10 md:grid-cols-[.75fr_1.25fr]">
            <div>
              <p className="section-kicker eyebrow text-accent">What We Support</p>
              <h2 className="mt-4 font-display text-3xl leading-tight md:text-4xl">A clear next step for your goals.</h2>
            </div>
            <div className="border-y border-border">
              {service.offerings.map((offering) => (
                <div key={offering} className="flex items-start gap-4 border-b border-border py-5 last:border-b-0">
                  <Check size={17} className="mt-1 shrink-0 text-accent" />
                  <p className="text-base leading-7">{offering}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-primary px-5 py-8 text-primary-foreground/80 md:px-10">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-4 text-xs">
          <span>© 2026 Provisa Writers Ltd.</span>
          <nav aria-label="Legal information" className="flex flex-wrap gap-x-5 gap-y-3">
            {legalDocuments.map((document) => (
              <a key={document.slug} href={routePath(`/legal/${document.slug}`)} className="transition-colors hover:text-primary-foreground">{document.title}</a>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}

function LegalPage({ documentSlug }: { documentSlug: LegalDocumentSlug }) {
  useScrollReveals();
  const document = getLegalDocumentBySlug(documentSlug);
  if (!document) return <NotFound />;

  return (
    <div className="template-two grain min-h-[100dvh]">
      <header className="border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1240px] items-center justify-between px-5 lg:px-8">
          <Logo />
          <a href={routePath('/')} className="inline-flex items-center gap-2 text-sm font-bold text-primary transition-colors hover:text-accent">
            <ArrowRight className="rotate-180" size={16} /> Back to Provisa
          </a>
        </div>
      </header>
      <main>
        <section className="border-b border-border bg-secondary/35 px-5 py-16 md:px-10 md:py-24">
          <div className="mx-auto max-w-[1240px]">
            <p className="section-kicker eyebrow text-accent">Legal Information</p>
            <h1 className="mt-5 font-display text-4xl leading-tight tracking-[-.04em] md:text-6xl">{document.title}</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">{document.summary}</p>
            <aside className="mt-8 max-w-3xl border-l-4 border-accent bg-background p-5 text-sm leading-7 text-foreground" role="note">
              <strong className="block text-primary">Draft for review</strong>
              <span>{legalReviewNote}</span>
            </aside>
          </div>
        </section>
        <section className="px-5 py-14 md:px-10 md:py-20">
          <div className="mx-auto max-w-3xl divide-y divide-border border-y border-border">
            {document.sections.map((section) => (
              <article key={section.heading} className="py-8">
                <h2 className="font-display text-2xl md:text-3xl">{section.heading}</h2>
                <div className="mt-4 space-y-4 text-sm leading-7 text-muted-foreground md:text-base">
                  {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
              </article>
            ))}
          </div>
          <nav aria-label="Other legal documents" className="mx-auto mt-10 flex max-w-3xl flex-wrap gap-x-6 gap-y-3 text-sm font-bold text-primary">
            {legalDocuments.filter((entry) => entry.slug !== document.slug).map((entry) => (
              <a key={entry.slug} href={routePath(`/legal/${entry.slug}`)} className="hover:text-accent">{entry.title}</a>
            ))}
          </nav>
        </section>
      </main>
    </div>
  );
}

function GlobalOpportunitiesServiceRoute() {
  return <ServiceDetailPage serviceSlug="global-opportunities-consulting" />;
}

function SkilledWorkerServiceRoute() {
  return <ServiceDetailPage serviceSlug="us-skilled-worker-migration" />;
}

function VisaSupportServiceRoute() {
  return <ServiceDetailPage serviceSlug="visa-application-support" />;
}

function PrivacyPolicyRoute() {
  return <LegalPage documentSlug="privacy-policy" />;
}

function TermsOfUseRoute() {
  return <LegalPage documentSlug="terms-of-use" />;
}

function DisclaimerRoute() {
  return <LegalPage documentSlug="disclaimer" />;
}

function TestimonialsPage() {
  useScrollReveals();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let active = true;
    let demoTestimonials: Testimonial[] = [];

    const syncDemoTestimonials = (event?: StorageEvent) => {
      if (event && event.key !== null && event.key !== DEMO_TESTIMONIALS_STORAGE_KEY) return;
      void readDemoTestimonials()
        .then((saved) => {
          if (!active) {
            releaseDemoTestimonialUrls(saved);
            return;
          }
          releaseDemoTestimonialUrls(demoTestimonials);
          demoTestimonials = saved;
          setTestimonials(saved);
          setLoadError('');
          setLoading(false);
        })
        .catch((error) => {
          if (!active) return;
          setLoadError(error instanceof Error ? error.message : 'Testimonials could not be loaded.');
          setLoading(false);
        });
    };

    if (TESTIMONIAL_DEMO_MODE) {
      window.addEventListener('storage', syncDemoTestimonials);
      syncDemoTestimonials();
    } else {
      void fetch('/provisa-api/content')
        .then(async (response) => {
          if (!response.ok) throw new Error('Testimonials could not be loaded. Please try again.');
          return response.json();
        })
        .then((content) => {
          if (!active) return;
          setTestimonials(Array.isArray(content?.testimonials) ? content.testimonials : []);
          setLoadError('');
        })
        .catch((error) => {
          if (active) {
            setLoadError(error instanceof Error ? error.message : 'Testimonials could not be loaded.');
          }
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }

    return () => {
      active = false;
      releaseDemoTestimonialUrls(demoTestimonials);
      window.removeEventListener('storage', syncDemoTestimonials);
    };
  }, []);

  return (
    <div className="template-two grain min-h-[100dvh]">
      <header className="border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1240px] items-center justify-between px-5 lg:px-8">
          <Logo />
          <a href={routePath('/')} className="inline-flex items-center gap-2 text-sm font-bold text-primary transition-colors hover:text-accent">
            <ArrowRight className="rotate-180" size={16} /> Back to Home
          </a>
        </div>
      </header>
      <main>
        <section className="border-b border-border bg-secondary/35 px-5 py-14 md:px-10 md:py-20">
          <div className="mx-auto max-w-[1240px]">
            <p className="section-kicker eyebrow text-accent">Testimonials</p>
            <h1 className="mt-5 max-w-4xl font-display text-4xl leading-tight md:text-6xl">Words From the People We Support.</h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
              Browse the testimonials shared by professionals who have worked with Provisa.
            </p>
          </div>
        </section>
        <section id="testimonials" className="scroll-mt-24 px-5 py-14 md:px-10 md:py-20">
          <div className="mx-auto max-w-[1240px]">
            {loadError && <p role="alert" className="mb-6 rounded-xl border border-accent/40 bg-accent/10 px-4 py-3 text-sm">{loadError}</p>}
            {loading ? (
              <p role="status" className="text-sm text-muted-foreground">Loading testimonials…</p>
            ) : testimonials.length ? (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {testimonials.map((testimonial, index) => (
                  <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
                ))}
              </div>
            ) : (
              <p className="max-w-xl border-y border-border py-8 text-sm leading-7 text-muted-foreground">
                {TESTIMONIAL_DEMO_MODE
                  ? 'No testimonials have been saved in this browser yet.'
                  : 'No testimonials have been published yet.'}
              </p>
            )}
          </div>
        </section>
      </main>
      <footer className="bg-primary px-5 pb-10 text-primary-foreground/70 md:px-10">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-5 border-t border-primary-foreground/15 pt-8 text-xs">
          <span>© 2026 Provisa Writers Ltd. Company details placeholder.</span>
          <a href={routePath('/')} className="font-semibold transition-colors hover:text-primary-foreground">Return to Home</a>
        </div>
      </footer>
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
    const error = await requestAdminLogin(username, password);
    if (error) {
      setLoginError(error);
      return;
    }
    setAuthenticated(true);
    setLoginError('');
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
  const [activeTab, setActiveTab] = useState<'posts' | 'staff' | 'founder' | 'testimonials'>('posts');
  const [posts, setPosts] = useState<BlogPost[]>(readPosts);
  const [staff, setStaff] = useState<StaffMember[]>(readStaff);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  const [editingTestimonialId, setEditingTestimonialId] = useState<string | null>(null);
  const [imageUploadingFor, setImageUploadingFor] = useState<'post' | 'staff' | 'founder' | null>(null);
  const [imageUploadError, setImageUploadError] = useState<{ section: 'post' | 'staff' | 'founder'; message: string } | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [staffImagePreview, setStaffImagePreview] = useState('');
  const [postForm, setPostForm] = useState({ title: '', excerpt: '', body: '', publishAt: '', expiresAt: '' });
  const [staffForm, setStaffForm] = useState({ name: '', role: '', bio: '' });
  const [testimonialForm, setTestimonialForm] = useState<TestimonialForm>({ quote: '', image: '', attribution: '' });
  const [testimonialImageUploading, setTestimonialImageUploading] = useState(false);
  const [testimonialUploadError, setTestimonialUploadError] = useState('');
  const [demoTestimonialsReady, setDemoTestimonialsReady] = useState(!TESTIMONIAL_DEMO_MODE);
  const [founderForm, setFounderForm] = useState({ name: founderProfile.name, role: founderProfile.role, descriptor: founderProfile.descriptor, summary: founderProfile.summary[0], fullWriteup: founderProfile.paragraphs.join('\n\n'), image: '/stock/founder-mercy.jpg' });

  useEffect(() => {
    if (TESTIMONIAL_DEMO_MODE) {
      void readDemoTestimonials()
        .then((saved) => {
          setTestimonials(saved);
          setDemoTestimonialsReady(true);
        })
        .catch((error) => {
          setSaveError(
            error instanceof Error
              ? error.message
              : 'Demo testimonials could not be loaded from this browser.',
          );
        });
    }

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
        if (content.testimonials && !TESTIMONIAL_DEMO_MODE) {
          setTestimonials(content.testimonials);
        }
        if (content.founder) setFounderForm({ ...content.founder, summary: firstParagraph(content.founder.summary) });
        setContentReady(true);
      })
      .catch(() => {
        if (TESTIMONIAL_DEMO_MODE) {
          setSaveMessage(
            'Demo mode: testimonial changes stay in this browser and do not reach the live site.',
          );
        } else {
          setSaveError('Unable to load the current site content. Please reload before editing.');
        }
      })
      .finally(() => setContentLoading(false));
  }, []);

  const saveChanges = async (payload: object, section: 'posts' | 'staff' | 'founder' | 'testimonials') => {
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
      setTestimonials(content.testimonials);
      setFounderForm({ ...content.founder, summary: firstParagraph(content.founder.summary) });
      setSaveMessage(`${section === 'founder' ? 'Founder profile' : section === 'staff' ? 'Staff directory' : section === 'testimonials' ? 'Testimonials' : 'Blog posts'} saved. The public site will show the update on reload.`);
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
    setImageUploadError((current) => current?.section === 'post' ? null : current);
    setPostForm({ title: '', excerpt: '', body: '', publishAt: '', expiresAt: '' });
  };
  const resetStaffForm = () => {
    setEditingStaffId(null);
    setStaffImagePreview('');
    setImageUploadError((current) => current?.section === 'staff' ? null : current);
    setStaffForm({ name: '', role: '', bio: '' });
  };
  const resetTestimonialForm = () => {
    setEditingTestimonialId(null);
    setTestimonialForm({ quote: '', image: '', attribution: '' });
    setTestimonialUploadError('');
  };
  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const error = await requestAdminLogin(username, password);
    if (error) {
      setLoginError(error);
      return;
    }
    setAuthenticated(true);
    setLoginError('');
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
      image: staffImagePreview || assetPath('/no-profile-avatar.svg'),
    };
    if (await saveChanges({ staff: editingStaffId ? staff.map((member) => member.id === editingStaffId ? next : member) : [next, ...staff] }, 'staff')) resetStaffForm();
  };
  const saveTestimonial = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!testimonialForm.quote.trim()) {
      setSaveError('Testimonial text is required.');
      return;
    }
    const next: Testimonial = { id: editingTestimonialId || `testimonial-${Date.now()}`, ...testimonialForm };
    const updated = editingTestimonialId
      ? testimonials.map((entry) => entry.id === editingTestimonialId ? next : entry)
      : [next, ...testimonials];
    if (TESTIMONIAL_DEMO_MODE) {
      setSaving(true);
      try {
        await writeDemoTestimonials(updated);
        setTestimonials(updated);
        setSaveError('');
        setSaveMessage(
          'Demo testimonial saved in this browser. Open the public preview in this browser to view it.',
        );
        resetTestimonialForm();
      } catch (error) {
        setSaveError(
          error instanceof Error
            ? error.message
            : 'Could not save the demo testimonial in this browser.',
        );
      } finally {
        setSaving(false);
      }
      return;
    }
    if (await saveChanges({ testimonials: updated }, 'testimonials')) resetTestimonialForm();
  };
  const deleteTestimonial = async (id: string) => {
    const updated = testimonials.filter((entry) => entry.id !== id);
    if (!TESTIMONIAL_DEMO_MODE) {
      await saveChanges({ testimonials: updated }, 'testimonials');
      return;
    }

    setSaving(true);
    try {
      await writeDemoTestimonials(updated);
      setTestimonials(updated);
      setSaveError('');
      setSaveMessage('Demo testimonial removed from this browser.');
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : 'Could not remove the demo testimonial from this browser.',
      );
    } finally {
      setSaving(false);
    }
  };
  const chooseTestimonialImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;

    setTestimonialUploadError('');
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setTestimonialUploadError('Choose a PNG, JPG, WEBP, or GIF screenshot.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setTestimonialUploadError('The screenshot must be 10 MB or smaller.');
      return;
    }

    setTestimonialImageUploading(true);
    try {
      if (TESTIMONIAL_DEMO_MODE) {
        const savedImage = await saveDemoTestimonialImage(file);
        setTestimonialForm((current) => ({
          ...current,
          image: savedImage.previewUrl,
          demoImageKey: savedImage.key,
        }));
        return;
      }

      const filename = file.name.replace(/[^a-zA-Z0-9._-]/g, '-').slice(-100) || 'screenshot';
      const blob = await upload(`testimonials/${Date.now()}-${filename}`, file, {
        access: 'public',
        handleUploadUrl: '/provisa-api/testimonial-upload',
        contentType: file.type,
      });
      setTestimonialForm((current) => ({
        ...current,
        image: blob.url,
        demoImageKey: undefined,
      }));
    } catch (error) {
      setTestimonialUploadError(error instanceof Error ? error.message : 'Screenshot upload failed. Please try again.');
    } finally {
      setTestimonialImageUploading(false);
    }
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
  const chooseImage = async (event: ChangeEvent<HTMLInputElement>, kind: 'post' | 'staff' | 'founder') => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;

    setImageUploadError(null);
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setImageUploadError({ section: kind, message: 'Choose a JPG, PNG, WEBP, or GIF image.' });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setImageUploadError({ section: kind, message: 'The image must be 10 MB or smaller.' });
      return;
    }

    setImageUploadingFor(kind);
    try {
      const folder = kind === 'post' ? 'blog' : kind;
      const filename = file.name.replace(/[^a-zA-Z0-9._-]/g, '-').slice(-100) || 'image';
      const blob = await upload(`${folder}/${Date.now()}-${filename}`, file, {
        access: 'public',
        handleUploadUrl: '/provisa-api/image-upload',
        contentType: file.type,
      });
      if (kind === 'post') setImagePreview(blob.url);
      else if (kind === 'staff') setStaffImagePreview(blob.url);
      else setFounderForm((current) => ({ ...current, image: blob.url }));
    } catch (error) {
      setImageUploadError({
        section: kind,
        message: error instanceof Error ? error.message : 'Image upload failed. Please try again.',
      });
    } finally {
      setImageUploadingFor(null);
    }
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
            <p className="mt-5 max-w-xl leading-7 text-muted-foreground">{TESTIMONIAL_DEMO_MODE ? 'Demo mode: testimonials and screenshots are saved in this browser and appear in the public preview only.' : 'Manage blog posts, the public team directory, the founder profile, and testimonials. Changes are saved to the site database.'}</p>
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
           <button type="button" onClick={() => setActiveTab('testimonials')} className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition-colors ${activeTab === 'testimonials' ? 'bg-primary text-primary-foreground' : 'text-primary hover:bg-secondary'}`}><MessageCircle size={15} /> Testimonials</button>
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
                <label className="grid gap-2 text-xs font-bold uppercase tracking-[.1em]">
                  <span className="flex items-center gap-2"><ImagePlus size={13} /> {editingId && imagePreview ? 'Replace feature image' : 'Feature image'}</span>
                  <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => void chooseImage(event, 'post')} disabled={imageUploadingFor !== null} className="block w-full text-xs file:mr-3 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:font-bold file:text-accent-foreground disabled:opacity-50" />
                </label>
                <p className="-mt-3 text-xs leading-5 text-muted-foreground" aria-live="polite">{imageUploadingFor === 'post' ? 'Uploading feature image…' : 'JPG, PNG, WEBP, or GIF. Maximum file size: 10 MB. Choose a new file to replace the current image.'}</p>
                {imageUploadError?.section === 'post' && <p role="alert" className="-mt-3 text-xs leading-5 text-accent">{imageUploadError.message}</p>}
                {imagePreview && <img src={assetPath(imagePreview)} alt="Feature image preview" className="aspect-[1.8] w-full rounded-xl object-cover" />}
                 <button type="submit" disabled={saving || !contentReady || imageUploadingFor === 'post'} className="mt-2 inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50">{editingId ? <Pencil size={16} /> : <Plus size={16} />}{saving ? 'Saving…' : editingId ? 'Save changes' : 'Publish post'}</button>
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
                <label className="grid gap-2 text-xs font-bold uppercase tracking-[.1em]">Role / area of work<input required value={staffForm.role} onChange={(event) => setStaffForm({ ...staffForm, role: event.target.value })} className="rounded-xl border border-border bg-background px-4 py-3 text-sm normal-case tracking-normal outline-none" placeholder="For example: Research Analyst" /></label>
                <label className="grid gap-2 text-xs font-bold uppercase tracking-[.1em]">
                  Short write-up (optional)
                  <textarea
                    rows={3}
                    maxLength={240}
                    value={staffForm.bio}
                    onChange={(event) => setStaffForm({ ...staffForm, bio: event.target.value })}
                    className="resize-y rounded-xl border border-border bg-background px-4 py-3 text-sm normal-case leading-6 tracking-normal outline-none"
                    placeholder="A brief description of the member’s work"
                  />
                </label>
                <p className="-mt-3 text-xs leading-5 text-muted-foreground">Shown below the member’s name and role on the public site.</p>
                 <label className="grid gap-2 text-xs font-bold uppercase tracking-[.1em]">
                   <span className="flex items-center gap-2"><ImagePlus size={13} /> {editingStaffId && staffImagePreview ? 'Replace portrait' : 'Portrait'}</span>
                   <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => void chooseImage(event, 'staff')} disabled={imageUploadingFor !== null} className="block w-full text-xs file:mr-3 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:font-bold file:text-accent-foreground disabled:opacity-50" />
                 </label>
                 <p className="-mt-3 text-xs leading-5 text-muted-foreground" aria-live="polite">{imageUploadingFor === 'staff' ? 'Uploading portrait…' : 'JPG, PNG, WEBP, or GIF. Maximum file size: 10 MB. Choose a new file to replace the current portrait.'}</p>
                 {imageUploadError?.section === 'staff' && <p role="alert" className="-mt-3 text-xs leading-5 text-accent">{imageUploadError.message}</p>}
                 {staffImagePreview && <img src={assetPath(staffImagePreview)} alt="Staff portrait preview" className="aspect-[.9] w-full rounded-xl object-cover" />}
                  <button type="submit" disabled={saving || !contentReady || imageUploadingFor === 'staff'} className="mt-2 inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50">{editingStaffId ? <Pencil size={16} /> : <UserPlus size={16} />}{saving ? 'Saving…' : editingStaffId ? 'Save staff changes' : 'Add staff member'}</button>
              </div>
            </form>
            <section>
               <div className="mb-5 flex items-center justify-between"><h2 className="font-display text-3xl">Staff directory</h2><span className="font-mono-ui text-[10px] uppercase tracking-[.13em] text-muted-foreground">Site database</span></div>
               <div className="grid gap-4 sm:grid-cols-2">{staff.map((member) => <article key={member.id} className="border-t border-border pt-5"><div className="flex gap-4"><img src={assetPath(member.image || '/stock/team-strategy.jpg')} alt="" className="h-20 w-20 shrink-0 rounded-xl object-cover" /><div className="min-w-0"><h3 className="font-display text-2xl">{member.name}</h3><p className="mt-1 text-xs font-bold uppercase tracking-[.1em] text-accent">{member.role}</p><p className="mt-3 text-xs leading-6 text-muted-foreground">{member.bio}</p></div></div><div className="mt-4 flex gap-2"><button type="button" onClick={() => editStaffMember(member)} className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-xs font-bold text-primary hover:bg-secondary"><Pencil size={13} /> Edit</button><button type="button" disabled={saving} onClick={() => { if (window.confirm(`Delete ${member.name}?`)) void saveChanges({ staff: staff.filter((item) => item.id !== member.id) }, 'staff'); }} className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-xs font-bold text-accent hover:bg-secondary"><Trash2 size={13} /> Delete</button></div></article>)}</div>
            </section>
          </div>
        ) : activeTab === 'testimonials' ? (
          <div className="mt-8 grid gap-8 lg:grid-cols-[.85fr_1.15fr]">
            <form onSubmit={saveTestimonial} className="admin-editor-card rounded-[1.75rem] bg-secondary/80 p-7 text-foreground md:p-9">
              <h2 className="font-display text-3xl">{editingTestimonialId ? 'Edit testimonial' : 'Add testimonial'}</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">Add a written testimonial, a screenshot, or both. Only share client feedback you have permission to publish.</p>
              <div className="mt-8 grid gap-5">
                <label className="grid gap-2 text-xs font-bold uppercase tracking-[.1em]">Title / client name (optional)
                  <input value={testimonialForm.attribution} onChange={(event) => setTestimonialForm({ ...testimonialForm, attribution: event.target.value })} className="rounded-xl border border-border bg-background px-4 py-3 text-sm normal-case tracking-normal outline-none" placeholder="A short title or client name" />
                </label>
                <label className="grid gap-2 text-xs font-bold uppercase tracking-[.1em]">Testimonial text
                  <textarea required rows={5} value={testimonialForm.quote} onChange={(event) => setTestimonialForm({ ...testimonialForm, quote: event.target.value })} className="rounded-xl border border-border bg-background px-4 py-3 text-sm normal-case tracking-normal outline-none" placeholder="Paste the client's words here" />
                </label>
                <label className="grid gap-2 text-xs font-bold uppercase tracking-[.1em]">
                   <span className="flex items-center gap-2"><ImagePlus size={13} /> Upload or replace screenshot</span>
                  <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={chooseTestimonialImage} disabled={testimonialImageUploading} className="block w-full text-xs file:mr-3 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:font-bold file:text-accent-foreground disabled:opacity-50" />
                </label>
                <p className="-mt-3 text-xs leading-5 text-muted-foreground" aria-live="polite">{testimonialImageUploading ? 'Uploading screenshot…' : 'PNG, JPG, WEBP, or GIF. Maximum file size: 10 MB.'}</p>
                {testimonialUploadError && <p role="alert" className="-mt-3 text-xs leading-5 text-accent">{testimonialUploadError}</p>}
                  {testimonialForm.image && <div className="grid gap-2"><img src={testimonialForm.image} alt="Testimonial screenshot preview" className="max-h-72 w-full rounded-xl border border-border object-contain" /><button type="button" onClick={() => setTestimonialForm((current) => ({ ...current, image: '', demoImageKey: undefined }))} className="w-fit text-xs font-semibold text-accent">Remove screenshot</button></div>}
                <div className="flex flex-wrap gap-3">
                  <button type="submit" disabled={saving || (TESTIMONIAL_DEMO_MODE ? !demoTestimonialsReady : !contentReady) || testimonialImageUploading} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground disabled:opacity-50">{saving ? 'Saving…' : editingTestimonialId ? 'Save testimonial' : 'Add testimonial'}</button>
                  {editingTestimonialId && <button type="button" disabled={testimonialImageUploading} onClick={resetTestimonialForm} className="text-sm font-semibold text-primary disabled:opacity-50">Cancel</button>}
                </div>
              </div>
            </form>
            <section>
              <h2 className="font-display text-3xl">{TESTIMONIAL_DEMO_MODE ? 'Demo testimonials in this browser' : 'Published testimonials'}</h2>
              {testimonials.length ? <div className="mt-5 grid gap-4">
                {testimonials.map((entry) => <article key={entry.id} className="border-t border-border py-5">
                  {entry.attribution && <h3 className="mb-3 font-display text-lg">{entry.attribution}</h3>}
                  {entry.image && <img src={entry.image} alt={entry.attribution ? `Testimonial screenshot: ${entry.attribution}` : 'Testimonial screenshot'} className="mb-4 max-h-60 w-full rounded-xl object-contain" />}
                  {entry.quote && <p className="whitespace-pre-line text-sm leading-7 text-muted-foreground">{entry.quote}</p>}
                  <div className="mt-4 flex gap-2">
                    <button type="button" onClick={() => { setEditingTestimonialId(entry.id); setTestimonialForm({ quote: entry.quote, image: entry.image, attribution: entry.attribution, demoImageKey: entry.demoImageKey }); }} className="rounded-full border border-border px-3 py-2 text-xs font-bold text-primary">Edit</button>
                    <button type="button" disabled={saving} onClick={() => { if (window.confirm('Delete this testimonial?')) void deleteTestimonial(entry.id); }} className="rounded-full border border-border px-3 py-2 text-xs font-bold text-accent">Delete</button>
                  </div>
                </article>)}
              </div> : <p className="mt-5 text-sm text-muted-foreground">No testimonials have been added yet.</p>}
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
                <label className="grid gap-2 text-xs font-bold uppercase tracking-[.1em]">
                  <span className="flex items-center gap-2"><ImagePlus size={13} /> {founderForm.image ? 'Replace founder portrait' : 'Upload founder portrait'}</span>
                  <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => void chooseImage(event, 'founder')} disabled={imageUploadingFor !== null} className="block w-full text-xs file:mr-3 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:font-bold file:text-accent-foreground disabled:opacity-50" />
                </label>
                <p className="-mt-3 text-xs leading-5 text-muted-foreground" aria-live="polite">{imageUploadingFor === 'founder' ? 'Uploading founder portrait…' : 'JPG, PNG, WEBP, or GIF. Maximum file size: 10 MB. Upload a new file to replace the current portrait.'}</p>
                {imageUploadError?.section === 'founder' && <p role="alert" className="-mt-3 text-xs leading-5 text-accent">{imageUploadError.message}</p>}
                {founderForm.image && <img src={assetPath(founderForm.image)} alt="Founder portrait preview" className="aspect-[1.2] w-full max-w-sm rounded-xl object-cover" />}
                <p className="-mt-3 text-xs leading-5 text-muted-foreground">The founder portrait is shared by the homepage carousel and founder page.</p>
                <button type="submit" disabled={saving || !contentReady || imageUploadingFor === 'founder'} className="inline-flex min-h-12 w-fit items-center justify-center gap-3 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"><Pencil size={16} /> {saving ? 'Saving…' : 'Save founder profile'}</button>
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

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function SiteExperienceControls({ isAdminRoute = false }: { isAdminRoute?: boolean }) {
  const [demoMode, setDemoMode] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    let restoredDemoMode = false;
    try {
      restoredDemoMode = window.sessionStorage.getItem(DEMO_MODE_STORAGE_KEY) === 'true';
    } catch {
      // The toggle still works for this page if browser storage is unavailable.
    }
    document.documentElement.classList.toggle('provisa-demo-mode', restoredDemoMode);
    setDemoMode(restoredDemoMode);

    const handleScroll = () => setShowScrollTop(window.scrollY > 520);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDemoMode = () => {
    const nextDemoMode = !demoMode;
    document.documentElement.classList.toggle('provisa-demo-mode', nextDemoMode);
    setDemoMode(nextDemoMode);
    try {
      if (nextDemoMode) {
        window.sessionStorage.setItem(DEMO_MODE_STORAGE_KEY, 'true');
      } else {
        window.sessionStorage.removeItem(DEMO_MODE_STORAGE_KEY);
      }
    } catch {
      // The active page remains in the selected mode even if browser storage is unavailable.
    }
  };

  if (isAdminRoute) return null;

  return (
    <div className="fixed bottom-5 right-3 z-50 flex flex-col items-end gap-3 sm:right-5">
      <button
        type="button"
        onClick={toggleDemoMode}
        aria-pressed={demoMode}
        aria-label={demoMode ? 'Exit black background demo mode' : 'Preview black background demo mode'}
        className="provisa-demo-toggle inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-3 text-sm font-bold text-primary-foreground shadow-2xl transition-transform hover:-translate-y-0.5 sm:px-5"
      >
        <span className="hidden sm:inline">{demoMode ? 'Exit demo' : 'Demo mode'}</span>
        <span className="sm:hidden">{demoMode ? 'Exit' : 'Demo'}</span>
      </button>
      {showScrollTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="grid h-12 w-12 place-items-center rounded-full bg-accent text-accent-foreground shadow-2xl transition-transform hover:-translate-y-1"
          aria-label="Back to top"
        >
          <ArrowUp size={18} />
        </button>
      )}
    </div>
  );
}

function Router() {
  const [location] = useLocation();

  return (
    <>
      <RoutedErrorBoundary>
        <Switch><Route path="/" component={Home} /><Route path="/founder" component={FounderPage} /><Route path="/services" component={ServicesOverviewPage} /><Route path="/services/global-opportunities-consulting" component={GlobalOpportunitiesServiceRoute} /><Route path="/services/us-skilled-worker-migration" component={SkilledWorkerServiceRoute} /><Route path="/services/visa-application-support" component={VisaSupportServiceRoute} /><Route path="/legal/privacy-policy" component={PrivacyPolicyRoute} /><Route path="/legal/terms-of-use" component={TermsOfUseRoute} /><Route path="/legal/disclaimer" component={DisclaimerRoute} /><Route path="/testimonials" component={TestimonialsPage} /><Route path="/admin" component={AdminPage} /><Route path="/pwadmin" component={AdminPage} /><Route component={NotFound} /></Switch>
      </RoutedErrorBoundary>
      <SiteExperienceControls isAdminRoute={location === '/admin' || location === '/pwadmin'} />
    </>
  );
}

function App({ initialPath = '/' }: { initialPath?: string }) {
  if (typeof window === 'undefined') {
    let serverPage: ReactNode = <Home />;

    if (initialPath === '/founder') {
      serverPage = <FounderPage />;
    } else if (initialPath === '/testimonials') {
      serverPage = <TestimonialsPage />;
    } else if (initialPath === '/services') {
      serverPage = <ServicesOverviewPage />;
    } else if (initialPath === '/pwadmin' || initialPath === '/admin') {
      serverPage = <AdminPage />;
    } else {
      const service = serviceCatalog.find((entry) => initialPath === `/services/${entry.slug}`);
      const legalDocument = legalDocuments.find((entry) => initialPath === `/legal/${entry.slug}`);
      if (service) {
        serverPage = <ServiceDetailPage serviceSlug={service.slug} />;
      } else if (legalDocument) {
        serverPage = <LegalPage documentSlug={legalDocument.slug} />;
      }
    }

    const isAdminRoute = initialPath === '/admin' || initialPath === '/pwadmin';
    return (
      <>
        {serverPage}
        {!isAdminRoute && <SiteExperienceControls />}
      </>
    );
  }

  return <WouterRouter base="/"><Router /></WouterRouter>;
}

export default function SiteApp({ initialPath }: { initialPath?: string }) {
  return <App initialPath={initialPath} />;
}