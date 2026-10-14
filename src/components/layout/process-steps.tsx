import { ApproachIcon } from "@/features/company/components/approach-icons";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

type Step = { title: string; description?: string };

const lgColumns: Record<number, string> = {
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
  6: "lg:grid-cols-6",
  7: "lg:grid-cols-7",
};

export function ProcessSteps({ steps, className }: { steps: readonly Step[]; className?: string }) {
  return (
    <ol
      className={cn(
        "relative grid gap-6 sm:grid-cols-2 lg:gap-3",
        lgColumns[steps.length] ?? "lg:grid-cols-4",
        className,
      )}
    >
      <span
        aria-hidden
        className="absolute left-[6%] right-[6%] top-7 hidden h-px bg-accent/70 lg:block"
      />
      {steps.map((step, index) => (
        <Reveal as="li" key={step.title} index={index} className="relative flex gap-4 lg:flex-col lg:items-center lg:text-center">
          <span className="relative inline-flex size-14 shrink-0 items-center justify-center rounded-full bg-card text-primary shadow-soft ring-1 ring-accent/50 transition-all duration-500 hover:-translate-y-1 hover:bg-primary hover:text-white hover:ring-primary">
            <ApproachIcon name={step.title} />
          </span>
          <div>
            <h3 className="font-bold text-primary lg:mt-4">{step.title}</h3>
            {step.description ? (
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{step.description}</p>
            ) : null}
          </div>
        </Reveal>
      ))}
    </ol>
  );
}
