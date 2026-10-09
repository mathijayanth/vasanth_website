import type { ArticleDetail, ArticleContentBlock } from "@/types/article-content";

const sharedDisclaimerParts = [
  {
    type: "callout" as const,
    variant: "warning" as const,
    title: "Informational only",
    parts: [
      {
        type: "text" as const,
        value:
          "This placeholder article is for layout and UX demonstration. It does not provide diagnosis, treatment, or emergency guidance. Talk with a qualified clinician about your situation.",
      },
    ],
  },
];

function genericBody(title: string): ArticleContentBlock[] {
  return [
    {
      type: "heading",
      id: "overview",
      level: 2,
      text: "Overview",
    },
    {
      type: "paragraph",
      parts: [
        {
          type: "text",
          value: `This is a placeholder page for “${title}”. When the CMS is connected, the full editorial body will appear here with headings, citations, and reviewer attribution.`,
        },
      ],
    },
    {
      type: "heading",
      id: "questions-for-your-clinician",
      level: 2,
      text: "Questions for your clinician",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "What follow-up timeline makes sense for me?",
        "Which sources of information do you trust for this topic?",
        "When should I seek urgent care?",
      ],
    },
    ...sharedDisclaimerParts,
  ];
}

const featuredBody: ArticleContentBlock[] = [
  {
    type: "heading",
    id: "why-context-matters",
    level: 2,
    text: "Why context matters",
  },
  {
    type: "paragraph",
    parts: [
      {
        type: "text",
        value:
          "Health headlines often summarize a single study or anecdote. A calmer read starts with scope: Who was studied? How large was the sample? Was the design observational or randomized? This placeholder article models how VitalNotes will frame ",
      },
      {
        type: "link",
        value: "evidence-informed",
        href: "/articles",
      },
      {
        type: "text",
        value: " stories without overstating certainty.",
      },
    ],
  },
  {
    type: "callout",
    variant: "highlight",
    title: "Editorial note",
    parts: [
      {
        type: "text",
        value:
          "We do not invent statistics or cite fake journals. Numbers and trial names below are intentionally omitted until content is verified in the CMS.",
      },
    ],
  },
  {
    type: "heading",
    id: "four-questions-to-ask",
    level: 2,
    text: "Four questions to ask",
  },
  {
    type: "list",
    ordered: true,
    items: [
      "What population does this evidence apply to?",
      "What outcomes were measured—and for how long?",
      "What are the plausible benefits and harms?",
      "Does this change my plan after speaking with my clinician?",
    ],
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1200&h=675&fit=crop",
    alt: "Clinician reviewing notes with a patient",
    caption: "Placeholder image — consultation settings vary by clinic and country.",
    width: 1200,
    height: 675,
  },
  {
    type: "heading",
    id: "spotting-overstated-claims",
    level: 2,
    text: "Spotting overstated claims",
  },
  {
    type: "paragraph",
    parts: [
      {
        type: "text",
        value:
          "Be cautious with absolute language (“cure,” “miracle,” “always”). Responsible reporting uses ranges, uncertainty, and links to primary sources. Our future articles will distinguish ",
      },
      { type: "text", value: "informational education" },
      {
        type: "text",
        value: " from individualized medical advice.",
      },
    ],
  },
  {
    type: "quote",
    text: "Good science is often incremental. Patient-friendly writing should reflect that pace.",
    attribution: "Placeholder editorial principle",
  },
  {
    type: "heading",
    id: "comparison-table",
    level: 3,
    text: "Observational vs. randomized studies (simplified)",
  },
  {
    type: "table",
    caption: "Placeholder comparison for readers — not a methods textbook.",
    headers: ["Study type", "Helpful for", "Limitation"],
    rows: [
      ["Observational", "Hypotheses in real-world settings", "Cannot prove cause alone"],
      ["Randomized trial", "Testing interventions", "May not represent every patient group"],
    ],
  },
  {
    type: "heading",
    id: "when-to-seek-care",
    level: 2,
    text: "When to seek professional care",
  },
  {
    type: "callout",
    variant: "info",
    title: "Not emergency guidance",
    parts: [
      {
        type: "text",
        value:
          "If you think you are experiencing a medical emergency, call your local emergency number. This article cannot triage symptoms or recommend treatments.",
      },
    ],
  },
  {
    type: "paragraph",
    parts: [
      {
        type: "text",
        value: "Use articles like this to prepare questions—not to self-diagnose. Learn more about our approach on the ",
      },
      {
        type: "link",
        value: "About",
        href: "/about",
      },
      {
        type: "text",
        value: " page.",
      },
    ],
  },
];

const bodies: Record<
  string,
  Pick<
    ArticleDetail,
    | "updatedAt"
    | "keyTakeaways"
    | "content"
    | "references"
    | "medicalReview"
    | "isPlaceholder"
  >
> = {
  "calmer-way-to-read-clinical-evidence": {
    isPlaceholder: true,
    updatedAt: "2026-10-06T12:00:00.000Z",
    keyTakeaways: [
      "Start with study context before accepting a headline.",
      "Ask how evidence applies to your personal health situation.",
      "Separate educational content from individualized medical advice.",
    ],
    content: featuredBody,
    references: [
      {
        id: "ref-1",
        label:
          "Placeholder reference — primary sources will be linked from the CMS with DOI or PubMed ID.",
      },
      {
        id: "ref-2",
        label: "NIH: Understanding clinical research (external resource placeholder)",
        href: "https://www.nih.gov/",
      },
    ],
    medicalReview: {
      reviewer: {
        name: "Dr. Jordan Lee",
        slug: "jordan-lee",
        avatarUrl:
          "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop",
        title: "MD, Cardiology",
        specialty: "Preventive cardiology",
      },
      reviewedAt: "2026-10-06T10:00:00.000Z",
      note: "Placeholder review record for demo layout. Production articles will show reviewers only when verified in the database.",
    },
  },
};

export function getArticleBodyBySlug(
  slug: string,
): Pick<
  ArticleDetail,
  | "keyTakeaways"
  | "content"
  | "references"
  | "medicalReview"
  | "isPlaceholder"
> & { updatedAt?: string } {
  if (bodies[slug]) {
    return bodies[slug];
  }

  const title = slug.replace(/-/g, " ");
  return {
    isPlaceholder: true,
    keyTakeaways: [
      "Placeholder article — not verified medical guidance.",
      "Discuss personal decisions with a licensed clinician.",
    ],
    content: genericBody(title),
    references: [
      {
        id: "ref-placeholder",
        label: "References will appear here after editorial publication.",
      },
    ],
  };
}
