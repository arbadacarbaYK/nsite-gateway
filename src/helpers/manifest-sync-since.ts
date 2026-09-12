/**
 * Periodic REQ `since` for site manifests.
 *
 * Using only `latestCreatedAt + 1` (newest event of *any* site) skips a
 * replaceable republish whose `created_at` is older than some other author's
 * latest row. Overlap re-fetches a recent window so gittr-docu updates are
 * not stranded behind a busier directory.
 */
export function siteManifestSyncSinceUnix(
  latestCreatedAt: number | undefined,
  nowUnix: number,
  overlapSeconds = 15 * 60,
): number | undefined {
  if (latestCreatedAt === undefined) return undefined;
  const overlap = Number.isFinite(overlapSeconds) && overlapSeconds > 0
    ? overlapSeconds
    : 0;
  const floor = Math.max(0, nowUnix - overlap);
  return Math.min(latestCreatedAt + 1, floor);
}
