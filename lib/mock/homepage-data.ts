/**
 * PLACEHOLDER homepage content — replace with API/database queries later.
 * Article listings are sourced from articles-catalog.ts.
 */

import type { ExpertProfile, NavLink, TopicSummary } from "@/types";
import {
  getFeaturedArticle,
  getLatestArticles,
  getTrendingArticles,
} from "@/lib/mock/articles-catalog";

export const primaryNavLinks: NavLink[] = [
  { href: "/articles", label: "Articles" },
  { href: "/topics", label: "Topics" },
  { href: "/authors", label: "Experts" },
  { href: "/research", label: "Research" },
  { href: "/about", label: "About" },
];

export const footerNav = {
  about: [
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ],
  topics: [
    { href: "/topics/heart-health", label: "Heart Health" },
    { href: "/topics/diabetes", label: "Diabetes" },
    { href: "/topics/nutrition", label: "Nutrition" },
    { href: "/topics/mental-health", label: "Mental Health" },
  ],
  articles: [
    { href: "/articles", label: "All articles" },
    { href: "/research", label: "Research" },
  ],
  legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms" },
    { href: "/disclaimer", label: "Medical Disclaimer" },
  ],
} as const;

export const socialLinks = [
  { href: "https://linkedin.com", label: "LinkedIn" },
  { href: "https://x.com", label: "X (Twitter)" },
  { href: "https://instagram.com", label: "Instagram" },
] as const;

export const featuredArticle = getFeaturedArticle();
export const trendingArticles = getTrendingArticles();
export const latestArticles = getLatestArticles();

export const topics: TopicSummary[] = [
  {
    slug: "heart-health",
    name: "Heart Health",
    description: "Blood pressure, cholesterol, and cardiovascular wellness.",
  },
  {
    slug: "diabetes",
    name: "Diabetes",
    description: "Glucose management, A1C, and daily routines.",
  },
  {
    slug: "nutrition",
    name: "Nutrition",
    description: "Balanced eating patterns and practical meal ideas.",
  },
  {
    slug: "mental-health",
    name: "Mental Health",
    description: "Stress, sleep, and emotional wellbeing.",
  },
  {
    slug: "womens-health",
    name: "Women's Health",
    description: "Screenings, hormones, and life-stage care.",
  },
  {
    slug: "fitness",
    name: "Fitness",
    description: "Movement, strength, and recovery basics.",
  },
  {
    slug: "skin-health",
    name: "Skin Health",
    description: "Sun safety, routines, and common concerns.",
  },
  {
    slug: "general-wellness",
    name: "General Wellness",
    description: "Everyday habits for long-term health.",
  },
];

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

export const experts: ExpertProfile[] = [
  {
    id: "e1",
    ...authors.jordan,
    bio: "Placeholder bio — cardiologist focused on patient-friendly evidence summaries.",
  },
  {
    id: "e2",
    ...authors.amira,
    bio: "Placeholder bio — endocrinologist translating diabetes research for readers.",
  },
  {
    id: "e3",
    ...authors.elena,
    bio: "Placeholder bio — dietitian covering nutrition without fad diets.",
  },
  {
    id: "e4",
    ...authors.marcus,
    bio: "Placeholder bio — psychiatrist writing about mental health with clarity.",
  },
];

export const heroVisual = {
  imageUrl:
    "https://images.unsplash.com/photo-1631217868264-e5b1bb5e99ab?w=1200&h=1400&fit=crop",
  imageAlt: "Modern healthcare consultation in a bright clinical space",
};
