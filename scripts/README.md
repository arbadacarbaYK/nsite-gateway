# Operator scripts (gittr Pages)

These scripts are for **gittr operators**, not for end users publishing sites.

## `publish-curation-mutelist.cjs`

The gateway **does not publish** kind `10000` events. It only **loads** a curator mute list from relays (and optional `CACHE_RELAYS` at `ws://localhost:4869` caches fetched events — not a publish pipeline).

Publish or update the list from a machine with Node + `nostr-tools` (e.g. gittr `ui/`):

```bash
export GITTR_PAGES_MUTE_NSEC="$(cat /path/to/.gittr-pages-mute-nsec)"  # chmod 600, never in git
export UI_ENV_LOCAL=/path/to/ui/.env.local   # NEXT_PUBLIC_PUBLISHER_BLOCKLIST
node scripts/publish-curation-mutelist.cjs
```

- Merges existing public `p` tags on relays with the blocklist (do not replace the whole list).
- Publishes the default NIP-33 list (`d=""`) so `getReplaceable(Mutelist, pubkey)` matches upstream.
- Set gateway `CURATION_USER` to the curator **hex pubkey** only (never `nsec` in `.env`).

Full curation vs blocklist: [gittr `docs/GITTR_PAGES_CURATION.md`](https://github.com/arbadacarbaYK/gittr/blob/main/docs/GITTR_PAGES_CURATION.md).
