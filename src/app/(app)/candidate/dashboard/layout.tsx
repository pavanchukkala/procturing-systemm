// Force the entire /candidate/dashboard segment to be dynamic
export const dynamic = "force-dynamic";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

