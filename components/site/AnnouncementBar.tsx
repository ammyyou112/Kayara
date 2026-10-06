// Messages come from Shopify → Content → Metaobjects → Announcement bar.
// Scrolling runs them across the bar (pauses on hover, and stands still for
// visitors who prefer reduced motion); otherwise they sit side by side.
export function AnnouncementBar({
  messages,
  scroll
}: {
  messages: string[];
  scroll: boolean;
}) {
  if (!messages.length) {
    return null;
  }

  const barClass =
    "bg-[var(--kayra-walnut)] py-2 text-[9px] uppercase leading-4 tracking-[0.22em] text-[var(--kayra-ivory)] md:text-[10px] md:tracking-[0.28em]";

  if (!scroll) {
    return (
      <div className={`${barClass} px-4 text-center`}>
        {messages[0]}
        {messages.slice(1).map((message) => (
          <span className="hidden sm:inline" key={message}>
            {" · "}
            {message}
          </span>
        ))}
      </div>
    );
  }

  // Each half of the track must be wider than the screen, so short messages
  // are repeated; the track then slides by exactly one half and loops.
  const length = messages.join("").length + messages.length * 6;
  const repeat = Math.max(1, Math.ceil(240 / length));
  const half = Array.from({ length: repeat }, () => messages).flat();
  const duration = Math.max(20, Math.round(length * repeat * 0.16));

  const group = (hidden: boolean) => (
    <div aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {half.map((message, i) => (
        <span className="flex items-center whitespace-nowrap" key={`${message}-${i}`}>
          <span className="px-6 md:px-10">{message}</span>
          <span aria-hidden="true" className="text-[var(--kayra-gold-light)]">
            ✦
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div className={`${barClass} kayra-marquee-wrap overflow-hidden`}>
      <p className="sr-only">{messages.join(" · ")}</p>
      <div
        aria-hidden="true"
        className="kayra-marquee flex w-max"
        style={{ animationDuration: `${duration}s` }}
      >
        {group(false)}
        {group(true)}
      </div>
    </div>
  );
}
