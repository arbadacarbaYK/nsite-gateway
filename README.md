# nsite-gateway — gittr Pages

**Production:** [https://pages.gittr.space](https://pages.gittr.space)  
**This repository:** [arbadacarbaYK/nsite-gateway](https://github.com/arbadacarbaYK/nsite-gateway) — the gateway we build and run for gittr Pages.  
**App repo:** [arbadacarbaYK/gittr](https://github.com/arbadacarbaYK/gittr) — deploy script, nginx example, production `.env` template.

Branch **`master`** is our production line (based on hzrd149 **v3.6.2**, plus gittr-only features below).

## Forked from

This codebase was **forked from** **[hzrd149/nsite-gateway](https://github.com/hzrd149/nsite-gateway)** by **[hzrd149](https://github.com/hzrd149)** — a Deno + Hono gateway for [NIP-5A](https://github.com/nostr-protocol/nips/blob/master/5A.md) (nsite) static sites on Nostr, with blobs on [Blossom](https://github.com/hzrd149/blossom). Thank you for the original project.

| | |
| --- | --- |
| **Forked from** | https://github.com/hzrd149/nsite-gateway |
| **Original README** | https://github.com/hzrd149/nsite-gateway/blob/master/README.md |
| **Original JSR package** | [`jsr:@hzrd149/nsite-gateway`](https://jsr.io/@hzrd149/nsite-gateway) |
| **Our base revision** | hzrd149 tag **v3.6.2** |
| **License** | [MIT](LICENSE) — copyright **hzrd149** in `LICENSE`; our changes under the same license |

For core gateway behavior (caching, hostname rules, Blossom proxy, Docker layout), hzrd149’s README is still the best reference for the shared foundation. **This README** covers how **we** run and extend it for gittr Pages.

---

## What we added (gittr Pages)

| Feature | Purpose |
|--------|---------|
| `GET /status/manifests.json` | JSON site directory for [gittr.space/pages](https://gittr.space/pages) |
| `hasIndexHtml` | JSON feed lists only manifests that include `/index.html` |
| `GITTR_SYNC_MUTED_PUBKEYS` | Server env backup for the publisher blocklist until the relay mute list is live |
| `scripts/publish-curation-mutelist.cjs` | Operator script to publish/update the curator NIP-51 mute list |

- **`GET /status`** — HTML table of all indexed manifests (operator view).
- **`GET /status/manifests.json`** + gittr **`/pages`** — public “sites with a homepage” directory.

Curation: [gittr `docs/GITTR_PAGES_CURATION.md`](https://github.com/arbadacarbaYK/gittr/blob/main/docs/GITTR_PAGES_CURATION.md). Scripts: [`scripts/README.md`](scripts/README.md).

---

## Deploy (production)

Use **this repo** (`master`), not a fresh clone of hzrd149’s repository.

1. Clone **arbadacarbaYK/nsite-gateway** (`master`).
2. From the **gittr** repo root:

   ```bash
   export DEPLOY_HOST=your.server
   export NSITE_GATEWAY_SRC=/path/to/this/repo   # optional; default ../nsite-gateway-pr
   ./scripts/deploy-nsite-gateway.sh
   ```

   Syncs this repo into the Docker build, copies compose files from gittr’s `infra/nsite-gateway/`, and restarts the stack. Does **not** overwrite an existing server `.env`.

3. **DNS:** `pages.gittr.space` and wildcard `*.pages.gittr.space` → your server.
4. **TLS / nginx:** gittr [`infra/nsite-gateway/README.md`](https://github.com/arbadacarbaYK/gittr/blob/main/infra/nsite-gateway/README.md) and `nginx-pages.gittr.space.conf.example`.

Production env (no secrets) is maintained in **gittr**:

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
deno task dev
```

Gateway: `http://localhost:3000` (or `NSITE_PORT`). Try `/status` and `/status/manifests.json`.

---

## Configuration

Copy `.env.example` → `.env`.

| Variable | Description |
| -------- | ----------- |
| `LOOKUP_RELAYS` | NIP-65 / kind `10063` lookup |
| `NOSTR_RELAYS` | Extra relays for manifest hydration |
| `BLOSSOM_SERVERS` | Fallback Blossom when no `10063` / manifest `server` tags |
| `PUBLIC_DOMAIN` | Gateway hostname for homepage / status links |
| `CURATION_USER` / `CURATION_REFRESH` | Curator mute list (kind `10000`) |
| `GITTR_SYNC_MUTED_PUBKEYS` | Blocklist backup (gittr deploy) |

Full variable reference from the original project: [hzrd149/nsite-gateway README](https://github.com/hzrd149/nsite-gateway/blob/master/README.md).

The gateway **never publishes** the curator mute list — use `scripts/publish-curation-mutelist.cjs`.

---

## Protocol (short)

Static sites on Nostr ([NIP-5A](https://github.com/nostr-protocol/nips/blob/master/5A.md)): manifests `15128` / `35128` / `5128`, blobs via [Blossom](https://github.com/hzrd149/blossom). On gittr, sites are served at `https://<label>.pages.gittr.space/`.

---

## Merging updates from hzrd149

When you want fixes from the **original** [hzrd149/nsite-gateway](https://github.com/hzrd149/nsite-gateway):

1. Fetch tags/releases from hzrd149’s repo.
2. Merge or rebase into our **`master`**.
3. Re-apply gittr-only files if needed (`manifests.json`, `hasIndexHtml`, `gittr-muted-pubkeys`, scripts).
4. Push **`master`** and redeploy via gittr’s `deploy-nsite-gateway.sh`.

We do not open PRs to hzrd149 for gittr-specific code.

---

## License

MIT License — see [LICENSE](LICENSE).  
Copyright © 2025 **hzrd149** (original nsite-gateway).  
Changes in [arbadacarbaYK/nsite-gateway](https://github.com/arbadacarbaYK/nsite-gateway) are distributed under the same terms.
