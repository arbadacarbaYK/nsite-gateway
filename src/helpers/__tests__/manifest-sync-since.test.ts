import { assertEquals } from "jsr:@std/assert";
import { siteManifestSyncSinceUnix } from "../manifest-sync-since.ts";

Deno.test("empty store hydrates without since", () => {
  assertEquals(siteManifestSyncSinceUnix(undefined, 2_000, 900), undefined);
});

Deno.test("overlap wins when another site is newer than a republish", () => {
  // Store latest is "now"; a gittr-docu republish 10 minutes ago must still match.
  assertEquals(siteManifestSyncSinceUnix(2_000, 2_000, 900), 1_100);
});

Deno.test("behind the overlap window still uses latest+1 to catch up", () => {
  assertEquals(siteManifestSyncSinceUnix(100, 2_000, 900), 101);
});
