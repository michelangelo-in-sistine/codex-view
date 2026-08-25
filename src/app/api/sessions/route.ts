import { NextResponse } from "next/server";
import { listSessions } from "@/lib/indexer";
import type { SessionSortBy, SortDirection } from "@/lib/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function toBool(value: string | null) {
  if (!value) return false;
  return value === "1" || value.toLowerCase() === "true";
}

function toInt(value: string | null, fallback: number) {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

const SESSION_SORT_FIELDS = new Set<SessionSortBy>([
  "startedAt",
  "endedAt",
  "name",
  "durationSec",
  "cwd",
  "messages",
  "toolCalls",
  "errors",
  "tokensTotal"
]);

function toSortBy(value: string | null): SessionSortBy | undefined {
  return value && SESSION_SORT_FIELDS.has(value as SessionSortBy) ? (value as SessionSortBy) : undefined;
}

function toSortOrder(value: string | null): SortDirection | undefined {
  return value === "asc" || value === "desc" ? value : undefined;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? undefined;
  const start = searchParams.get("start") ?? undefined;
  const end = searchParams.get("end") ?? undefined;
  const withTools = toBool(searchParams.get("withTools"));
  const withErrors = toBool(searchParams.get("withErrors"));
  const limit = toInt(searchParams.get("limit"), 100);
  const offset = toInt(searchParams.get("offset"), 0);
  const sortBy = toSortBy(searchParams.get("sortBy"));
  const sortOrder = toSortOrder(searchParams.get("sortOrder"));

  const sessions = await listSessions({ q, start, end, withTools, withErrors, limit, offset, sortBy, sortOrder });
  return NextResponse.json(sessions);
}
