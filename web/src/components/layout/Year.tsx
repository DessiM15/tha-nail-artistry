"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const BUILD_YEAR = 2026;

/** Current year, resolved on the client so the static shell stays prerenderable. */
export function Year() {
  const year = useSyncExternalStore(subscribe, () => new Date().getFullYear(), () => BUILD_YEAR);
  return <>{year}</>;
}
