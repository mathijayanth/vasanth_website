import {
  ArticleStatus,
  CommentStatus,
  NewsletterStatus,
  PrismaClient,
  UserRole,
} from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

const PLACEHOLDER_BANNER = {
  type: "callout",
  variant: "warning",
  title: "PLACEHOLDER content",
  parts: [
    {
      type: "text",
      value:
        "Seeded for development only. Not medical advice. Replace with clinician-reviewed content before production.",
    },
  ],
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function main() {
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe-Dev-Only!";
  const passwordHash = await hash(adminPassword, 12);

  await prisma.articleView.deleteMany();
  await prisma.savedArticle.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.medicalReview.deleteMany();
  await prisma.reference.deleteMany();
  await prisma.articleTag.deleteMany();
  await prisma.article.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.category.deleteMany();
  await prisma.authorProfile.deleteMany();
  await prisma.newsletterSubscriber.deleteMany();
  await prisma.user.deleteMany();

  const adminUser = await prisma.user.create({
    data: {
      email: "admin@placeholder.vitalnotes.local",
      name: "Placeholder Admin",
      role: UserRole.ADMIN,
      passwordHash,
    },
  });

  const editorUser = await prisma.user.create({
    data: {
      email: "editor@placeholder.vitalnotes.local",
      name: "Placeholder Editor",
      role: UserRole.EDITOR,
      passwordHash,
    },
  });

  const categories = await Promise.all(
    [
      ["Heart Health", "heart-health", "Blood pressure, cholesterol, and cardiovascular wellness."],
      ["Diabetes", "diabetes", "Glucose management and daily routines."],
      ["Nutrition", "nutrition", "Balanced eating patterns and practical meal ideas."],
      ["Mental Health", "mental-health", "Stress, sleep, and emotional wellbeing."],
      ["Women's Health", "womens-health", "Screenings and life-stage care."],
      ["Fitness", "fitness", "Movement, strength, and recovery basics."],
      ["Skin Health", "skin-health", "Sun safety and common skin concerns."],
      ["General Wellness", "general-wellness", "Everyday habits for long-term health."],
    ].map(([name, slug, description]) =>
      prisma.category.create({
        data: { name, slug, description },
      }),
    ),
  );

  const categoryBySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));

  const authors = await Promise.all(
    [
      {
        slug: "jordan-lee",
        displayName: "Dr. Jordan Lee",
        title: "MD, Cardiology",
        specialty: "Preventive cardiology",
        avatarUrl:
          "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop",
        bio: "PLACEHOLDER bio — cardiologist focused on patient-friendly evidence summaries.",
        userId: adminUser.id,
      },
      {
        slug: "amira-hassan",
        displayName: "Dr. Amira Hassan",
        title: "MD, Endocrinology",
        specialty: "Diabetes & metabolism",
        avatarUrl:
          "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop",
        bio: "PLACEHOLDER bio — endocrinology editorials for readers.",
      },
      {
        slug: "elena-vasquez",
        displayName: "Dr. Elena Vasquez",
        title: "PhD, RD",
        specialty: "Clinical nutrition",
        avatarUrl:
          "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop",
        bio: "PLACEHOLDER bio — clinical nutrition without fad diets.",
        userId: editorUser.id,
      },
      {
        slug: "marcus-chen",
        displayName: "Dr. Marcus Chen",
        title: "MD, Psychiatry",
        specialty: "Mental health & wellness",
        avatarUrl:
          "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&h=200&fit=crop",
        bio: "PLACEHOLDER bio — mental health writing with clarity.",
      },
    ].map((author) => prisma.authorProfile.create({ data: author })),
  );

  const authorBySlug = Object.fromEntries(authors.map((a) => [a.slug, a]));

  const tags = await Promise.all(
    [
      "Evidence",
      "Prevention",
      "Primary Care",
      "Patient Education",
      "Wellness",
      "Research Literacy",
    ].map((name) =>
      prisma.tag.create({
        data: { name, slug: slugify(name) },
      }),
    ),
  );

  const tagBySlug = Object.fromEntries(tags.map((t) => [t.slug, t]));

  const sampleArticles: Array<{
    title: string;
    slug: string;
    excerpt: string;
    categorySlug: string;
    authorSlug: string;
    readingTime: number;
    featuredImage: string;
    featuredImageAlt: string;
    tagSlugs: string[];
    withReview?: boolean;
  }> = [
    {
      title: "[PLACEHOLDER] A calmer way to read clinical evidence",
      slug: "calmer-way-to-read-clinical-evidence",
      excerpt:
        "Placeholder editorial on evaluating health headlines with context — not individualized medical advice.",
      categorySlug: "heart-health",
      authorSlug: "jordan-lee",
      readingTime: 5,
      featuredImage:
        "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1400&h=900&fit=crop",
      featuredImageAlt: "Clinician reviewing health information on a tablet",
      tagSlugs: ["evidence", "research-literacy", "patient-education"],
      withReview: true,
    },
    {
      title: "[PLACEHOLDER] Blood pressure checks at home: what to track",
      slug: "blood-pressure-checks-at-home",
      excerpt: "Placeholder guide to home monitoring routines and when to follow up with a clinician.",
      categorySlug: "heart-health",
      authorSlug: "jordan-lee",
      readingTime: 4,
      featuredImage:
        "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop",
      featuredImageAlt: "Blood pressure cuff on a table",
      tagSlugs: ["prevention", "primary-care"],
    },
    {
      title: "[PLACEHOLDER] Understanding A1C results without the jargon",
      slug: "understanding-a1c-results",
      excerpt: "Placeholder explainer on lab reports and questions for your clinician.",
      categorySlug: "diabetes",
      authorSlug: "amira-hassan",
      readingTime: 6,
      featuredImage:
        "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&h=600&fit=crop",
      featuredImageAlt: "Lab report on a desk",
      tagSlugs: ["patient-education", "primary-care"],
    },
    {
      title: "[PLACEHOLDER] Protein at breakfast: simple plate ideas",
      slug: "protein-at-breakfast",
      excerpt: "Placeholder nutrition notes for balanced morning meals.",
      categorySlug: "nutrition",
      authorSlug: "elena-vasquez",
      readingTime: 3,
      featuredImage:
        "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=600&fit=crop",
      featuredImageAlt: "Healthy breakfast bowl",
      tagSlugs: ["wellness", "patient-education"],
    },
    {
      title: "[PLACEHOLDER] Sleep and stress: a gentle reset routine",
      slug: "sleep-and-stress-reset",
      excerpt: "Placeholder wellness tips — seek professional care for persistent symptoms.",
      categorySlug: "mental-health",
      authorSlug: "marcus-chen",
      readingTime: 5,
      featuredImage:
        "https://images.unsplash.com/photo-1541781774459-bb2af2d05a55?w=800&h=600&fit=crop",
      featuredImageAlt: "Calm bedroom with soft morning light",
      tagSlugs: ["wellness", "patient-education"],
    },
    {
      title: "[PLACEHOLDER] Hydration myths and facts",
      slug: "hydration-myths-and-facts",
      excerpt: "Placeholder overview of fluids and daily habits without treatment claims.",
      categorySlug: "general-wellness",
      authorSlug: "elena-vasquez",
      readingTime: 3,
      featuredImage:
        "https://images.unsplash.com/photo-1548839140-29a7492991a5?w=800&h=600&fit=crop",
      featuredImageAlt: "Glass of water on a table",
      tagSlugs: ["wellness", "evidence"],
    },
  ];

  const publishedAtBase = new Date("2026-10-01T12:00:00.000Z");

  for (const [index, sample] of sampleArticles.entries()) {
    const publishedAt = new Date(publishedAtBase);
    publishedAt.setDate(publishedAt.getDate() + index);

    const content = [
      PLACEHOLDER_BANNER,
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
            value: `${sample.excerpt} This seeded article supports UI and database integration testing only.`,
          },
        ],
      },
      {
        type: "list",
        ordered: false,
        items: [
          "Discuss personal decisions with a licensed clinician.",
          "Do not use this page for emergency guidance.",
          "Replace placeholder copy before launch.",
        ],
      },
    ];

    const article = await prisma.article.create({
      data: {
        title: sample.title,
        slug: sample.slug,
        excerpt: sample.excerpt,
        content,
        featuredImage: sample.featuredImage,
        featuredImageAlt: sample.featuredImageAlt,
        status: ArticleStatus.PUBLISHED,
        categoryId: categoryBySlug[sample.categorySlug]!.id,
        authorId: authorBySlug[sample.authorSlug]!.id,
        publishedAt,
        readingTime: sample.readingTime,
        seoTitle: sample.title.replace("[PLACEHOLDER] ", ""),
        seoDescription: sample.excerpt,
        lastReviewedAt: sample.withReview ? publishedAt : null,
        tags: {
          create: sample.tagSlugs.map((tagSlug) => ({
            tagId: tagBySlug[tagSlug]!.id,
          })),
        },
        references: {
          create: [
            {
              label:
                "PLACEHOLDER reference — link verified sources in production CMS.",
              sortOrder: 0,
            },
            {
              label: "NIH health information portal (external example)",
              href: "https://www.nih.gov/",
              sortOrder: 1,
            },
          ],
        },
      },
    });

    if (sample.withReview) {
      await prisma.medicalReview.create({
        data: {
          articleId: article.id,
          reviewerId: authorBySlug["jordan-lee"]!.id,
          note: "PLACEHOLDER review record for development layout only.",
          isVerified: false,
        },
      });
    }
  }

  await prisma.newsletterSubscriber.create({
    data: {
      email: "subscriber@placeholder.vitalnotes.local",
      status: NewsletterStatus.ACTIVE,
    },
  });

  await prisma.comment.create({
    data: {
      articleId: (
        await prisma.article.findFirstOrThrow({
          where: { slug: "calmer-way-to-read-clinical-evidence" },
        })
      ).id,
      userId: editorUser.id,
      body: "PLACEHOLDER comment — moderation workflow demo.",
      status: CommentStatus.APPROVED,
    },
  });

  console.log("Seed completed (PLACEHOLDER data only).");
  console.log(`Admin user: ${adminUser.email} (password from SEED_ADMIN_PASSWORD env)`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
