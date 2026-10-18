export const legalReviewNote =
  "Website-specific draft for review, not legal advice. Before treating these pages as final, Provisa should confirm its registered business name and address, applicable jurisdiction, data-retention and deletion practices, fees and refunds, and whether any visa or migration service includes regulated advice or representation.";

export const legalDocuments = [
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    summary:
      "What information the Provisa Writers website handles, how it is used, and how to ask privacy questions.",
    sections: [
      {
        heading: "Who this policy covers",
        paragraphs: [
          "This policy describes the Provisa Writers website and the information a visitor may choose to share through it. Provisa Writers is the public-facing business name; its registered legal entity and business address should be added after confirmation.",
        ],
      },
      {
        heading: "Information you choose to send",
        paragraphs: [
          "The contact form asks for your name, email address, the service you are interested in, and a brief description of what you need.",
          "Selecting “Send an email” opens your email application with those details filled in. The website does not send or store the inquiry automatically. Provisa receives it if you choose to send the prepared email.",
          "If you contact Provisa by email, WhatsApp, Instagram, LinkedIn, or phone, the information you share is handled through that communication channel as well as by Provisa.",
        ],
      },
      {
        heading: "Website operation and service providers",
        paragraphs: [
          "The site uses an essential session cookie for the protected administrator area. The current site code does not include advertising pixels or analytics tracking.",
          "Vercel provides website hosting and image storage. Supabase stores the site’s published content, such as articles, team profiles, founder information, and testimonials. Google Fonts is used to load the site’s typefaces. These providers may process technical information needed to deliver or secure their services.",
        ],
      },
      {
        heading: "How information is used and retained",
        paragraphs: [
          "Information sent to Provisa may be used to reply to your inquiry, discuss a requested service, and manage the resulting client relationship. Public website content is stored so it can be displayed and maintained.",
          "The public contact form does not save inquiry details in the site database. Email and third-party messaging history may remain with the relevant provider. Provisa’s specific retention and deletion periods are not set by the website and must be confirmed by the business.",
        ],
      },
      {
        heading: "Your privacy requests",
        paragraphs: [
          "Where applicable law gives you privacy rights, you may ask to access, correct, or delete personal information held by Provisa. Contact info@provisawriters.com. Provisa should confirm how it verifies and responds to these requests before this draft is finalized.",
          "The site links to third-party websites and communication platforms. Their own privacy notices explain their separate handling of your information.",
        ],
      },
    ],
  },
  {
    slug: "terms-of-use",
    title: "Terms of Use",
    summary:
      "Basic terms for using this website and reviewing its service information.",
    sections: [
      {
        heading: "Using this website",
        paragraphs: [
          "You may use this website to learn about Provisa Writers and its services. Please provide accurate information when contacting the team and do not misuse the website or its content.",
        ],
      },
      {
        heading: "Service information and outcomes",
        paragraphs: [
          "Service descriptions are general information and may change. Whether a service is suitable depends on an individual assessment and any separate terms agreed with Provisa.",
          "Provisa cannot guarantee a visa approval, selection, membership, funding, employment, or any other decision made by a third party.",
          "Prices, deliverables, timelines, cancellation terms, and any refund terms should be set out in a separate written proposal or client agreement before a service begins.",
        ],
      },
      {
        heading: "Website content and acceptable use",
        paragraphs: [
          "You may view and use the website for personal, lawful purposes. Do not interfere with its operation, attempt unauthorized access, or copy and republish its content in a way that infringes another person’s rights.",
          "Unless a separate written agreement says otherwise, website text, branding, and design remain the property of Provisa or their respective rights holders.",
        ],
      },
      {
        heading: "External links",
        paragraphs: [
          "Links to WhatsApp, Instagram, LinkedIn, and other external websites are provided for convenience. Those services operate under their own terms and policies.",
        ],
      },
      {
        heading: "Applicable terms",
        paragraphs: [
          "These website terms do not replace the terms of a separate client agreement. The applicable governing law and dispute process should be confirmed by Provisa with qualified counsel before these terms are treated as final.",
        ],
      },
    ],
  },
  {
    slug: "disclaimer",
    title: "Disclaimer",
    summary:
      "Important limits on the information and outcomes described on this website.",
    sections: [
      {
        heading: "General information",
        paragraphs: [
          "Website content is general information, not legal, immigration, financial, or tax advice. It does not replace advice from a qualified professional who understands your circumstances.",
          "Immigration, visa, and opportunity requirements can change. Verify current requirements with the relevant government body, institution, or opportunity provider before acting.",
        ],
      },
      {
        heading: "No guaranteed outcomes",
        paragraphs: [
          "Provisa can help clients prepare and position their professional information, but it cannot guarantee visa approvals, selections, memberships, grants, employment, or other outcomes controlled by third parties.",
        ],
      },
      {
        heading: "Service boundaries",
        paragraphs: [
          "The website itself does not create a lawyer-client or immigration-representative relationship. The exact scope and regulatory status of Provisa’s visa or migration support must be confirmed by the business and qualified counsel, and should be stated in the applicable client agreement.",
        ],
      },
    ],
  },
] as const;

export type LegalDocumentSlug = (typeof legalDocuments)[number]["slug"];

export function getLegalDocumentBySlug(slug: string) {
  return legalDocuments.find((document) => document.slug === slug);
}