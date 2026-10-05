export function AnnouncementBar({
  primary,
  secondary
}: {
  primary: string;
  secondary?: string;
}) {
  if (!primary && !secondary) {
    return null;
  }

  return (
    <div className="bg-[var(--kayra-walnut)] px-4 py-2 text-center text-[9px] uppercase leading-4 tracking-[0.22em] text-[var(--kayra-ivory)] md:text-[10px] md:tracking-[0.28em]">
      {primary}
      {secondary ? (
        <span className="hidden sm:inline">
          {primary ? " · " : ""}
          {secondary}
        </span>
      ) : null}
    </div>
  );
}
