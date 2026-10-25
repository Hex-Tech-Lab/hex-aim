#!/usr/bin/env python3
"""CER scorer for the RICO transcription bake-off (KITAB-Bench metric).
CER = Levenshtein(hyp, ref) / len(ref) over NFC-normalized text, Arabic diacritics
(tashkeel + tatweel) stripped, Arabic-Indic digits mapped to ASCII, whitespace squeezed.

Usage:
  python3 cer.py                     # self-test
  python3 cer.py eval.json           # {"file": {"ref": "...", "hyp": "...", "engine": "..."}} -> CER table
Eval file may carry multiple engines per file: {"file": {"ref": "...", "hyp": {...}}}.
"""
import json, re, sys, unicodedata

AR_DIAC = re.compile(r"[\u064B-\u0652\u0670\u0640]")
AR_DIGITS = str.maketrans("٠١٢٣٤٥٦٧٨٩", "0123456789")

def norm(t, strip_diacritics=True):
    if not t: return ""
    t = unicodedata.normalize("NFC", str(t))
    if strip_diacritics: t = AR_DIAC.sub("", t)
    t = t.translate(AR_DIGITS)
    return re.sub(r"\s+", " ", t).strip()

def lev(a, b):
    if len(a) < len(b): a, b = b, a
    prev = list(range(len(b) + 1))
    for i, ca in enumerate(a, 1):
        cur = [i]
        for j, cb in enumerate(b, 1):
            cur.append(min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (ca != cb)))
        prev = cur
    return prev[-1]

def cer(ref, hyp):
    r, h = norm(ref), norm(hyp)
    if not r: return None
    return lev(h, r) / len(r)

def table(data, title):
    rows = []
    for f, d in data.items():
        hyps = d["hyp"] if isinstance(d.get("hyp"), dict) else {d.get("engine", "hyp"): d.get("hyp", "")}
        row = {"file": f, "ref_len": len(norm(d.get("ref", "")))}
        for eng, h in hyps.items():
            row[eng] = cer(d.get("ref", ""), h)
        rows.append(row)
    engines = [k for k in rows[0] if k not in ("file", "ref_len")] if rows else []
    print(f"\n=== CER table{(' - ' + title) if title else ''} (lower = better; KITAB-Bench baselines: Gemini 13.0%, GPT-4o 31%, Qwen-2.5 49.2%, EasyOCR 58%, Tesseract 54%)")
    hdr = f"{'file':44} {'ref#':>5} " + " ".join(f"{e[:16]:>17}" for e in engines)
    print(hdr); print("-" * len(hdr))
    per = {e: [] for e in engines}
    for r in rows:
        cells = " ".join((f"{r[e]*100:16.1f}%" if r.get(e) is not None else f"{'-':>17}") for e in engines)
        print(f"{r['file'][:44]:44} {r['ref_len']:5} {cells}")
        for e in engines:
            if r.get(e) is not None: per[e].append(r[e])
    print("-" * len(hdr))
    for e in engines:
        if per[e]: print(f"MEAN CER {e}: {sum(per[e])/len(per[e])*100:.1f}%  over {len(per[e])} file(s)")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        table(json.load(open(sys.argv[1])), sys.argv[1])
        sys.exit(0)
    cases = [
        ("identical", "مرحبا بالعالم", "مرحبا بالعالم", 0.0),
        ("one sub of 5", "ABCDE", "ABXDE", 0.2),
        ("diacritics ignored", "مُحَمَّد", "محمد", 0.0),
        ("arabic digits mapped", "سنوات ١٩٥٠", "سنوات 1950", 0.0),
        ("empty hyp", "ABCDEFGH", "", 1.0),
    ]
    ok = True
    for name, ref, hyp, want in cases:
        got = cer(ref, hyp)
        good = got is not None and abs(got - want) < 1e-9
        ok &= good
        print(f"{'PASS' if good else 'FAIL'} {name}: cer={got} want={want}")
    sys.exit(0 if ok else 1)
