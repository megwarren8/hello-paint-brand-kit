"""Make listing-pack.html's tile grids match what is actually deployed.

Why this exists (2026-08-07): the grids were hand-written HTML. Every new board
needed a tile typed in by hand, and every time one was forgotten
check_listing_pack_sync.py reported it as an orphan: deployed, paying for
bandwidth, invisible on the page. It happened to custom-17 on 2026-08-06 and to
all eight `15-your-palette-your-brush` boards on 2026-08-07.

Megan is adding premade kits and custom subject lanes, so hand-typed tiles were
going to keep breaking. This rebuilds each lane's grid from the PNGs in
listing-images/, in filename order, which is the order Etsy shows them.

It does NOT invent sections. A brand new kit still needs its <section> once,
with its own heading and stat line, because those carry real counts. After that
its boards look after themselves.

    python3 tools/sync_listing_pack.py [--check]
"""
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGE = ROOT / "listing-pack.html"
IMAGES = ROOT / "listing-images"

# section id -> the filename prefix its lanes use, per lane heading
# The brand kit stores boards under SHORT names (custom-ipad-01-hero.png), not
# the long etsy slugs propagate_boards.py writes into the upload folders. Get
# this wrong and boards_for() finds nothing, the lane is silently skipped, and
# the gate keeps reporting orphans while this script reports success.
LANES = {
    "custom": [(None, "custom-")],
    "custom-ipad": [(None, "custom-ipad-")],
    "palette": [(None, "palette-")],
}
# Glob, do not list. A hardcoded seven would leave a new kit's boards untiled,
# which is exactly the orphaning this script exists to stop.
_KITS = sorted({p.name.split("-hand-")[0] for p in IMAGES.glob("*-hand-01-hero.png")})
for kit in _KITS:
    LANES[kit] = [("paper kit", f"{kit}-hand-"), ("ipad / procreate kit", f"{kit}-ipad-")]


def tile(name, prefix):
    """One <a class="tile">, matching the shape the page already uses."""
    stem = name[:-4]
    label = stem[len(prefix):].replace("-", " ")
    return (f'<a class="tile" href="listing-images/{stem}.png" target="_blank">'
            f'<img src="listing-images/thumbs/{stem}.jpg" '
            f'alt="{label.replace("  ", " ")}" loading="lazy">'
            f'<b>{label.replace("-", " ")}</b></a>')


def boards_for(prefix):
    names = sorted(p.name for p in IMAGES.glob(f"{prefix}*.png"))
    # a lane's own boards only: kiwi-hand- must not swallow kiwi-hand-video etc
    return [n for n in names if re.match(rf"^{re.escape(prefix)}\d\d-", n)]


def main(check_only):
    src = PAGE.read_text()
    out = src
    changed = []
    for sec, lanes in LANES.items():
        m = re.search(rf'<section class="kit" id="{re.escape(sec)}">(.*?)</section>', out, re.S)
        if not m:
            print(f"  no section for {sec}, skipping (add it once by hand)")
            continue
        body = m.group(1)
        newbody = body
        # each lane is <h3>NAME &middot; N boards ...</h3><div class="grid">TILES</div>
        for name, prefix in lanes:
            names = boards_for(prefix)
            if not names:
                continue
            pat = (rf'(<h3>{re.escape(name)}\s*&middot;\s*)(\d+)( boards.*?<div class="grid">)(.*?)(</div>)'
                   if name else r'(<h3>[^<]*?&middot;\s*)(\d+)( boards.*?<div class="grid">)(.*?)(</div>)')
            lm = re.search(pat, newbody, re.S)
            if not lm:
                print(f"  {sec}/{name}: no lane heading matched, left alone")
                continue
            tiles = "".join(tile(n, prefix) for n in names)
            if lm.group(4) == tiles and lm.group(2) == str(len(names)):
                continue
            changed.append(f"{sec}/{name}: {lm.group(2)} -> {len(names)} boards")
            newbody = (newbody[:lm.start()] + lm.group(1) + str(len(names)) + lm.group(3)
                       + tiles + lm.group(5) + newbody[lm.end():])
        if newbody != body:
            out = out[:m.start(1)] + newbody + out[m.end(1):]
    if not changed:
        print("listing pack: tiles already match what is deployed")
        return 0
    for c in changed:
        print("  " + c)
    if check_only:
        print(f"{len(changed)} lane(s) STALE")
        return 1
    PAGE.write_text(out)
    print(f"rewrote {len(changed)} lane grid(s)")
    return 0


if __name__ == "__main__":
    sys.exit(main("--check" in sys.argv))
