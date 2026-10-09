/**
 * PLACEHOLDER article catalog — replace with database queries.
 */

import type { ArticleSummary } from "@/types";

const authors = {
  jordan: {
    name: "Dr. Jordan Lee",
    slug: "jordan-lee",
    avatarUrl:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop",
    title: "MD, Cardiology",
    specialty: "Preventive cardiology",
  },
  amira: {
    name: "Dr. Amira Hassan",
    slug: "amira-hassan",
    avatarUrl:
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop",
    title: "MD, Endocrinology",
    specialty: "Diabetes & metabolism",
  },
  elena: {
    name: "Dr. Elena Vasquez",
    slug: "elena-vasquez",
    avatarUrl:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop",
    title: "PhD, RD",
    specialty: "Clinical nutrition",
  },
  marcus: {
    name: "Dr. Marcus Chen",
    slug: "marcus-chen",
    avatarUrl:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&h=200&fit=crop",
    title: "MD, Psychiatry",
    specialty: "Mental health & wellness",
  },
} as const;

export const ARTICLE_PAGE_SIZE = 6;

/** Extended fields for catalog filtering (API can mirror this shape). */
export type CatalogArticle = ArticleSummary & {
  featured?: boolean;
  searchText?: string;
};

export const articlesCatalog: CatalogArticle[] = [
  {
    id: "featured-1",
    slug: "calmer-way-to-read-clinical-evidence",
    title: "A calmer way to read clinical evidence",
    excerpt:
      "Placeholder editorial: how to evaluate health headlines with context, trusted sources, and questions to ask your clinician.",
    category: "Heart Health",
    categorySlug: "heart-health",
    imageUrl:
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1400&h=900&fit=crop",
    imageAlt: "Clinician reviewing health information on a tablet",
    author: authors.jordan,
    publishedAt: "2026-10-06T09:00:00.000Z",
    readingTimeMinutes: 5,
    featured: true,
  },
  {
    id: "t1",
    slug: "blood-pressure-checks-at-home",
    title: "Blood pressure checks at home: what to track",
    excerpt: "Placeholder guide to home monitoring routines and when to follow up.",
    category: "Heart Health",
    categorySlug: "heart-health",
    imageUrl:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop",
    imageAlt: "Blood pressure cuff on a table",
    author: authors.jordan,
    publishedAt: "2026-10-04T10:00:00.000Z",
    readingTimeMinutes: 4,
    featured: true,
  },
  {
    id: "t2",
    slug: "understanding-a1c-results",
    title: "Understanding A1C results without the jargon",
    excerpt: "Placeholder explainer on lab reports and conversation starters.",
    category: "Diabetes",
    categorySlug: "diabetes",
    imageUrl:
      "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&h=600&fit=crop",
    imageAlt: "Lab report on a desk",
    author: authors.amira,
    publishedAt: "2026-10-03T14:00:00.000Z",
    readingTimeMinutes: 6,
  },
  {
    id: "t3",
    slug: "protein-at-breakfast",
    title: "Protein at breakfast: simple plate ideas",
    excerpt: "Placeholder nutrition notes for balanced morning meals.",
    category: "Nutrition",
    categorySlug: "nutrition",
    imageUrl:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=600&fit=crop",
    imageAlt: "Healthy breakfast bowl",
    author: authors.elena,
    publishedAt: "2026-10-02T08:00:00.000Z",
    readingTimeMinutes: 3,
  },
  {
    id: "t4",
    slug: "sleep-and-stress-reset",
    title: "Sleep and stress: a gentle reset routine",
    excerpt: "Placeholder wellness tips — not individualized medical advice.",
    category: "Mental Health",
    categorySlug: "mental-health",
    imageUrl:
      "https://images.unsplash.com/photo-1541781774459-bb2af2d05a55?w=800&h=600&fit=crop",
    imageAlt: "Calm bedroom with soft morning light",
    author: authors.marcus,
    publishedAt: "2026-10-01T16:00:00.000Z",
    readingTimeMinutes: 5,
  },
  {
    id: "l5",
    slug: "womens-health-screening-timeline",
    title: "Women's health screening timeline (placeholder)",
    excerpt: "Overview of common screenings — confirm schedules with your clinician.",
    category: "Women's Health",
    categorySlug: "womens-health",
    imageUrl:
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&h=600&fit=crop",
    imageAlt: "Healthcare professional in consultation",
    author: authors.amira,
    publishedAt: "2026-09-28T11:00:00.000Z",
    readingTimeMinutes: 7,
  },
  {
    id: "l6",
    slug: "movement-snacks-for-busy-days",
    title: "Movement snacks for busy days",
    excerpt: "Placeholder fitness ideas for short activity breaks.",
    category: "Fitness",
    categorySlug: "fitness",
    imageUrl:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac2558?w=800&h=600&fit=crop",
    imageAlt: "Person stretching outdoors",
    author: authors.jordan,
    publishedAt: "2026-09-26T09:30:00.000Z",
    readingTimeMinutes: 4,
  },
  {
    id: "a7",
    slug: "skin-sun-protection-basics",
    title: "Sun protection basics for everyday skin health",
    excerpt: "Placeholder overview of SPF, shade, and when to see a dermatologist.",
    category: "Skin Health",
    categorySlug: "skin-health",
    imageUrl:
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&h=600&fit=crop",
    imageAlt: "Sunscreen and skincare products",
    author: authors.elena,
    publishedAt: "2026-09-22T12:00:00.000Z",
    readingTimeMinutes: 4,
  },
  {
    id: "a8",
    slug: "hydration-myths-and-facts",
    title: "Hydration myths and facts",
    excerpt: "Placeholder guide to daily fluids without overpromising outcomes.",
    category: "General Wellness",
    categorySlug: "general-wellness",
    imageUrl:
      "https://images.unsplash.com/photo-1548839140-29a7492991a5?w=800&h=600&fit=crop",
    imageAlt: "Glass of water on a table",
    author: authors.elena,
    publishedAt: "2026-09-20T09:00:00.000Z",
    readingTimeMinutes: 3,
  },
  {
    id: "a9",
    slug: "cholesterol-numbers-explained",
    title: "Cholesterol numbers explained in plain language",
    excerpt: "Placeholder breakdown of common lipid panel terms.",
    category: "Heart Health",
    categorySlug: "heart-health",
    imageUrl:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop",
    imageAlt: "Doctor speaking with a patient",
    author: authors.jordan,
    publishedAt: "2026-09-18T15:00:00.000Z",
    readingTimeMinutes: 6,
  },
  {
    id: "a10",
    slug: "type-2-diabetes-lifestyle-questions",
    title: "Type 2 diabetes: lifestyle questions for your visit",
    excerpt: "Placeholder checklist for appointments — not treatment advice.",
    category: "Diabetes",
    categorySlug: "diabetes",
    imageUrl:
      "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&h=600&fit=crop",
    imageAlt: "Notebook on a clinic desk",
    author: authors.amira,
    publishedAt: "2026-09-15T10:00:00.000Z",
    readingTimeMinutes: 5,
  },
  {
    id: "a11",
    slug: "mindful-breathing-for-stress",
    title: "Mindful breathing exercises for acute stress",
    excerpt: "Placeholder techniques — seek care for persistent symptoms.",
    category: "Mental Health",
    categorySlug: "mental-health",
    imageUrl:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop",
    imageAlt: "Person meditating in a bright room",
    author: authors.marcus,
    publishedAt: "2026-09-12T08:00:00.000Z",
    readingTimeMinutes: 4,
  },
  {
    id: "a12",
    slug: "whole-grains-grocery-guide",
    title: "Whole grains: a simple grocery guide",
    excerpt: "Placeholder nutrition labels and pantry ideas.",
    category: "Nutrition",
    categorySlug: "nutrition",
    imageUrl:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=600&fit=crop",
    imageAlt: "Whole grain foods on a counter",
    author: authors.elena,
    publishedAt: "2026-09-10T11:30:00.000Z",
    readingTimeMinutes: 3,
  },
  {
    id: "a13",
    slug: "postpartum-mood-changes",
    title: "Postpartum mood changes: when to reach out",
    excerpt: "Placeholder awareness article — emergency care for crisis symptoms.",
    category: "Women's Health",
    categorySlug: "womens-health",
    imageUrl:
      "https://images.unsplash.com/photo-1555252333-9f8e92e665df?w=800&h=600&fit=crop",
    imageAlt: "Parent holding a newborn",
    author: authors.amira,
    publishedAt: "2026-09-08T14:00:00.000Z",
    readingTimeMinutes: 6,
  },
  {
    id: "a14",
    slug: "strength-training-after-40",
    title: "Strength training after 40: starting safely",
    excerpt: "Placeholder movement primer — personalize with your clinician.",
    category: "Fitness",
    categorySlug: "fitness",
    imageUrl:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac2558?w=800&h=600&fit=crop",
    imageAlt: "Light dumbbells in a gym",
    author: authors.jordan,
    publishedAt: "2026-09-05T09:00:00.000Z",
    readingTimeMinutes: 5,
  },
].map((article) => ({
  ...article,
  searchText: `${article.title} ${article.excerpt} ${article.category} ${article.author.name}`.toLowerCase(),
}));

export const articleCategories = [
  { slug: "heart-health", label: "Heart Health" },
  { slug: "diabetes", label: "Diabetes" },
  { slug: "nutrition", label: "Nutrition" },
  { slug: "mental-health", label: "Mental Health" },
  { slug: "womens-health", label: "Women's Health" },
  { slug: "fitness", label: "Fitness" },
  { slug: "skin-health", label: "Skin Health" },
  { slug: "general-wellness", label: "General Wellness" },
] as const;

export function getFeaturedArticle(): ArticleSummary {
  return articlesCatalog.find((a) => a.id === "featured-1")!;
}

export function getTrendingArticles(): ArticleSummary[] {
  return articlesCatalog.filter((a) =>
    ["t1", "t2", "t3", "t4"].includes(a.id),
  );
}

export function getLatestArticles(): ArticleSummary[] {
  return [...articlesCatalog]
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )
    .slice(0, 6);
}
