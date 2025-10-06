// Route configuration to disable static generation
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default function MapLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
