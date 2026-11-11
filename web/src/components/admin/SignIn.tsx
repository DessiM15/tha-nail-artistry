"use client";

import { signIn, signOut } from "@/app/admin/actions";
import { Label, SubmitButton, TextInput } from "@/components/forms/Field";
import { useSubmit } from "./useSubmit";

export function SignInForm() {
  const { onSubmit, pending, error } = useSubmit(signIn);
  return (
    <form onSubmit={onSubmit} className="mx-auto mt-6 max-w-md rounded-3xl bg-white p-8 ring-1 ring-black/10">
      <h1 className="t-h3">Referral tracker</h1>
      <p className="t-body mt-2 text-black/70">Sign in to see educator referrals and payouts.</p>
      <div className="mt-6">
        <Label htmlFor="password">Password</Label>
        <TextInput id="password" name="password" type="password" autoComplete="current-password" required autoFocus />
      </div>
      {error && <p role="alert" className="mt-3 text-[0.9rem] font-semibold">{error}</p>}
      <div className="mt-6">
        <SubmitButton busy={pending}>{pending ? "Signing in" : "Sign in"}</SubmitButton>
      </div>
    </form>
  );
}

export function SignOutButton() {
  return (
    <form action={signOut}>
      <button type="submit" className="rounded-full px-4 py-2 text-[0.85rem] font-semibold ring-1 ring-white/50 transition-colors hover:bg-white hover:text-black">
        Sign out
      </button>
    </form>
  );
}
