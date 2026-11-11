import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import { enrollment } from "@/config/site";
import { hasDatabase } from "@/lib/admin/db";
import { PAYOUT_WAIT_DAYS, TIER_WINDOW_MONTHS, listEducators, listReferrals, todayInHouston } from "@/lib/admin/referrals";
import { hasAdminPassword, isSignedIn } from "@/lib/admin/session";
import { hasWixKey } from "@/lib/admin/wix-orders";
import { ReferralTracker } from "@/components/admin/ReferralTracker";
import { SignInForm, SignOutButton } from "@/components/admin/SignIn";

export default function AdminPage() {
  return (
    <>
      <header className="on-dark bg-black text-white">
        <div className="container-x flex items-center justify-between gap-4 py-4">
          <Link href="/" className="inline-block rounded-sm" aria-label="Tha Nail Artistry Academy, back to the site">
            <Image src="/images/logo-white-trim.png" alt="Tha Nail Artistry Academy" width={1679} height={386} className="h-8 w-auto" sizes="160px" loading="eager" />
          </Link>
          <Suspense fallback={null}>
            <SignOutSlot />
          </Suspense>
        </div>
      </header>
      <main id="main" className="container-x flex-1 py-8 md:py-12">
        <Suspense fallback={<p className="t-body text-black/60">Loading the tracker.</p>}>
          <Gate />
        </Suspense>
      </main>
    </>
  );
}

async function SignOutSlot() {
  await connection();
  return (await isSignedIn()) ? <SignOutButton /> : null;
}

async function Gate() {
  await connection();

  if (!hasAdminPassword() || !hasDatabase()) {
    return (
      <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 ring-1 ring-black/10">
        <h1 className="t-h3">The tracker is not set up yet</h1>
        <p className="t-body mt-3 text-black/70">
          {hasDatabase() ? "The admin password is missing (ADMIN_PASSWORD)." : "The database is not connected (DATABASE_URL)."} Add it in Vercel and redeploy.
        </p>
      </div>
    );
  }

  if (!(await isSignedIn())) return <SignInForm />;

  const [educators, referrals] = await Promise.all([listEducators(), listReferrals()]);
  return (
    <ReferralTracker
      educators={educators}
      referrals={referrals}
      today={todayInHouston()}
      nextClassStart={enrollment.nextClassStart}
      wixConnected={hasWixKey()}
      waitDays={PAYOUT_WAIT_DAYS}
      tierMonths={TIER_WINDOW_MONTHS}
    />
  );
}
