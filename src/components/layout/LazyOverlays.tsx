"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { CorgiCompanion } from "@/components/mascot/CorgiCompanion";
import type { PaletteProject } from "@/components/ui/CommandPalette";

// The chat and the Ctrl+K palette are only downloaded when someone first uses them.
// Until then these stand-ins listen for the same triggers ("sahayika:open",
// "palette:open", Ctrl/⌘+K, a click on the corgi) and then mount the real thing, open.

const loadAssistant = () => import("@/components/ui/SahayikaAssistant");
const Assistant = dynamic(() => loadAssistant().then((m) => m.SahayikaAssistant), { ssr: false });
const Palette = dynamic(() => import("@/components/ui/CommandPalette").then((m) => m.CommandPalette), { ssr: false });

export function AssistantDock() {
  const [opened, setOpened] = useState<{ question?: string } | null>(null);

  useEffect(() => {
    if (opened) return; // the assistant listens for itself once mounted
    const onOpen = (e: Event) => setOpened({ question: (e as CustomEvent<{ question?: string }>).detail?.question });
    window.addEventListener("sahayika:open", onOpen);
    return () => window.removeEventListener("sahayika:open", onOpen);
  }, [opened]);

  if (opened) return <Assistant initialOpen initialQuestion={opened.question} />;
  return (
    // Start fetching the chat as soon as the visitor reaches for the corgi.
    <div onPointerOver={() => void loadAssistant()} onFocus={() => void loadAssistant()}>
      <CorgiCompanion onOpen={() => setOpened({})} />
    </div>
  );
}

export function PaletteLoader({ projects }: { projects: PaletteProject[] }) {
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    if (opened) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpened(true);
      }
    };
    const onOpen = () => setOpened(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("palette:open", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("palette:open", onOpen);
    };
  }, [opened]);

  return opened ? <Palette projects={projects} initialOpen /> : null;
}
