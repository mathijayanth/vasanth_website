import Link from "next/link";
import { Avatar, Card, CardDescription, CardTitle } from "@/components/ui";
import type { ExpertProfile } from "../author.types";

type ExpertCardProps = {
  expert: ExpertProfile;
};

export function ExpertCard({ expert }: ExpertCardProps) {
  return (
    <Card interactive className="h-full p-5 sm:p-6">
      <div className="flex items-start gap-4">
        <Avatar
          src={expert.avatarUrl}
          alt={expert.name}
          fallback={expert.name}
          size="lg"
        />
        <div className="min-w-0">
          <CardTitle className="text-lg">
            <Link
              href={`/authors/${expert.slug}`}
              className="hover:text-primary"
            >
              {expert.name}
            </Link>
          </CardTitle>
          <p className="text-sm font-medium text-secondary">{expert.title}</p>
          <p className="text-caption">{expert.specialty}</p>
        </div>
      </div>
      <CardDescription className="mt-4 line-clamp-3">{expert.bio}</CardDescription>
      <Link
        href={`/authors/${expert.slug}`}
        className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-primary"
      >
        View profile →
      </Link>
    </Card>
  );
}

type ExpertGridProps = {
  experts: ExpertProfile[];
};

export function ExpertGrid({ experts }: ExpertGridProps) {
  return (
    <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {experts.map((expert) => (
        <li key={expert.id}>
          <ExpertCard expert={expert} />
        </li>
      ))}
    </ul>
  );
}
