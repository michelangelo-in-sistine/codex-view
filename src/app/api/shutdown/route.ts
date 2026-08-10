import process from "node:process";
import type { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = forwardedHost || request.headers.get("host");
  const forwardedProtocol = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const protocol = forwardedProtocol || new URL(request.url).protocol.replace(":", "");
  let isSameOrigin = false;

  if (origin && host) {
    try {
      const originUrl = new URL(origin);
      isSameOrigin = originUrl.host === host && originUrl.protocol === `${protocol}:`;
    } catch {
      // Reject malformed Origin headers.
    }
  }

  if (!isSameOrigin) {
    return Response.json({ error: "仅允许从 codex-view 页面退出服务。" }, { status: 403 });
  }

  const shutdownTimer = setTimeout(() => {
    process.kill(process.pid, "SIGTERM");
  }, 250);
  shutdownTimer.unref();

  return Response.json({ ok: true });
}
