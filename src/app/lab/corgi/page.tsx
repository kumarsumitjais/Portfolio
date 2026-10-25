import type { Metadata } from "next";
import { CorgiLab } from "./CorgiLab";

export const metadata: Metadata = {
  title: "Corgi lab",
  robots: { index: false, follow: false },
};

export default function CorgiLabPage() {
  return (
    <main className="container mx-auto px-5 md:px-20 py-12 pb-48">
      <h1 className="text-3xl md:text-4xl font-display font-bold mb-3 text-text-primary">Corgi companion lab</h1>
      <p className="text-text-secondary max-w-2xl mb-8">
        Test page for the corgi in the bottom-right corner. Move your cursor towards it, or use the controls below.
        Leave the page alone for 45&nbsp;s and it falls asleep.
      </p>
      <CorgiLab />
    </main>
  );
}
