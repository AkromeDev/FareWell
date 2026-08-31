#!/usr/bin/env node
/**
 * Keeps the shared Putzplan database awake, and shouts when it isn't.
 *
 * Supabase pauses free-plan projects after 7 days without database activity,
 * and a paused project's hostname stops resolving entirely — at which point
 * the unlock gate rejects a perfectly correct passphrase and the whole team
 * is locked out of the task pages (see SUPABASE-SETUP.md §6b). One cheap
 * REST read resets that timer, so this runs on a schedule from CI.
 *
 * It doubles as a health check. The request is made with the PUBLIC anon key
 * against the RLS-protected `tasks` table, so the one correct answer is
 * `200 []`: the project is awake, the anon key is still valid, and RLS is
 * still refusing anonymous readers (the acceptance criterion in
 * SUPABASE-SETUP.md §7). Anything else exits non-zero so CI mails someone,
 * instead of the failure surfacing weeks later as a locked-out salon.
 *
 * Credentials are read from the app's own config file rather than duplicated
 * here: recreating the project must never leave this pinging a dead one.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const CONFIG_PATH = join(
  dirname(dirname(fileURLToPath(import.meta.url))),
  'src/components/pages/tasks/config/supabase.config.ts',
);

/** Network blips must not page anyone; a paused project fails every attempt. */
const ATTEMPTS = 3;
const RETRY_DELAY_MS = 10_000;
const TIMEOUT_MS = 20_000;

/** Pull a single-quoted string literal for `key` out of the config source. */
function readSetting(source, key) {
  // `\s*` spans the newline the formatter puts after `anonKey:`.
  const match = new RegExp(`\\b${key}:\\s*'([^']*)'`).exec(source);
  return match ? match[1] : '';
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function fail(message) {
  console.error(`✗ ${message}`);
  process.exit(1);
}

const source = readFileSync(CONFIG_PATH, 'utf8');
const url = readSetting(source, 'url');
const anonKey = readSetting(source, 'anonKey');
const table = readSetting(source, 'table') || 'tasks';

// Emptying url/anonKey is the documented switch back to localStorage-only
// (SUPABASE-SETUP.md §7). That is a deliberate state, not a failure.
if (!url || !anonKey) {
  console.log('· Supabase is disabled in supabase.config.ts — nothing to keep warm.');
  process.exit(0);
}

const endpoint = `${url}/rest/v1/${encodeURIComponent(table)}?select=id&limit=1`;
const headers = { apikey: anonKey, Authorization: `Bearer ${anonKey}` };

let lastNetworkError = null;

for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
  let response;
  try {
    response = await fetch(endpoint, { headers, signal: AbortSignal.timeout(TIMEOUT_MS) });
  } catch (err) {
    // DNS failure is the signature of a paused or deleted project.
    lastNetworkError = err;
    console.warn(`· attempt ${attempt}/${ATTEMPTS} could not reach ${url}: ${err.message}`);
    if (attempt < ATTEMPTS) await sleep(RETRY_DELAY_MS);
    continue;
  }

  const body = (await response.text()).trim();

  if (response.status === 200) {
    if (body === '[]') {
      console.log(`✓ ${url} is awake; anon still reads nothing (RLS intact).`);
      process.exit(0);
    }
    fail(
      `RLS REGRESSION: the anon key read data from "${table}". Anonymous readers ` +
        `must get []. Check the table's policies immediately.\n  body: ${body.slice(0, 300)}`,
    );
  }

  if (response.status === 401 || response.status === 403) {
    fail(
      `the anon key was rejected (HTTP ${response.status}). The project is up, but the ` +
        `key in supabase.config.ts is stale — the app cannot sign in either.\n  body: ${body.slice(0, 300)}`,
    );
  }

  // 5xx (including the 540 a paused project can return) may be transient.
  if (response.status >= 500 && attempt < ATTEMPTS) {
    console.warn(`· attempt ${attempt}/${ATTEMPTS} got HTTP ${response.status}; retrying`);
    await sleep(RETRY_DELAY_MS);
    continue;
  }

  fail(`unexpected HTTP ${response.status} from ${url}\n  body: ${body.slice(0, 300)}`);
}

fail(
  `${url} is unreachable after ${ATTEMPTS} attempts (${lastNetworkError?.message}).\n` +
    '  A hostname that does not resolve means the project is PAUSED or DELETED.\n' +
    '  Fix: supabase.com → the project → Restore project. One click restores the\n' +
    '  data, but only within 90 days of the pause. See SUPABASE-SETUP.md §6b.',
);
