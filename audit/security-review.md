# Zilpah site security review

18 October 2026 · index.html, brief.html and their scripts

## The short answer

The site has very little to attack. It is static: there is no backend, API, database, login, cookie, analytics or third-party script, and it loads nothing from other domains. The site never stores visitor data. The brief is put together in the visitor's browser and sent from their own email app to hello@zilpah.io, so that inbox is where your users' data lives, and securing it matters most.

## How visitor data moves today

1. The visitor fills in the brief. Nothing is saved in their browser (no cookies, no local storage).
2. When they press Send, their email app opens with the brief as a draft, and they send it themselves.
3. The email travels to hello@zilpah.io. Mail providers normally encrypt it in transit, but not end to end.
4. It stays in that mailbox until someone deletes it.

## What I checked

| Check | Result |
|---|---|
| Third-party scripts, trackers, outside requests | None. Fonts are self-hosted, and a browser test showed no requests leaving the site. |
| Unsafe code patterns (`innerHTML`, `eval`, inline event handlers) | None. Form answers only go into a text box and an encoded email link. |
| Secrets, keys or internal notes in the files | None. |
| Cookies and browser storage | None, so no cookie banner is needed. |
| Dependencies | None at runtime. The React Bits components are local copies. |
| Domain (HTTPS, email records) | Not checked. DNS lookups are blocked here, and zilpah.io blocks my fetcher. |

## What I fixed

1. **Content Security Policy on both pages.** Browsers now only run scripts and load styles, fonts and images from the site itself. In testing, an injected script, an outside script and a tracking pixel were all blocked, while every feature still worked. To make this possible, the inline scripts moved into `site.js` and `brief.js`.
2. **Brief answers can't leak into a web address.** Before, if JavaScript failed, pressing Send would have put every answer in the page URL, where hosting logs and browser history keep it. The form now uses POST and the policy blocks plain form submission, so nothing is sent. With JavaScript off, the page tells visitors to email instead.
3. **Security headers for the host** in a new `_headers` file: HTTPS only (HSTS), no framing by other sites, no MIME sniffing, a referrer policy, and no camera, microphone or location access. Static hosts that support a `_headers` file read it. On another host, set the same headers in its settings.

Also fixed: the consent checkbox sat flush against its text.

## What needs you

| Area | Why it matters | What to do |
|---|---|---|
| hello@zilpah.io mailbox | Every brief ends up here | Turn on two-factor sign-in, limit who has access, and delete briefs that lead nowhere after a set time (for example 12 months). |
| Email records for zilpah.io | They stop others sending email as @zilpah.io. Gmail and Yahoo require SPF or DKIM from every sender, and DMARC from bulk senders. | Set up SPF, DKIM and DMARC. Start DMARC at `p=none`, then move to `quarantine`. |
| Registrar and hosting accounts | Whoever controls them controls the site | Two-factor sign-in on both, and a registrar lock on the domain. |
| Hosting | The headers above need a host that applies them | HTTPS on, plus the `_headers` file or the same headers in the host's settings. |
| Privacy notice | GDPR Art. 13 requires telling visitors how their data is used | A short privacy page linked from the brief and the footer. It needs the company name, CVR and address. I can draft it. |

## When a real form endpoint replaces email

- The browser can submit a brief but never read anyone else's.
- Store submissions in the EU, under a data processing agreement with the provider.
- Add spam protection: a hidden honeypot field and rate limiting.
- Keep secret keys out of the page. Use public keys only, with access rules enforced on the server.
- Allow that one endpoint in the policy's `connect-src`.
- Use the same retention period as the inbox.
