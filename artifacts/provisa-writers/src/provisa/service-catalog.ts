export const serviceCatalog = [
  {
    slug: "global-opportunities-consulting",
    title: "Global Opportunities Consulting",
    description: "We connect professionals to global opportunities, such as:",
    detail:
      "We help professionals identify and pursue international opportunities that fit their achievements, fields, and ambitions.",
    overview: [
      "A global opportunity is most useful when it fits your experience, field and professional goals. We help you identify relevant programmes and platforms, then clarify how to approach them with a strong record of your work.",
      "Support can include scholarships, global conferences, professional memberships, fellowships, research and publication opportunities, grants and research funding, and arts or exhibition showcases. Each opportunity has its own eligibility requirements, deadlines and selection process.",
    ],
    offerings: [
      "Scholarship opportunities",
      "Global conferences",
      "Professional memberships",
      "International fellowships",
      "Research and publication opportunities",
      "Grants and research funding",
      "Arts and exhibition showcases",
    ],
  },
  {
    slug: "us-skilled-worker-migration",
    title: "US Skilled Worker Migration",
    description:
      "Professional support for skilled workers exploring U.S. migration pathways.",
    detail:
      "We support skilled professionals as they assess their profiles, organize evidence, and explore U.S. employment-based pathways.",
    overview: [
      "U.S. employment-based pathways often require a clear account of a professional's work, achievements and supporting evidence. We help skilled workers assess their profile and organize a consistent record before deciding on next steps.",
      "Depending on the case, support may include profile building and application preparation for EB-1A or EB-2 NIW. Eligibility and decisions depend on the relevant criteria and reviewing authorities; our support does not guarantee approval.",
    ],
    offerings: [
      "Profile Assessment",
      "Profile Building",
      "EB-1A Application Support",
      "EB-2 NIW Application Support",
    ],
  },
  {
    slug: "visa-application-support",
    title: "Visa Application Support",
    description: "Professional support for visa applications, such as:",
    detail:
      "We help applicants prepare for selected visitor and student visa applications and visa interviews.",
    overview: [
      "We provide practical preparation for selected visitor and student visa applications, including UK and U.S. visitor visas, UK student visas and Canada visitor visas. Support may include organizing documents, checking application materials for consistency and preparing for an interview.",
      "Requirements vary by country, visa type and applicant. We help clients prepare clear, complete materials while decisions remain with the relevant authority.",
    ],
    offerings: [
      "UK visitor visa",
      "US visitor visa",
      "UK student visa",
      "Canada visitor visa",
      "Visa interview preparation",
    ],
  },
] as const;

export type ServiceSlug = (typeof serviceCatalog)[number]["slug"];

export function getServiceBySlug(slug: string) {
  return serviceCatalog.find((service) => service.slug === slug);
}