"use client";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-16 lg:py-24">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.5, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute right-[-10%] top-[-10%] h-72 w-72 rounded-full bg-gradient-to-br from-primary/40 to-fuchsia-500/30 blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.5, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
          className="absolute left-[-10%] bottom-[-10%] h-72 w-72 rounded-full bg-gradient-to-tr from-emerald-400/30 to-cyan-500/30 blur-3xl"
        />
      </div>
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl font-bold tracking-tight sm:text-5xl"
            >
              YaatraSarthi
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-4 text-muted-foreground"
            >
              Earn Punya Points for good deeds, get guidance from Sarthi, and
              see the community impact of your yatra.
            </motion.p>
            <div className="mt-6 flex gap-3">
              <a
                href="/chat"
                className="rounded-md border px-4 py-2 font-medium hover:bg-accent"
              >
                Ask Sarthi
              </a>
              <a
                href="/dashboard"
                className="rounded-md border px-4 py-2 font-medium hover:bg-accent"
              >
                View Dashboard
              </a>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="rounded-xl border bg-card/60 p-6 shadow-sm backdrop-blur"
          >
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="rounded-lg border p-4">
                <div className="text-sm text-muted-foreground">Actions</div>
                <div className="text-lg font-semibold">
                  Scan • Report • Attend
                </div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="text-sm text-muted-foreground">Rewards</div>
                <div className="text-lg font-semibold">Prasad • Passes</div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="text-sm text-muted-foreground">Community</div>
                <div className="text-lg font-semibold">Collective Impact</div>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Join thousands of pilgrims contributing to a cleaner, kinder,
              culturally rich yatra.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
