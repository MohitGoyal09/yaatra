export default function Home() {
  return (
    <div className="relative min-h-[calc(100vh-56px)] overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-muted to-background" />
      <section className="mx-auto max-w-6xl px-4 py-16 lg:py-24">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
              YaatraSarthi
            </h1>
            <p className="mt-4 text-base text-muted-foreground sm:text-lg">
              Earn Punya Points for good deeds, stay informed, and make your
              Simhastha journey meaningful. Report hygiene issues, scan smart
              bins, attend cultural events, and climb the leaderboard.
            </p>
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
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="rounded-lg border p-4">
                <div className="text-sm text-muted-foreground">Actions</div>
                <div className="text-2xl font-semibold">
                  Scan • Report • Attend
                </div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="text-sm text-muted-foreground">Rewards</div>
                <div className="text-2xl font-semibold">Prasad • Passes</div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="text-sm text-muted-foreground">Community</div>
                <div className="text-2xl font-semibold">Collective Impact</div>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Join thousands of pilgrims contributing to a cleaner, kinder, and
              culturally rich Yatra.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
