"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import type { SiteContent } from "@/content/types";
import { localeHref, type Locale } from "@/i18n/config";
import { business } from "@/config/site";
import { fill } from "@/lib/format";
import { submitWeb3Form, todayLabel } from "@/lib/forms";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Primitives";
import { TextLink } from "@/components/sections/Blocks";
import { Honeypot, Label, SubmitButton, TextInput } from "./Field";

type Copy = SiteContent["pages"]["assessment"];
type Stage = "intro" | "questions" | "contact" | "done";
type Status = "idle" | "sending" | "error";

/** Internal rubric from the admissions spec. Never shown to the applicant. */
const MAX_SCORE = 16;
function category(score: number): string {
  if (score >= 14) return "Enrollment Ready (Green)";
  if (score >= 11) return "Ready With Guidance (Yellow)";
  if (score >= 8) return "Additional Preparation Recommended (Orange)";
  return "Admissions Guidance Recommended (Red)";
}

export function ReadinessAssessment({ locale, copy }: { locale: Locale; copy: Copy }) {
  const total = copy.questions.length;
  const [stage, setStage] = useState<Stage>("intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(total).fill(null));
  const [status, setStatus] = useState<Status>("idle");
  const top = useRef<HTMLDivElement>(null);
  const advanceTimer = useRef<number | null>(null);

  // Keep the active panel in view as the applicant moves through the steps.
  useEffect(() => {
    if (stage === "intro" || !top.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const y = top.current.getBoundingClientRect().top + window.scrollY - 96;
    if (Math.abs(window.scrollY - y) > 24) window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
  }, [stage, step]);

  useEffect(() => () => { if (advanceTimer.current) window.clearTimeout(advanceTimer.current); }, []);

  function choose(i: number) {
    setAnswers((a) => { const n = [...a]; n[step] = i; return n; });
    if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
    advanceTimer.current = window.setTimeout(() => {
      if (step < total - 1) setStep(step + 1);
      else setStage("contact");
    }, 320);
  }

  function back() {
    if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
    if (stage === "contact") { setStage("questions"); return; }
    if (step > 0) setStep(step - 1);
    else setStage("intro");
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    const fd = new FormData(e.currentTarget);
    if (fd.get("botcheck")) return;
    const get = (k: string) => String(fd.get(k) ?? "").trim();
    const name = get("name");
    const score = copy.questions.reduce((sum, q, i) => sum + (q.options[answers[i] ?? -1]?.points ?? 0), 0);
    const cat = category(score);
    const responses = Object.fromEntries(
      copy.questions.map((q, i) => {
        const o = q.options[answers[i] ?? -1];
        return [`Q${i + 1} ${q.topic}`, o ? `${o.code}. ${o.label}` : "(no answer)"];
      }),
    );
    setStatus("sending");
    try {
      await submitWeb3Form(`Readiness Assessment: ${name} (${cat})`, {
        "Full name": name,
        Phone: get("phone"),
        Email: get("email"),
        "Completed on": todayLabel(),
        Language: locale === "es" ? "Spanish" : "English",
        "Readiness score (Q1 to Q4)": `${score} / ${MAX_SCORE}`,
        "Readiness category": cat,
        ...responses,
      });
      setStage("done");
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }

  const stepsTotal = total + 1;
  const current = stage === "contact" ? stepsTotal : step + 1;
  const pct = stage === "intro" ? 0 : Math.round((current / stepsTotal) * 100);

  return (
    <div ref={top} className="scroll-mt-28">
      {stage === "intro" && (
        <div className="assess-panel rounded-3xl bg-white p-6 ring-1 ring-black/10 sm:p-10">
          <p className="t-body text-black/80">{copy.intro}</p>
          <ul className="mt-6 grid gap-3">
            {copy.bullets.map((b) => (
              <li key={b} className="flex gap-3 text-[0.95rem] text-black/80">
                <span aria-hidden="true" className="mt-[0.55em] size-1.5 shrink-0 rounded-full bg-lime ring-4 ring-lime/30" />
                {b}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button type="button" onClick={() => setStage("questions")} className="inline-flex items-center gap-2 rounded-full bg-lavender px-6 py-3.5 text-[0.95rem] font-semibold text-black transition-[background-color,transform] duration-300 ease-out-expo hover:bg-lime active:scale-[0.98]">
              {copy.start}
            </button>
            <span className="text-[0.85rem] font-semibold text-black/60">{copy.time}</span>
          </div>
        </div>
      )}

      {stage === "done" && (
        <div className="assess-panel on-dark rounded-3xl bg-black p-8 text-white sm:p-12" role="status" aria-live="polite">
          <Eyebrow tone="lavender">{copy.done.kicker}</Eyebrow>
          <h2 className="t-h2 mt-4">{copy.done.heading}</h2>
          <div className="mt-6 grid max-w-2xl gap-4">
            {copy.done.text.slice(0, 2).map((t) => <p key={t} className="t-body text-white/80">{t}</p>)}
            <p className="t-lede mt-2 font-semibold text-lime">{copy.done.nextStep}</p>
            <p className="t-body text-white/80">{copy.done.text[2]}</p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={localeHref(locale, "/book-a-tour")} variant="lime">{copy.done.cta}</Button>
            <Button href={localeHref(locale, "/")} variant="onDarkOutline" icon={false}>{copy.done.home}</Button>
          </div>
        </div>
      )}

      {(stage === "questions" || stage === "contact") && (
        <div className="rounded-3xl bg-white p-6 ring-1 ring-black/10 sm:p-10">
          <div className="flex items-center justify-between gap-4">
            <p className="t-eyebrow text-black/65">{stage === "contact" ? copy.contactStep : fill(copy.progress, { n: step + 1, total })}</p>
            <p className="text-[0.8rem] font-semibold tabular-nums text-black/50" aria-hidden="true">{pct}%</p>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-black/10" role="progressbar" aria-valuemin={0} aria-valuemax={stepsTotal} aria-valuenow={current} aria-label={fill(copy.progress, { n: current, total: stepsTotal })}>
            <div className="h-full rounded-full bg-black transition-[width] duration-500 ease-out-expo" style={{ width: `${pct}%` }} />
          </div>

          {stage === "questions" ? (
            <div key={step} className="assess-panel mt-8">
              <h2 className="t-h3">{copy.questions[step].question}</h2>
              <div className="mt-6 grid gap-3">
                {copy.questions[step].options.map((opt, i) => {
                  const selected = answers[step] === i;
                  return (
                    <button
                      key={opt.code}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => choose(i)}
                      className={`flex w-full items-start gap-4 rounded-2xl border px-5 py-4 text-left transition-colors duration-200 ${selected ? "border-black bg-black text-white" : "border-black/15 bg-white hover:border-black/50"}`}
                    >
                      <span aria-hidden="true" className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border ${selected ? "border-lime bg-lime" : "border-black/30"}`}>
                        {selected && <span className="size-2 rounded-full bg-black" />}
                      </span>
                      <span className="text-[0.95rem] font-semibold leading-snug">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-8 flex items-center justify-between gap-4">
                <button type="button" onClick={back} className="rounded-full px-4 py-2 text-[0.9rem] font-semibold text-black/70 underline-offset-4 hover:underline">{copy.back}</button>
                {answers[step] !== null && (
                  <button type="button" onClick={() => (step < total - 1 ? setStep(step + 1) : setStage("contact"))} className="rounded-full px-4 py-2 text-[0.9rem] font-semibold text-black underline-offset-4 hover:underline">
                    {copy.next}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <form key="contact" onSubmit={onSubmit} className="assess-panel mt-8">
              <h2 className="t-h3">{copy.contactHeading}</h2>
              <p className="t-body mt-3 text-black/75">{copy.contactText}</p>
              <Honeypot />
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Label htmlFor="ra-name">{copy.form.fullName}</Label>
                  <TextInput id="ra-name" name="name" type="text" required autoComplete="name" minLength={2} />
                </div>
                <div>
                  <Label htmlFor="ra-phone">{copy.form.phone}</Label>
                  <TextInput id="ra-phone" name="phone" type="tel" required autoComplete="tel" inputMode="tel" pattern="[0-9()+\-.\s]{10,}" />
                </div>
                <div>
                  <Label htmlFor="ra-email">{copy.form.email}</Label>
                  <TextInput id="ra-email" name="email" type="email" required autoComplete="email" />
                </div>
              </div>
              <p className="mt-6 text-[0.8rem] text-black/60">
                {copy.form.privacy} <TextLink href={localeHref(locale, "/privacy-policy")}>{copy.form.privacyLink}</TextLink>
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <button type="button" onClick={back} className="rounded-full px-4 py-2 text-[0.9rem] font-semibold text-black/70 underline-offset-4 hover:underline">{copy.back}</button>
                <SubmitButton busy={status === "sending"}>{status === "sending" ? copy.form.sending : copy.form.submit}</SubmitButton>
              </div>
              {status === "error" && (
                <p role="alert" className="mt-4 text-[0.9rem] text-black/80">
                  {copy.form.errorText} <TextLink href={`mailto:${business.email}?subject=Readiness%20Assessment`}>{copy.form.errorCta}</TextLink>
                </p>
              )}
            </form>
          )}
        </div>
      )}
    </div>
  );
}
