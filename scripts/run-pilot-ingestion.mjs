#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { PilotBatchIngestor } from '../packages/core/dist/intake/PilotBatchIngestor.js';
import { StorageFactory, VisionFactory } from '../packages/adapters/dist/index.js';
import { SettingsManager } from '../packages/core/dist/settings/SettingsManager.js';

async function main() {
  console.log('🚀 [Pilot Intake] Initiating Live Batch Ingestion from hex-aim-private/docs/for_sharing/ ...');

  const privateDir = '/home/kellyb_dev/projects/hex-aim-private/docs/for_sharing';
  if (!fs.existsSync(privateDir)) {
    console.error(`Directory not found: ${privateDir}`);
    process.exit(1);
  }

  const entries = fs.readdirSync(privateDir);
  const targetImages = entries.filter(f => f.toLowerCase().endsWith('.jpeg') || f.toLowerCase().endsWith('.jpg'));

  console.log(`📁 Found ${targetImages.length} worksheet image candidates:`);
  targetImages.forEach(img => console.log(`  • ${img}`));

  const fileItems = targetImages.map(filename => {
    const fullPath = path.join(privateDir, filename);
    const stat = fs.statSync(fullPath);
    const buffer = fs.readFileSync(fullPath);
    const hash = crypto.createHash('sha256').update(buffer).digest('hex');
    return {
      path: fullPath,
      filename,
      fileSizeBytes: stat.size,
      hash,
    };
  });

  const isMock = process.argv.includes('--mock') || process.argv.includes('-m');
  const settings = SettingsManager.getInstance();
  const storage = StorageFactory.getStorage();
  const vision = VisionFactory.getVision(isMock ? 'mock' : undefined);

  const report = await PilotBatchIngestor.processBatch(fileItems, {
    guardianId: 'guardian_5055012900',
    defaultSchoolId: 'asten-college',
    defaultYearGroup: 'Y4',
    defaultSubject: 'science',
    defaultWeek: 8,
    storage,
    vision,
    settings,
  });

  console.log('\n─────────────────────────────────────────────────────────────────');
  console.log('📊 [Pilot Intake] Batch Processing Complete');
  console.log(`• Total Image Files:    ${report.totalFiles}`);
  console.log(`• Ingested / Processed: ${report.processedCount}`);
  console.log(`• Duplicates Skipped:   ${report.duplicatesSkipped}`);
  console.log(`• New Masters Created:  ${report.newMastersCount}`);
  console.log(`• Student Deltas Linked:${report.deltasRecordedCount}`);
  console.log('─────────────────────────────────────────────────────────────────');

  console.log('\n📄 Ingestion Breakdown by File:');
  for (const r of report.results) {
    if (r.status === 'ingested') {
      console.log(`  ✅ [${r.status.toUpperCase()}] ${r.filename}`);
      console.log(`     Student: ${r.studentId?.toUpperCase()} | Subject: ${r.subjectId} W${r.week} | Score: ${r.score}`);
      console.log(`     Canonical Master: ${r.canonicalMasterId} (New: ${r.isNewMaster})`);
    } else if (r.status === 'skipped_duplicate') {
      console.log(`  ⏱️ [SKIPPED DUP] ${r.filename} (Hash: ${r.hash.slice(0, 12)}...)`);
    } else {
      console.log(`  ❌ [FAILED] ${r.filename} — ${r.error}`);
    }
  }
}

main().catch(err => {
  console.error('Fatal ingestion error:', err);
  process.exit(1);
});
