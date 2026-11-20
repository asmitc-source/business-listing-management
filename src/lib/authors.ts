export type AuthorProfile = {
  name: string;
  slug: string;
  bio: string;
  linkedinUrl?: string;
  imageSrc?: string;
  imageWebpSrc?: string;
  imageAlt: string;
  initials: string;
};

/** Canonical author bios for BLM article footers — tuned for business listing management. */
export const AUTHORS = {
  editorial: {
    name: "BLM Editorial",
    slug: "blm-editorial",
    bio:
      "BLM Editorial documents the product's listing workflows, integrations, security controls, pricing, and operating limits for multi-location teams.",
    imageAlt: "BLM Editorial",
    initials: "BLM",
  },
  asmit: {
    name: "Asmit Choudhary",
    slug: "asmit-choudhary",
    bio:
      "Asmit Choudhary built Business Listing Management. An IIT Roorkee B.Tech with stints at Ninjacart and Deloitte, he writes for multi-location operators who need NAP, coverage, and duplicates handled without the spreadsheet.",
    linkedinUrl: "https://www.linkedin.com/in/asmit-c/",
    imageSrc: "/team/asmit-choudhary.jpg",
    imageWebpSrc: "/team/asmit-choudhary.webp",
    imageAlt: "Asmit Choudhary",
    initials: "AC",
  },
  nancy: {
    name: "Nancy",
    slug: "nancy",
    bio: "Nancy writes practical comparisons and guidance for teams managing business listings, local visibility, and review workflows.",
    imageAlt: "Nancy",
    initials: "N",
  },
  mehak: {
    name: "Mehak",
    slug: "mehak",
    bio: "Mehak contributes editorial analysis on business listings, multi-location operations, and local visibility.",
    imageAlt: "Mehak",
    initials: "M",
  },
  sandeep: {
    name: "Sandeep Kumar",
    slug: "sandeep-kumar",
    bio:
      "Sandeep Kumar writes about business listing management and local SEO. With prior SEO work at Tosh Innovations and Hyper Adam, he focuses on practical guidance for teams that need clean NAP, directory coverage, and multi-location data they can trust.",
    linkedinUrl: "https://www.linkedin.com/in/marketingbysandeep",
    imageSrc: "/team/sandeep-kumar.jpg",
    imageWebpSrc: "/team/sandeep-kumar.webp",
    imageAlt: "Sandeep Kumar",
    initials: "SK",
  },
} as const satisfies Record<string, AuthorProfile>;

const ALIASES: Record<string, keyof typeof AUTHORS> = {
  "asmit choudhary": "asmit",
  asmit: "asmit",
  "blm editorial": "editorial",
  editorial: "editorial",
  "sandeep kumar": "sandeep",
  sandeep: "sandeep",
  nancy: "nancy",
  mehak: "mehak",
};

export function resolveAuthor(authorName: string | null | undefined): AuthorProfile {
  const key = ALIASES[(authorName ?? "").trim().toLowerCase()] ?? "editorial";
  return AUTHORS[key];
}
