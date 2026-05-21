# gittr production fork

This repository is **arbadacarbaYK’s fork** of [hzrd149/nsite-gateway](https://github.com/hzrd149/nsite-gateway), used for **pages.gittr.space**.

- **`master`** = what we run in production (hzrd149 **v3.6.2** + gittr features below).
- We do **not** open PRs to upstream with gittr-specific code (`GITTR_SYNC`, blocklist publish script, etc.).
- To pull generic fixes from hzrd149 later: merge or rebase their release tags into `master`, then re-apply gittr-only files if needed.

## gittr additions on top of v3.6.2

| Feature | Purpose |
|---------|---------|
| `GET /status/manifests.json` | Machine-readable directory for gittr `/pages` |
| `hasIndexHtml` | Only list sites with a real homepage in the JSON feed |
| `GITTR_SYNC_MUTED_PUBKEYS` | Env backup for publisher blocklist until relay mute list is live |
| `scripts/publish-curation-mutelist.cjs` | Publish/update curator NIP-51 mute list (merge `p` tags) |

See `scripts/README.md` and [gittr docs](https://github.com/arbadacarbaYK/gittr/blob/main/docs/GITTR_PAGES_CURATION.md).

## Deploy

Built by [gittr](https://github.com/arbadacarbaYK/gittr) `scripts/deploy-nsite-gateway.sh` (syncs this repo into the gateway Docker image). Secrets stay on the server (`.env`, never committed).
