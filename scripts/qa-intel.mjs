import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');

const violations = [];

function scanDirectory(dir, fileCallback) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', 'dist', '.git', '.vercel', 'coverage', '.temp', '.turbo'].includes(entry.name)) {
        continue;
      }
      scanDirectory(fullPath, fileCallback);
    } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx') || entry.name.endsWith('.mjs') || entry.name.endsWith('.json'))) {
      fileCallback(fullPath);
    }
  }
}

console.log('🔍 [QA-Intel] Initiating Architecture, Boundary & Security Audit for HEX-AIM...');

// 1. Audit Hexagonal Isolation in packages/core and packages/types
scanDirectory(path.resolve(REPO_ROOT, 'packages/core/src'), (filePath) => {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split(/\r?\n/);

  lines.forEach((line, idx) => {
    if (line.includes("from '@upstash") || line.includes("from 'fetch'") || line.includes("from 'http'")) {
      violations.push({
        file: filePath,
        rule: 'HexagonalBoundaryRule',
        severity: 'CRITICAL',
        message: 'packages/core must remain pure domain logic. Direct I/O import forbidden.',
        line: idx + 1,
      });
    }
  });
});

scanDirectory(path.resolve(REPO_ROOT, 'packages/types/src'), (filePath) => {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split(/\r?\n/);

  lines.forEach((line, idx) => {
    if (line.includes("from '@upstash") || line.includes("from 'fs'") || line.includes("from 'path'")) {
      violations.push({
        file: filePath,
        rule: 'HexagonalBoundaryRule',
        severity: 'CRITICAL',
        message: 'packages/types must remain pure contracts. Direct I/O or SDK import forbidden.',
        line: idx + 1,
      });
    }
  });
});

// 2. Audit Security & Credential Leak Rule
const scannedDirs = ['packages/core/src', 'packages/adapters/src', 'packages/types/src', 'apps/bot/src', 'apps/web/src'];
for (const sub of scannedDirs) {
  scanDirectory(path.resolve(REPO_ROOT, sub), (filePath) => {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split(/\r?\n/);

    lines.forEach((line, idx) => {
      // Check for hardcoded raw API keys (e.g. sk-, AIzaSy, etc.)
      if (/(["'])AIzaSy[A-Za-z0-9_-]{33}\1/.test(line) || /(["'])sk-[A-Za-z0-9_-]{30,}\1/.test(line)) {
        violations.push({
          file: filePath,
          rule: 'CredentialLeakRule',
          severity: 'CRITICAL',
          message: 'Hardcoded API secret found in source code.',
          line: idx + 1,
        });
      }
    });
  });
}

// 3. Complexity & File Size Rule (< 600 LOC)
for (const sub of scannedDirs) {
  scanDirectory(path.resolve(REPO_ROOT, sub), (filePath) => {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lineCount = content.split(/\r?\n/).length;
    if (lineCount > 600) {
      violations.push({
        file: filePath,
        rule: 'ComplexityRule',
        severity: 'MEDIUM',
        message: `File exceeds 600 LOC threshold (${lineCount} lines). Consider modularizing.`,
      });
    }
  });
}

// Output report
console.log('─────────────────────────────────────────────────────────────────');
console.log(`📋 QA-Intel Scan Results: ${violations.length} violation(s) found.`);
console.log('─────────────────────────────────────────────────────────────────');

if (violations.length === 0) {
  console.log('✅ ALL ARCHITECTURAL INVARIANTS, BOUNDARIES, AND CREDENTIAL AUDITS PASSED CLEANLY.');
  process.exit(0);
} else {
  for (const v of violations) {
    console.error(`[${v.severity}] ${v.rule} in ${v.file}${v.line ? `:${v.line}` : ''}`);
    console.error(`       ↳ ${v.message}`);
  }
  const hasCritical = violations.some(v => v.severity === 'CRITICAL');
  if (hasCritical) {
    process.exit(1);
  }
}
