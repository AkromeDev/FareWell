#!/usr/bin/env python3
"""A new version waits at least seven days before it is accepted: releases that
turn out to be infected are usually found and pulled within days. Reads one or
more package-lock.json files, asks the npm registry when each locked version
was published, and fails when one is younger than the wait.

    python3 -I tools/package-age.py package-lock.json
    python3 -I tools/package-age.py package-lock.json --days 7 --today 2026-11-13

Publish dates are cached in tools/.package-age-cache.json (a date never
changes once published), so a second run asks only for what is new.
Standard library only.
"""
import argparse
import concurrent.futures
import datetime as dt
import json
import sys
import urllib.parse
import urllib.request
from pathlib import Path

REGISTRY = "https://registry.npmjs.org/"
UA = "package-age-check"


def locked(lock_path):
    """Every registry package in a lockfile (version 2 or 3), as (name, version)."""
    data = json.loads(Path(lock_path).read_text())
    out = set()
    for key, entry in data.get("packages", {}).items():
        if not key or entry.get("link") or "version" not in entry:
            continue
        if not entry.get("resolved", "").startswith(REGISTRY):
            # A git, tarball or other-registry package has no publish date here to check.
            raise SystemExit(f"{lock_path}: {key} is not from the npm registry ({entry.get('resolved')}). Refused.")
        name = entry.get("name") or key.rsplit("node_modules/", 1)[1]
        out.add((name, entry["version"]))
    return out


def fetch_times(name):
    url = REGISTRY + urllib.parse.quote(name, safe="@")
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.load(r).get("time", {})


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("lockfiles", nargs="+")
    ap.add_argument("--days", type=int, default=7)
    ap.add_argument("--today", default=dt.date.today().isoformat())
    args = ap.parse_args()
    cache_path = Path(__file__).with_name(".package-age-cache.json")
    cache = json.loads(cache_path.read_text()) if cache_path.exists() else {}
    today = dt.date.fromisoformat(args.today)

    wanted = set()
    for lock in args.lockfiles:
        wanted |= locked(lock)
    missing = sorted({name for name, ver in wanted if f"{name}@{ver}" not in cache})

    failed = []
    try:
        with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
            for name, result in zip(missing, pool.map(lambda n: _safe(fetch_times, n), missing)):
                if isinstance(result, Exception):
                    failed.append((name, result))
                    continue
                for ver in (v for n, v in wanted if n == name):
                    if ver in result:
                        cache[f"{name}@{ver}"] = result[ver][:10]
    finally:
        cache_path.write_text(json.dumps(cache, indent=1, sort_keys=True) + "\n")

    rows, young, unknown = [], [], []
    for name, ver in wanted:
        when = cache.get(f"{name}@{ver}")
        if when is None:
            unknown.append((name, ver))
            continue
        age = (today - dt.date.fromisoformat(when)).days
        rows.append((age, name, ver, when))
        if age < args.days:
            young.append((name, ver, when, age))
    rows.sort()
    print(f"{len(rows)} registry packages in {', '.join(args.lockfiles)}; youngest:")
    for age, name, ver, when in rows[:8]:
        print(f"  {name} {ver}  published {when}  ({age} days)")
    for name, err in failed:
        print(f"  could not ask the registry about {name}: {err}")
    if unknown:
        print(f"\nREFUSED: {len(unknown)} with no known publish date:")
        for name, ver in sorted(unknown):
            print(f"  {name} {ver}")
    if young:
        print(f"\nREFUSED: {len(young)} younger than {args.days} days:")
        for name, ver, when, age in sorted(young):
            print(f"  {name} {ver}  published {when}  ({age} days); lock an older one")
    if unknown or young:
        sys.exit(1)
    print(f"\nok: every version is at least {args.days} days old on {today}")


def _safe(fn, arg):
    try:
        return fn(arg)
    except Exception as e:  # reported per package, never fatal for the others
        return e


if __name__ == "__main__":
    main()
