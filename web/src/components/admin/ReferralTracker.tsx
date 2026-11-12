"use client";

import { useActionState, useEffect, useRef, useState, type ReactNode } from "react";
import { checkWix, deleteEducator, deleteReferral, markPaid, saveEducator, saveReferral, type ActionResult } from "@/app/admin/actions";
import { Label, Select, SubmitButton, TextInput } from "@/components/forms/Field";
import type { Educator, Referral, Stage } from "@/lib/admin/referrals";
import { useSubmit } from "./useSubmit";

interface Props {
  educators: Educator[];
  referrals: Referral[];
  today: string;
  nextClassStart: string;
  wixConnected: boolean;
  waitDays: number;
  tierMonths: number;
}

type Filter = "all" | "due" | "waiting" | "paid";
type Editing = { kind: "referral"; referral: Referral | null } | { kind: "educator"; educator: Educator | null; first?: boolean } | null;

const idle: ActionResult = { ok: true, message: "" };

function formatDate(iso: string | null): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(Date.UTC(y, m - 1, d)));
}

function formatMoney(cents: number | null): string {
  if (cents === null) return "";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: cents % 100 === 0 ? 0 : 2 }).format(cents / 100);
}

/** What the educator is owed for this referral: the amount typed in, or the tier amount. */
function payoutOf(r: Referral): number | null {
  return r.payoutCents ?? r.tierCents;
}

function stageLabel(r: Referral): string {
  switch (r.stage) {
    case "applied": return "Applied";
    case "needs-start": return "Enrolled, needs a class start date";
    case "waiting": return `Payout on ${formatDate(r.eligibleOn)}`;
    case "due": return "Payout due";
    case "paid": return `Paid ${formatDate(r.paidOn)}`;
    case "withdrawn": return "Withdrawn";
  }
}

const stageStyle: Record<Stage, string> = {
  applied: "bg-black/5 text-black",
  "needs-start": "bg-white text-black ring-1 ring-black/70",
  waiting: "bg-lavender/30 text-black",
  due: "bg-lime text-black",
  paid: "bg-black text-white",
  withdrawn: "bg-black/5 text-black/55",
};

const smallButton = "rounded-full px-4 py-2 text-[0.85rem] font-semibold ring-1 ring-black/70 transition-colors hover:bg-black hover:text-white disabled:opacity-60";

export function ReferralTracker({ educators, referrals, today, nextClassStart, wixConnected, waitDays, tierMonths }: Props) {
  const [filter, setFilter] = useState<Filter>("all");
  const [editing, setEditing] = useState<Editing>(null);
  const [wix, runWixCheck, checkingWix] = useActionState(checkWix, idle);

  const due = referrals.filter((r) => r.stage === "due");
  const dueTotal = due.reduce((sum, r) => sum + (payoutOf(r) ?? 0), 0);
  const counts: Record<Filter, number> = {
    all: referrals.length,
    due: due.length,
    waiting: referrals.filter((r) => r.stage === "waiting").length,
    paid: referrals.filter((r) => r.stage === "paid").length,
  };
  const shown = filter === "all" ? referrals : referrals.filter((r) => r.stage === filter);
  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "due", label: "Payout due" },
    { key: "waiting", label: `Waiting on ${waitDays} days` },
    { key: "paid", label: "Paid" },
  ];

  return (
    <div className="space-y-12">
      <section aria-labelledby="referrals-heading">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 id="referrals-heading" className="t-h2">Referrals</h1>
            <p className="t-body mt-2 max-w-2xl text-black/70">
              A referral qualifies once the student has started class and stayed enrolled for {waitDays} days. The payout follows the tier the educator has reached, and a higher tier only applies to later referrals.
              {due.length > 0 && (
                <strong className="font-semibold text-black">
                  {" "}{due.length} {due.length === 1 ? "payout is" : "payouts are"} due now{dueTotal > 0 ? `, ${formatMoney(dueTotal)} in total` : ""}.
                </strong>
              )}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {wixConnected && (
              <form action={runWixCheck}>
                <button type="submit" disabled={checkingWix} className={smallButton}>{checkingWix ? "Checking Wix" : "Check Wix for new referrals"}</button>
              </form>
            )}
            <button
              type="button"
              onClick={() => setEditing(educators.length === 0 ? { kind: "educator", educator: null, first: true } : { kind: "referral", referral: null })}
              className="rounded-full bg-lavender px-4 py-2 text-[0.85rem] font-semibold text-black transition-colors hover:bg-lime"
            >
              Add referral
            </button>
          </div>
        </div>

        {wix.message && <p role="status" className="mt-4 rounded-2xl bg-white px-4 py-3 text-[0.9rem] ring-1 ring-black/10">{wix.message}</p>}
        {!wixConnected && (
          <p className="mt-4 rounded-2xl bg-white px-4 py-3 text-[0.9rem] text-black/70 ring-1 ring-black/10">
            Wix is not connected yet, so referrals are added by hand for now.
          </p>
        )}

        <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Show referrals">
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              aria-pressed={filter === f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-full px-4 py-2 text-[0.85rem] font-semibold transition-colors ${filter === f.key ? "bg-black text-white" : "bg-white text-black ring-1 ring-black/15 hover:ring-black/70"}`}
            >
              {f.label} ({counts[f.key]})
            </button>
          ))}
        </div>

        {shown.length === 0 ? (
          <p className="t-body mt-6 text-black/60">
            {referrals.length === 0
              ? educators.length === 0 ? "Start by adding your educators and their promo codes below." : "No referrals yet."
              : "Nothing here right now."}
          </p>
        ) : (
          <ul className="mt-6 space-y-3">
            {shown.map((r) => (
              <ReferralRow key={r.id} referral={r} onEdit={() => setEditing({ kind: "referral", referral: r })} />
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="educators-heading">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="educators-heading" className="t-h2">Educators</h2>
            <p className="t-body mt-2 max-w-2xl text-black/70">
              One promo code per educator. Type the code exactly as it is set up in Wix so referrals match.
            </p>
          </div>
          <button type="button" onClick={() => setEditing({ kind: "educator", educator: null })} className="rounded-full bg-lavender px-4 py-2 text-[0.85rem] font-semibold text-black transition-colors hover:bg-lime">
            Add educator
          </button>
        </div>

        {educators.length === 0 ? (
          <p className="t-body mt-6 text-black/60">No educators yet.</p>
        ) : (
          <ul className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {educators.map((e) => {
              const theirs = referrals.filter((r) => r.educatorId === e.id);
              const owed = theirs.filter((r) => r.stage === "due").reduce((s, r) => s + (payoutOf(r) ?? 0), 0);
              const paid = theirs.filter((r) => r.stage === "paid").reduce((s, r) => s + (payoutOf(r) ?? 0), 0);
              return (
                <li key={e.id} className="rounded-3xl bg-white p-5 ring-1 ring-black/10">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-[1.05rem] font-semibold">{e.name}</h3>
                      <p className="mt-1 inline-block rounded-full bg-lavender/30 px-3 py-1 font-mono text-[0.8rem] font-semibold">{e.code}</p>
                    </div>
                    <button type="button" onClick={() => setEditing({ kind: "educator", educator: e })} className={smallButton}>Edit</button>
                  </div>
                  {(e.email || e.phone) && <p className="mt-3 break-words text-[0.85rem] text-black/70">{[e.email, e.phone].filter(Boolean).join(" · ")}</p>}
                  <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-[0.85rem]">
                    <div className="col-span-2"><dt className="text-black/60">Tier</dt><dd className="font-semibold">{e.tierName}</dd></div>
                    <div><dt className="text-black/60">Qualified, last {tierMonths} months</dt><dd className="font-semibold">{e.recentCount}</dd></div>
                    <div><dt className="text-black/60">All referrals</dt><dd className="font-semibold">{e.referralCount}</dd></div>
                    <div><dt className="text-black/60">Due now</dt><dd className="font-semibold">{formatMoney(owed) || "$0"}</dd></div>
                    <div><dt className="text-black/60">Paid so far</dt><dd className="font-semibold">{formatMoney(paid) || "$0"}</dd></div>
                  </dl>
                  {e.notes && <p className="mt-3 text-[0.85rem] text-black/70">{e.notes}</p>}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {editing?.kind === "referral" && (
        <Modal title={editing.referral ? "Edit referral" : "Add referral"} onClose={() => setEditing(null)}>
          <ReferralForm referral={editing.referral} educators={educators} today={today} nextClassStart={nextClassStart} waitDays={waitDays} onDone={() => setEditing(null)} />
        </Modal>
      )}
      {editing?.kind === "educator" && (
        <Modal title={editing.educator ? "Edit educator" : "Add educator"} onClose={() => setEditing(null)}>
          {editing.first && <p className="t-body mt-3 text-black/70">A referral needs an educator to belong to. Add the educator and their promo code first, then add the referral.</p>}
          <EducatorForm educator={editing.educator} onDone={() => setEditing(null)} />
        </Modal>
      )}
    </div>
  );
}

function ReferralRow({ referral: r, onEdit }: { referral: Referral; onEdit: () => void }) {
  const pay = useSubmit(markPaid);
  return (
    <li className="rounded-3xl bg-white p-5 ring-1 ring-black/10">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-[1.05rem] font-semibold">{r.studentName}</h3>
          <p className="mt-0.5 text-[0.85rem] text-black/70">
            Referred by {r.educatorName} <span className="font-mono font-semibold text-black">{r.code}</span>
          </p>
        </div>
        <span className={`rounded-full px-3 py-1 text-[0.8rem] font-semibold ${stageStyle[r.stage]}`}>{stageLabel(r)}</span>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-[0.85rem] sm:grid-cols-4">
        <div><dt className="text-black/60">Applied</dt><dd className="font-semibold">{formatDate(r.appliedOn) || "Not set"}</dd></div>
        <div><dt className="text-black/60">Class starts</dt><dd className="font-semibold">{formatDate(r.classStart) || "Not set"}</dd></div>
        <div><dt className="text-black/60">30 days are up</dt><dd className="font-semibold">{formatDate(r.eligibleOn) || "Needs a start date"}</dd></div>
        <div><dt className="text-black/60">Payout</dt><dd className="font-semibold">
            {formatMoney(payoutOf(r))
              ? `${formatMoney(payoutOf(r))}${r.stage === "waiting" && r.payoutCents === null ? " expected" : ""}`
              : r.status === "enrolled" ? "Needs a start date" : "Set once enrolled"}
          </dd></div>
      </dl>

      {(r.studentEmail || r.studentPhone) && <p className="mt-3 break-words text-[0.85rem] text-black/70">{[r.studentEmail, r.studentPhone].filter(Boolean).join(" · ")}</p>}
      {r.notes && <p className="mt-2 text-[0.85rem] text-black/70">{r.notes}</p>}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button type="button" onClick={onEdit} className={smallButton}>Edit</button>
        {r.stage === "due" && (
          <form onSubmit={pay.onSubmit}>
            <input type="hidden" name="id" value={r.id} />
            <button type="submit" disabled={pay.pending} className="rounded-full bg-lime px-4 py-2 text-[0.85rem] font-semibold text-black transition-colors hover:bg-lavender disabled:opacity-60">
              {pay.pending ? "Saving" : "Mark paid today"}
            </button>
          </form>
        )}
        {r.source === "wix" && <span className="text-[0.8rem] text-black/55">From Wix</span>}
        {pay.error && <p role="alert" className="text-[0.85rem] font-semibold">{pay.error}</p>}
      </div>
    </li>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-label={title}
      className="m-auto w-[min(40rem,calc(100vw-2rem))] max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-3xl bg-white p-6 text-black backdrop:bg-black/60 sm:p-8"
    >
      <div className="flex items-start justify-between gap-4">
        <h2 className="t-h3">{title}</h2>
        <button type="button" onClick={onClose} className={smallButton}>Close</button>
      </div>
      {children}
    </dialog>
  );
}

function ReferralForm({ referral: r, educators, today, nextClassStart, waitDays, onDone }: { referral: Referral | null; educators: Educator[]; today: string; nextClassStart: string; waitDays: number; onDone: () => void }) {
  const save = useSubmit(saveReferral, onDone);
  const remove = useSubmit(deleteReferral, onDone);
  const [confirming, setConfirming] = useState(false);
  const [classStart, setClassStart] = useState(r?.classStart ?? "");

  return (
    <>
      <form onSubmit={save.onSubmit} className="mt-6 grid gap-5 sm:grid-cols-2">
        {r && <input type="hidden" name="id" value={r.id} />}
        <div className="sm:col-span-2">
          <Label htmlFor="educatorId">Referred by</Label>
          <Select id="educatorId" name="educatorId" defaultValue={r?.educatorId ?? ""} required>
            <option value="" disabled>Choose an educator</option>
            {educators.map((e) => (<option key={e.id} value={e.id}>{e.name} ({e.code})</option>))}
          </Select>
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="studentName">Student name</Label>
          <TextInput id="studentName" name="studentName" defaultValue={r?.studentName ?? ""} required autoComplete="off" />
        </div>
        <div>
          <Label htmlFor="studentEmail">Student email</Label>
          <TextInput id="studentEmail" name="studentEmail" type="email" defaultValue={r?.studentEmail ?? ""} autoComplete="off" />
        </div>
        <div>
          <Label htmlFor="studentPhone">Student phone</Label>
          <TextInput id="studentPhone" name="studentPhone" type="tel" defaultValue={r?.studentPhone ?? ""} autoComplete="off" />
        </div>
        <div>
          <Label htmlFor="appliedOn">Date applied</Label>
          <TextInput id="appliedOn" name="appliedOn" type="date" defaultValue={r ? r.appliedOn ?? "" : today} />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select id="status" name="status" defaultValue={r?.status ?? "applied"}>
            <option value="applied">Applied</option>
            <option value="enrolled">Enrolled</option>
            <option value="withdrawn">Withdrawn</option>
          </Select>
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="classStart" hint={`The payout is earned ${waitDays} days after this date.`}>Class start date</Label>
          <TextInput id="classStart" name="classStart" type="date" value={classStart} onChange={(e) => setClassStart(e.target.value)} />
          {!classStart && (
            <button type="button" onClick={() => setClassStart(nextClassStart)} className="mt-2 text-[0.85rem] font-semibold underline underline-offset-4">
              Use the next class start, {formatDate(nextClassStart)}
            </button>
          )}
        </div>
        <div>
          <Label htmlFor="payout" hint={r?.paidOn ? undefined : "Leave blank to use the tier amount."}>Payout amount</Label>
          <TextInput id="payout" name="payout" inputMode="decimal" placeholder={r?.tierCents != null ? String(r.tierCents / 100) : "Tier amount"} defaultValue={r?.payoutCents != null ? String(r.payoutCents / 100) : ""} autoComplete="off" />
        </div>
        <div>
          <Label htmlFor="paidOn">Paid on</Label>
          <TextInput id="paidOn" name="paidOn" type="date" defaultValue={r?.paidOn ?? ""} />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="notes">Notes</Label>
          <TextInput id="notes" name="notes" defaultValue={r?.notes ?? ""} autoComplete="off" />
        </div>
        {save.error && <p role="alert" className="text-[0.9rem] font-semibold sm:col-span-2">{save.error}</p>}
        <div className="sm:col-span-2">
          <SubmitButton busy={save.pending}>{save.pending ? "Saving" : "Save referral"}</SubmitButton>
        </div>
      </form>

      {r && r.source === "manual" && (
        <form onSubmit={remove.onSubmit} className="mt-6 border-t border-black/10 pt-5">
          <input type="hidden" name="id" value={r.id} />
          {confirming ? (
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-[0.9rem]">Remove this referral for good?</p>
              <button type="submit" disabled={remove.pending} className={smallButton}>{remove.pending ? "Removing" : "Yes, remove it"}</button>
              <button type="button" onClick={() => setConfirming(false)} className="text-[0.85rem] font-semibold underline underline-offset-4">Keep it</button>
            </div>
          ) : (
            <button type="button" onClick={() => setConfirming(true)} className="text-[0.85rem] font-semibold underline underline-offset-4">Remove this referral</button>
          )}
          {remove.error && <p role="alert" className="mt-2 text-[0.9rem] font-semibold">{remove.error}</p>}
        </form>
      )}
      {r && r.source === "wix" && (
        <p className="mt-6 border-t border-black/10 pt-5 text-[0.85rem] text-black/60">This referral came from Wix. If the student does not continue, set the status to Withdrawn.</p>
      )}
    </>
  );
}

function EducatorForm({ educator: e, onDone }: { educator: Educator | null; onDone: () => void }) {
  const save = useSubmit(saveEducator, onDone);
  const remove = useSubmit(deleteEducator, onDone);
  return (
    <>
      <form onSubmit={save.onSubmit} className="mt-6 grid gap-5 sm:grid-cols-2">
        {e && <input type="hidden" name="id" value={e.id} />}
        <div>
          <Label htmlFor="name">Educator name</Label>
          <TextInput id="name" name="name" defaultValue={e?.name ?? ""} required autoComplete="off" />
        </div>
        <div>
          <Label htmlFor="code">Promo code</Label>
          <TextInput id="code" name="code" defaultValue={e?.code ?? ""} required maxLength={20} autoComplete="off" autoCapitalize="characters" className="font-mono uppercase" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <TextInput id="email" name="email" type="email" defaultValue={e?.email ?? ""} autoComplete="off" />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <TextInput id="phone" name="phone" type="tel" defaultValue={e?.phone ?? ""} autoComplete="off" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="educatorNotes">Notes</Label>
          <TextInput id="educatorNotes" name="notes" defaultValue={e?.notes ?? ""} autoComplete="off" />
        </div>
        {save.error && <p role="alert" className="text-[0.9rem] font-semibold sm:col-span-2">{save.error}</p>}
        <div className="sm:col-span-2">
          <SubmitButton busy={save.pending}>{save.pending ? "Saving" : "Save educator"}</SubmitButton>
        </div>
      </form>
      {e && e.referralCount === 0 && (
        <form onSubmit={remove.onSubmit} className="mt-6 border-t border-black/10 pt-5">
          <input type="hidden" name="id" value={e.id} />
          <button type="submit" disabled={remove.pending} className="text-[0.85rem] font-semibold underline underline-offset-4">{remove.pending ? "Removing" : "Remove this educator"}</button>
          {remove.error && <p role="alert" className="mt-2 text-[0.9rem] font-semibold">{remove.error}</p>}
        </form>
      )}
    </>
  );
}
