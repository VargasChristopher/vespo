/**
 * Vespo quote-form API.
 *
 * The site is a static export on GitHub Pages, so there is no Next.js server
 * to host an /api route. This Worker is that endpoint: the contact quiz POSTs
 * here and the submission is emailed to the owner.
 *
 * Uses the Cloudflare Email Service `send_email` binding — no third-party
 * provider, no API key to leak. See worker/README.md for setup.
 *
 * NOTE: this deliberately does NOT use the legacy `cloudflare:email`
 * EmailMessage + mimetext raw-MIME API. That path needs nodejs_compat and a
 * mimetext dependency, and was the source of a runtime 1101. env.EMAIL.send()
 * takes plain fields.
 */

/* Minimal shape of what we call. Run `npx wrangler types` to generate the
   full, authoritative Env (worker-configuration.d.ts) from the runtime. */
interface SendEmailOptions {
  to: string | string[];
  from: { email: string; name?: string };
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
}

interface Env {
  EMAIL: { send(options: SendEmailOptions): Promise<{ messageId: string }> };
  /* Envelope sender. Must be on a domain onboarded to Email Sending. */
  MAIL_FROM: string;
  /* Recipient. Must be a verified destination address on the account. */
  MAIL_TO: string;
  /* Comma-separated list of origins allowed to POST here. */
  ALLOWED_ORIGINS: string;
}

interface QuotePayload {
  projectType?: string | null;
  fleetSize?: string | null;
  budget?: string | null;
  timeline?: string | null;
  truckName?: string;
  ownerName?: string;
  email?: string;
  notes?: string;
  /* Honeypot. Real people never fill this in; bots fill in everything. */
  company?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/* Long enough for a chatty owner, short enough that nobody can post a novel. */
const MAX_FIELD = 2000;

function corsHeaders(origin: string | null, env: Env): HeadersInit {
  const allowed = env.ALLOWED_ORIGINS.split(",").map((o) => o.trim());
  /* Echo the origin only when it is on the list — never reflect blindly, and
     never fall back to "*" on a POST endpoint that sends mail. */
  const allowOrigin = origin && allowed.includes(origin) ? origin : allowed[0];
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function json(body: unknown, status: number, headers: HeadersInit) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...headers, "Content-Type": "application/json" },
  });
}

/* Trim, cap, and strip CR/LF so nothing submitted can inject mail headers. */
function clean(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.replace(/[\r\n]+/g, " ").trim().slice(0, MAX_FIELD);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get("Origin");
    const cors = corsHeaders(origin, env);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }
    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, 405, cors);
    }

    const allowed = env.ALLOWED_ORIGINS.split(",").map((o) => o.trim());
    if (origin && !allowed.includes(origin)) {
      return json({ error: "Forbidden" }, 403, cors);
    }

    let payload: QuotePayload;
    try {
      payload = (await request.json()) as QuotePayload;
    } catch {
      return json({ error: "Invalid JSON" }, 400, cors);
    }

    /* Honeypot: pretend it worked so bots do not learn to adapt. */
    if (clean(payload.company)) {
      return json({ ok: true }, 200, cors);
    }

    const truckName = clean(payload.truckName);
    const ownerName = clean(payload.ownerName);
    const email = clean(payload.email);

    if (!truckName || !ownerName || !EMAIL_RE.test(email)) {
      return json(
        { error: "Truck name, your name, and a valid email are required." },
        400,
        cors
      );
    }

    const rows: [string, string][] = [
      ["Truck", truckName],
      ["Owner", ownerName],
      ["Email", email],
      ["Project", clean(payload.projectType) || "not answered"],
      ["Fleet size", clean(payload.fleetSize) || "not answered"],
      ["Budget", clean(payload.budget) || "not answered"],
      ["Timeline", clean(payload.timeline) || "not given"],
      ["Notes", clean(payload.notes) || "none"],
      ["Received", new Date().toISOString()],
      ["From IP", request.headers.get("CF-Connecting-IP") ?? "unknown"],
      ["Country", request.headers.get("CF-IPCountry") ?? "unknown"],
    ];

    const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");
    /* Both text and html: some clients only render one, and shipping both
       improves spam scoring. */
    const html = `<h2>New audit request: ${escapeHtml(truckName)}</h2><table cellpadding="6">${rows
      .map(
        ([k, v]) =>
          `<tr><td><strong>${escapeHtml(k)}</strong></td><td>${escapeHtml(v)}</td></tr>`
      )
      .join("")}</table>`;

    try {
      await env.EMAIL.send({
        to: env.MAIL_TO,
        from: { email: env.MAIL_FROM, name: "Vespo Site" },
        /* Replying in the mail client goes straight to the truck owner. */
        replyTo: email,
        subject: `New audit request: ${truckName}`,
        text,
        html,
      });
    } catch (err) {
      /* Email Service throws with a .code like E_SENDER_NOT_VERIFIED. Log it
         for `wrangler tail` and return it — these codes are diagnostic, not
         sensitive, and they turn a mystery 500 into a one-line fix. */
      const code =
        err && typeof err === "object" && "code" in err
          ? String((err as { code: unknown }).code)
          : "UNKNOWN";
      console.error("EMAIL.send failed", code, err);
      return json({ error: "Could not send right now.", code }, 502, cors);
    }

    return json({ ok: true }, 200, cors);
  },
};
