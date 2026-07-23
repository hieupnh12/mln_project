import { ADMIN_DISPLAY_TIME_ZONE } from "../constants/admin-datetime.constants";

/**
 * Backend sends ISO local date-times without offset (UTC wall clock).
 * Treat those as UTC, then format in Asia/Ho_Chi_Minh for admin UI.
 */
export function parseAdminBackendDateTime(
  value: string | null | undefined,
): Date | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const hasExplicitOffset = /[zZ]$|[+-]\d{2}:?\d{2}$/.test(trimmed);
  if (hasExplicitOffset) {
    const parsed = new Date(trimmed);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const normalized = trimmed.includes("T")
    ? trimmed
    : trimmed.includes(" ")
      ? trimmed.replace(" ", "T")
      : `${trimmed}T00:00:00`;

  const parsed = new Date(`${normalized}Z`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function formatAdminDateTime(value: string | null | undefined): string {
  const parsed = parseAdminBackendDateTime(value);
  if (!parsed) {
    return value?.trim() ? value : "—";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    timeZone: ADMIN_DISPLAY_TIME_ZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsed);
}

export function formatAdminDate(value: string | null | undefined): string {
  const parsed = parseAdminBackendDateTime(value);
  if (!parsed) {
    return value?.trim() ? value : "—";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    timeZone: ADMIN_DISPLAY_TIME_ZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(parsed);
}

export function formatChartDayLabel(isoDate: string): string {
  const parsed = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return isoDate;
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
  }).format(parsed);
}
