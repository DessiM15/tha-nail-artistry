"use client";

import { useMemo, useState } from "react";
import type { Program, SiteContent } from "@/content/types";
import { localeHref, type Locale } from "@/i18n/config";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Primitives";
import { fill } from "@/lib/format";

type Key = Program["slug"] | "workshops";

export function ProgramPicker({ locale, quiz, programs }: { locale: Locale; quiz: SiteContent["pages"]["quiz"]; programs: Program[] }) {
  const total = quiz.questions.length;
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(total).fill(null));
  const [done, setDone] = useState(false);

  const result = useMemo<Key>(() => {
    const score: Record<Key, number> = { core: 0, specialty: 0, complete: 0, workshops: 0 };
    quiz.questions.forEach((q, i) => {
      const a = answers[i];
      if (a === null) return;
      for (const [k, v] of Object.entries(q.options[a].scores)) score[k as Key] += v ?? 0;
    });
    return (Object.keys(score) as Key[]).sort((a, b) => score[b] - score[a])[0];
  }, [answers, quiz.questions]);

  const q = quiz.questions[step];
  const canNext = answers[step] !== null;

  if (done) {
    const program = programs.find((p) => p.slug === result);
    const name = program ? program.name : quiz.workshopsName;
    return (
      <div className="on-dark rounded-3xl bg-black p-8 text-white sm:p-10" role="status" aria-live="polite">
        <Eyebrow tone="lavender">{quiz.resultKicker}</Eyebrow>
        <h2 className="t-h2 mt-4">{fill(quiz.resultHeading, { name })}</h2>
        <p className="t-lede mt-4 max-w-2xl text-white/75">{quiz.resultText[result]}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          {program ? (
            <Button href={localeHref(locale, `/courses/${program.slug}`)} variant="lime">{quiz.viewProgram}</Button>
          ) : (
            <Button href={localeHref(locale, "/workshops")} variant="lime">{quiz.viewWorkshops}</Button>
          )}
          <Button href={localeHref(locale, "/book-a-tour")} variant="onDarkOutline" icon={false}>{quiz.bookTour}</Button>
          <button type="button" onClick={() => { setDone(false); setStep(0); setAnswers(Array(total).fill(null)); }} className="rounded-full px-5 py-3 text-[0.9rem] font-semibold text-white/70 underline-offset-4 hover:underline">
            {quiz.restart}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      className="rounded-3xl bg-white p-6 ring-1 ring-black/10 sm:p-10"
      onSubmit={(e) => { e.preventDefault(); if (step < total - 1) setStep(step + 1); else setDone(true); }}
    >
      <p className="t-eyebrow text-black/65">{fill(quiz.progress, { n: step + 1, total })}</p>
      <div className="mt-3 flex gap-1.5" aria-hidden="true">
        {quiz.questions.map((_, i) => <span key={i} className={`h-1 flex-1 rounded-full ${i <= step ? "bg-black" : "bg-black/10"}`} />)}
      </div>
      <fieldset className="mt-8">
        <legend className="t-h3">{q.question}</legend>
        <div className="mt-6 grid gap-3">
          {q.options.map((opt, i) => {
            const id = `q${step}-o${i}`;
            const checked = answers[step] === i;
            return (
              <label key={id} htmlFor={id} className={`flex cursor-pointer items-center gap-4 rounded-2xl border px-5 py-4 transition-colors ${checked ? "border-black bg-black text-white" : "border-black/15 hover:border-black/40"}`}>
                <input
                  id={id}
                  type="radio"
                  name={`question-${step}`}
                  className="size-4 accent-black"
                  checked={checked}
                  onChange={() => setAnswers((a) => { const n = [...a]; n[step] = i; return n; })}
                />
                <span className="text-[0.95rem] font-semibold">{opt.label}</span>
              </label>
            );
          })}
        </div>
      </fieldset>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="rounded-full px-5 py-3 text-[0.9rem] font-semibold ring-1 ring-black/15 disabled:opacity-40">
          {quiz.back}
        </button>
        <button type="submit" disabled={!canNext} className="rounded-full bg-black px-6 py-3 text-[0.9rem] font-semibold text-white disabled:opacity-40">
          {step < total - 1 ? quiz.next : quiz.seeResult}
        </button>
      </div>
    </form>
  );
}
