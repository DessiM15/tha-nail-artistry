import { connection } from "next/server";
import type { TeamMember } from "@/content/types";

/** Opts the caller into request-time rendering and returns the current instant. */
export async function requestNow(): Promise<number> {
  await connection();
  return Date.now();
}

export function isActive(member: Pick<TeamMember, "activeUntil">, now: number): boolean {
  return !member.activeUntil || now < Date.parse(member.activeUntil);
}

export function activeMembers<T extends Pick<TeamMember, "activeUntil">>(members: T[], now: number): T[] {
  return members.filter((m) => isActive(m, now));
}

/** "A, B and C" with the locale's conjunction. */
export function joinNames(names: string[], and: string): string {
  if (names.length <= 1) return names.join("");
  return `${names.slice(0, -1).join(", ")} ${and} ${names[names.length - 1]}`;
}
