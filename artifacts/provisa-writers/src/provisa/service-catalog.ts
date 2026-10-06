export const serviceCatalog = [
  {
    slug: "global-opportunities-consulting",
    title: "Global Opportunities Consulting",
    description:
      "Discover fellowships, conferences, scholarships and other opportunities aligned with your goals.",
    detail:
      "There are thousands of international opportunities available to professionals—but finding the right ones can be difficult.",
    detailNote: "",
    overview: [
      "Provisa helps professionals identify opportunities that align with their expertise, career stage and international ambitions, and provides strategic support where needed to pursue them.",
      "These may include fellowships, conferences, professional memberships, scholarships, awards, grants, research and publication opportunities, and arts or exhibition opportunities.",
    ],
    offerings: [
      "International fellowships",
      "Conferences and professional memberships",
      "Scholarships, awards and grants",
      "Research, publication and arts opportunities",
    ],
    detailSections: [
      {
        title: "Global Opportunities Consulting",
        headline: "Discover Opportunities Beyond Borders.",
        paragraphs: [
          "There are thousands of international opportunities available to professionals—but finding the right ones can be difficult.",
          "Provisa helps you identify opportunities that align with your expertise, career stage and international ambitions, and provides strategic support where needed to pursue them.",
        ],
        itemsHeading: "Opportunities may include",
        items: [
          "International fellowships",
          "Conferences",
          "Professional memberships",
          "Scholarships",
          "Awards and recognition",
          "Grants and research funding",
          "Research and publication opportunities",
          "Arts and exhibition opportunities",
        ],
        additionalHeading: "",
        additionalItems: [],
        audience: "",
        ctaLabel: "Explore Global Opportunities",
      },
    ],
  },
  {
    slug: "us-skilled-worker-migration",
    title: "US Skilled Worker Migration",
    description:
      "Build your professional record and prepare for EB-1A and EB-2 NIW petition support.",
    detail:
      "Professional support for skilled workers exploring U.S. migration pathways through profile building and petition preparation.",
    overview: [
      "We help professionals build a stronger record, assess relevant evidence and prepare petition materials for EB-1A or EB-2 NIW pathways.",
      "Eligibility and decisions depend on the relevant criteria and reviewing authorities. Provisa does not guarantee approval.",
    ],
    offerings: [
      "Profile Building",
      "EB-1A Application Support",
      "EB-2 NIW Application Support",
    ],
    detailNote:
      "Eligibility and decisions depend on the relevant criteria and reviewing authorities. Provisa does not guarantee approval.",
    detailSections: [
      {
        title: "Profile Building",
        headline: "Build Today for the Opportunities You Want Tomorrow.",
        paragraphs: [
          "Not every professional is ready to pursue an opportunity immediately.",
          "Our Profile Building service helps professionals identify gaps, strengthen their professional record and intentionally pursue credible achievements that support their long-term international goals.",
          "Based on your field and goals, we may explore areas such as:",
        ],
        itemsHeading: "Areas we may explore",
        items: [
          "Professional recognition",
          "Publications",
          "Memberships",
          "Speaking opportunities",
          "Leadership",
          "Judging",
          "Awards",
          "Industry contributions",
          "Other achievements relevant to your field and goals",
        ],
        additionalHeading: "",
        additionalItems: [],
        audience:
          "Professionals who want to strengthen their profile before pursuing competitive global opportunities or skilled migration pathways.",
        ctaLabel: "Start Building Your Profile",
      },
      {
        title: "EB-1A Application Support",
        headline: "Extraordinary Ability. Strategically Presented.",
        paragraphs: [
          "The EB-1A is a U.S. immigration pathway for individuals who can demonstrate extraordinary ability and sustained recognition in their field.",
          "Provisa supports professionals in assessing their profile, identifying relevant evidence, developing case strategy, organizing supporting documentation, and preparing professionally structured petition materials.",
        ],
        itemsHeading: "Our support includes",
        items: [
          "Profile assessment",
          "Evidence review and organization",
          "Petition strategy",
          "Recommendation letters",
          "Petition documentation",
          "Supporting exhibit organization",
          "RFE support, where applicable",
        ],
        additionalHeading: "",
        additionalItems: [],
        audience:
          "Professionals with significant achievements, recognition, leadership, contributions or influence in their field.",
        ctaLabel: "Assess Your Profile",
      },
      {
        title: "EB-2 NIW Application Support",
        headline: "Your Expertise. Your Endeavor. Your Impact.",
        paragraphs: [
          "The EB-2 National Interest Waiver provides a U.S. immigration pathway for qualifying professionals whose proposed work has substantial merit and national importance.",
          "Provisa helps professionals evaluate their profile, articulate their proposed endeavor, document their expertise and impact, and develop comprehensive petition materials.",
        ],
        itemsHeading: "Our support includes",
        items: [
          "Profile assessment",
          "Proposed endeavor development",
          "Evidence strategy",
          "Recommendation letters",
          "Petition preparation",
          "Exhibit organization",
          "RFE support, where applicable",
        ],
        additionalHeading: "",
        additionalItems: [],
        audience:
          "Researchers, healthcare professionals, engineers, technology professionals, entrepreneurs and other qualified professionals whose work may contribute meaningfully in the United States.",
        ctaLabel: "Assess Your Profile",
      },
    ],
  },
  {
    slug: "visa-application-support",
    title: "Visa Application Support",
    description:
      "Prepare selected visitor and student visa applications with clear documents and interview support.",
    detail:
      "A strong visa application requires more than completing forms. Your documentation should clearly communicate your purpose of travel, circumstances and supporting evidence.",
    overview: [
      "We provide professional support for selected UK and U.S. visitor visas, UK student visas, Canada visitor visas and visa interview preparation.",
      "Support may include application review, documentation guidance, supporting document preparation and interview preparation, depending on the service.",
    ],
    offerings: [
      "UK visitor visa",
      "U.S. B-1/B-2 visitor visa",
      "UK student visa",
      "Canada visitor visa",
      "Visa interview preparation",
    ],
    detailNote:
      "Requirements vary by country, visa type and applicant. Decisions remain with the relevant authority.",
    detailSections: [
      {
        title: "Visa Application Support",
        headline: "Prepare Your Application With Clarity.",
        paragraphs: [
          "A strong visa application requires more than completing forms. Your documentation should clearly communicate your purpose of travel, circumstances and supporting evidence.",
          "Provisa provides professional documentation and application support for selected visa categories, including:",
          "Support may include application review, documentation guidance, supporting document preparation and interview preparation, depending on the service.",
        ],
        itemsHeading: "Selected visa categories",
        items: [
          "UK Visitor Visa",
          "U.S. B-1/B-2 Visitor Visa",
          "UK Student Visa",
          "Canada Visitor Visa",
          "Visa interview preparation",
        ],
        additionalHeading: "Our support may include",
        additionalItems: [
          "Application review",
          "Documentation guidance",
          "Supporting document preparation",
          "Interview preparation",
        ],
        audience: "",
        ctaLabel: "Get Visa Application Support",
      },
    ],
  },
] as const;

export type ServiceSlug = (typeof serviceCatalog)[number]["slug"];

export function getServiceBySlug(slug: string) {
  return serviceCatalog.find((service) => service.slug === slug);
}