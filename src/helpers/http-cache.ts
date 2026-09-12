export function createStrongEtag(value: string): string {
  return `"${value}"`;
}

/**
 * Site HTML/blobs are content-addressed (ETag = sha256). Browsers must
 * revalidate so a new kind 35128 is not hidden behind a 1-hour max-age.
 */
export const SITE_HTML_CACHE_CONTROL = "public, max-age=0, must-revalidate";

function normalizeEtag(value: string): string {
  const trimmed = value.trim();
  return trimmed.startsWith("W/") ? trimmed.slice(2).trim() : trimmed;
}

export function hasMatchingIfNoneMatch(
  headers: Pick<Headers, "get">,
  etag: string,
): boolean {
  const ifNoneMatch = headers.get("if-none-match");
  if (!ifNoneMatch) return false;
  if (headers.get("range")) return false;
  if (ifNoneMatch.trim() === "*") return true;

  const expected = normalizeEtag(etag);
  return ifNoneMatch.split(",").some((candidate) => {
    return normalizeEtag(candidate) === expected;
  });
}

export function createWeakFileEtag(stat: Deno.FileInfo): string | undefined {
  if (!stat.mtime) return undefined;
  return `W/"${stat.size.toString(16)}-${stat.mtime.getTime().toString(16)}"`;
}
