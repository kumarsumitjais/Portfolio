import { PageTransition } from "@/components/layout/PageTransition";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <PageTransition>
      <main className="flex-grow pt-24">{children}</main>
    </PageTransition>
  );
}
