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

// Full literal class strings so Tailwind's scanner detects every utility.
export const themes: Record<World, WorldTheme> = {
  clothing: {
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
  },
  jewelry: {
    page: "bg-[var(--jewel-black)] text-[var(--jewel-pearl)]",
    eyebrow: "text-[var(--jewel-champagne)]",
    muted: "text-[var(--jewel-pearl)]/60",
    line: "border-[var(--jewel-champagne)]/20",
    card: "bg-[var(--jewel-charcoal)]/70",
    cardMuted: "text-[var(--jewel-pearl)]/50",
    solidBtn:
      "bg-[var(--jewel-champagne)] text-[var(--jewel-black)] hover:bg-[var(--jewel-pearl)]",
    ghostBtn:
      "border-[var(--jewel-champagne)]/35 text-[var(--jewel-pearl)] hover:bg-[var(--jewel-champagne)] hover:text-[var(--jewel-black)]",
    chip: "border-[var(--jewel-champagne)]/30 text-[var(--jewel-pearl)] hover:border-[var(--jewel-champagne)]",
    chipSelected:
      "border-[var(--jewel-champagne)] bg-[var(--jewel-champagne)] text-[var(--jewel-black)]"
  }
};
