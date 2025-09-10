"use client";
import { motion } from "framer-motion";

const items = [
  {
    name: "Anita",
    quote: "Reporting hygiene issues felt impactful. I even earned Prasad!",
  },
  {
    name: "Rahul",
    quote: "Loved the leaderboard and the positive vibes across the ghats.",
  },
  {
    name: "Meera",
    quote: "Sarthi guided me to nearby cultural events. Super helpful!",
  },
];

export function Testimonials() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16">
      <div className="grid gap-4 sm:grid-cols-3">
        {items.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ rotate: i === 1 ? 1 : -1, y: 16, opacity: 0 }}
            whileInView={{ rotate: 0, y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="rounded-xl border bg-card p-5 shadow-sm"
          >
            <p className="text-sm">“{t.quote}”</p>
            <p className="mt-3 text-xs text-muted-foreground">— {t.name}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
