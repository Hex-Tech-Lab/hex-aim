/**
 * Contract Auditor for hex-aim
 * Catches "it compiles, it's not a security bug, but silently breaks contracts or hardcodes assumptions"
 * 
 * Rules:
 *   - HARDCODED_ARBITRARY_TIMEOUTS: Catches hardcoded debounce or timeout literals outside SettingsManager.
 *   - BLIND_ARRAY_SLICING: Flags blind 50/50 halving (e.g. slice(0, half)).
 *   - UNREGISTERED_SETTINGS: Flags raw process.env access bypassing SettingsManager.
 *   - SILENT_CATCH_NO_TELEMETRY: Flags empty catch blocks or error swallowing.
 *   - SILENT_SUCCESS_ON_MISSING_CONFIG: Catches scripts warning on missing config and exiting 0.
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';
import { createHash } from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');
const REPO_ROOT = join(__dirname, '..');

const SCAN_ROOTS = [
  join(REPO_ROOT, 'apps', 'bot', 'src'),
  join(REPO_ROOT, 'packages', 'core', 'src'),
  join(REPO_ROOT, 'packages', 'adapters', 'src'),
  join(REPO_ROOT, 'packages', 'types', 'src'),
];

const SKIP_DIRS = new Set(['node_modules', '.next', '.git', 'dist', 'coverage', '.turbo']);
const CODE_EXT = new Set(['.ts', '.tsx', '.js', '.mjs']);
const TEST_MARKERS = ['.test.', '.spec.', '__tests__'];

function* walk(dir) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return;
  }
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      yield* walk(full);
    } else if (CODE_EXT.has(entry.slice(entry.lastIndexOf('.')))) {
      yield full;
    }
  }
}

function isTestFile(path) {
  return TEST_MARKERS.some((m) => path.includes(m));
}

const findings = [];

// Rule 1: HARDCODED_ARBITRARY_TIMEOUTS
function auditHardcodedTimeouts(file, content) {
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? '';
    // Flag hardcoded arbitrary ms in debounce/batch logic outside settings
    if (/setTimeout\s*\([^,]+,\s*(?:4500|5500|28000|45000)\s*\)/.test(line) && !line.includes('settings.get')) {
      findings.push({
        rule: 'HARDCODED_ARBITRARY_TIMEOUTS',
        severity: 'critical',
        file,
        line: i + 1,
        why: 'Hardcoded arbitrary timeout/debounce delay found. All delays must route through SettingsManager.',
        snippet: line.trim(),
      });
    }
  }
}

// Rule 2: BLIND_ARRAY_SLICING
function auditBlindArraySlicing(file, content) {
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? '';
    if (/slice\s*\(\s*0\s*,\s*half\s*\)/i.test(line) || /Math\.ceil\s*\(\s*\w+\.length\s*\/\s*2\s*\)/.test(line)) {
      findings.push({
        rule: 'BLIND_ARRAY_SLICING',
        severity: 'critical',
        file,
        line: i + 1,
        why: 'Blind 50/50 array slicing detected. Pages must be partitioned by anchor identification or visual clustering, never halved blindly.',
        snippet: line.trim(),
      });
    }
  }
}

// Rule 3: UNREGISTERED_SETTINGS
function auditUnregisteredSettings(file, content) {
  // Exclude SettingsManager itself and tests
  if (file.includes('SettingsManager') || file.includes('check-instructions') || file.includes('contract-auditor')) return;
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? '';
    if (/process\.env\.[A-Z0-9_]+/.test(line) && !line.includes('SettingsManager') && !/NODE_ENV|VITEST/.test(line)) {
      findings.push({
        rule: 'UNREGISTERED_SETTINGS',
        severity: 'warning',
        file,
        line: i + 1,
        why: 'Raw process.env access bypassing SettingsManager. Centralized registry ensures zero hardcoding and test mockability.',
        snippet: line.trim(),
      });
    }
  }
}

// Rule 4: SILENT_CATCH_NO_TELEMETRY
function auditSilentCatchNoTelemetry(file, content) {
  if (file.includes('contract-auditor')) return;
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? '';
    // Flag empty catch: catch {} or catch (err) {}
    if (/catch\s*(?:\([^)]*\))?\s*\{\s*\}/.test(line)) {
      // Allow intentional ignores if marked with comment or Telegram deleteMessage cleanup
      if (!lines[i - 1]?.includes('catch-ignore') && !line.includes('deleteMessage')) {
        findings.push({
          rule: 'SILENT_CATCH_NO_TELEMETRY',
          severity: 'warning',
          file,
          line: i + 1,
          why: 'Empty catch block swallows error without telemetry, logging, or user feedback.',
          snippet: line.trim(),
        });
      }
    }
  }
}

// Rule 5: SILENT_SUCCESS_ON_MISSING_CONFIG
function auditSilentSuccess(file, content) {
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? '';
    if (!/console\.(warn|error)\(/.test(line)) continue;
    const isMissingConfig = /missing|not (configured|set|found)|skipping/i.test(line);
    if (!isMissingConfig) continue;
    // Look ahead a few lines for process.exit(0)
    const window = lines.slice(i, i + 5).join('\n');
    if (/process\.exit\(0\)/.test(window)) {
      findings.push({
        rule: 'SILENT_SUCCESS_ON_MISSING_CONFIG',
        severity: 'critical',
        file,
        line: i + 1,
        why: 'Script warns of missing configuration but exits 0, reporting false success.',
        snippet: line.trim(),
      });
    }
  }
}

for (const root of SCAN_ROOTS) {
  const files = [...walk(root)];
  for (const file of files) {
    if (isTestFile(file)) continue;
    const content = readFileSync(file, 'utf-8');
    const relPath = relative(REPO_ROOT, file);
    auditHardcodedTimeouts(relPath, content);
    auditBlindArraySlicing(relPath, content);
    auditUnregisteredSettings(relPath, content);
    auditSilentCatchNoTelemetry(relPath, content);
    auditSilentSuccess(relPath, content);
  }
}

for (const f of findings) {
  f.fingerprint = createHash('sha1').update(`${f.rule}:${f.file}:${f.line}`).digest('hex').slice(0, 12);
}

const criticalCount = findings.filter((f) => f.severity === 'critical').length;
const warningCount = findings.filter((f) => f.severity === 'warning').length;

console.log(JSON.stringify({
  auditedFilesCount: SCAN_ROOTS.reduce((acc, r) => acc + [...walk(r)].length, 0),
  criticalCount,
  warningCount,
  findings,
}, null, 2));

console.error(`\nContract Auditor: ${criticalCount} critical, ${warningCount} warning finding(s).`);

process.exit(criticalCount > 0 ? 1 : 0);
