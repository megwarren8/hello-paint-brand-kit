#!/usr/bin/env python3
"""Fail loudly when the listing pack drifts from the canonical boards.

The listing pack (listing-images/ + listing-pack.html) is a hand-synced COPY
of ~/Documents/hello-paint-listing-images. On 2026-07-30 the heroes were
rebuilt an hour after the copy was taken and nobody re-ran the sync, so the
public site served a superseded hero for a day, and the zips (both here and in
the canonical folder) kept serving it even longer because rebuilding a board
does not rebuild the zip it ships in. This checker exists so that exact thing
can never again reach a push quietly.

Checks, all byte-level (md5), none of them "looks fine":
  1. canonical zips agree with canonical loose files (the trap that started it)
  2. repo pngs/zips/video agree with canonical, no missing and no extra
  3. listing-pack.html references every file, and only files that exist
  4. no iCloud " 2.png" duplicate names on either side
  5. --live: the deployed page, every zip member, every hero and custom board
     agree with the repo (run AFTER a push, once Pages finishes deploying)

Usage:
    python3 tools/check_listing_pack_sync.py            local checks (fast)
    python3 tools/check_listing_pack_sync.py --live     also verify the site
    CHECK_FORCE_FAIL=1 ...                              self-test hook wiring

Wired as .git/hooks/pre-push (install: see tools/pre-push.hook). Exit 0 clean,
exit 1 with every finding listed.
"""
import hashlib
import io
import json
import os
import pathlib
import re
import sys
import urllib.request
import zipfile

REPO = pathlib.Path(os.environ.get("CHECK_REPO",
                                   pathlib.Path(__file__).resolve().parent.parent))
CANON = pathlib.Path(os.environ.get("CHECK_CANON",
                                    pathlib.Path.home() / "Documents/hello-paint-listing-images"))
READY = pathlib.Path(os.environ.get("CHECK_READY",
                                    pathlib.Path.home() / "Documents/hello-paint-etsy-ready"))
SITE = "https://hellopaint.megan-warren.com"
KITS = ["kiwi", "mushrooms", "fresh", "cozy", "colorful", "cappy", "citrus"]
LANES = ["hand", "ipad"]
DUP = re.compile(r" \d+\.(png|zip|mp4)$")

problems, warnings = [], []


def md5(p):
    return hashlib.md5(pathlib.Path(p).read_bytes()).hexdigest()


def tail(name):
    """hello-paint-<kit>-...-kit-05-foo.png -> 05-foo.png"""
    m = re.search(r"kit-(\d\d-[a-z-]+\.png)$", name)
    return m.group(1) if m else None


def canonical_boards(folder):
    return sorted(p for p in folder.glob("*.png")
                  if not DUP.search(p.name) and tail(p.name))


def check_dups(root, label):
    for p in sorted(root.rglob("*")):
        if DUP.search(p.name):
            problems.append(f"{label}: iCloud duplicate name: {p}")


def check_zip_against(zip_path, member_lookup, label):
    """Every png member of the zip must byte-match the file member_lookup
    returns for it. Non-png members (README) are left alone."""
    with zipfile.ZipFile(zip_path) as zf:
        for n in zf.namelist():
            if not n.endswith(".png"):
                continue
            want_file = member_lookup(n)
            if want_file is None or not pathlib.Path(want_file).exists():
                problems.append(f"{label}: {zip_path.name} member {n}: no loose file to compare")
                continue
            if hashlib.md5(zf.read(n)).hexdigest() != md5(want_file):
                problems.append(f"{label}: {zip_path.name} member {n} != {want_file}")


def check_canonical_self():
    for kit in KITS:
        for lane in LANES:
            folder = CANON / f"{kit}-{lane}"
            z = CANON / f"{kit}-{lane}-listing-images.zip"
            if not folder.is_dir() or not z.exists():
                problems.append(f"canonical: missing {folder.name} or its zip")
                continue
            loose = {tail(p.name): p for p in canonical_boards(folder)}
            check_zip_against(z, lambda n: loose.get(tail(n)), "canonical")


def check_repo_vs_canonical():
    ldir = REPO / "listing-images"
    for kit in KITS:
        for lane in LANES:
            canon = {tail(p.name): p for p in canonical_boards(CANON / f"{kit}-{lane}")}
            repo = {m.group(1): p for p in ldir.glob(f"{kit}-{lane}-*.png")
                    if (m := re.match(rf"{kit}-{lane}-(\d\d-[a-z-]+\.png)$", p.name))}
            for t in sorted(canon.keys() - repo.keys()):
                problems.append(f"repo: missing {kit}-{lane}-{t} (canonical has it)")
            for t in sorted(repo.keys() - canon.keys()):
                problems.append(f"repo: extra {kit}-{lane}-{t} (canonical retired it)")
            for t in sorted(canon.keys() & repo.keys()):
                if md5(repo[t]) != md5(canon[t]):
                    problems.append(f"repo: stale {kit}-{lane}-{t} != canonical")
            rz, cz = ldir / f"{kit}-{lane}-listing-images.zip", CANON / f"{kit}-{lane}-listing-images.zip"
            if not rz.exists():
                problems.append(f"repo: missing zip {rz.name}")
            elif cz.exists() and md5(rz) != md5(cz):
                problems.append(f"repo: zip {rz.name} != canonical zip")
    # the custom lane: different naming, one folder, a video instead of a zip
    cfolder = CANON / "custom"
    canon = {tail(p.name): p for p in canonical_boards(cfolder)}
    repo = {m.group(1): p for p in (REPO / "listing-images").glob("custom-*.png")
            if (m := re.match(r"custom-(\d\d-[a-z-]+\.png)$", p.name))}
    for t in sorted(canon.keys() - repo.keys()):
        problems.append(f"repo: missing custom-{t}")
    for t in sorted(repo.keys() - canon.keys()):
        problems.append(f"repo: extra custom-{t}")
    for t in sorted(canon.keys() & repo.keys()):
        if md5(repo[t]) != md5(canon[t]):
            problems.append(f"repo: stale custom-{t} != canonical")
    v, cv = REPO / "listing-images/custom-video.mp4", cfolder / "video.mp4"
    if v.exists() and cv.exists() and md5(v) != md5(cv):
        problems.append("repo: custom-video.mp4 != canonical video.mp4")
    # the custom-ipad lane joined the pack on 2026-08-02: hold it to the same
    # byte discipline as the custom lane
    ci = CANON / "custom-ipad"
    canon_ci = {tail(x.name): x for x in canonical_boards(ci)}
    repo_ci = {m.group(1): x for x in (REPO / "listing-images").glob("custom-ipad-*.png")
               if (m := re.match(r"custom-ipad-(\d\d-[a-z-]+\.png)$", x.name))}
    for t_ in sorted(canon_ci.keys() - repo_ci.keys()):
        problems.append(f"repo: missing custom-ipad-{t_}")
    for t_ in sorted(repo_ci.keys() - canon_ci.keys()):
        problems.append(f"repo: extra custom-ipad-{t_}")
    for t_ in sorted(canon_ci.keys() & repo_ci.keys()):
        if md5(repo_ci[t_]) != md5(canon_ci[t_]):
            problems.append(f"repo: stale custom-ipad-{t_} != canonical")


def check_page():
    html = (REPO / "listing-pack.html").read_text()
    srcs = set(re.findall(r'(?:src|href)="(listing-images/[^"]+)"', html))
    srcs |= {u.replace(f"{SITE}/", "") for u in
             re.findall(rf'href="({SITE}/listing-images/[^"]+)"', html)}
    on_disk = {f"listing-images/{p.name}" for p in (REPO / "listing-images").iterdir()
               if p.suffix in (".png", ".zip", ".mp4")}
    on_disk |= {f"listing-images/thumbs/{p.name}"
                for p in (REPO / "listing-images/thumbs").glob("*.jpg")}
    for s in sorted(srcs - on_disk):
        problems.append(f"page: references missing file {s}")
    for s in sorted(on_disk - srcs):
        problems.append(f"page: {s} is deployed but not on the page (orphan)")
    # every board must have its 400px thumb, or the grid shows a broken tile
    for p in (REPO / "listing-images").glob("*.png"):
        if not (REPO / f"listing-images/thumbs/{p.stem}.jpg").exists():
            problems.append(f"page: no thumb for {p.name}")
    # structure: every kit lane must sit INSIDE .wrap and BEFORE the foot.
    # On 2026-07-31 three lanes sat after </div> and the footer, rendering
    # edge-to-edge below the copyright line, and the byte checks all passed.
    wrap_open = html.find('<div class="wrap"')
    foot = html.find('<p class="foot"')
    sections = [m.start() for m in re.finditer(r'<section class="kit"', html)]
    if wrap_open < 0 or foot < 0:
        problems.append("page: wrap or foot marker missing")
    else:
        for s in sections:
            if not (wrap_open < s < foot):
                problems.append("page: a kit lane sits outside .wrap or after the foot")
        if len(sections) < 8:
            problems.append(f"page: only {len(sections)} kit lanes, expected at least 8")


def check_live():
    def fetch(path):
        # Cloudflare 403s urllib's default Python-urllib agent; curl passes.
        req = urllib.request.Request(f"{SITE}/{path}",
                                     headers={"User-Agent": "listing-pack-gate/1.0"})
        with urllib.request.urlopen(req, timeout=30) as r:
            return r.read()

    page = fetch("listing-pack").decode("utf-8", "ignore")
    local = (REPO / "listing-pack.html").read_text()
    # compare structure to the repo instead of hardcoding counts that rot
    live_kits = re.findall(r'<section class="kit" id="([a-z]+)"', page)
    local_kits = re.findall(r'<section class="kit" id="([a-z]+)"', local)
    if live_kits != local_kits:
        problems.append(f"live: kit lanes {live_kits} != repo {local_kits}")
    live_tiles = len(re.findall(r'class="tile"', page))
    local_tiles = len(re.findall(r'class="tile"', local))
    if live_tiles != local_tiles:
        problems.append(f"live: {live_tiles} tiles != repo {local_tiles}")
    targets = sorted((REPO / "listing-images").glob("*-01-hero.png")) \
        + sorted((REPO / "listing-images").glob("custom-*.png"))
    for p in targets:
        if hashlib.md5(fetch(f"listing-images/{p.name}")).hexdigest() != md5(p):
            problems.append(f"live: {p.name} differs from the repo")
    for z in sorted((REPO / "listing-images").glob("*.zip")):
        blob = fetch(f"listing-images/{z.name}")
        if hashlib.md5(blob).hexdigest() != md5(z):
            problems.append(f"live: zip {z.name} differs from the repo")


def main():
    if os.environ.get("CHECK_FORCE_FAIL"):
        print("listing-pack gate: CHECK_FORCE_FAIL is set (hook self-test)")
        return 1
    check_dups(REPO / "listing-images", "repo")
    # The canonical folders and the etsy-ready upload folders were never swept
    # for iCloud conflict copies, only the repo was. On 2026-08-02 iCloud left
    # 145 of them across those two trees while boards were being rewritten:
    # "07-print-it-and-go 2.png" would have uploaded as a duplicate photo, in
    # filename order, right in the middle of the designed sequence.
    check_dups(CANON, "canonical")
    check_dups(READY, "etsy-ready")
    check_canonical_self()
    check_repo_vs_canonical()
    check_page()
    if "--live" in sys.argv:
        check_live()
    for w in warnings:
        print(w)
    if problems:
        print(f"listing-pack gate: {len(problems)} problem(s):")
        for p in problems:
            print("  " + p)
        return 1
    scope = "local + live" if "--live" in sys.argv else "local"
    print(f"listing-pack gate: clean ({scope})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
