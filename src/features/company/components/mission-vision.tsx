import { Reveal } from "@/components/ui/reveal";
import { mission, vision } from "../data/company-content";

const panels = [
  { label: "Our Mission", body: mission },
  { label: "Our Vision", body: vision },
] as const;

export function MissionVision() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {panels.map((panel, index) => (
        <Reveal
          key={panel.label}
          index={index}
          variant="scale"
          className="group relative overflow-hidden rounded-[2rem] bg-foreground p-8 text-white shadow-elevated sm:p-10"
        >
          <div
            aria-hidden
            className="absolute -right-20 -top-20 size-64 rounded-full bg-gradient-to-br from-primary/50 to-secondary/40 blur-3xl transition-transform duration-700 group-hover:scale-125"
          />
          <p className="relative text-xs font-semibold uppercase tracking-[0.18em] text-secondary">{panel.label}</p>
          <p className="relative mt-4 text-xl font-semibold leading-relaxed sm:text-2xl">{panel.body}</p>
        </Reveal>
      ))}
    </div>
  );
}
