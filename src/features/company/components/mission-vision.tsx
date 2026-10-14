import { Reveal } from "@/components/ui/reveal";
import { coreValues, mission, vision } from "../data/company-content";

const panels = [
  { label: "Our Mission", body: mission },
  { label: "Our Vision", body: vision },
] as const;

export function MissionVision() {
  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {panels.map((panel, index) => (
        <Reveal key={panel.label} index={index} className="text-center lg:text-left">
          <p className="text-overline">{panel.label}</p>
          <p className="mt-3 text-lg font-semibold leading-relaxed text-primary">{panel.body}</p>
        </Reveal>
      ))}
      <Reveal index={2} className="text-center lg:text-left">
        <p className="text-overline">Core Values</p>
        <p className="mt-3 text-lg font-semibold text-primary">What Guides Every Project</p>
        <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm font-medium text-muted">
          {coreValues.map((value) => (
            <li key={value.title} className="flex items-center gap-2">
              <span aria-hidden className="size-1.5 rounded-full bg-accent" />
              {value.title}
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  );
}
