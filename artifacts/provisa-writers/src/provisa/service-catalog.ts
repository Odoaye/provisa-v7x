export const serviceCatalog = [
  {
    slug: "global-opportunities-consulting",
    title: "Global Opportunities Consulting",
    description: "We connect professionals to global opportunities, such as:",
    detail:
      "We help professionals identify and pursue international opportunities that fit their achievements, fields, and ambitions.",
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