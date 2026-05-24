# nsite-gateway (gittr Pages fork)

**Production:** [https://pages.gittr.space](https://pages.gittr.space)  
**Upstream:** [hzrd149/nsite-gateway](https://github.com/hzrd149/nsite-gateway) (NIP-5A / nsite)  
**App repo:** [arbadacarbaYK/gittr](https://github.com/arbadacarbaYK/gittr) — builds and deploys this fork as the Pages gateway Docker image.

This repository is **not** a generic copy-paste of upstream. Branch **`master`** is what we run for **gittr Pages**: hzrd149 **v3.6.2** plus gittr-only features below. We do **not** open PRs upstream for gittr-specific code.

---

## What this fork adds

| Feature | Purpose |
|--------|---------|
| `GET /status/manifests.json` | JSON site directory for [gittr.space/pages](https://gittr.space/pages) |
| `hasIndexHtml` | JSON feed lists only manifests that include `/index.html` |
| `GITTR_SYNC_MUTED_PUBKEYS` | Server env backup for the publisher blocklist until the relay mute list is live |
| `scripts/publish-curation-mutelist.cjs` | Operator script to publish/update the curator NIP-51 mute list |

- **`GET /status`** — HTML table of all indexed manifests (operator view).
- **`GET /status/manifests.json`** + gittr **`/pages`** — public “sites with a homepage” directory.

Curation details: [gittr `docs/GITTR_PAGES_CURATION.md`](https://github.com/arbadacarbaYK/gittr/blob/main/docs/GITTR_PAGES_CURATION.md). Operator scripts: [`scripts/README.md`](scripts/README.md).

---

## Deploy (production)

Do **not** use upstream’s `git clone hzrd149/nsite-gateway` flow for gittr production.

1. Clone **this fork** (`master`) on your machine.
2. From the **gittr** repo root, run:

   ```bash
   export DEPLOY_HOST=your.server
   export NSITE_GATEWAY_SRC=/path/to/this/fork   # optional; default ../nsite-gateway-pr
   ./scripts/deploy-nsite-gateway.sh
   ```

   That syncs this repo into the gateway Docker build context, copies compose files from gittr’s `infra/nsite-gateway/`, and restarts the stack. It **does not overwrite** an existing server `.env`.

3. **DNS:** `pages.gittr.space` and wildcard `*.pages.gittr.space` → your server.
4. **TLS / nginx:** see gittr [`infra/nsite-gateway/README.md`](https://github.com/arbadacarbaYK/gittr/blob/main/infra/nsite-gateway/README.md) and `nginx-pages.gittr.space.conf.example`.

Canonical production env (no secrets) lives in **gittr**, not in this fork:

[`gittr/infra/nsite-gateway/gittr-pages.production.env`](https://github.com/arbadacarbaYK/gittr/blob/main/infra/nsite-gateway/gittr-pages.production.env)

| Variable | gittr production |
|----------|------------------|
| `PUBLIC_DOMAIN` | `pages.gittr.space` (hostname only, v3.6.1+) |
| `BLOSSOM_SERVERS` | `https://blossom.gittr.space,https://blossom.band,https://nostr.download` |
| `NOSTR_RELAYS` | Damus, nos.lol, Primal, Nostr.band, **nsite.run** |
| `CURATION_USER` | gittr operator pubkey (hex) — mute list on relays |
| `GITTR_SYNC_MUTED_PUBKEYS` | Set on deploy from gittr `PUBLISHER_BLOCKLIST` (not committed) |

`BLOSSOM_SERVERS` is the fallback when a publisher has no kind `10063` Blossom list. **blossom.gittr.space** is tried first (where gittr Pages uploads land).

---

## Local development

```sh
cp .env.example .env
# edit .env — see gittr production table above for realistic values
deno task dev
```

Gateway listens on `http://localhost:3000` (or `NSITE_PORT`). For a quick check of fork endpoints: `/status`, `/status/manifests.json`.

---

## Configuration

Copy `.env.example` → `.env`. All settings are environment variables.

| Variable | Default (example file) | Description |
| -------- | ---------------------- | ----------- |
| `LOOKUP_RELAYS` | kindpages + purplepag.es | NIP-65 / kind `10063` lookup |
| `NOSTR_RELAYS` | _(see `.env.example`)_ | Extra relays for manifest hydration |
| `BLOSSOM_SERVERS` | gittr-oriented fallbacks in comments | Fallback Blossom when no `10063` / manifest `server` tags |
| `BLOSSOM_PROXY` | _(auto localhost:24242)_ | Optional BUD-11 proxy checked first |
| `PUBLIC_DOMAIN` | `pages.gittr.space` in comments | Gateway hostname for homepage / status links |
| `CACHE_PATH` | `./data/cache` | Deno KV persistence |
| `CACHE_TIME` | `3600` | KV TTL (seconds) |
| `CURATION_USER` | _(unset)_ | Hex pubkey — loads kind `10000` mute list |
| `CURATION_REFRESH` | `600` | Mute list refresh interval (seconds) |
| `GITTR_SYNC_MUTED_PUBKEYS` | _(unset)_ | Comma-separated hex pubkeys (gittr blocklist backup) |
| `NSITE_HOST` / `NSITE_PORT` | `0.0.0.0` / `3000` | Bind address |

Full upstream variable list and behavior: [hzrd149/nsite-gateway README](https://github.com/hzrd149/nsite-gateway/blob/master/README.md).

The gateway **never publishes** the curator mute list — you sign kind `10000` yourself (`scripts/publish-curation-mutelist.cjs`).

---

## Protocol (short)

A Deno + Hono gateway serves **static sites** published on Nostr ([NIP-5A](https://github.com/nostr-protocol/nips/blob/master/5A.md)):

- Manifests: kind `15128` (root), `35128` (named), `5128` (snapshots).
- Blobs: [Blossom](https://github.com/hzrd149/blossom).

Hostname resolution (in order): npub subdomain, snapshot label, named site label, then CNAME. On gittr, sites look like `https://<label>.pages.gittr.space/`.

---

## Pulling upstream fixes

When you want generic fixes from hzrd149:

1. Fetch tags/releases from `hzrd149/nsite-gateway`.
2. Merge or rebase into **`master`**.
3. Re-apply gittr-only files if needed (`manifests.json`, `hasIndexHtml`, `gittr-muted-pubkeys`, scripts).
4. Push **`master`** and redeploy via gittr’s `deploy-nsite-gateway.sh`.

---

## License

MIT — same as upstream.
