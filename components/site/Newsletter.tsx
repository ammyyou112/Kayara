"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.includes("@")) {
      return;
    }
    setDone(true);
    setEmail("");
    window.setTimeout(() => setDone(false), 3500);
  };

  return (
    <form className="w-full max-w-sm" onSubmit={submit}>
      <label className="text-[10px] uppercase tracking-[0.32em] text-[var(--kayra-ivory)]/60">
        The KAYRA List
      </label>
      <div className="mt-3 flex items-center border-b border-[var(--kayra-ivory)]/25 pb-2">
        <input
          aria-label="Email address"
          className="w-full bg-transparent text-sm tracking-[0.12em] text-[var(--kayra-ivory)] outline-none placeholder:text-[var(--kayra-ivory)]/40"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email address"
          required
          type="email"
          value={email}
        />
        <button
          aria-label="Subscribe"
          className="magnetic-focus shrink-0 pl-3 text-[var(--kayra-ivory)]/80 transition hover:text-[var(--kayra-gold)]"
          type="submit"
        >
          {done ? <Check size={18} strokeWidth={1.5} /> : <ArrowRight size={18} strokeWidth={1.5} />}
        </button>
      </div>
      <p className="mt-3 h-4 text-[10px] uppercase tracking-[0.28em] text-[var(--kayra-gold)]">
        {done ? "Welcome to the house." : ""}
      </p>
    </form>
  );
}
