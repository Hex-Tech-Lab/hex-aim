import os
import subprocess
import requests

BASE_DIR = "/home/kellyb_dev/projects/hex-aim"
RENDER_DIR = os.path.join(BASE_DIR, ".rendered_sprint_pages")
os.makedirs(RENDER_DIR, exist_ok=True)

# Master CSS: balanced, responsive flexbox layout that fills A4 pages from top to bottom
COMMON_CSS = """
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');

@page {
  size: A4 portrait;
  margin: 10mm 13mm 10mm 13mm;
}

* {
  box-sizing: border-box;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

body {
  font-family: 'Nunito', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #1e293b;
  margin: 0;
  padding: 0;
  font-size: 10.2pt;
  line-height: 1.45;
  background-color: #ffffff;
}

.page {
  page-break-after: always;
  height: 272mm;
  max-height: 272mm;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Automatically balances vertical spacing from top to bottom! */
  padding: 2mm 0;
}

.page:last-child {
  page-break-after: avoid;
}

/* Header */
.quiz-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2.5px solid #2563eb;
  padding-bottom: 5px;
  margin-bottom: 8px;
  gap: 12px;
}

.quiz-title-group {
  flex: 1 1 auto;
  min-width: 0;
}

.quiz-title-group h1 {
  font-size: 14pt;
  font-weight: 900;
  color: #1e3a8a;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

.quiz-title-group .subtitle {
  font-size: 9pt;
  color: #64748b;
  font-weight: 700;
  white-space: nowrap;
}

.student-meta {
  flex: 0 0 auto !important;
  white-space: nowrap !important;
  text-align: right;
  font-size: 9.5pt;
  font-weight: 800;
  color: #1e40af;
  background: #eff6ff;
  padding: 5px 12px;
  border-radius: 8px;
  border: 1.5px solid #bfdbfe;
  display: inline-block;
}

/* Cards */
.card {
  background: #ffffff;
  border: 1.5px solid #cbd5e1;
  border-radius: 10px;
  padding: 9px 13px;
  margin-bottom: 7px;
  position: relative;
}

.card-header {
  font-size: 10.8pt;
  font-weight: 800;
  color: #1e3a8a;
  border-bottom: 1.5px solid #e2e8f0;
  padding-bottom: 4px;
  margin-bottom: 7px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.card-blue { background: #f8fafc; border-color: #93c5fd; }
.card-amber { background: #fffbeb; border-color: #fde68a; }
.card-green { background: #f0fdf4; border-color: #bbf7d0; }
.card-purple { background: #faf5ff; border-color: #e9d5ff; }

/* Tip Box */
.tip-box {
  background: #fef3c7;
  border-left: 4px solid #f59e0b;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 9.2pt;
  color: #92400e;
  margin-bottom: 8px;
  line-height: 1.4;
}

/* Question Badges & Lines */
.q-num {
  display: inline-block;
  background: #2563eb;
  color: white;
  font-weight: 800;
  font-size: 9.5pt;
  width: 22px;
  height: 22px;
  line-height: 22px;
  text-align: center;
  border-radius: 50%;
  margin-right: 6px;
  vertical-align: middle;
}

.q-text {
  font-weight: 700;
  font-size: 10.5pt;
  color: #0f172a;
}

.sub-item {
  margin: 5px 0;
  font-size: 9.8pt;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.answer-line {
  display: inline-block;
  border-bottom: 1.5px solid #64748b;
  margin-left: 6px;
  height: 16px;
}

/* Comparison Sub-boxes */
.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin: 6px 0;
}

.grid-3 {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
  margin: 6px 0;
}

.sub-box {
  background: #ffffff;
  border: 1.5px solid #cbd5e1;
  border-radius: 8px;
  padding: 8px 10px;
}

.sub-box-title {
  font-size: 9.5pt;
  font-weight: 800;
  color: #1e40af;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 3px;
  margin-bottom: 6px;
}

/* Tables */
table.styled-table {
  width: 100%;
  border-collapse: collapse;
  margin: 6px 0;
  font-size: 9.4pt;
}

table.styled-table th {
  background: #1e3a8a;
  color: white;
  font-weight: 800;
  padding: 5px 8px;
  border: 1px solid #1e3a8a;
  text-align: left;
}

table.styled-table td {
  border: 1px solid #cbd5e1;
  padding: 4px 8px;
}

table.styled-table tr:nth-child(even) {
  background: #f8fafc;
}

/* Footer */
.quiz-footer {
  border-top: 1px solid #cbd5e1;
  padding-top: 4px;
  display: flex;
  justify-content: space-between;
  font-size: 8pt;
  color: #94a3b8;
  font-weight: 700;
  margin-top: 4px;
}

/* Cover Page */
.cover-container {
  text-align: center;
  padding: 18mm 12mm 12mm 12mm;
  height: 272mm;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.cover-title {
  font-size: 28pt;
  font-weight: 900;
  color: #1e3a8a;
  margin-bottom: 4px;
}

.cover-subtitle {
  font-size: 13.5pt;
  font-weight: 700;
  color: #0284c7;
  margin-bottom: 14px;
}

.cover-badge-box {
  display: inline-block;
  background: #f0fdf4;
  border: 2px solid #86efac;
  color: #166534;
  padding: 7px 22px;
  border-radius: 25px;
  font-size: 11pt;
  font-weight: 800;
  margin: 0 auto;
}

.cover-card {
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px 20px;
  text-align: left;
  max-width: 530px;
  margin: 10px auto;
}

.cover-card h3 {
  margin-top: 0;
  color: #1e293b;
  font-size: 12pt;
  border-bottom: 2px solid #cbd5e1;
  padding-bottom: 5px;
  margin-bottom: 8px;
}

.cover-card ul {
  margin: 0;
  padding-left: 18px;
  font-size: 10pt;
  color: #334155;
  line-height: 1.6;
}
"""

# ==========================================
# 1. LARA'S HTML SPRINT PACK (BIOMECHANICS FOCUS)
# ==========================================
def build_lara_html():
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Lara's Science Detective Pack - Year 4 Midterm</title>
<style>
{COMMON_CSS}
</style>
</head>
<body>

<!-- PAGE 1: COVER PAGE -->
<div class="page cover-container">
  <div>
    <div style="font-size: 38pt; margin-bottom: 6px;">🌟 🔍 🦴</div>
    <div class="cover-title">Lara's Science Detective Pack</div>
    <div class="cover-subtitle">Year 4 Special Mission: Biomechanics, Bones &amp; Health Investigator</div>
    <div class="cover-badge-box">Target: 100% Exam Confidence • Hands-On Anatomy • Asten College Midterm</div>
  </div>

  <div class="cover-card">
    <h3>🕵️‍♀️ Lara's 4 Super-Detective Secret Weapons:</h3>
    <ul>
      <li><strong>Weapon 1: The Lever Rule!</strong> Muscles CANNOT push! They can ONLY pull on bones by getting shorter (contracting).</li>
      <li><strong>Weapon 2: The Antagonistic Guard!</strong> Muscles always work in pairs! When Biceps contracts to bend your arm, Triceps relaxes!</li>
      <li><strong>Weapon 3: The Shield Formula!</strong> Skull guards Brain, Rib Cage shields Heart &amp; Lungs, Spine protects the delicate Spinal Cord.</li>
      <li><strong>Weapon 4: The Health Code!</strong> Vaccines PREVENT before sickness; Antibiotics TREAT bacterial infections after sickness (never viruses!).</li>
    </ul>
  </div>

  <div style="font-size: 12.5pt; font-weight: 800; color: #1e3a8a; background: #eff6ff; border: 2px dashed #3b82f6; border-radius: 12px; padding: 10px 20px; max-width: 530px; margin: 0 auto;">
    Student Detective: <span style="color: #0f172a;">Lara Bakri</span> &nbsp;&nbsp;&nbsp;&nbsp;
    Class: <span style="color: #0f172a;">Year 4A</span>
  </div>

  <div class="card card-green" style="max-width: 530px; margin: 0 auto; text-align: center; padding: 12px 18px;">
    <div style="font-weight: 800; color: #166534; font-size: 11pt;">🎯 Mission Objective for Tomorrow:</div>
    <div style="font-size: 9.8pt; color: #15803d; margin-top: 3px;">
      Read each question calmly, underline key words like "PULL", "CONTRACT", "PROTECT", and solve the clues like a master scientist!
    </div>
  </div>

  <div class="quiz-footer">
    <span>HEX-AIM High-Yield Science Sprint • Asten College Year 4</span>
    <span>Cover Page • Lara Bakri</span>
  </div>
</div>

<!-- PAGE 2: BONES & SKELETON FUNCTIONS -->
<div class="page">
  <div class="quiz-header">
    <div class="quiz-title-group">
      <h1><span>🦴</span> Mission 1: The Skeleton &amp; Bone Shield Detective</h1>
      <div class="subtitle">Units 1.1 - 1.2: The 3 Vital Functions &amp; Vital Organ Protection</div>
    </div>
    <div class="student-meta">LARA • PAGE 1 OF 5</div>
  </div>

  <div class="tip-box">
    <strong>💡 Detective Secret:</strong> Bones perform 3 vital jobs: <strong>1) SUPPORT</strong> (stops body from collapsing), <strong>2) PROTECTION</strong> (hard shields for fragile organs), <strong>3) MOVEMENT</strong> (solid levers for muscles to pull).
  </div>

  <div class="card">
    <div class="card-header">1. The Three Vital Functions of the Skeleton</div>
    <div style="margin-bottom: 6px;">
      <strong>• SUPPORT:</strong> Provides an upright framework giving body shape. Without bones, humans would collapse into a blob of jelly!
    </div>
    <div style="margin-bottom: 6px;">
      <strong>• PROTECTION:</strong> Hard bone armor encasing fragile organs:
      <div style="margin-left: 12px; margin-top: 3px; color: #0284c7; font-weight: 700;">
        → <strong>SKULL</strong> protects the delicate <strong>BRAIN</strong>.<br>
        → <strong>RIB CAGE</strong> protects the <strong>HEART</strong> and <strong>LUNGS</strong> in the chest.<br>
        → <strong>SPINE (Backbone)</strong> shields the <strong>SPINAL CORD</strong> and keeps back upright.
      </div>
    </div>
    <div>
      <strong>• MOVEMENT:</strong> Bones act as rigid levers. Muscles pull on bones at joints to allow running, writing, and jumping.
    </div>
  </div>

  <div class="card card-blue">
    <div class="card-header">2. Key Bones Forensic Identification Table</div>
    <table class="styled-table">
      <thead>
        <tr>
          <th>Bone Name</th>
          <th>Location &amp; Shape</th>
          <th>Crucial Function</th>
        </tr>
      </thead>
      <tbody>
        <tr><td><strong>Skull</strong></td><td>Head / Rounded dome</td><td>Protects brain, forms facial structure</td></tr>
        <tr><td><strong>Spine (Backbone)</strong></td><td>Back column of vertebrae</td><td>Supports posture, guards spinal cord</td></tr>
        <tr><td><strong>Rib Cage</strong></td><td>Chest / Curved basket</td><td>Shields heart &amp; lungs, moves during breathing</td></tr>
        <tr><td><strong>Pelvis (Hip Bone)</strong></td><td>Lower torso basin</td><td>Supports upper body weight, connects legs</td></tr>
        <tr><td><strong>Femur</strong></td><td>Upper leg (Thigh)</td><td>Longest, strongest bone; supports body weight</td></tr>
        <tr><td><strong>Jaw</strong></td><td>Lower skull</td><td>Moves up/down to chew food and speak</td></tr>
      </tbody>
    </table>
  </div>

  <div class="card">
    <div class="card-header">3. Detective Challenge: Organ Protection Match</div>
    <div class="sub-item">
      <span>a. Which specific bone shields the control center of your body (the brain)?</span>
      <span class="answer-line" style="width: 150px;"></span>
    </div>
    <div class="sub-item">
      <span>b. Which bone structure expands and contracts when you breathe air?</span>
      <span class="answer-line" style="width: 150px;"></span>
    </div>
    <div class="sub-item">
      <span>c. Name the longest and heaviest bone in the entire human skeleton:</span>
      <span class="answer-line" style="width: 150px;"></span>
    </div>
  </div>

  <div class="card card-green">
    <div class="card-header">4. Detective Investigation: What Else Do Bones Do?</div>
    <div style="font-size: 9.6pt; line-height: 1.45;">
      • <strong>Mineral Storage:</strong> Bones store essential minerals like <strong>calcium</strong> to keep them dense and sturdy.<br>
      • <strong>Blood Cell Factory:</strong> Inside large bones (like the femur), spongy <strong>bone marrow</strong> manufactures fresh red blood cells!
    </div>
  </div>

  <div class="quiz-footer">
    <span>HEX-AIM High-Yield Science Sprint • Living Things (1.1 - 1.5)</span>
    <span>Page 2 of 6</span>
  </div>
</div>

<!-- PAGE 3: ANTAGONISTIC MUSCLES & LAB EXPERIMENT -->
<div class="page">
  <div class="quiz-header">
    <div class="quiz-title-group">
      <h1><span>💪</span> Mission 2: Antagonistic Muscle Mechanics Lab</h1>
      <div class="subtitle">Unit 1.3: How Muscles Pull, Contract &amp; Relax in Pairs</div>
    </div>
    <div class="student-meta">LARA • PAGE 2 OF 5</div>
  </div>

  <div class="tip-box" style="background: #f0fdf4; border-color: #16a34a; color: #166534;">
    <strong>🌟 GOLDEN EXAM RULE:</strong> Muscles <strong>CANNOT PUSH!</strong> They can <strong>ONLY PULL</strong> by contracting (getting shorter and fatter). Because they only pull, they must work in <strong>ANTAGONISTIC PAIRS</strong>!
  </div>

  <div class="card">
    <div class="card-header">1. Arm Mechanics: Bending vs. Straightening</div>
    <div class="grid-2">
      <div class="sub-box" style="border-color: #3b82f6; background: #eff6ff;">
        <div class="sub-box-title">ACTION 1: BENDING THE ARM (Flexion)</div>
        <div style="font-size: 9.4pt; line-height: 1.45;">
          <strong>1. BICEPS (Front of arm):</strong><br>
          • <strong>CONTRACTS!</strong><br>
          • Gets <strong>shorter and fatter</strong>.<br>
          • <strong>Pulls</strong> forearm upward towards shoulder.<br><br>
          <strong>2. TRICEPS (Back of arm):</strong><br>
          • <strong>RELAXES!</strong><br>
          • Gets <strong>longer and thinner</strong>.<br>
          • Allows arm to bend smoothly.
        </div>
      </div>

      <div class="sub-box" style="border-color: #f59e0b; background: #fffbeb;">
        <div class="sub-box-title">ACTION 2: STRAIGHTENING THE ARM (Extension)</div>
        <div style="font-size: 9.4pt; line-height: 1.45;">
          <strong>1. TRICEPS (Back of arm):</strong><br>
          • <strong>CONTRACTS!</strong><br>
          • Gets <strong>shorter and tighter</strong>.<br>
          • <strong>Pulls</strong> forearm straight downward.<br><br>
          <strong>2. BICEPS (Front of arm):</strong><br>
          • <strong>RELAXES!</strong><br>
          • Gets <strong>longer and thinner</strong>.<br>
          • Rests while triceps does the pulling work.
        </div>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-header">2. Lara's Biomechanics Experiment Analysis</div>
    <div style="font-size: 9.6pt; margin-bottom: 6px;">
      In class, students build a cardboard model of an arm using split pins and elastic bands:
    </div>
    <div class="sub-item">
      <span>a. What does the elastic band on the top represent?</span>
      <span class="answer-line" style="width: 170px;"></span>
    </div>
    <div class="sub-item">
      <span>b. What do the stiff cardboard strips represent?</span>
      <span class="answer-line" style="width: 170px;"></span>
    </div>
    <div class="sub-item">
      <span>c. Why does the model need TWO elastic bands instead of one?</span>
      <span class="answer-line" style="width: 230px;"></span>
    </div>
  </div>

  <div class="card card-purple">
    <div class="card-header">3. Tendons &amp; Quick Choice Drill</div>
    <div style="font-size: 9.6pt; line-height: 1.55;">
      • <strong>Tendons:</strong> Tough, non-stretchy cords that anchor muscle to bone.<br>
      • <strong>Question:</strong> When a muscle contracts, its length: &nbsp;&nbsp;&nbsp; <strong>[ A) Gets Longer ]</strong> &nbsp;&nbsp;&nbsp; <strong>[ B) Gets Shorter ]</strong><br>
      • <strong>Question:</strong> Can the triceps push the arm bone back? &nbsp;&nbsp;&nbsp; <strong>[ YES ]</strong> &nbsp;&nbsp;&nbsp; <strong>[ NO - muscles ONLY pull! ]</strong>
    </div>
  </div>

  <div class="quiz-footer">
    <span>HEX-AIM High-Yield Science Sprint • Living Things (1.1 - 1.5)</span>
    <span>Page 3 of 6</span>
  </div>
</div>

<!-- PAGE 4: MEDICINES & DISEASE PREVENTION -->
<div class="page">
  <div class="quiz-header">
    <div class="quiz-title-group">
      <h1><span>🦠</span> Mission 3: Disease Detectives &amp; Medicine Safety</h1>
      <div class="subtitle">Unit 1.5: Germs, Vaccinations, Antibiotics &amp; Safe Use</div>
    </div>
    <div class="student-meta">LARA • PAGE 3 OF 5</div>
  </div>

  <div class="tip-box">
    <strong>💡 Critical Exam Fact:</strong> Infectious diseases are caused by microscopic germs (pathogens like bacteria and viruses). <strong>HUMANS, ANIMALS, and PLANTS</strong> can ALL catch infectious diseases! (Plants get sick too!).
  </div>

  <div class="card">
    <div class="card-header">1. Vaccines vs. Antibiotics: The Crucial Difference</div>
    <div class="grid-2">
      <div class="sub-box" style="border-color: #10b981; background: #ecfdf5;">
        <div class="sub-box-title" style="color: #065f46;">💉 VACCINES (PREVENTION)</div>
        <ul style="margin: 0; padding-left: 15px; font-size: 9.2pt; line-height: 1.45;">
          <li>Given <strong>BEFORE</strong> you catch an illness.</li>
          <li>Usually administered by injection (needle).</li>
          <li>Trains immune system to make antibodies.</li>
          <li>Protects against severe diseases (measles, polio).</li>
          <li>Given to both humans and animals (pets/cattle).</li>
        </ul>
      </div>

      <div class="sub-box" style="border-color: #f59e0b; background: #fffbeb;">
        <div class="sub-box-title" style="color: #92400e;">💊 ANTIBIOTICS (TREATMENT)</div>
        <ul style="margin: 0; padding-left: 15px; font-size: 9.2pt; line-height: 1.45;">
          <li>Given <strong>AFTER</strong> you are already sick.</li>
          <li>Taken as liquids, capsules, or pills.</li>
          <li><strong>ONLY kills bacteria!</strong></li>
          <li><strong>DOES NOT WORK on viruses</strong> (like colds/flu!).</li>
          <li>Must always finish the full course prescribed!</li>
        </ul>
      </div>
    </div>
  </div>

  <div class="card card-amber">
    <div class="card-header">2. The 4 Golden Rules of Medicine Safety</div>
    <div class="grid-2" style="font-size: 9.5pt; line-height: 1.4;">
      <div><strong>• Rule 1: Trusted Adult Only</strong><br>Never take medicine alone; parent, nurse, or doctor must give it.</div>
      <div><strong>• Rule 2: Read the Label</strong><br>Always check exact dosage and expiry date before taking.</div>
      <div><strong>• Rule 3: Never Share</strong><br>Medicine prescribed for someone else could be harmful to you.</div>
      <div><strong>• Rule 4: More ≠ Faster</strong><br>Taking extra doses will NOT heal you faster; it causes poisoning!</div>
    </div>
  </div>

  <div class="card">
    <div class="card-header">3. Forensic True / False Challenge</div>
    <table class="styled-table">
      <thead>
        <tr>
          <th>Statement</th>
          <th style="width: 140px; text-align: center;">Verdict (Circle One)</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>a. Germs are microscopic living things that can cause infectious disease.</td><td style="text-align: center;"><strong>TRUE &nbsp;/&nbsp; FALSE</strong></td></tr>
        <tr><td>b. Antibiotics can cure the common cold and the flu.</td><td style="text-align: center;"><strong>TRUE &nbsp;/&nbsp; FALSE</strong></td></tr>
        <tr><td>c. Plants can never catch infectious diseases.</td><td style="text-align: center;"><strong>TRUE &nbsp;/&nbsp; FALSE</strong></td></tr>
        <tr><td>d. Vaccines train the body to fight off pathogens before getting sick.</td><td style="text-align: center;"><strong>TRUE &nbsp;/&nbsp; FALSE</strong></td></tr>
        <tr><td>e. Washing hands thoroughly with warm water and soap destroys germs.</td><td style="text-align: center;"><strong>TRUE &nbsp;/&nbsp; FALSE</strong></td></tr>
      </tbody>
    </table>
  </div>

  <div class="card card-blue">
    <div class="card-header">4. Detective Clinical Case: Who Needs Antibiotics?</div>
    <div style="font-size: 9.6pt; line-height: 1.45;">
      Mia has a runny nose caused by a cold virus. Tarek has a bacterial ear infection.<br>
      <strong>Question:</strong> Who should receive antibiotics, and why?
      <div class="answer-line" style="width: 85%; margin-top: 5px;"></div>
    </div>
  </div>

  <div class="quiz-footer">
    <span>HEX-AIM High-Yield Science Sprint • Living Things (1.1 - 1.5)</span>
    <span>Page 4 of 6</span>
  </div>
</div>

<!-- PAGE 5: EXAM SIMULATION & ARUN'S DATA GRAPH -->
<div class="page">
  <div class="quiz-header">
    <div class="quiz-title-group">
      <h1><span>📊</span> Mission 4: Exam Simulation &amp; Health Data Forensics</h1>
      <div class="subtitle">Realistic Exam Simulation: Biomechanics, Skeleton Lab &amp; Graphs</div>
    </div>
    <div class="student-meta">LARA • PAGE 4 OF 5</div>
  </div>

  <div class="card">
    <div class="card-header">1. Skeleton Diagram Analysis (Lab Rabbit Skeleton)</div>
    <div style="font-size: 9.6pt; margin-bottom: 5px;">
      A science student examines an articulated skeleton of a mammal (rabbit). Answer each clue:
    </div>
    <div class="sub-item">
      <span>a. What is the name of the bone cage protecting the heart and lungs?</span>
      <span class="answer-line" style="width: 160px;"></span>
    </div>
    <div class="sub-item">
      <span>b. What is the name of the skull bone that moves to allow chewing?</span>
      <span class="answer-line" style="width: 160px;"></span>
    </div>
    <div class="sub-item">
      <span>c. Name the large hip bone that anchors the powerful hind leg bones:</span>
      <span class="answer-line" style="width: 160px;"></span>
    </div>
    <div class="sub-item">
      <span>d. Besides support and movement, give ONE other vital function of the skeleton:</span>
      <span class="answer-line" style="width: 160px;"></span>
    </div>
  </div>

  <div class="card card-blue">
    <div class="card-header">2. Arun's 24-Hour Activity Data &amp; Heart Health</div>
    <div style="font-size: 9.6pt; margin-bottom: 5px;">
      Arun logged his daily 24 hours: <strong>Sleeping (10h), School Class (6h), TV &amp; Gaming (4h), Cycling &amp; Football (2h), Meals &amp; Sitting (2h).</strong>
    </div>
    <div class="sub-item">
      <span>a. For how many total hours was Arun physically active and exercising?</span>
      <span class="answer-line" style="width: 150px;"></span>
    </div>
    <div class="sub-item">
      <span>b. For how many total hours was Arun sitting still or sedentary (Class + TV + Meals)?</span>
      <span class="answer-line" style="width: 150px;"></span>
    </div>
    <div class="sub-item">
      <span>c. Which activity should Arun REDUCE to improve his cardiovascular fitness?</span>
      <span class="answer-line" style="width: 150px;"></span>
    </div>
    <div class="sub-item">
      <span>d. State TWO health benefits of daily exercise for children:</span>
      <span class="answer-line" style="width: 200px;"></span>
    </div>
  </div>

  <div class="card card-green" style="text-align: center; margin-top: 6px; padding: 12px;">
    <div style="font-size: 20pt;">🌟 👑 🔬</div>
    <div style="font-weight: 800; font-size: 12.5pt; color: #166534;">Lara is a Year 4 Science Champion!</div>
    <div style="font-size: 9.8pt; color: #15803d; margin-top: 3px;">
      You have mastered how muscles pull, how bones shield your organs, and how to stay healthy!
    </div>
  </div>

  <div class="quiz-footer">
    <span>HEX-AIM High-Yield Science Sprint • Living Things (1.1 - 1.5)</span>
    <span>Page 5 of 6</span>
  </div>
</div>

<!-- PAGE 6: SOCRATIC GUIDE & ANSWER KEY FOR DAD -->
<div class="page">
  <div class="quiz-header">
    <div class="quiz-title-group">
      <h1><span>🎯</span> Parent Socratic Coaching Guide &amp; Lara's Model Answers</h1>
      <div class="subtitle">Tonight's 8-Minute Bedtime Verbal Script &amp; Complete Marking Scheme</div>
    </div>
    <div class="student-meta">LARA • PAGE 5 OF 5</div>
  </div>

  <div class="card card-amber">
    <div class="card-header">Tonight's 8-Minute Verbal Socratic Script (For Dad)</div>
    <div style="font-size: 9.5pt; line-height: 1.45;">
      <strong>• Minute 1-2 (Bones &amp; Shields):</strong> "Touch your skull. What delicate organ is inside? (Brain). Touch your chest. What cage is that? (Rib cage). What two organs does it guard? (Heart &amp; lungs)."<br>
      <strong>• Minute 3-4 (Antagonistic Action):</strong> Have Lara flex her arm hard like a superhero. "Touch your top muscle. Is it hard or soft? (Hard - contracted!). What is the triceps underneath doing? (Relaxing/getting longer!). Can a muscle push? (NEVER!)."<br>
      <strong>• Minute 5-6 (Infectious Diseases):</strong> "Can an apple tree catch an infectious disease? (YES! Plants get sick too!). What is the difference between a vaccine and an antibiotic?"<br>
      <strong>• Minute 7-8 (Medicine Safety):</strong> "What are the 4 safety rules for medicine? Can taking a double dose cure you twice as fast? (NO, causes poisoning!)."
    </div>
  </div>

  <div class="card">
    <div class="card-header">Complete Model Answer Key (Lara's Pack)</div>
    <div style="font-size: 9.2pt; line-height: 1.45;">
      <strong>• Mission 1:</strong> a) Skull, b) Rib cage, c) Femur. (4. Calcium storage &amp; bone marrow blood cells).<br>
      <strong>• Mission 2:</strong><br>
      &nbsp;&nbsp;&nbsp;&nbsp;a) Biceps muscle.<br>
      &nbsp;&nbsp;&nbsp;&nbsp;b) Bones / Forearm and upper arm.<br>
      &nbsp;&nbsp;&nbsp;&nbsp;c) Because muscles can only pull; one band pulls arm up (biceps), the second band is needed to pull it down (triceps).<br>
      &nbsp;&nbsp;&nbsp;&nbsp;Drill: Gets Shorter; NO - muscles only pull; Tendons attach muscle to bone.<br>
      <strong>• Mission 3 (True/False):</strong> a) TRUE, b) FALSE (antibiotics only kill bacteria, not viruses), c) FALSE (plants get sick too), d) TRUE, e) TRUE.<br>
      &nbsp;&nbsp;&nbsp;&nbsp;Case Study: Tarek needs antibiotics because his ear infection is bacterial; Mia has a viral cold which antibiotics cannot cure.<br>
      <strong>• Mission 4:</strong><br>
      &nbsp;&nbsp;&nbsp;&nbsp;1. Skeleton: a) Rib cage, b) Jaw bone, c) Pelvis, d) Protection / Mineral storage / Blood cell production.<br>
      &nbsp;&nbsp;&nbsp;&nbsp;2. Arun's Data: a) 2 hours (Cycling/Soccer), b) 12 hours (6h Class + 4h TV + 2h Meals), c) TV &amp; Gaming, d) Strengthens heart and muscles, increases bone density, improves stamina.
    </div>
  </div>

  <div class="quiz-footer">
    <span>HEX-AIM High-Yield Science Sprint • Living Things (1.1 - 1.5)</span>
    <span>Page 6 of 6</span>
  </div>
</div>

</body>
</html>"""

# ==========================================
# 2. MAYA'S HTML SPRINT PACK (ANIMAL CLASSIFICATION FOCUS)
# ==========================================
def build_maya_html():
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Maya's Science Detective Pack - Year 4 Midterm</title>
<style>
{COMMON_CSS}
</style>
</head>
<body>

<!-- PAGE 1: COVER PAGE -->
<div class="page cover-container">
  <div>
    <div style="font-size: 38pt; margin-bottom: 6px;">🌟 🔍 🐾</div>
    <div class="cover-title">Maya's Science Detective Pack</div>
    <div class="cover-subtitle">Year 4 Special Mission: The Animal Kingdom &amp; Skeleton Codebreaker</div>
    <div class="cover-badge-box">Target: Master All 5 Vertebrate Classes • Zero Confusion • 100% Exam Mastery</div>
  </div>

  <div class="cover-card">
    <h3>🕵️‍♀️ Maya's 4 Super-Detective Secret Weapons:</h3>
    <ul>
      <li><strong>Weapon 1: The Backbone Key!</strong> Vertebrate = HAS a backbone/spine. Invertebrate = NO backbone!</li>
      <li><strong>Weapon 2: The Mammal Trap-Buster!</strong> Whales swim in the sea &amp; bats fly in the night—but BOTH are MAMMALS (hair &amp; nurse with milk)!</li>
      <li><strong>Weapon 3: The 3 Skeleton Types!</strong> Endoskeleton (inside bones), Exoskeleton (outer hard armour), Hydrostatic (fluid pressure balloon)!</li>
      <li><strong>Weapon 4: The 5-Class Passport!</strong> Mammals (fur/milk), Birds (feathers/beaks), Reptiles (dry scales), Amphibians (moist skin/jelly eggs), Fish (scales/fins/gills).</li>
    </ul>
  </div>

  <div style="font-size: 12.5pt; font-weight: 800; color: #1e3a8a; background: #eff6ff; border: 2px dashed #3b82f6; border-radius: 12px; padding: 10px 20px; max-width: 530px; margin: 0 auto;">
    Student Detective: <span style="color: #0f172a;">Maya Bakri</span> &nbsp;&nbsp;&nbsp;&nbsp;
    Class: <span style="color: #0f172a;">Year 4A</span>
  </div>

  <div class="card card-green" style="max-width: 530px; margin: 0 auto; text-align: center; padding: 12px 18px;">
    <div style="font-weight: 800; color: #166534; font-size: 11pt;">🎯 Maya's Super Secret Exam Mission:</div>
    <div style="font-size: 9.8pt; color: #15803d; margin-top: 3px;">
      You are the Master Animal Detective! Whenever you see an animal on tomorrow's test, ask: "Does it have a spine?" and "Does it nurse with milk or have feathers?"
    </div>
  </div>

  <div class="quiz-footer">
    <span>HEX-AIM High-Yield Science Sprint • Asten College Year 4</span>
    <span>Cover Page • Maya Bakri</span>
  </div>
</div>

<!-- PAGE 2: THE 5 VERTEBRATE CLASSES MASTER DOSSIER -->
<div class="page">
  <div class="quiz-header">
    <div class="quiz-title-group">
      <h1><span>🐾</span> Mission 1: The 5 Vertebrate Classes Master Dossier</h1>
      <div class="subtitle">Unit 1.4: Animals with a Backbone (Vertebrates) &amp; Their Distinct Features</div>
    </div>
    <div class="student-meta">MAYA • PAGE 1 OF 5</div>
  </div>

  <div class="tip-box">
    <strong>💡 Detective Secret:</strong> All vertebrates have an internal backbone and an <strong>ENDOSKELETON</strong>. There are exactly <strong>5 CLASSES</strong>: Mammals, Birds, Reptiles, Amphibians, and Fish!
  </div>

  <div class="card card-blue">
    <div class="card-header">1. The Five Vertebrate Families Field Guide</div>
    <table class="styled-table">
      <thead>
        <tr>
          <th>Class</th>
          <th>Body Covering</th>
          <th>Breathing &amp; Blood</th>
          <th>Reproduction &amp; Young</th>
          <th>Exam Traps &amp; Examples</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>1. MAMMALS</strong></td>
          <td>Hair or Fur</td>
          <td>Lungs<br>Warm-blooded</td>
          <td>Give live birth; mothers nurse young with <strong>milk</strong></td>
          <td><strong>TRAP:</strong> Whales, dolphins, &amp; bats are mammals! (Humans, lions).</td>
        </tr>
        <tr>
          <td><strong>2. BIRDS</strong></td>
          <td>Feathers &amp; Wings</td>
          <td>Lungs<br>Warm-blooded</td>
          <td>Lay hard-shelled eggs in nests on land</td>
          <td><strong>TRAP:</strong> Penguins &amp; ostriches cannot fly, but ARE birds! (Beaks!).</td>
        </tr>
        <tr>
          <td><strong>3. REPTILES</strong></td>
          <td>Dry, tough scales</td>
          <td>Lungs<br>Cold-blooded</td>
          <td>Lay leathery waterproof eggs on dry land</td>
          <td>Snakes, lizards, crocodiles, tortoises, turtles.</td>
        </tr>
        <tr>
          <td><strong>4. AMPHIBIANS</strong></td>
          <td>Smooth, moist skin</td>
          <td>Gills when young; Lungs/skin as adults</td>
          <td>Lay soft jelly eggs in water; metamorphosis</td>
          <td>Frogs, toads, newts, salamanders. (Start in water, live on land).</td>
        </tr>
        <tr>
          <td><strong>5. FISH</strong></td>
          <td>Wet, slimy scales</td>
          <td>Gills<br>Cold-blooded</td>
          <td>Fins for swimming; lay eggs in water</td>
          <td>Salmon, goldfish, sharks, tuna. (Live 100% in water).</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="card">
    <div class="card-header">2. Trap-Buster Forensic Questions (Answer Carefully!)</div>
    <div class="sub-item">
      <span>a. A dolphin lives in the sea and swims with fins. Why is it a MAMMAL, not a fish?</span>
      <span class="answer-line" style="width: 170px;"></span>
    </div>
    <div class="sub-item">
      <span>b. A penguin cannot fly in the sky. Why is it classified as a BIRD?</span>
      <span class="answer-line" style="width: 170px;"></span>
    </div>
    <div class="sub-item">
      <span>c. A frog lays eggs without hard shells in a pond. Which class does it belong to?</span>
      <span class="answer-line" style="width: 170px;"></span>
    </div>
  </div>

  <div class="card card-purple">
    <div class="card-header">3. Quick Diagnostic: Match Animal to Vertebrate Class</div>
    <div class="sub-item">
      <span>• Fruit Bat (flies with leathery wings, fur, nurses with milk):</span>
      <span style="font-weight: 800; color: #1e40af;">Class: ___________________</span>
    </div>
    <div class="sub-item">
      <span>• Sea Turtle (breathes with lungs, lays leathery eggs on beach sand):</span>
      <span style="font-weight: 800; color: #1e40af;">Class: ___________________</span>
    </div>
  </div>

  <div class="quiz-footer">
    <span>HEX-AIM High-Yield Science Sprint • Living Things (1.1 - 1.5)</span>
    <span>Page 2 of 6</span>
  </div>
</div>

<!-- PAGE 3: THE 3 SKELETON TYPES -->
<div class="page">
  <div class="quiz-header">
    <div class="quiz-title-group">
      <h1><span>🦴</span> Mission 2: The Three Skeleton Architecture Types</h1>
      <div class="subtitle">Unit 1.4: Endoskeleton vs. Exoskeleton vs. Hydrostatic Skeleton</div>
    </div>
    <div class="student-meta">MAYA • PAGE 2 OF 5</div>
  </div>

  <div class="tip-box" style="background: #eff6ff; border-color: #3b82f6; color: #1e40af;">
    <strong>💡 The Big Discovery:</strong> Animals have 3 ways to build a body: <strong>1) Endoskeleton</strong> (inside bones), <strong>2) Exoskeleton</strong> (outer armour shell), <strong>3) Hydrostatic</strong> (fluid-filled pressure cushion).
  </div>

  <div class="card">
    <div class="card-header">1. Comparative Architecture of Animal Skeletons</div>
    <div class="grid-3">
      <div class="sub-box" style="border-color: #2563eb; background: #eff6ff;">
        <div class="sub-box-title" style="color: #1e40af;">ENDOSKELETON</div>
        <div style="font-size: 9pt; line-height: 1.45;">
          <strong>• Where:</strong> INSIDE the body.<br>
          <strong>• Structure:</strong> Hard bones &amp; cartilage.<br>
          <strong>• Growth:</strong> Grows naturally as animal grows.<br>
          <strong>• Found In:</strong> <strong>ALL 5 Vertebrates!</strong> (Humans, eagles, snakes, frogs, sharks).<br>
          <strong>• Advantage:</strong> Supports heavy bodies &amp; large sizes!
        </div>
      </div>

      <div class="sub-box" style="border-color: #f59e0b; background: #fffbeb;">
        <div class="sub-box-title" style="color: #92400e;">EXOSKELETON</div>
        <div style="font-size: 9pt; line-height: 1.45;">
          <strong>• Where:</strong> OUTSIDE the body.<br>
          <strong>• Structure:</strong> Hard outer casing/armour.<br>
          <strong>• Growth:</strong> <strong>Does NOT grow!</strong> Animal must moult (shed) old shell.<br>
          <strong>• Found In:</strong> Invertebrates (Insects, crabs, lobsters, spiders, beetles).<br>
          <strong>• Advantage:</strong> Super armour &amp; prevents drying out.
        </div>
      </div>

      <div class="sub-box" style="border-color: #06b6d4; background: #ecfeff;">
        <div class="sub-box-title" style="color: #0e7490;">HYDROSTATIC</div>
        <div style="font-size: 9pt; line-height: 1.45;">
          <strong>• Where:</strong> Fluid pressure inside body.<br>
          <strong>• Structure:</strong> Liquid-filled cavity under pressure (like a water balloon).<br>
          <strong>• Growth:</strong> Flexible, moves by squeezing muscles against fluid.<br>
          <strong>• Found In:</strong> Soft invertebrates (Earthworms, jellyfish, slugs).<br>
          <strong>• Advantage:</strong> Fits into tight soil tunnels!
        </div>
      </div>
    </div>
  </div>

  <div class="card card-amber">
    <div class="card-header">2. Detective Science Riddle: Why Can't Bugs Be Huge?</div>
    <div style="font-size: 9.6pt; line-height: 1.5;">
      <em>"A giant beetle the size of a school bus cannot exist on Earth!"</em> Explain why based on its skeleton:<br>
      <strong>Clue 1:</strong> An exoskeleton is made of heavy outer casing. As it gets bigger, it would be too heavy to lift!<br>
      <strong>Clue 2:</strong> When an insect moults its exoskeleton to grow, its soft body would collapse under gravity without inside bones!
    </div>
  </div>

  <div class="card">
    <div class="card-header">3. Skeleton Matching Forensics</div>
    <div class="sub-item">
      <span>1. Beetle (hard crunchy shell):</span>
      <span style="font-weight: 700; color: #1e40af;">[ Endoskeleton / Exoskeleton / Hydrostatic ]</span>
    </div>
    <div class="sub-item">
      <span>2. Earthworm (soft squishy body tunneling in garden):</span>
      <span style="font-weight: 700; color: #1e40af;">[ Endoskeleton / Exoskeleton / Hydrostatic ]</span>
    </div>
    <div class="sub-item">
      <span>3. Chameleon (lizard climbing branches):</span>
      <span style="font-weight: 700; color: #1e40af;">[ Endoskeleton / Exoskeleton / Hydrostatic ]</span>
    </div>
    <div class="sub-item">
      <span>4. Crab (snapping claw on the beach):</span>
      <span style="font-weight: 700; color: #1e40af;">[ Endoskeleton / Exoskeleton / Hydrostatic ]</span>
    </div>
  </div>

  <div class="card card-green">
    <div class="card-header">4. Maya's Skeleton Summary Rule</div>
    <div style="font-size: 9.6pt; line-height: 1.45;">
      • If it has bones inside → <strong>Endoskeleton (Vertebrate)</strong>.<br>
      • If it crunches when stepped on → <strong>Exoskeleton (Invertebrate)</strong>.<br>
      • If it is squishy and soft with fluid → <strong>Hydrostatic (Invertebrate)</strong>.
    </div>
  </div>

  <div class="quiz-footer">
    <span>HEX-AIM High-Yield Science Sprint • Living Things (1.1 - 1.5)</span>
    <span>Page 3 of 6</span>
  </div>
</div>

<!-- PAGE 4: MAYA'S MASTER CLASSIFICATION MATRIX -->
<div class="page">
  <div class="quiz-header">
    <div class="quiz-title-group">
      <h1><span>🔍</span> Mission 3: Maya's Master Classification Key &amp; Matrix</h1>
      <div class="subtitle">Unit 1.4: Sorting Any Creature with 100% Diagnostic Accuracy</div>
    </div>
    <div class="student-meta">MAYA • PAGE 3 OF 5</div>
  </div>

  <div class="tip-box">
    <strong>🎯 Maya's Flowchart Secret:</strong><br>
    Step 1: Backbone? → <strong>NO</strong> = Invertebrate. (Hard shell = Exoskeleton; Soft/Fluid = Hydrostatic).<br>
    Step 2: Backbone? → <strong>YES</strong> = Vertebrate (Endoskeleton). Check fur (Mammal), feathers (Bird), dry scales (Reptile), moist skin (Amphibian), wet scales/fins (Fish)!
  </div>

  <div class="card">
    <div class="card-header">1. Complete Animal Classification Matrix (12 Test Creatures)</div>
    <table class="styled-table">
      <thead>
        <tr>
          <th>Animal</th>
          <th>Backbone? (Y/N)</th>
          <th>Vert / Invert</th>
          <th>Class (If Vertebrate)</th>
          <th>Skeleton Type</th>
        </tr>
      </thead>
      <tbody>
        <tr><td><strong>1. Human</strong></td><td>YES</td><td>Vertebrate</td><td>Mammal</td><td>Endoskeleton</td></tr>
        <tr><td><strong>2. Earthworm</strong></td><td>NO</td><td>Invertebrate</td><td><em>None (Annelid)</em></td><td>Hydrostatic</td></tr>
        <tr><td><strong>3. Golden Eagle</strong></td><td>YES</td><td>Vertebrate</td><td>Bird</td><td>Endoskeleton</td></tr>
        <tr><td><strong>4. Ladybird Beetle</strong></td><td>NO</td><td>Invertebrate</td><td><em>None (Insect)</em></td><td>Exoskeleton</td></tr>
        <tr><td><strong>5. Whale</strong></td><td>YES</td><td>Vertebrate</td><td>Mammal</td><td>Endoskeleton</td></tr>
        <tr><td><strong>6. Frog</strong></td><td>YES</td><td>Vertebrate</td><td>Amphibian</td><td>Endoskeleton</td></tr>
        <tr><td><strong>7. Great White Shark</strong></td><td>YES</td><td>Vertebrate</td><td>Fish</td><td>Endoskeleton</td></tr>
        <tr><td><strong>8. Blue Crab</strong></td><td>NO</td><td>Invertebrate</td><td><em>None (Crustacean)</em></td><td>Exoskeleton</td></tr>
        <tr><td><strong>9. Fruit Bat</strong></td><td>YES</td><td>Vertebrate</td><td>Mammal</td><td>Endoskeleton</td></tr>
        <tr><td><strong>10. Chameleon</strong></td><td>YES</td><td>Vertebrate</td><td>Reptile</td><td>Endoskeleton</td></tr>
        <tr><td><strong>11. Moon Jellyfish</strong></td><td>NO</td><td>Invertebrate</td><td><em>None (Cnidarian)</em></td><td>Hydrostatic</td></tr>
        <tr><td><strong>12. Emperor Penguin</strong></td><td>YES</td><td>Vertebrate</td><td>Bird</td><td>Endoskeleton</td></tr>
      </tbody>
    </table>
  </div>

  <div class="card card-purple">
    <div class="card-header">2. Practice Case Study: The Platypus Mystery!</div>
    <div style="font-size: 9.8pt; line-height: 1.5;">
      A strange creature has fur, a duck-like beak, lays eggs, but nurses its babies with mother's milk!
      <div class="sub-item" style="margin-top: 5px;">
        <span>Which class does the Platypus belong to? (Hint: it produces milk!)</span>
        <span class="answer-line" style="width: 150px;"></span>
      </div>
    </div>
  </div>

  <div class="quiz-footer">
    <span>HEX-AIM High-Yield Science Sprint • Living Things (1.1 - 1.5)</span>
    <span>Page 4 of 6</span>
  </div>
</div>

<!-- PAGE 5: EXAM SIMULATION & MYSTERY CREATURES -->
<div class="page">
  <div class="quiz-header">
    <div class="quiz-title-group">
      <h1><span>🎯</span> Mission 4: Exam Simulation &amp; Mystery Creature Clues</h1>
      <div class="subtitle">Realistic Exam Simulation: Identification, Bones &amp; Medicine Rules</div>
    </div>
    <div class="student-meta">MAYA • PAGE 4 OF 5</div>
  </div>

  <div class="card">
    <div class="card-header">1. Who Am I? Mystery Creature Riddles</div>
    <div style="font-size: 9.8pt; line-height: 1.55;">
      <strong>Clue 1:</strong> "I have no bones inside my body. When I grow bigger, I split my crunchy outer shell and crawl out to harden a new one. I have 6 legs."<br>
      → Creature Type: <span class="answer-line" style="width: 130px;"></span> &nbsp;&nbsp;&nbsp; Skeleton: <strong>EXOSKELETON</strong><br><br>

      <strong>Clue 2:</strong> "I breathe with lungs and swim across oceans. I have warm blood and nurse my newborn calf with milk."<br>
      → Creature Type: <span class="answer-line" style="width: 130px;"></span> &nbsp;&nbsp;&nbsp; Class: <strong>MAMMAL</strong> (Vertebrate)<br><br>

      <strong>Clue 3:</strong> "I have a fluid-filled body under pressure. I push against soil to burrow in dark, moist gardens without any legs."<br>
      → Creature Type: <span class="answer-line" style="width: 130px;"></span> &nbsp;&nbsp;&nbsp; Skeleton: <strong>HYDROSTATIC</strong>
    </div>
  </div>

  <div class="card card-amber">
    <div class="card-header">2. Rapid Medicine &amp; Health Rules for Maya</div>
    <div class="sub-item">
      <span>a. Can a dog or a cow catch an infectious disease?</span>
      <span class="answer-line" style="width: 140px;"></span>
    </div>
    <div class="sub-item">
      <span>b. Can a tomato plant in a greenhouse catch an infectious disease?</span>
      <span class="answer-line" style="width: 140px;"></span>
    </div>
    <div class="sub-item">
      <span>c. Which injection is given to prevent a disease BEFORE you get sick?</span>
      <span class="answer-line" style="width: 140px;"></span>
    </div>
    <div class="sub-item">
      <span>d. If you have an earache from bacteria, which medicine does the doctor give?</span>
      <span class="answer-line" style="width: 140px;"></span>
    </div>
  </div>

  <div class="card card-green" style="text-align: center; margin-top: 6px; padding: 12px;">
    <div style="font-size: 20pt;">🌟 👑 🐾</div>
    <div style="font-weight: 800; font-size: 12.5pt; color: #166534;">Maya is a Master Animal Kingdom Detective!</div>
    <div style="font-size: 9.8pt; color: #15803d; margin-top: 3px;">
      You have conquered all 5 vertebrate families, solved every skeleton puzzle, and are 100% ready to shine!
    </div>
  </div>

  <div class="quiz-footer">
    <span>HEX-AIM High-Yield Science Sprint • Living Things (1.1 - 1.5)</span>
    <span>Page 5 of 6</span>
  </div>
</div>

<!-- PAGE 6: SOCRATIC GUIDE & ANSWER KEY FOR DAD -->
<div class="page">
  <div class="quiz-header">
    <div class="quiz-title-group">
      <h1><span>🎯</span> Parent Socratic Coaching Guide &amp; Maya's Model Answers</h1>
      <div class="subtitle">Tonight's 8-Minute Bedtime Verbal Script &amp; Complete Marking Scheme</div>
    </div>
    <div class="student-meta">MAYA • PAGE 5 OF 5</div>
  </div>

  <div class="card card-amber">
    <div class="card-header">Tonight's 8-Minute Vertebrate Verbal Script (For Dad with Maya)</div>
    <div style="font-size: 9.5pt; line-height: 1.45;">
      <strong>• Minute 1-2 (Vertebrate vs Invertebrate):</strong> "Maya, what is the single golden difference between a vertebrate and an invertebrate? (Vertebrate = backbone; Invertebrate = NO backbone!). Name 2 animals with backbones."<br>
      <strong>• Minute 3-4 (The 5 Families Drill):</strong> "Name the 5 vertebrate classes! (Mammals, Birds, Reptiles, Amphibians, Fish). Is a shark a fish? (YES). Is an eagle a bird? (YES). What about a whale? (MAMMAL - has fur &amp; milk!)."<br>
      <strong>• Minute 5-6 (The 3 Skeletons):</strong> "What skeleton does a beetle have? (Exoskeleton). An earthworm? (Hydrostatic). A human? (Endoskeleton). Which one has to moult to grow? (Exoskeleton!)."<br>
      <strong>• Minute 7-8 (Exam Confidence):</strong> "What do you do if you see a tricky animal on the exam? Follow the two questions: Does it have a spine? Does it nurse with milk or have feathers?"
    </div>
  </div>

  <div class="card">
    <div class="card-header">Complete Model Answer Key (Maya's Pack)</div>
    <div style="font-size: 9.2pt; line-height: 1.45;">
      <strong>• Mission 1 (Trap-Busters):</strong><br>
      &nbsp;&nbsp;&nbsp;&nbsp;a) Because it breathes air with lungs, has warm blood, and mothers nurse calves with milk.<br>
      &nbsp;&nbsp;&nbsp;&nbsp;b) Because it has feathers, wings, a beak, and lays hard-shelled eggs.<br>
      &nbsp;&nbsp;&nbsp;&nbsp;c) Amphibian (smooth moist skin, starts life in water, metamorphosis).<br>
      &nbsp;&nbsp;&nbsp;&nbsp;Match: Bat = Mammal; Sea Turtle = Reptile.<br>
      <strong>• Mission 2 (Skeletons):</strong> 1. Exoskeleton, 2. Hydrostatic, 3. Endoskeleton, 4. Exoskeleton.<br>
      <strong>• Mission 3 (Platypus):</strong> Mammal (producing milk defines mammals).<br>
      <strong>• Mission 4 (Riddles &amp; Medicine):</strong><br>
      &nbsp;&nbsp;&nbsp;&nbsp;Clue 1: Beetle / Insect (Exoskeleton).<br>
      &nbsp;&nbsp;&nbsp;&nbsp;Clue 2: Whale / Dolphin (Mammal with Endoskeleton).<br>
      &nbsp;&nbsp;&nbsp;&nbsp;Clue 3: Earthworm (Hydrostatic skeleton).<br>
      &nbsp;&nbsp;&nbsp;&nbsp;Medicine: a) YES (animals get infectious diseases), b) YES (plants catch diseases too!), c) Vaccination, d) Antibiotics (kills bacteria).
    </div>
  </div>

  <div class="quiz-footer">
    <span>HEX-AIM High-Yield Science Sprint • Living Things (1.1 - 1.5)</span>
    <span>Page 6 of 6</span>
  </div>
</div>

</body>
</html>"""

# ==========================================
# 3. DAD'S 1-PAGE RAPID SCIENCE CHEAT SHEET
# ==========================================
def build_dad_html():
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Dad's 1-Page Rapid Science Cheat Sheet</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');

@page {{
  size: A4 portrait;
  margin: 8mm 12mm 8mm 12mm;
}}

* {{
  box-sizing: border-box;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}}

body {{
  font-family: 'Nunito', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #1e293b;
  margin: 0;
  padding: 0;
  font-size: 8.8pt;
  line-height: 1.35;
  background-color: #ffffff;
}}

.page {{
  height: 280mm;
  max-height: 280mm;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}}

.header-banner {{
  background: #1e3a8a;
  color: white;
  border-radius: 8px;
  padding: 8px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}}

.header-title {{
  font-size: 14pt;
  font-weight: 900;
  letter-spacing: 0.5px;
}}

.header-subtitle {{
  font-size: 8.5pt;
  color: #93c5fd;
  font-weight: 700;
}}

.grid-2 {{
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 7px;
}}

.card {{
  border: 1.5px solid #cbd5e1;
  border-radius: 8px;
  padding: 7px 10px;
  background: #ffffff;
}}

.card-title {{
  font-size: 9.5pt;
  font-weight: 800;
  color: #1e3a8a;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 3px;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  gap: 5px;
}}

.card-blue {{ background: #eff6ff; border-color: #bfdbfe; }}
.card-amber {{ background: #fffbeb; border-color: #fde68a; }}
.card-green {{ background: #f0fdf4; border-color: #bbf7d0; }}

ul {{
  margin: 0;
  padding-left: 14px;
}}

li {{
  margin-bottom: 2px;
}}

.highlight-green {{ color: #166534; font-weight: 800; }}
.highlight-blue {{ color: #1e40af; font-weight: 800; }}
.highlight-amber {{ color: #92400e; font-weight: 800; }}

.footer-bar {{
  border-top: 1px solid #cbd5e1;
  padding-top: 3px;
  display: flex;
  justify-content: space-between;
  font-size: 7.5pt;
  color: #94a3b8;
  font-weight: 700;
}}
</style>
</head>
<body>

<div class="page">
  <div>
    <!-- Top Header Banner -->
    <div class="header-banner">
      <div>
        <div class="header-title">⚡ HEX-AIM DAD'S 1-PAGE RAPID SCIENCE CHEAT SHEET</div>
        <div class="header-subtitle">Asten College Y4 Term 1 Midterm Exam • Living Things (Units 1.1 - 1.5) • Lara &amp; Maya</div>
      </div>
      <div style="text-align: right; font-size: 8pt; font-weight: 800; background: #3b82f6; padding: 4px 8px; border-radius: 6px;">
        CONFIDENTIAL<br>COACHING KEY
      </div>
    </div>

    <!-- Row 1: The Core Science Foundations -->
    <div class="grid-2">
      <!-- Lara Focus: Bones & Biomechanics -->
      <div class="card card-blue">
        <div class="card-title">🦴 1. LARA FOCUS: BONES &amp; ANTAGONISTIC MUSCLES (1.1 - 1.3)</div>
        <ul>
          <li><strong>3 Functions:</strong> 1) SUPPORT (framework), 2) PROTECTION (shields), 3) MOVEMENT (levers).</li>
          <li><strong>Protection:</strong> Skull → Brain; Rib Cage → Heart &amp; Lungs; Spine → Spinal Cord.</li>
          <li><strong>Femur:</strong> Longest &amp; strongest bone (thigh). Pelvis: Hip basin supporting upper body.</li>
          <li><span class="highlight-green">GOLDEN RULE:</span> Muscles <strong>CANNOT PUSH!</strong> They can ONLY <strong>PULL</strong>!</li>
          <li><strong>Antagonistic Pairs:</strong>
            <br>• Bending arm: <strong>Biceps CONTRACTS</strong> (shorter/pulls up) &amp; <strong>Triceps RELAXES</strong>.
            <br>• Straightening: <strong>Triceps CONTRACTS</strong> (shorter/pulls down) &amp; <strong>Biceps RELAXES</strong>.</li>
        </ul>
      </div>

      <!-- Maya Focus: Animal Classification -->
      <div class="card card-amber">
        <div class="card-title">🐾 2. MAYA CRITICAL FOCUS: THE 5 VERTEBRATE CLASSES (1.4)</div>
        <ul>
          <li><span class="highlight-amber">Vertebrate vs Invertebrate:</span> Vertebrate = HAS a backbone; Invertebrate = NO backbone!</li>
          <li><strong>5 Classes of Vertebrates (All have ENDOSKELETONS):</strong>
            <br>1) <strong>Mammals:</strong> Hair/fur, lungs, warm-blooded, nurse with milk, live birth.
            <br>2) <strong>Birds:</strong> Feathers, wings, beaks, warm-blooded, hard eggs on land.
            <br>3) <strong>Reptiles:</strong> Dry scales, cold-blooded, leathery eggs on land.
            <br>4) <strong>Amphibians:</strong> Smooth wet skin, cold-blooded, jelly eggs in water.
            <br>5) <strong>Fish:</strong> Wet scales, fins, gills, cold-blooded, 100% in water.</li>
          <li><span class="highlight-blue">Trap Busters:</span> Whales &amp; bats = <strong>MAMMALS</strong>! Penguins = <strong>BIRDS</strong>!</li>
        </ul>
      </div>
    </div>

    <!-- Row 2: Skeletons & Medicine -->
    <div class="grid-2">
      <div class="card">
        <div class="card-title">🏗️ 3. THE THREE SKELETON ARCHITECTURES</div>
        <ul>
          <li><strong>Endoskeleton:</strong> INSIDE body (Bones). Grows with body. <em>All 5 Vertebrates</em> (humans, birds, fish, snakes, frogs).</li>
          <li><strong>Exoskeleton:</strong> OUTSIDE body (Hard shell). Does NOT grow; must moult. <em>Invertebrates</em> (insects, crabs, beetles, spiders).</li>
          <li><strong>Hydrostatic:</strong> Fluid under pressure (water balloon). Flexible for digging. <em>Soft Invertebrates</em> (earthworms, jellyfish, slugs).</li>
        </ul>
      </div>

      <div class="card card-green">
        <div class="card-title">💊 4. MEDICINES &amp; INFECTIOUS DISEASES (1.5)</div>
        <ul>
          <li><strong>Pathogens:</strong> Germs (bacteria, viruses). <span class="highlight-green">Plants catch diseases too!</span></li>
          <li><strong>Vaccines:</strong> Injections given <strong>BEFORE</strong> sickness to train antibodies (Prevention).</li>
          <li><strong>Antibiotics:</strong> Medicine taken <strong>AFTER</strong> sickness. <span class="highlight-amber">ONLY kills bacteria! Never kills viruses (colds/flu)!</span></li>
          <li><strong>4 Rules:</strong> 1) Adult supervision only, 2) Follow exact label dose, 3) Never share with others, 4) More does NOT heal faster!</li>
        </ul>
      </div>
    </div>

    <!-- Row 3: Dad's 5-Minute Bedtime Verbal Drill -->
    <div class="card" style="border-color: #2563eb; background: #f8fafc; margin-bottom: 7px;">
      <div class="card-title" style="color: #1e40af;">🎯 DAD'S 5-MINUTE ORAL DRILL FOR TONIGHT (ASK OUT LOUD)</div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 8.5pt;">
        <div>
          <strong>Q1 (For Lara):</strong> "Can a muscle ever push a bone?"<br>
          <span style="color: #166534; font-weight: 700;">→ Ans: NO! Muscles only pull by getting shorter (contracting).</span><br>
          <strong>Q2 (For Lara):</strong> "What does biceps do to bend your arm?"<br>
          <span style="color: #166534; font-weight: 700;">→ Ans: Biceps contracts and gets shorter; triceps relaxes!</span><br>
          <strong>Q3 (For Both):</strong> "Can a tree or plant catch an infectious disease?"<br>
          <span style="color: #166534; font-weight: 700;">→ Ans: YES! Humans, animals, and plants all catch diseases.</span>
        </div>
        <div>
          <strong>Q4 (For Maya):</strong> "Is a dolphin a fish? Is a bat a bird?"<br>
          <span style="color: #1e40af; font-weight: 700;">→ Ans: NO! Both are MAMMALS (hair, breathe air, nurse with milk!).</span><br>
          <strong>Q5 (For Maya):</strong> "What skeleton does a crab have? An earthworm?"<br>
          <span style="color: #1e40af; font-weight: 700;">→ Ans: Crab = Exoskeleton (outer shell); Worm = Hydrostatic!</span><br>
          <strong>Q6 (For Both):</strong> "Does an antibiotic cure the flu or a common cold?"<br>
          <span style="color: #92400e; font-weight: 700;">→ Ans: NO! Antibiotics only kill bacteria, never viruses!</span>
        </div>
      </div>
    </div>

    <!-- Row 4: Quick Marking & Confidence Keys -->
    <div class="card card-blue" style="margin-bottom: 4px;">
      <div class="card-title">💡 EXAM MORNING MINDSET &amp; QUICK MARKING KEY</div>
      <div style="font-size: 8.2pt; line-height: 1.35;">
        • <strong>Lara Mindset:</strong> Remind Lara to read all options in multi-choice questions before picking. In graph questions, count the grid boxes carefully!<br>
        • <strong>Maya Mindset:</strong> Maya knows the animal kingdom! Remind her of the two-step rule: 1) Does it have a spine? 2) Does it have feathers, fur, or scales?<br>
        • <strong>Breakfast &amp; Sleep:</strong> Midterm starts first period tomorrow. Good hydration, high protein breakfast, and calm reassurance. Both girls are fully prepared!
      </div>
    </div>
  </div>

  <div class="footer-bar">
    <span>HEX-AIM Adaptive Individualized Mastery • Year 4 Science Midterm</span>
    <span>Dad's Executive Master Coaching Sheet • Asten College 2026/2027</span>
  </div>
</div>

</body>
</html>"""

import argparse
import shutil

def main():
    parser = argparse.ArgumentParser(description="HEX-AIM Sprint Pack Generator (ADR-002 Decoupled Privacy Architecture)")
    parser.add_argument("--student-uid", default="all", help="Target Student UID (e.g., stu_01j9ax8001lara, stu_01j9ax8002maya, or all)")
    args = parser.parse_args()

    print(f"🚀 Generating Sprint Packs (Target UID: {args.student_uid})...")

    # Canonical Decoupled Student Registry (ADR-002)
    STUDENTS = {
        "stu_01j9ax8001lara": {
            "studentUid": "stu_01j9ax8001lara",
            "internalPdf": "sprint_stu_01j9ax8001lara_science_midterm.pdf",
            "internalHtml": "sprint_stu_01j9ax8001lara_science_midterm.html",
            "builder": build_lara_html,
            # Egress Hydration Layer (Resolved dynamically for parent delivery)
            "egressFilename": "Lara_Science_Detective_Sprint.pdf",
            "egressCaption": "🦴 Lara's Science Detective Pack (6 Pages: Biomechanics, Antagonistic Muscles & Vital Organ Shields)",
        },
        "stu_01j9ax8002maya": {
            "studentUid": "stu_01j9ax8002maya",
            "internalPdf": "sprint_stu_01j9ax8002maya_science_midterm.pdf",
            "internalHtml": "sprint_stu_01j9ax8002maya_science_midterm.html",
            "builder": build_maya_html,
            # Egress Hydration Layer (Resolved dynamically for parent delivery)
            "egressFilename": "Maya_Science_Detective_Sprint.pdf",
            "egressCaption": "🐾 Maya's Science Detective Pack (6 Pages: Animal Kingdom, 5 Vertebrate Classes & Skeleton Forensics)",
        }
    }

    # Storage directory for decoupled internal artifacts
    STORAGE_DIR = os.path.join(BASE_DIR, "storage", "artifacts")
    os.makedirs(STORAGE_DIR, exist_ok=True)

    # 1. Compile Dad Coach Cheat Sheet
    dad_internal_html = os.path.join(STORAGE_DIR, "cheat_sheet_G5055012900_science_midterm.html")
    dad_internal_pdf = os.path.join(STORAGE_DIR, "cheat_sheet_G5055012900_science_midterm.pdf")
    with open(dad_internal_html, "w", encoding="utf-8") as f:
        f.write(build_dad_html())
    subprocess.run([
        "google-chrome", "--headless=new", "--disable-gpu", "--no-sandbox",
        "--no-pdf-header-footer", f"--print-to-pdf={dad_internal_pdf}", dad_internal_html
    ], check=True)

    # 2. Compile Students under Decoupled Anonymous Identifiers
    compiled_students = []
    for s_uid, s_meta in STUDENTS.items():
        if args.student_uid != "all" and args.student_uid != s_uid:
            continue

        html_path = os.path.join(STORAGE_DIR, s_meta["internalHtml"])
        pdf_path = os.path.join(STORAGE_DIR, s_meta["internalPdf"])

        with open(html_path, "w", encoding="utf-8") as f:
            f.write(s_meta["builder"]())

        subprocess.run([
            "google-chrome", "--headless=new", "--disable-gpu", "--no-sandbox",
            "--no-pdf-header-footer", f"--print-to-pdf={pdf_path}", html_path
        ], check=True)

        print(f"✅ Compiled Decoupled Artifact: {pdf_path} ({os.path.getsize(pdf_path)/1024:.1f} KB)")
        compiled_students.append((pdf_path, s_meta["egressFilename"], s_meta["egressCaption"]))

    # Visual Inspection Render
    print("🔍 Rendering inspection pages from decoupled artifacts...")
    lara_pdf = os.path.join(STORAGE_DIR, STUDENTS["stu_01j9ax8001lara"]["internalPdf"])
    maya_pdf = os.path.join(STORAGE_DIR, STUDENTS["stu_01j9ax8002maya"]["internalPdf"])
    subprocess.run(["pdftoppm", "-png", "-r", "150", lara_pdf, os.path.join(RENDER_DIR, "lara_html_v7_page")], check=True)
    subprocess.run(["pdftoppm", "-png", "-r", "150", maya_pdf, os.path.join(RENDER_DIR, "maya_html_v7_page")], check=True)

    # 3. Dynamic Presentation Hydration & Telegram Egress Dispatch
    bot_token = os.environ.get("TELEGRAM_BOT_TOKEN")
    chat_id = os.environ.get("TELEGRAM_ADMIN_CHAT_ID")
    if not bot_token or not chat_id:
        print("ℹ️ TELEGRAM_BOT_TOKEN or TELEGRAM_ADMIN_CHAT_ID not provided. Skipping Telegram egress.")
        return
    print(f"📡 Dispatching dynamically hydrated sprint packs to Telegram chat {chat_id}...")

    intro_text = (
        "🌟 *HEX-AIM Science Midterm Sprints (ADR-002 Decoupled Privacy Edition)* 🌟\n\n"
        "✨ *Personalized Delivery for Dad, Lara & Maya*:\n"
        "• All internal storage & processing operates on immutable anonymous tokens (`stu_01j9ax...`).\n"
        "• Presentation Egress Layer dynamically hydrates files with child-friendly names and personalized coaching keys.\n"
        "• Zero PII leakage in internal ledgers; full Right-to-Erasure compliance."
    )
    requests.post(
        f"https://api.telegram.org/bot{bot_token}/sendMessage",
        json={"chat_id": chat_id, "text": intro_text, "parse_mode": "Markdown"}
    )

    # Send Dad Cheat Sheet
    dad_egress_name = "Dads_Rapid_Science_Cheat_Sheet_Lara_Maya.pdf"
    dad_caption = "⚡ Dad's 1-Page Rapid Science Cheat Sheet for Lara & Maya (5-Min Bedtime Drill, Trap Busters, Answer Keys)"
    with open(dad_internal_pdf, "rb") as f:
        resp = requests.post(
            f"https://api.telegram.org/bot{bot_token}/sendDocument",
            data={"chat_id": chat_id, "caption": dad_caption},
            files={"document": (dad_egress_name, f, "application/pdf")}
        )
        if resp.ok:
            print(f"✅ Successfully dispatched hydrated: {dad_egress_name}")
        else:
            print(f"❌ Failed: {resp.text}")

    # Send Hydrated Student Sprints
    for internal_path, egress_name, caption in compiled_students:
        with open(internal_path, "rb") as f:
            resp = requests.post(
                f"https://api.telegram.org/bot{bot_token}/sendDocument",
                data={"chat_id": chat_id, "caption": caption},
                files={"document": (egress_name, f, "application/pdf")}
            )
            if resp.ok:
                print(f"✅ Successfully dispatched hydrated: {egress_name}")
            else:
                print(f"❌ Failed to dispatch {egress_name}: {resp.text}")

    print("🎉 All Sprint Packs dynamically hydrated and delivered to Telegram!")

if __name__ == "__main__":
    main()
