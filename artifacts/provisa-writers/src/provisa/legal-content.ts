export const legalReviewNote =
  "Draft for review: Provisa should confirm its registered details, governing jurisdiction, data-retention practices, and service boundaries with qualified counsel before treating these pages as final.";

export const legalDocuments = [
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    summary:
      "How information shared through the Provisa Writers website is handled.",
    sections: [
      {
        heading: "Information you choose to share",
        paragraphs: [
          "The contact form asks for your name, email address, the service you are interested in, and a brief description of what you need.",
          "Selecting “Send an email” opens your email application with those details filled in. The website does not send the message automatically; Provisa receives it only if you choose to send the prepared email.",
        ],
      },
      {
        heading: "How information is used",
        paragraphs: [
          "Information you send to Provisa may be used to respond to your inquiry and discuss the service you are interested in.",
          "If you contact Provisa through email, WhatsApp, Instagram, or LinkedIn, the relevant communication platform may process your information under its own terms and privacy policy.",
        ],
      },
      {
        heading: "Cookies and website operation",
        paragraphs: [
          "The protected administrator area uses an essential session cookie for sign-in. The public contact form does not store submitted details in the website database.",
          "Provisa should confirm its email-retention and deletion practices before this draft is treated as final.",
        ],
      },
      {
        heading: "Privacy requests",
        paragraphs: [
          "For questions about information you have shared with Provisa, contact info@provisawriters.com. The response and deletion process should be confirmed by Provisa before publication.",
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
        ],
      },
      {
        heading: "External links",
        paragraphs: [
          "Links to WhatsApp, Instagram, LinkedIn, and other external websites are provided for convenience. Those services operate under their own terms and policies.",
        ],
      },
      {
        heading: "Governing law",
        paragraphs: [
          "The governing law and courts for these terms must be confirmed by Provisa with qualified counsel before publication.",
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
          "Website content is provided for general information. It is not a substitute for advice from a qualified immigration or legal professional about an individual matter.",
          "Readers should verify requirements with the relevant government body, institution, or opportunity provider before making decisions.",
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
          "Provisa should confirm how its profile, visa, and migration support differs from regulated legal or immigration advice before this draft is treated as final.",
        ],
      },
    ],
  },
] as const;

export type LegalDocumentSlug = (typeof legalDocuments)[number]["slug"];

export function getLegalDocumentBySlug(slug: string) {
  return legalDocuments.find((document) => document.slug === slug);
}