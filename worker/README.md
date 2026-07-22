# vespo-quote-api

Cloudflare Worker behind the contact quiz on vespo.io. The site is a static
export on GitHub Pages, so there is no Next.js server to host an `/api` route —
this Worker is that endpoint. It validates the submission and emails it to the
owner via the Cloudflare Email Service `send_email` binding. No third-party
provider, no API key to leak.

## Two prerequisites — both required

The Worker deploys fine without these, then fails at send time. Do both.

### 1. Onboard vespo.io for **Email Sending**

This authorises `MAIL_FROM` (`site@vespo.io`) as a sender. It is a different
feature from Email Routing (which is for *receiving*).

Dashboard → **vespo.io → Email → Email Sending** → enable, and complete the
DNS records it asks for (SPF/DKIM).

Or by CLI: `npx wrangler email sending enable vespo.io`
(if that returns `Unauthorized [code: 2036]`, your `wrangler login` token
lacks the Email scope — re-run `npx wrangler login` and grant it, or just use
the dashboard).

Check status with `npx wrangler email sending list`.

### 2. Verify the destination address

**Email → Email Routing → Destination addresses → Add** →
`chrispy.en1@gmail.com`, then click the link in the verification email.

Sending to a verified destination on your own account is free on all plans.

## Deploy

```bash
cd worker
npm install
npx wrangler login     # once
npm run deploy
```

## Point `api.vespo.io` at it

`wrangler.jsonc` routes the Worker at `api.vespo.io/quote`. That needs a DNS
record for the hostname to exist:

DNS → Records → **Add record**
- Type `AAAA`, Name `api`, address `100::`, **Proxied (orange cloud)**

`100::` is the documented discard prefix — the Worker intercepts before
anything routes there. The record only has to exist so Cloudflare has a
hostname to attach the route to, and it **must** be proxied.

**Alternative:** delete the `routes` block and deploy; Wrangler gives you a
`https://vespo-quote-api.<subdomain>.workers.dev` URL. Set the GitHub repo
variable `QUOTE_ENDPOINT` to it and re-run the Pages deploy.

## Verify

```bash
curl -X POST https://api.vespo.io/quote \
  -H 'Content-Type: application/json' \
  -H 'Origin: https://vespo.io' \
  -d '{"truckName":"Test Truck","ownerName":"Chris","email":"chrispy.en1@gmail.com","notes":"hello"}'
```

Expect `{"ok":true}` and an email within seconds.

**If it fails you get a diagnostic code**, e.g.
`{"error":"Could not send right now.","code":"E_SENDER_NOT_VERIFIED"}`:

| Code | Meaning | Fix |
|---|---|---|
| `E_SENDER_NOT_VERIFIED` | vespo.io not onboarded for sending | Prerequisite 1 |
| `E_SENDER_DOMAIN_NOT_AVAILABLE` | Domain onboarding incomplete | Finish the DNS records in prerequisite 1 |
| `E_RECIPIENT_NOT_ALLOWED` | Recipient not in `allowed_destination_addresses` | Check `wrangler.jsonc` matches `MAIL_TO` |
| `E_RECIPIENT_SUPPRESSED` | Address bounced or marked spam | Clear it in the dashboard suppression list |
| `E_VALIDATION_ERROR` | Malformed payload | Check the JSON body |

`npm run tail` streams live logs while you submit.

## Implementation notes

- **Uses `env.EMAIL.send({ to, from, subject, text, html, replyTo })`**, the
  current Email Service binding. It deliberately does *not* use the legacy
  `cloudflare:email` `EmailMessage` + `mimetext` raw-MIME path — that needs
  `nodejs_compat` plus a dependency, and threw a runtime **1101** here.
- **CORS** locked to `ALLOWED_ORIGINS`. The origin is echoed only when it is on
  the list, never reflected blindly, never `*`.
- **Header-injection guard** — CR/LF stripped from every field, all fields
  capped at 2000 chars. HTML body is escaped.
- **Honeypot** — the form ships a hidden `company` field. Anything that fills
  it gets `200 {"ok":true}` and is dropped, so bots do not learn to adapt.
- **Reply-To** is the submitter, so replying in Gmail reaches the truck owner
  rather than `site@vespo.io`.
- **Binding is pinned** to `chrispy.en1@gmail.com` via
  `allowed_destination_addresses` — even a compromised Worker can only mail
  that one inbox.
- Run `npx wrangler types` to generate the authoritative `Env` types from the
  runtime instead of the minimal hand-written ones in `src/index.ts`.

## Changing the recipient

Update **all three** — they must agree:

1. `send_email[0].allowed_destination_addresses` in `wrangler.jsonc`
2. `vars.MAIL_TO` in `wrangler.jsonc`
3. The verified destination address in the Cloudflare dashboard

Then redeploy.
