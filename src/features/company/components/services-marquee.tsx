import { ServiceIcon, serviceSummaries } from "@/features/services";

export function ServicesMarquee() {
  const items = [...serviceSummaries, ...serviceSummaries];

  return (
    <section aria-label="Our services" className="border-y border-border bg-card/60 py-6">
      <div className="mask-fade-edges group overflow-hidden">
        <ul className="flex w-max animate-marquee gap-4 group-hover:[animation-play-state:paused]">
          {items.map((service, index) => (
            <li
              key={`${service.slug}-${index}`}
              aria-hidden={index >= serviceSummaries.length}
              className="flex shrink-0 items-center gap-3 rounded-full border border-border bg-card px-5 py-2.5 shadow-soft"
            >
              <ServiceIcon name={service.icon} className="size-5 text-primary" />
              <span className="whitespace-nowrap text-sm font-semibold text-foreground">{service.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
