# nsite-gateway — gittr Pages

**Production:** [https://pages.gittr.space](https://pages.gittr.space)  
**This repository:** [arbadacarbaYK/nsite-gateway](https://gittr.space/npub1n2ph08n4pqz4d3jk6n2p35p2f4ldhc5g5tu7dhftfpueajf4rpxqfjhzmc/nsite-gateway) — the gateway we build and run for gittr Pages.  
**App repo:** [arbadacarbaYK/gittr](https://gittr.space/npub1n2ph08n4pqz4d3jk6n2p35p2f4ldhc5g5tu7dhftfpueajf4rpxqfjhzmc/gittr) — deploy script, nginx example, production `.env` template.

Branch **`master`** is our production line (based on hzrd149 **v3.6.2**, plus gittr-only features below). We **selectively** pull useful patches from later hzrd149 releases (see CHANGELOG) — we do **not** take every upstream change.

## Forked from

This codebase was **forked from** **[hzrd149/nsite-gateway](https://github.com/hzrd149/nsite-gateway)** by **[hzrd149](https://github.com/hzrd149)** — a Deno + Hono gateway for [NIP-5A](https://github.com/nostr-protocol/nips/blob/master/5A.md) (nsite) static sites on Nostr, with blobs on [Blossom](https://github.com/hzrd149/blossom). Thank you for the original project.

| | |
| --- | --- |
| **Forked from** | https://github.com/hzrd149/nsite-gateway |
| **Original README** | https://github.com/hzrd149/nsite-gateway/blob/master/README.md |
| **Original JSR package** | [`jsr:@hzrd149/nsite-gateway`](https://jsr.io/@hzrd149/nsite-gateway) |
| **Our base revision** | hzrd149 tag **v3.6.2** + selective patches from **v3.6.3** (root-host DNS skip, applesauce ^6.2) |
| **License** | [MIT](LICENSE) — copyright **hzrd149** in `LICENSE`; our changes under the same license |

For core gateway behavior (caching, hostname rules, Blossom proxy, Docker layout), hzrd149’s README is still the best reference for the shared foundation. **This README** covers how **we** run and extend it for gittr Pages.

---

## Curation and blocklist (hzrd149 + gittr)

hzrd149’s gateway (**v3.6.2+**) already includes **curation**: set `CURATION_USER` and it **loads** a NIP-51 kind `10000` mute list from relays and hides those authors on the built-in home page and `/status`. It does **not** publish that list for you — you sign kind `10000` yourself ([his README](https://github.com/hzrd149/nsite-gateway#configuring)).

We **use** that feature in production (`CURATION_USER` = gittr operator) and **extended** it so the same pubkeys as gittr’s platform-wide **`PUBLISHER_BLOCKLIST`** apply on Pages:

| Piece | From hzrd149? | What gittr added |
|-------|----------------|------------------|
| Read mute list (`CURATION_USER`, `CURATION_REFRESH`, `src/services/curation.ts`) | **Yes** — in v3.6.2 | We point it at the gittr operator and apply mutes on **`manifests.json`** too |
| Publish / merge blocklist → kind `10000` on relays | **No** | `scripts/publish-curation-mutelist.cjs` merges `NEXT_PUBLIC_PUBLISHER_BLOCKLIST` with the existing list (does not replace `p` tags) |
| Until relays have the new list | **No** | `GITTR_SYNC_MUTED_PUBKEYS` on deploy (from `ui/.env.local` blocklist) + `src/helpers/gittr-muted-pubkeys.ts` |

Details: [gittr `docs/GITTR_PAGES_CURATION.md`](https://gittr.space/npub1n2ph08n4pqz4d3jk6n2p35p2f4ldhc5g5tu7dhftfpueajf4rpxqfjhzmc/gittr?file=docs/GITTR_PAGES_CURATION.md&branch=main). Operator script: [`scripts/README.md`](scripts/README.md).

## What we added (gittr Pages)

### gittr-only (not pushed back to hzrd149)

| Feature | Back to hzrd149? |
|--------|------------------|
| **Machine-readable site directory** — JSON list of published sites for [gittr.space/pages](https://gittr.space/pages) and automation (`GET /status/manifests.json`) | **No** — fork only (PR branch prepared locally; never opened on his repo) |
| **Homepage-only filter** — that JSON lists only sites with `/index.html`, not empty manifests (`hasIndexHtml`) | **No** — part of the row above |
| **Platform blocklist on Pages** — sync + publish wiring above (`GITTR_SYNC_MUTED_PUBKEYS`, publish script, `gittr-muted-pubkeys.ts`) | **No** — gittr-only (builds on his **read** curation, not a duplicate of it) |

### Pushed back to hzrd149 (merged)

| Feature | Back to hzrd149? |
|--------|------------------|
| **Correct “updated” on `/status`** when a site is republished via manifest only (no new snapshot), and **keep the newest manifest** per site address | **Yes** — [PR #21](https://github.com/hzrd149/nsite-gateway/pull/21) merged May 2026 |

Implementation detail: HTML **`/status`** = all indexed manifests (operator). **`/status/manifests.json`** + gittr **`/pages`** = public “sites with a homepage” directory.

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
4. **TLS / nginx:** gittr [`infra/nsite-gateway/README.md`](https://gittr.space/npub1n2ph08n4pqz4d3jk6n2p35p2f4ldhc5g5tu7dhftfpueajf4rpxqfjhzmc/gittr?file=infra/nsite-gateway/README.md&branch=main) and `nginx-pages.gittr.space.conf.example`.

Production env (no secrets) is maintained in **gittr**:

[`gittr/infra/nsite-gateway/gittr-pages.production.env`](https://gittr.space/npub1n2ph08n4pqz4d3jk6n2p35p2f4ldhc5g5tu7dhftfpueajf4rpxqfjhzmc/gittr?file=infra/nsite-gateway/gittr-pages.production.env&branch=main)

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

hzrd149’s gateway **never publishes** mute lists; gittr’s **`publish-curation-mutelist.cjs`** publishes the operator kind `10000` list aligned with **`PUBLISHER_BLOCKLIST`** (see [Curation and blocklist](#curation-and-blocklist-hzrd149--gittr) above).

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
Changes in [arbadacarbaYK/nsite-gateway](https://gittr.space/npub1n2ph08n4pqz4d3jk6n2p35p2f4ldhc5g5tu7dhftfpueajf4rpxqfjhzmc/nsite-gateway) are distributed under the same terms.
