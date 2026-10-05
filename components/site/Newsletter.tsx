"use client";

import { useState, useTransition } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { subscribeAction } from "@/app/actions/newsletter";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    startTransition(async () => {
      const result = await subscribeAction(email);
      if (result.ok) {
        setEmail("");
        setStatus({ ok: true, message: "Welcome to the house." });
      } else {
        setStatus({ ok: false, message: result.message });
      }
    });
  };

  return (
    <form className="w-full max-w-sm" onSubmit={submit}>
      <label
        className="text-[10px] uppercase tracking-[0.32em] text-[var(--kayra-ivory)]/60"
        htmlFor="newsletter-email"
      >
        The KAYRA List
      </label>
      <div className="mt-3 flex items-center border-b border-[var(--kayra-ivory)]/25 pb-2 focus-within:border-[var(--kayra-ivory)]/70">
        <input
          autoComplete="email"
          className="w-full min-w-0 bg-transparent text-sm tracking-[0.08em] text-[var(--kayra-ivory)] outline-none placeholder:text-[var(--kayra-ivory)]/40"
          id="newsletter-email"
          onChange={(event) => {
            setEmail(event.target.value);
            setStatus(null);
          }}
          placeholder="Email address"
          required
          type="email"
          value={email}
        />
        <button
          aria-label="Subscribe"
          className="magnetic-focus grid h-9 w-9 shrink-0 place-items-center text-[var(--kayra-ivory)]/80 transition hover:text-[var(--kayra-gold-light)] disabled:opacity-50"
          disabled={pending}
          type="submit"
        >
          {pending ? (
            <Loader2 className="animate-spin" size={18} strokeWidth={1.5} />
          ) : status?.ok ? (
            <Check size={18} strokeWidth={1.5} />
          ) : (
            <ArrowRight size={18} strokeWidth={1.5} />
          )}
        </button>
      </div>
      <p
        aria-live="polite"
        className={`mt-3 min-h-4 text-[10px] uppercase tracking-[0.24em] ${
          status?.ok ? "text-[var(--kayra-gold-light)]" : "text-[#f0a58a]"
        }`}
      >
        {status?.message ?? ""}
      </p>
    </form>
  );
}
