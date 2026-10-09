import { SectionHeader } from "@/components/layout";
import { ArticleGrid, FeaturedArticle } from "@/features/articles";
import { ExpertGrid } from "@/features/authors";
import { TopicGrid } from "@/features/categories";
import {
  HeroSection,
  experts,
  featuredArticle,
  latestArticles,
  topics,
  trendingArticles,
} from "@/features/home";
import { NewsletterSection } from "@/features/newsletter";

export default function HomePage() {
  return (
    <main className="flex-1">
      <HeroSection />

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <SectionHeader
          overline="Editor's pick"
          title="Featured article"
          description="A deep read from this week's clinical editorial desk."
        />
        <div className="mt-8">
          <FeaturedArticle article={featuredArticle} />
        </div>
      </section>

      <section className="border-y border-border bg-card/50">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <SectionHeader
            overline="Trending"
            title="What readers are exploring"
            href="/articles"
            linkLabel="All articles"
          />
          <div className="mt-8">
            <ArticleGrid articles={trendingArticles} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <SectionHeader
          overline="Browse"
          title="Explore topics"
          description="Start with a specialty area — filters will connect to the article index later."
          href="/topics"
          linkLabel="All topics"
        />
        <div className="mt-8">
          <TopicGrid topics={topics} />
        </div>
      </section>

      <section className="border-t border-border bg-background">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <SectionHeader
            overline="Fresh"
            title="Latest articles"
            href="/articles"
            linkLabel="View all"
          />
          <div className="mt-8">
            <ArticleGrid articles={latestArticles} />
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card/40">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <SectionHeader
            overline="Experts"
            title="Written and reviewed by clinicians"
            description="Placeholder profiles — real credentials will come from the author database."
            href="/authors"
            linkLabel="Meet experts"
          />
          <div className="mt-8">
            <ExpertGrid experts={experts} />
          </div>
        </div>
      </section>

      <NewsletterSection />
    </main>
  );
}
