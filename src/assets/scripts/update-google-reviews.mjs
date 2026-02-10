import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";

const BACKEND_CWD = path.resolve(process.cwd(), "backend");
const HEALTH_URL = process.env.HEALTH_URL ?? "http://localhost:5050/health";
const REVIEWS_URL = process.env.REVIEWS_URL ?? "http://localhost:5050/reviews";
const OUT_FILE =
  process.env.OUT_FILE ??
  path.resolve(process.cwd(), "src/assets/data/google-reviews.json");

function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: "inherit", shell: true, ...opts });
    p.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} ${args.join(" ")} failed with code ${code}`));
    });
  });
}

async function waitForHealthy(url, timeoutMs = 20000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const r = await fetch(url, { method: "GET" });
      if (r.ok) return;
    } catch {
      // ignore
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Backend not healthy within ${timeoutMs}ms: ${url}`);
}

async function updateReviews() {
  console.log(`🔄 Fetching reviews from ${REVIEWS_URL}`);
  const res = await fetch(REVIEWS_URL);
  if (!res.ok) throw new Error(`Backend /reviews error ${res.status}`);
  const json = await res.json();

  const wrapped = {
    ...json,
    fetchedAt: new Date().toISOString(),
  };

  await mkdir(path.dirname(OUT_FILE), { recursive: true });
  await writeFile(OUT_FILE, JSON.stringify(wrapped, null, 2), "utf-8");
  console.log(`✅ Reviews written to ${OUT_FILE}`);
}

async function main() {
  console.log("🚀 Starting backend...");
  const backend = spawn("npm", ["run", "dev"], {
    cwd: BACKEND_CWD,
    stdio: "inherit",
    shell: true,
  });

  try {
    console.log(`⏳ Waiting for backend health: ${HEALTH_URL}`);
    await waitForHealthy(HEALTH_URL);

    await updateReviews();

    console.log("🏗️ Building frontend...");
    await run("npm", ["run", "build"], { cwd: process.cwd() });

    console.log("✅ Done: backend started -> reviews updated -> frontend built");
  } finally {
    console.log("🛑 Stopping backend...");
    // Graceful stop; on Windows this still works via shell:true
    backend.kill("SIGTERM");
  }
}

main().catch((err) => {
  console.error("❌ Failed:", err);
  process.exit(1);
});
