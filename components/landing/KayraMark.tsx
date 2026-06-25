import { clsx } from "clsx";

export function KayraMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={clsx("kayra-mark", className)}
      fill="none"
      viewBox="0 0 180 220"
    >
      <path
        d="M125 19C100 31 80 53 63 84C45 118 31 154 18 201"
        pathLength="1"
      />
      <path
        d="M65 91C93 76 126 52 158 22"
        pathLength="1"
      />
      <path
        d="M67 94C93 118 118 151 151 204"
        pathLength="1"
      />
      <path
        d="M52 139C82 128 110 117 139 99"
        pathLength="1"
      />
    </svg>
  );
}
