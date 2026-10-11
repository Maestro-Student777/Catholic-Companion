"""Keep a small, attributed index of USCCB daily-reading links.

The reading text stays on the USCCB site. The public JSON contains only
dates, titles, canonical links, and a fetch timestamp.
"""

import html
import json
import re
import sys
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse

FEED = "https://bible.usccb.org/readings.rss"
DEST = Path(__file__).resolve().parents[1] / "liturgy" / "days.json"
READING_PATH = re.compile(r"^/bible/readings/(\d{2})(\d{2})(\d{2})\.cfm$")


def parse_feed(data: bytes) -> dict:
    root = ET.fromstring(data)
    found = {}
    for item in root.findall(".//item"):
        link = (item.findtext("link") or "").strip()
        parsed = urlparse(link)
        if parsed.scheme != "https" or parsed.netloc != "bible.usccb.org":
            continue
        match = READING_PATH.fullmatch(parsed.path)
        if not match:
            continue
        mm, dd, yy = match.groups()
        try:
            day = datetime(2000 + int(yy), int(mm), int(dd)).date().isoformat()
        except ValueError:
            continue
        title = re.sub(r"<[^>]*>", "", html.unescape(item.findtext("title") or ""))
        title = " ".join(title.split())[:160]
        if not title:
            continue
        found[day] = {"date": day, "title": title, "url": f"https://bible.usccb.org{parsed.path}"}
    if not found:
        raise ValueError("USCCB feed contained no validated reading links; existing data stays unchanged")
    return {"source": FEED, "updated_utc": datetime.now(timezone.utc).isoformat(timespec="seconds"),
            "days": [found[day] for day in sorted(found)]}


def main() -> None:
    request = urllib.request.Request(FEED, headers={"User-Agent": "CatholicCompanionDailyLinks/1.0 (+https://github.com/Maestro-Student777/Catholic-Companion)"})
    with urllib.request.urlopen(request, timeout=25) as response:
        payload = parse_feed(response.read(2_000_000))
    DEST.parent.mkdir(parents=True, exist_ok=True)
    old = json.loads(DEST.read_text()) if DEST.exists() else None
    # Avoid a new commit when the feed has not changed.
    if old and old.get("days") == payload["days"]:
        print("Daily reading metadata is current")
        return
    DEST.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n")
    print(f"Indexed {len(payload['days'])} dated USCCB reading links")


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"Daily index not updated: {exc}", file=sys.stderr)
        sys.exit(1)
