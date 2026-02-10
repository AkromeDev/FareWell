import express, { type Request, type Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import { promises as fs } from "node:fs";
import path from "node:path";

dotenv.config();

const app = express();

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const PLACE_ID = process.env.PLACE_ID;

if (!GOOGLE_MAPS_API_KEY) throw new Error("Missing GOOGLE_MAPS_API_KEY in backend/.env");
if (!PLACE_ID) throw new Error("Missing PLACE_ID in backend/.env");

/**
 * ✅ CORS allowlist (Frontend darf dein Backend aufrufen)
 * - Local dev: localhost
 * - Prod: farewell.salon (+ optional www)
 */
const allowedOrigins = new Set<string>([
  "http://localhost:4200",
  "http://localhost:5173",
  "https://farewell.salon",
  "https://www.farewell.salon",
]);

app.use(
  cors({
    origin(origin, cb) {
      // Requests ohne Origin (z.B. curl, server-to-server) erlauben wir
      if (!origin) return cb(null, true);
      return allowedOrigins.has(origin)
        ? cb(null, true)
        : cb(new Error(`CORS blocked for origin: ${origin}`));
    },
  })
);

app.use(express.json());

/**
 * ✅ Rate limit (schützt dich vor Spam)
 * - 60 Requests / 10 Minuten pro IP (für MVP völlig ausreichend)
 */
app.use(
  rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

/**
 * ✅ Weekly persistent cache (max 1 refresh / 7 days)
 * - Persists to disk so it survives restarts/redeploys
 */
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // ✅ 7 days

const CACHE_DIR = path.resolve(process.cwd(), "cache");
const CACHE_FILE = path.join(CACHE_DIR, "google-reviews.json");

type FileCache = {
  cachedAt: number;
  payload: unknown;
};

let cachedPayload: unknown | null = null;
let cacheExpiresAt = 0;

async function loadCacheFromDisk(): Promise<void> {
  try {
    const raw = await fs.readFile(CACHE_FILE, "utf-8");
    const parsed = JSON.parse(raw) as FileCache;

    cachedPayload = parsed.payload;
    cacheExpiresAt = parsed.cachedAt + CACHE_TTL_MS;
  } catch {
    // no cache yet -> ignore
  }
}

async function saveCacheToDisk(payload: unknown): Promise<void> {
  await fs.mkdir(CACHE_DIR, { recursive: true });
  const data: FileCache = { cachedAt: Date.now(), payload };
  await fs.writeFile(CACHE_FILE, JSON.stringify(data), "utf-8");
}

// ✅ load cache on boot
void loadCacheFromDisk();

app.get("/health", (_req: Request, res: Response) => {
  res.json({ ok: true });
});

app.get("/reviews", async (_req: Request, res: Response) => {
  try {
    const now = Date.now();

    // ✅ serve cache if still valid
    if (cachedPayload && now < cacheExpiresAt) {
      return res.json({ source: "cache", data: cachedPayload });
    }

    const url = new URL("https://places.googleapis.com/v1/places/" + PLACE_ID);
    url.searchParams.set("languageCode", "de");
    url.searchParams.set("regionCode", "DE");

    const resp = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "X-Goog-Api-Key": GOOGLE_MAPS_API_KEY,
        "X-Goog-FieldMask": "id,displayName,rating,userRatingCount,reviews",
      },
    });

    if (!resp.ok) {
      const text = await resp.text();
      return res.status(resp.status).json({
        error: "Google Places API error",
        status: resp.status,
        details: text,
      });
    }

    const json = await resp.json();

    // ✅ update cache + persist (so we refresh at most weekly)
    cachedPayload = json;
    cacheExpiresAt = now + CACHE_TTL_MS;
    await saveCacheToDisk(json);

    return res.json({ source: "google", data: json });
  } catch (err) {
    return res.status(500).json({
      error: "Server error",
      details: err instanceof Error ? err.message : String(err),
    });
  }
});

const port = Number(process.env.PORT ?? 5050);
app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
