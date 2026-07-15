// src/lib/dates.ts
//
// Timezone-agnostic date helpers for all business date fields.
// Standard `new Date("2026-07-15")` silently uses the local timezone,
// which shifts the stored UTC value by ±hours on Bangkok (GMT+7) servers.
// Use these helpers wherever a DATE-only value enters the system.

/**
 * Parses an ISO date string (YYYY-MM-DD) into a UTC midnight Date object
 * so that Prisma stores the correct calendar date regardless of server timezone.
 *
 * Example:
 *   parseToUTCMidnight("2026-07-15") → 2026-07-15T00:00:00.000Z
 */
export function parseToUTCMidnight(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

/**
 * Formats a Date (or JS Date-like) value back to "YYYY-MM-DD" using UTC
 * components — safe for display and re-parsing.
 */
export function formatUTCDate(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
