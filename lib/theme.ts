import type { World } from "./shop/types";

export type WorldTheme = {
  page: string;
  eyebrow: string;
  muted: string;
  line: string;
  card: string;
  cardMuted: string;
  solidBtn: string;
  ghostBtn: string;
  chip: string;
  chipSelected: string;
};

// One unified warm/light KAYRA theme across the whole site. Both worlds share
// it so clothing and jewelry read as a single house. Full literal class
// strings so Tailwind's scanner detects every utility.
const kayra: WorldTheme = {
  page: "bg-[var(--kayra-cream)] text-[var(--kayra-walnut)]",
  eyebrow: "text-[var(--kayra-clay)]",
  muted: "text-[var(--kayra-walnut)]/65",
  line: "border-[var(--kayra-walnut)]/15",
  card: "bg-[var(--kayra-ivory)]/45",
  cardMuted: "text-[var(--kayra-walnut)]/55",
  solidBtn:
    "bg-[var(--kayra-walnut)] text-[var(--kayra-ivory)] hover:bg-[var(--kayra-clay)]",
  ghostBtn:
    "border-[var(--kayra-walnut)]/30 text-[var(--kayra-walnut)] hover:bg-[var(--kayra-walnut)] hover:text-[var(--kayra-ivory)]",
  chip: "border-[var(--kayra-walnut)]/25 text-[var(--kayra-walnut)] hover:border-[var(--kayra-walnut)]",
  chipSelected:
    "border-[var(--kayra-walnut)] bg-[var(--kayra-walnut)] text-[var(--kayra-ivory)]"
};

export const themes: Record<World, WorldTheme> = {
  clothing: kayra,
  jewelry: kayra
};
