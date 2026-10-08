export const serviceCatalog = [
  {
    slug: "global-opportunities-consulting",
    title: "Global Opportunities Consulting",
    description: "We connect professionals to global opportunities, such as:",
    detailHeadline: "Discover Opportunities Beyond Borders.",
    detailCta: "Explore Global Opportunities",
    detail:
      "There are thousands of international opportunities available to professionals—but finding the right ones can be difficult.",
    overview: [
      "Provisa helps you identify opportunities that align with your expertise, career stage and international ambitions, and provides strategic support where needed.",
    ],
    offerings: [
      "International fellowships",
      "Conferences",
      "Professional memberships",
      "Scholarships",
      "Awards and recognition",
      "Grants and research funding",
      "Research and publication opportunities",
      "Arts and exhibition opportunities",
    ],
    supportHeading: "Our support may include",
    support: [],
    subservices: [],
  },
  {
    slug: "us-skilled-worker-migration",
    title: "US Skilled Worker Migration",
    description:
      "Professional support for skilled workers exploring U.S. migration pathways.",
    detailHeadline: "Build a stronger profile for your next opportunity.",
    detailCta: "Discuss U.S. Pathway Support",
    detail:
      "We help skilled professionals strengthen their records, assess relevant evidence and prepare for U.S. employment-based pathways.",
    overview: [
      "U.S. employment-based pathways often require a clear account of a professional's work, achievements and supporting evidence. We help skilled workers assess their profile and organize a consistent record before deciding on next steps.",
      "Support may include profile building and preparation for EB-1A or EB-2 NIW pathways. Eligibility and decisions depend on the applicable criteria and reviewing authorities; our support does not guarantee approval.",
    ],
    offerings: [
      "Profile Building",
      "EB-1A Application Support",
      "EB-2 NIW Application Support",
    ],
    supportHeading: "Our support may include",
    support: [],
    subservices: [
      {
        title: "Profile Building",
        headline: "Build Today for the Opportunities You Want Tomorrow.",
        overview: [
          "Not every professional is ready to pursue an opportunity immediately.",
          "Our Profile Building service helps professionals identify gaps, strengthen their professional record and intentionally pursue credible achievements that support their long-term international goals.",
        ],
        listHeading: "We may explore areas such as",
        listItems: [
          "Professional recognition",
          "Publications",
          "Memberships",
          "Speaking opportunities",
          "Leadership",
          "Judging",
          "Awards",
          "Industry contributions and other relevant achievements",
        ],
        audienceHeading: "Who is it for?",
        audience:
          "Professionals who want to strengthen their profile before pursuing competitive global opportunities or skilled migration pathways.",
        cta: "Start Building Your Profile",
      },
      {
        title: "EB-1A Application Support",
        headline: "Extraordinary Ability. Strategically Presented.",
        overview: [
          "The EB-1A is a U.S. immigration pathway for individuals who can demonstrate extraordinary ability and sustained recognition in their field.",
          "Provisa supports professionals in assessing their profile, identifying relevant evidence, developing case strategy, organizing supporting documentation, and preparing professionally structured petition materials.",
        ],
        listHeading: "Our support includes",
        listItems: [
          "Profile assessment",
          "Evidence review and organization",
          "Petition strategy",
          "Recommendation letters",
          "Petition documentation",
          "Supporting exhibit organization",
          "RFE support, where applicable",
        ],
        audienceHeading: "Who is it for?",
        audience:
          "Professionals with significant achievements, recognition, leadership, contributions or influence in their field.",
        cta: "Assess Your Profile",
      },
      {
        title: "EB-2 NIW Application Support",
        headline: "Your Expertise. Your Endeavor. Your Impact.",
        overview: [
          "The EB-2 National Interest Waiver provides a U.S. immigration pathway for qualifying professionals whose proposed work has substantial merit and national importance.",
          "Provisa helps professionals evaluate their profile, articulate their proposed endeavor, document their expertise and impact, and develop comprehensive petition materials.",
        ],
        listHeading: "Our support includes",
        listItems: [
          "Profile assessment",
          "Proposed endeavor development",
          "Evidence strategy",
          "Recommendation letters",
          "Petition preparation",
          "Exhibit organization",
          "RFE support, where applicable",
        ],
        audienceHeading: "Who is it for?",
        audience:
          "Researchers, healthcare professionals, engineers, technology professionals, entrepreneurs and other qualified professionals whose work may contribute meaningfully in the United States.",
        cta: "Assess Your Profile",
      },
    ],
  },
  {
    slug: "visa-application-support",
    title: "Visa Application Support",
    description: "Professional support for visa applications, such as:",
    detailHeadline: "Prepare Your Application With Clarity.",
    detailCta: "Get Visa Application Support",
    detail:
      "A strong visa application requires more than completing forms. Your documentation should clearly communicate your purpose of travel, circumstances and supporting evidence.",
    overview: [
      "Provisa provides professional documentation and application support for selected visa categories.",
      "Requirements vary by country, visa type and applicant. We help clients prepare clear, complete materials while decisions remain with the relevant authority.",
    ],
    offerings: [
      "UK Visitor Visa",
      "U.S. B-1/B-2 Visitor Visa",
      "UK Student Visa",
      "Canada Visitor Visa",
      "Visa interview preparation",
    ],
    supportHeading: "Our support may include",
    support: [
      "Application review",
      "Documentation guidance",
      "Supporting document preparation",
      "Interview preparation, depending on the service",
    ],
    subservices: [],
  },
] as const;

export type ServiceSlug = (typeof serviceCatalog)[number]["slug"];

export function getServiceBySlug(slug: string) {
  return serviceCatalog.find((service) => service.slug === slug);
}