"use client";

import { useState, useTransition, type FormEvent } from "react";
import type { ActionResult } from "@/app/admin/actions";

const idle: ActionResult = { ok: true, message: "" };

/**
 * Runs a server action from a form without clearing what was typed when the
 * action reports a problem (a plain form action resets the fields).
 */
export function useSubmit(action: (prev: ActionResult, form: FormData) => Promise<ActionResult>, onDone?: () => void) {
  const [pending, start] = useTransition();
  const [error, setError] = useState("");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setError("");
    start(async () => {
      try {
        const result = await action(idle, form);
        if (result.ok) onDone?.();
        else setError(result.message);
      } catch {
        setError("Something went wrong. Try again.");
      }
    });
  }

  return { onSubmit, pending, error };
}
