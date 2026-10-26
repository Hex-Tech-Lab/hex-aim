import os
import subprocess
import requests

PROJECT_ROOT = "/home/kellyb_dev/projects/hex-aim"
RENDER_DIR = os.path.join(PROJECT_ROOT, ".rendered_sprint_pages")
os.makedirs(RENDER_DIR, exist_ok=True)

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Morning Science Breakfast Power-Up - Year 4 Midterm Q&A</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');

  @page {
    size: A4 portrait;
    margin: 10mm 12mm;
    @bottom-right {
      content: counter(page);
    }
  }

  * {
    box-sizing: border-box;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  body {
    font-family: 'Nunito', system-ui, -apple-system, sans-serif;
    color: #0f172a;
    margin: 0;
    padding: 0;
    font-size: 10pt;
    line-height: 1.45;
    background-color: #ffffff;
  }

  .page {
    page-break-after: always;
    height: 275mm;
    max-height: 275mm;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 2mm 0;
  }

  .page:last-child {
    page-break-after: avoid;
  }

  /* Header */
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2.5px solid #2563eb;
    padding-bottom: 5px;
    margin-bottom: 6px;
    gap: 12px;
  }

  .header-left {
    flex: 1 1 auto;
    min-width: 0;
  }

  .header-left h1 {
    font-size: 13pt;
    font-weight: 900;
    color: #1e3a8a;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;
    white-space: nowrap;
  }

  .header-left .subtitle {
    font-size: 8.8pt;
    color: #64748b;
    font-weight: 700;
  }

  .badge {
    flex: 0 0 auto !important;
    white-space: nowrap !important;
    font-size: 9.5pt;
    font-weight: 800;
    color: #1e40af;
    background: #eff6ff;
    padding: 5px 12px;
    border-radius: 8px;
    border: 1.5px solid #bfdbfe;
  }

  /* Cards */
  .card {
    background: #ffffff;
    border: 1.5px solid #cbd5e1;
    border-radius: 9px;
    padding: 8px 12px;
    margin-bottom: 6px;
  }

  .card-header {
    font-size: 10.5pt;
    font-weight: 900;
    color: #1e3a8a;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 4px;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  /* Q&A Item Grid */
  .qa-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 5px 12px;
  }

  .qa-item {
    font-size: 9.3pt;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 4px 8px;
  }

  .qa-q {
    font-weight: 700;
    color: #334155;
  }

  .qa-a {
    font-weight: 900;
    color: #047857;
    margin-top: 1px;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .qa-a::before {
    content: "➔";
    color: #059669;
  }

  /* Antagonistic Arm 2-Column */
  .arm-columns {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-top: 4px;
  }

  .arm-box {
    border-radius: 7px;
    padding: 7px 10px;
    font-size: 9.3pt;
  }

  .arm-box.flexion {
    background: #f0fdf4;
    border: 1.5px solid #86efac;
  }

  .arm-box.extension {
    background: #eff6ff;
    border: 1.5px solid #93c5fd;
  }

  .arm-box-title {
    font-weight: 900;
    margin-bottom: 4px;
    font-size: 9.8pt;
  }

  /* Golden Secret Callout */
  .golden-box {
    background: #fffbeb;
    border-left: 4px solid #f59e0b;
    border-radius: 6px;
    padding: 6px 10px;
    font-size: 9.2pt;
    color: #92400e;
    margin-bottom: 6px;
  }

  /* Table styling */
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 9pt;
    margin-top: 3px;
  }

  th, td {
    padding: 4px 7px;
    text-align: left;
    border: 1px solid #cbd5e1;
  }

  th {
    background: #1e3a8a;
    color: #ffffff;
    font-weight: 800;
    font-size: 8.8pt;
  }

  tr:nth-child(even) td {
    background: #f8fafc;
  }

  /* Footer */
  .footer {
    display: flex;
    justify-content: space-between;
    font-size: 8.5pt;
    color: #64748b;
    border-top: 1.5px solid #cbd5e1;
    padding-top: 4px;
    margin-top: 4px;
  }
</style>
</head>
<body>

<!-- PAGE 1: VOCABULARY, BIOMECHANICS & SKELETON ANATOMY -->
<div class="page">
  <div class="header">
    <div class="header-left">
      <h1>🌅 Morning Science Breakfast Power-Up</h1>
      <div class="subtitle">Quick-Fire Midterm Q&amp;A • Living Things (Units 1.1 - 1.5) • Asten Y4</div>
    </div>
    <div class="badge">BREAKFAST REVISION • PAGE 1 OF 2</div>
  </div>

  <div class="golden-box">
    <strong>⚡ Breakfast Rule for Lara &amp; Maya:</strong> Read the question out loud, say the answer from memory, then check the green arrow! You've got this!
  </div>

  <!-- 1. ESSENTIAL SCIENTIFIC VOCABULARY -->
  <div class="card">
    <div class="card-header">1. Key Scientific Vocabulary (Exact Definitions)</div>
    <div class="qa-grid">
      <div class="qa-item">
        <div class="qa-q">a. A frame of bone supporting the body:</div>
        <div class="qa-a">Skeleton</div>
      </div>
      <div class="qa-item">
        <div class="qa-q">b. The hard protective bones of the head:</div>
        <div class="qa-a">Skull</div>
      </div>
      <div class="qa-item">
        <div class="qa-q">c. Something showing how a thing works:</div>
        <div class="qa-a">Model</div>
      </div>
      <div class="qa-item">
        <div class="qa-q">d. The vital parts inside our bodies:</div>
        <div class="qa-a">Organs</div>
      </div>
      <div class="qa-item">
        <div class="qa-q">e. Animals with NO backbone:</div>
        <div class="qa-a">Invertebrates</div>
      </div>
      <div class="qa-item">
        <div class="qa-q">f. Body parts that contract to move bones:</div>
        <div class="qa-a">Muscles</div>
      </div>
      <div class="qa-item">
        <div class="qa-q">g. Hard outer shell on the outside of body:</div>
        <div class="qa-a">Exoskeleton</div>
      </div>
      <div class="qa-item">
        <div class="qa-q">h. An injection given to prevent disease:</div>
        <div class="qa-a">Vaccination (Vaccine)</div>
      </div>
    </div>
  </div>

  <!-- 2. ANTAGONISTIC MUSCLE MECHANICS -->
  <div class="card">
    <div class="card-header">2. Arm Biomechanics: How Muscles Move Bones</div>
    <div style="font-size: 9.3pt; margin-bottom: 4px;">
      <strong>⚠️ Universal Rule:</strong> Muscles <strong>CANNOT PUSH</strong>! They can <strong>ONLY PULL</strong> by contracting (getting shorter and fatter). That is why they must work in <strong>pairs</strong>!
    </div>
    <div class="arm-columns">
      <div class="arm-box flexion">
        <div class="arm-box-title" style="color: #166534;">💪 ACTION 1: BENDING THE ARM (Up)</div>
        <div>• <strong>Biceps (Front):</strong> <strong>CONTRACTS!</strong> Gets shorter &amp; pulls forearm UP.</div>
        <div>• <strong>Triceps (Back):</strong> <strong>RELAXES!</strong> Gets longer and thinner.</div>
      </div>
      <div class="arm-box extension">
        <div class="arm-box-title" style="color: #1e40af;">🦾 ACTION 2: STRAIGHTENING THE ARM (Down)</div>
        <div>• <strong>Triceps (Back):</strong> <strong>CONTRACTS!</strong> Gets shorter &amp; pulls arm DOWN.</div>
        <div>• <strong>Biceps (Front):</strong> <strong>RELAXES!</strong> Gets longer and rests.</div>
      </div>
    </div>
  </div>

  <!-- 3. SKELETON ANATOMY & VITAL ORGAN PROTECTION -->
  <div class="card">
    <div class="card-header">3. Skeleton Anatomy &amp; Vital Shields (Mammal / Rabbit Exam Clues)</div>
    <table>
      <thead>
        <tr>
          <th style="width: 25%;">Skeleton Part</th>
          <th style="width: 35%;">Vital Function / Protection</th>
          <th style="width: 40%;">Exam Clue &amp; Target Organ</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Part C: Skull</strong></td>
          <td>Protection of control center</td>
          <td>Protects the delicate <strong>BRAIN</strong></td>
        </tr>
        <tr>
          <td><strong>Part D: Rib Cage</strong></td>
          <td>Chest armor basket</td>
          <td>Protects the <strong>HEART &amp; LUNGS</strong></td>
        </tr>
        <tr>
          <td><strong>Part A: Spine (Backbone)</strong></td>
          <td>Main upright support</td>
          <td>Protects delicate <strong>SPINAL CORD</strong> &amp; posture</td>
        </tr>
        <tr>
          <td><strong>Part E: Hip Bone (Pelvis)</strong></td>
          <td>Weight-bearing basin</td>
          <td>Supports upper torso &amp; anchors hind legs</td>
        </tr>
        <tr>
          <td><strong>Part F: Leg Bones (Femur)</strong></td>
          <td>Movement &amp; propulsion</td>
          <td>Longest, strongest bone; allows hopping/running</td>
        </tr>
        <tr>
          <td><strong>Part B: Jaw</strong></td>
          <td>Chewing &amp; communication</td>
          <td>The only skull bone that moves freely to chew food</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="footer">
    <span>HEX-AIM Adaptive Individualized Mastery • Breakfast Science Q&amp;A</span>
    <span>Lara &amp; Maya Midterm Prep • Asten College</span>
  </div>
</div>

<!-- PAGE 2: HEALTH DATA, MEDICINE SAFETY & GOLDEN EXAM TRAPS -->
<div class="page">
  <div class="header">
    <div class="header-left">
      <h1>🌅 Morning Science Breakfast Power-Up</h1>
      <div class="subtitle">Quick-Fire Midterm Q&amp;A • Living Things (Units 1.1 - 1.5) • Asten Y4</div>
    </div>
    <div class="badge">BREAKFAST REVISION • PAGE 2 OF 2</div>
  </div>

  <!-- 4. ARUN'S 24-HOUR ACTIVITY DATA -->
  <div class="card">
    <div class="card-header">4. Arun's 24-Hour Daily Activity Data &amp; Heart Health</div>
    <div class="qa-grid">
      <div class="qa-item">
        <div class="qa-q">a. What activity did Arun spend the MOST time doing?</div>
        <div class="qa-a">Sleeping (10 hours)</div>
      </div>
      <div class="qa-item">
        <div class="qa-q">b. Which activities took the SHORTEST amount of time?</div>
        <div class="qa-a">Riding a bike &amp; eating meals (approx. 1h each)</div>
      </div>
      <div class="qa-item">
        <div class="qa-q">c. How many hours did Arun spend moving vigorously?</div>
        <div class="qa-a">About 2 hours (1h cycling + 1h football)</div>
      </div>
      <div class="qa-item">
        <div class="qa-q">d. Which activities should Arun REDUCE? Why?</div>
        <div class="qa-a">Watching TV &amp; video games (sitting still too long)</div>
      </div>
      <div class="qa-item" style="grid-column: span 2;">
        <div class="qa-q">e. Name THREE huge benefits of regular physical exercise for children:</div>
        <div class="qa-a">1) Strengthens muscles and bones &nbsp;|&nbsp; 2) Keeps heart healthy &nbsp;|&nbsp; 3) Improves overall stamina &amp; fitness</div>
      </div>
    </div>
  </div>

  <!-- 5. MEDICINES & INFECTIOUS DISEASES TRUE / FALSE -->
  <div class="card">
    <div class="card-header">5. Medicines &amp; Infectious Diseases: Rapid True/False Lightning Round</div>
    <div class="qa-grid">
      <div class="qa-item">
        <div class="qa-q">a. Germs (pathogens) cause infectious diseases:</div>
        <div class="qa-a" style="color: #047857;">TRUE (Microscopic bacteria and viruses cause sickness)</div>
      </div>
      <div class="qa-item">
        <div class="qa-q">b. Taking more medicine makes you get better faster:</div>
        <div class="qa-a" style="color: #dc2626;">FALSE! (Dangerous! Causes poisoning and organ damage)</div>
      </div>
      <div class="qa-item">
        <div class="qa-q">c. Always follow exact instructions on medicine label:</div>
        <div class="qa-a" style="color: #047857;">TRUE (Check correct dose and expiry date with an adult)</div>
      </div>
      <div class="qa-item">
        <div class="qa-q">d. It is OK to take medicine a friend shares with you:</div>
        <div class="qa-a" style="color: #dc2626;">FALSE! (Prescribed only for that person; could harm you)</div>
      </div>
      <div class="qa-item" style="grid-column: span 2;">
        <div class="qa-q">e. Plants do not catch any infectious diseases:</div>
        <div class="qa-a" style="color: #dc2626;">FALSE! (Major Exam Trap: Plants, humans, and animals ALL get sick from germs!)</div>
      </div>
    </div>
  </div>

  <!-- 6. THE 4 GOLDEN TRAP-BUSTERS FOR 100% IN TODAY'S EXAM -->
  <div class="card" style="border: 2px solid #3b82f6; background: #f0fdf4;">
    <div class="card-header" style="color: #1e3a8a; border-color: #93c5fd;">
      🏆 The 4 Super-Detective Exam Trap Busters (Read Just Before Walking Into Class!)
    </div>
    <div style="font-size: 9.3pt; display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
      <div style="background: #ffffff; padding: 6px 8px; border-radius: 6px; border: 1px solid #bfdbfe;">
        <strong>1. The Mammal Secret:</strong><br>
        Whales and dolphins swim in water, bats fly in the air — but <strong>ALL THREE ARE MAMMALS</strong> because they have fur/hair, breathe air with lungs, and feed babies milk!
      </div>
      <div style="background: #ffffff; padding: 6px 8px; border-radius: 6px; border: 1px solid #bfdbfe;">
        <strong>2. Vaccine vs. Antibiotic:</strong><br>
        <strong>VACCINE</strong> = Given <em>BEFORE</em> getting sick to PREVENT disease.<br>
        <strong>ANTIBIOTIC</strong> = Given <em>AFTER</em> getting sick to TREAT bacterial infections (never cures cold/flu virus!).
      </div>
      <div style="background: #ffffff; padding: 6px 8px; border-radius: 6px; border: 1px solid #bfdbfe;">
        <strong>3. The 3 Skeleton Types:</strong><br>
        • <strong>Endoskeleton:</strong> Inside bones (all vertebrates).<br>
        • <strong>Exoskeleton:</strong> Hard crunchy outer armor (crabs, beetles).<br>
        • <strong>Hydrostatic:</strong> Soft fluid pressure balloon (worms, jellyfish).
      </div>
      <div style="background: #ffffff; padding: 6px 8px; border-radius: 6px; border: 1px solid #bfdbfe;">
        <strong>4. The Muscle Push Lie:</strong><br>
        If an exam question asks: "Does muscle push or pull?" — <strong>ALWAYS WRITE PULL</strong>! Muscles can never push.
      </div>
    </div>
  </div>

  <div class="footer">
    <span>HEX-AIM Adaptive Individualized Mastery • Breakfast Science Q&amp;A</span>
    <span>Good luck Lara &amp; Maya! You are 100% ready to shine today! 🌟</span>
  </div>
</div>

</body>
</html>
"""

html_path = os.path.join(PROJECT_ROOT, "morning_science_breakfast_qa.html")
with open(html_path, "w", encoding="utf-8") as f:
    f.write(html_content)

pdf_out = os.path.join(PROJECT_ROOT, "Morning_Science_Breakfast_QA_Lara_Maya.pdf")

print("🎨 Rendering Morning Science Breakfast Q&A PDF via Chrome Headless...")
subprocess.run([
    "google-chrome",
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--no-pdf-header-footer",
    f"--print-to-pdf={pdf_out}",
    html_path
], check=True)

size_kb = os.path.getsize(pdf_out) / 1024
print(f"✅ Generated: {pdf_out} ({size_kb:.1f} KB)")

# Render inspection PNGs
subprocess.run([
    "pdftoppm", "-png", "-r", "150", pdf_out,
    os.path.join(RENDER_DIR, "breakfast_qa_page")
], check=True)
print("🔍 Inspection PNGs rendered.")

# Dispatch to Telegram ONLY if explicitly requested via --send CLI argument
import sys
if "--send" in sys.argv:
    bot_token = os.environ.get("TELEGRAM_BOT_TOKEN")
    chat_id = os.environ.get("TELEGRAM_ADMIN_CHAT_ID")
    if not bot_token or not chat_id:
        print("⚠️ TELEGRAM_BOT_TOKEN or TELEGRAM_ADMIN_CHAT_ID not set. Skipping Telegram dispatch.")
        sys.exit(0)
    caption = "🌅 Morning Science Breakfast Power-Up (2-Page Q&A Reminder Sheet for Lara & Maya before school!)"

    with open(pdf_out, "rb") as f:
        resp = requests.post(
            f"https://api.telegram.org/bot{bot_token}/sendDocument",
            data={"chat_id": chat_id, "caption": caption},
            files={"document": ("Morning_Science_Breakfast_QA_Lara_Maya.pdf", f, "application/pdf")}
        )
        if resp.ok:
            print("✅ Delivered Morning Breakfast Q&A PDF to Telegram successfully!")
        else:
            print(f"❌ Telegram send failed: {resp.text}")
else:
    print("ℹ️ Telegram dispatch skipped. Pass '--send' flag to deliver.")
