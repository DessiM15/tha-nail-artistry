"use client";

import { useState, type FormEvent } from "react";
import type { SiteContent } from "@/content/types";
import type { Locale } from "@/i18n/config";
import { localeHref } from "@/i18n/config";
import { business } from "@/config/site";
import { submitWeb3Form, todayLabel } from "@/lib/forms";
import { Honeypot, Label, Select, SubmitButton, TextInput } from "./Field";
import { TextLink } from "@/components/sections/Blocks";

type Copy = SiteContent["pages"]["waitlist"]["form"];
type Status = "idle" | "sending" | "sent" | "error";

export function WaitlistForm({ locale, copy }: { locale: Locale; copy: Copy }) {
  const [status, setStatus] = useState<Status>("idle");
  const [heard, setHeard] = useState(copy.heardOptions[0].value);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    const form = e.currentTarget;
    const fd = new FormData(form);
    if (fd.get("botcheck")) return;
    const get = (k: string) => String(fd.get(k) ?? "").trim();
    const heardValue = get("heard");
    setStatus("sending");
    try {
      await submitWeb3Form(`Waitlist: ${get("name")}`, {
        "Full name": get("name"),
        Phone: get("phone"),
        Email: get("email"),
        "Program of interest": get("program"),
        "How they heard about us": heardValue === "Other" && get("heardOther") ? `Other: ${get("heardOther")}` : heardValue,
        Signature: get("signature"),
        "Signed on": todayLabel(),
        Language: locale === "es" ? "Spanish" : "English",
      });
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-3xl bg-black p-8 text-white on-dark sm:p-10" role="status" aria-live="polite">
        <h2 className="t-h3">{copy.successHeading}</h2>
        <p className="t-body mt-4 text-white/80">{copy.successText}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-3xl bg-white p-6 ring-1 ring-black/10 sm:p-10" noValidate={false}>
      <h2 className="t-h3">{copy.heading}</h2>
      <Honeypot />
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="wl-name">{copy.fullName}</Label>
          <TextInput id="wl-name" name="name" type="text" required autoComplete="name" minLength={2} />
        </div>
        <div>
          <Label htmlFor="wl-phone">{copy.phone}</Label>
          <TextInput id="wl-phone" name="phone" type="tel" required autoComplete="tel" inputMode="tel" pattern="[0-9()+\-.\s]{10,}" />
        </div>
        <div>
          <Label htmlFor="wl-email">{copy.email}</Label>
          <TextInput id="wl-email" name="email" type="email" required autoComplete="email" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="wl-program">{copy.program}</Label>
          <Select id="wl-program" name="program" required defaultValue="">
            <option value="" disabled>{copy.program}</option>
            {copy.programs.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
          </Select>
        </div>
        <div className={heard === "Other" ? "" : "sm:col-span-2"}>
          <Label htmlFor="wl-heard">{copy.heard}</Label>
          <Select id="wl-heard" name="heard" required value={heard} onChange={(e) => setHeard(e.target.value)}>
            {copy.heardOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </Select>
        </div>
        {heard === "Other" && (
          <div>
            <Label htmlFor="wl-heard-other">{copy.heardOther}</Label>
            <TextInput id="wl-heard-other" name="heardOther" type="text" />
          </div>
        )}
        <div className="sm:col-span-2">
          <Label htmlFor="wl-signature" hint={copy.signatureHelp}>{copy.signature}</Label>
          <TextInput id="wl-signature" name="signature" type="text" required autoComplete="off" minLength={2} className="t-italic text-[1.35rem]" />
        </div>
      </div>
      <p className="mt-6 text-[0.8rem] text-black/60">
        {copy.privacy} <TextLink href={localeHref(locale, "/privacy-policy")}>{copy.privacyLink}</TextLink>
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <SubmitButton busy={status === "sending"}>{status === "sending" ? copy.sending : copy.submit}</SubmitButton>
        {status === "error" && (
          <p role="alert" className="text-[0.9rem] text-black/80">
            {copy.errorText} <TextLink href={`mailto:${business.email}?subject=Waitlist`}>{copy.errorCta}</TextLink>
          </p>
        )}
      </div>
    </form>
  );
}
