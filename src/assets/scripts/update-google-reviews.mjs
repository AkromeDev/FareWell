import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

/**
 * Fetches Google reviews directly from the Google Places API (New) and writes
 * them to src/assets/data/google-reviews.json, which GoogleReviewsComponent
 * imports at build time. No backend / running server required.
 *
 * Usage:
 *   1. Put GOOGLE_MAPS_API_KEY=... in a .env file at the project root
 *      (gitignored) or export it in your shell. PLACE_ID is optional.
 *   2. npm run update:google-reviews
 *   3. npm run build  (so the refreshed JSON is bundled into the site)
 */

// Load .env from the project root if present (Node 20.12+). Ignore if missing.
try {
  process.loadEnvFile();
} catch {
  // no .env file -> rely on environment variables already set in the shell
}

const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const PLACE_ID = process.env.PLACE_ID ?? "ChIJZRTXOqdXn0cR5C9Q7j0xvPw";

const OUT_FILE =
  process.env.OUT_FILE ??
  path.resolve(process.cwd(), "src/assets/data/google-reviews.json");

if (!API_KEY) {
  console.error(
    "❌ Missing GOOGLE_MAPS_API_KEY. Add it to a .env file at the project root " +
      "or export it in your shell."
  );
  process.exit(1);
}

async function fetchReviews() {
  const url = new URL(`https://places.googleapis.com/v1/places/${PLACE_ID}`);
  url.searchParams.set("languageCode", "de");
  url.searchParams.set("regionCode", "DE");

  console.log(`🔄 Fetching reviews for place ${PLACE_ID} ...`);

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "X-Goog-Api-Key": API_KEY,
      "X-Goog-FieldMask": "id,displayName,rating,userRatingCount,reviews",
    },
  });

  if (!res.ok) {
    const details = await res.text();
    throw new Error(`Google Places API error ${res.status}: ${details}`);
  }

  return res.json();
}

async function main() {
  const data = await fetchReviews();

  // Shape matches what GoogleReviewsComponent expects ({ source, data, fetchedAt }).
  const payload = {
    source: "google",
    data,
    fetchedAt: new Date().toISOString(),
  };

  await mkdir(path.dirname(OUT_FILE), { recursive: true });
  await writeFile(OUT_FILE, JSON.stringify(payload, null, 2) + "\n", "utf-8");

  const count = data?.reviews?.length ?? 0;
  console.log(`✅ Wrote ${count} reviews to ${OUT_FILE}`);
  console.log("ℹ️  Run `npm run build` to bundle the refreshed reviews.");
}

main().catch((err) => {
  console.error("❌ Failed:", err?.message ?? err);
  process.exit(1);
});
