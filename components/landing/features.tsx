import { IconLeaf, IconActivity, IconUsers } from "@tabler/icons-react";

const cards = [
  {
    icon: <IconActivity className="h-5 w-5" />,
    title: "Actions",
    desc: "Scan bins, refill water, report hygiene, attend events",
  },
  {
    icon: <IconLeaf className="h-5 w-5" />,
    title: "Rewards",
    desc: "Earn Prasad, priority darshan, and festival passes",
  },
  {
    icon: <IconUsers className="h-5 w-5" />,
    title: "Community",
    desc: "See collective impact and climb the leaderboard",
  },
];

export function Features() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div
            key={c.title}
            className="rounded-xl border bg-card/70 p-5 shadow-sm transition hover:translate-y-[-2px]"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {c.icon}
              <span>{c.title}</span>
            </div>
            <p className="mt-2 text-sm">{c.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
