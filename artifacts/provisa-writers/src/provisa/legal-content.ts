export const legalLastUpdated = "5 November 2026";

export type LegalBlock =
  | { type: "p"; text: string }
  | { type: "strong"; text: string }
  | { type: "list"; items: readonly string[] };

const p = (text: string): LegalBlock => ({ type: "p", text });
const strong = (text: string): LegalBlock => ({ type: "strong", text });
const list = (...items: string[]): LegalBlock => ({ type: "list", items });

export const legalDocuments = [
  {
    slug: "terms-of-use",
    title: "Terms of Use",
    summary:
      "The rules for using the Provisa Writers website, and what we are and are not.",
    sections: [
      {
        heading: "1. Using this website",
        blocks: [
          p('This is the website of Provisa Writers Ltd. ("we", "us", "our"). When you use this website, you agree to these rules. If you do not agree, please do not use the site.'),
        ],
      },
      {
        heading: "2. What this website is",
        blocks: [
          p("This website tells you about Provisa Writers Ltd. and our services: global opportunities consulting, US skilled worker migration support (profile building, EB-1A and EB-2 NIW), and visa application support, including interview preparation."),
          p("The website is for information only. You cannot buy services or make payments on it. To work with us, you contact us through the contact form, email, phone, WhatsApp, Instagram or LinkedIn, and we agree the details in a separate written proposal or agreement. That document covers things like price, payment, timelines, ownership of the finished work and refunds. If it says something different from these Terms, the proposal or agreement wins for that service."),
        ],
      },
      {
        heading: "3. Important: what we are and are not",
        blocks: [
          strong("We are a professional services company. We are not a law firm. Some of our team may have legal training, but nothing on this website, and nothing we say or write, is legal advice. Using our services does not make us your lawyer. We do not speak for you before any government office unless we clearly agree to that in writing."),
          list(
            "We help with documents and strategy. We research, write, organise and present your information. We do not decide if you qualify.",
            "We cannot promise results. Immigration offices, embassies, funders and organisers make their own decisions. We cannot guarantee any approval, visa, green card, grant, award, invitation or timeline.",
            "Your information must be true. You are responsible for everything you give us. We will not include false or misleading information. We may stop work if we think something is not true.",
            "You are responsible for filing. You, or the licensed lawyer you choose, must sign and submit any application. If you need legal advice, speak to a licensed immigration lawyer.",
            "Rules change. Immigration and funding rules change often, so some information may become out of date.",
          ),
        ],
      },
      {
        heading: "4. Our content",
        blocks: [
          p("The design, logo, text, photos and graphics on this website belong to us or are used with permission. Please do not copy, sell or share them without our written permission. You can use them for personal, non-commercial purposes."),
        ],
      },
      {
        heading: "5. What you must not do",
        blocks: [
          p("You agree not to:"),
          list(
            "use the site for anything illegal or dishonest;",
            "hack, overload, copy data from, or disturb the site;",
            "upload viruses or harmful code;",
            "pretend to be another person or business;",
            "give us false, exaggerated or misleading information, credentials or documents when you contact us or work with us.",
          ),
        ],
      },
      {
        heading: "6. Links to other websites",
        blocks: [
          p("This website links to other platforms, such as WhatsApp, Instagram and LinkedIn. We do not control them and are not responsible for what is on them or how they use your data."),
        ],
      },
      {
        heading: "7. Limit of our responsibility",
        blocks: [
          p('The site and its content are provided "as is". We do not promise it will always work or be free of errors. As far as the law allows, we are not responsible for any loss that comes from using this website or relying on what is on it. Nothing here limits responsibility that the law does not allow us to limit, such as fraud.'),
        ],
      },
      {
        heading: "8. Changes to these terms",
        blocks: [
          p('We may update these Terms. The "Last updated" date shows the newest version. If you keep using the site after a change, you accept the new Terms.'),
        ],
      },
      {
        heading: "9. Which law applies",
        blocks: [
          p("These Terms follow the laws of the Federal Republic of Nigeria. If you have a problem, please email us first at info@provisawriters.com so we can try to fix it. If we cannot, the courts of Nigeria will handle it."),
        ],
      },
    ],
  },
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    summary:
      "What personal information Provisa Writers collects, how we use it, and your rights.",
    sections: [
      {
        heading: "1. Who we are",
        blocks: [
          p("Provisa Writers Ltd. is responsible for the personal information we collect through this website and when you contact us."),
          strong("Contact: info@provisawriters.com | +234 816 055 0258"),
        ],
      },
      {
        heading: "2. What information we collect",
        blocks: [
          strong("What you give us when you contact us:"),
          list(
            "the details you type into our contact form: your name, email address, the service you are interested in, and your question;",
            "your phone number and the messages you send us by email, phone, WhatsApp, Instagram or LinkedIn.",
          ),
          strong("If you become a client, we may also collect the information we need for your case, such as your CV, qualifications, achievements, publications, ID or passport details, travel history and immigration history. You usually share these with us directly, not through this website, but this policy still applies to them."),
          strong("What we collect automatically:"),
          list(
            "your IP address, browser, device type and operating system;",
            "the pages you visit and how long you stay.",
          ),
          p("Some documents, like passports, immigration records or health-related credentials, can be sensitive. We only ask for what we need for your case and we handle it with extra care."),
        ],
      },
      {
        heading: "3. How we use your information",
        blocks: [
          p("We use it to:"),
          list(
            "reply to your questions and messages;",
            "provide our services if you become a client;",
            "improve our website and see how it is used;",
            "follow legal and tax rules;",
            "protect our rights and settle disputes.",
          ),
        ],
      },
      {
        heading: "4. Why we are allowed to use it",
        blocks: [
          strong("Where the law needs a reason, we rely on: your consent; a contract or steps before a contract (to answer your enquiry and deliver our services); our legitimate interests (running and improving our business and preventing fraud); and legal duty (keeping records and paying tax)."),
        ],
      },
      {
        heading: "5. Who we share it with",
        blocks: [
          p("We do not sell your personal data. We only share it with:"),
          list(
            "website hosting, email and analytics services;",
            "our research analysts, operations and client-experience team, and any writers, editors or contractors working on your case, who must keep it confidential;",
            "professional advisers, regulators or authorities when the law requires;",
            "a buyer or new owner if our business is sold or restructured.",
          ),
          p("If you message us on WhatsApp, Instagram or LinkedIn, those platforms also handle your data under their own privacy policies."),
        ],
      },
      {
        heading: "6. Sending data abroad",
        blocks: [
          p("Our work is international, so our service providers and team members may be outside Nigeria. If your data goes abroad, we take reasonable steps to keep it protected under the data protection law that applies."),
        ],
      },
      {
        heading: "7. How long we keep it",
        blocks: [
          p("We only keep your data as long as we need it. As a guide: enquiry messages for as long as it takes to deal with them; client project files for 2 years after delivery, unless you ask us to delete them sooner; billing records for 6 years, for tax and legal reasons."),
        ],
      },
      {
        heading: "8. Cookies",
        blocks: [
          p("Cookies are small files saved on your device. This website may use essential cookies to make the site work and keep it secure, and analytics cookies to see how many people visit and which pages they read. We do not currently use cookies to show ads. You can block or delete cookies in your browser settings. Blocking some cookies may stop parts of the site from working well."),
        ],
      },
      {
        heading: "9. Your rights",
        blocks: [
          p("Depending on where you live, you may have the right to:"),
          list(
            "see the personal data we hold about you;",
            "correct wrong information;",
            "ask us to delete your data;",
            "object to or limit how we use it;",
            "take back your consent at any time;",
            "get a copy of your data in a portable format;",
            "complain to your data protection authority.",
          ),
          p("To use these rights, email info@provisawriters.com. We may need to confirm who you are first, and we will reply within the time the law requires."),
        ],
      },
      {
        heading: "10. Security",
        blocks: [
          p("We use reasonable steps to protect your data, like secure hosting, limited access and encrypted connections. No system is 100% safe, so we cannot promise perfect security. If a data breach affects you, we will tell you and the right authority as the law requires."),
        ],
      },
      {
        heading: "11. Children",
        blocks: [
          p("This website is not meant for children under 13 (or an older age if your local law says so). We do not knowingly collect their data. If you think a child has given us information, contact us and we will delete it."),
        ],
      },
      {
        heading: "12. Changes to this policy",
        blocks: [
          p('We will post updates here and change the "Last updated" date. For big changes, we will try to tell you.'),
        ],
      },
    ],
  },
  {
    slug: "disclaimer",
    title: "Disclaimer",
    summary:
      "Important limits on the information on this website and the outcomes we can offer.",
    sections: [
      {
        heading: "General information only",
        blocks: [
          p("Everything on this website is for general information only. It is not a replacement for professional advice. Please speak to a qualified professional before making big decisions about your immigration, career, money or business."),
        ],
      },
      {
        heading: "We are not a law firm",
        blocks: [
          p("Provisa Writers Ltd. is not a law firm and does not give legal advice. Using our services does not make us your lawyer."),
        ],
      },
      {
        heading: "No guarantees",
        blocks: [
          p("We cannot guarantee any outcome, including a visa, green card, grant, fellowship, scholarship, award, conference place or invitation. Governments, embassies, funders and organisers make their own decisions, and we do not control them."),
        ],
      },
      {
        heading: "No link to any government",
        blocks: [
          p("We are not part of, and are not connected to, any government, embassy, consulate or immigration office, including those of the United States, the United Kingdom and Canada."),
        ],
      },
      {
        heading: "Information can change",
        blocks: [
          p("Immigration, visa and funding rules change often. We try to keep our information up to date, but we cannot promise it is always complete or current. Always check the official source before you apply."),
        ],
      },
      {
        heading: "Other websites and opportunities",
        blocks: [
          p("We link to other platforms and mention opportunities run by other organisations. We do not control them and are not responsible for their content, rules or decisions."),
        ],
      },
      {
        heading: "Copyright and trademarks",
        blocks: [
          p('© 2026 Provisa Writers Ltd. All rights reserved. Please do not copy, store or share any part of this site without our written permission, unless the law allows it. "Provisa Writers" and our logo are trademarks (registered or not) of Provisa Writers Ltd. Other names on the site belong to their owners.'),
        ],
      },
      {
        heading: "Copyright complaints",
        blocks: [
          p("If you believe something on our site copies your work, email info@provisawriters.com with: your contact details, a description of your work, the link to the material on our site, and a statement that you own the work or are allowed to act for the owner. We will look at your request quickly."),
        ],
      },
      {
        heading: "Company information",
        blocks: [
          list(
            "Legal name: Provisa Writers Ltd.",
            "Registration number: RC 8278849",
            "Email: info@provisawriters.com",
            "Phone: +234 816 055 0258",
            "Website: www.provisawriters.com",
          ),
        ],
      },
    ],
  },
] as const;

export type LegalDocumentSlug = (typeof legalDocuments)[number]["slug"];

export function getLegalDocumentBySlug(slug: string) {
  return legalDocuments.find((document) => document.slug === slug);
}
