const WORKER_URL = process.env.AIM_WORKER_URL || 'https://aim-bot-worker.hex-tech-lab.workers.dev';

async function main() {
  const taskNumber = process.argv[2] || 'TASK-20A';
  const action = process.argv[3] || 'Completed & Live in Production';
  const summary = process.argv[4] || 'Delivered side-by-side all-kids comparative progress card in Telegram and established AGY session acknowledgement loop.';
  const chatId = process.argv[5] || '5055012900';

  console.log(`📤 Sending AGY session confirmation receipt to chat ${chatId}...`);
  console.log(`📌 Task: ${taskNumber}`);
  console.log(`⚡ Action: ${action}`);
  console.log(`📝 Summary: "${summary}"`);

  const res = await fetch(`${WORKER_URL}/api/telegram/acknowledge`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chatId,
      taskNumber,
      action,
      summary,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error(`❌ Failed to send Telegram acknowledgement (HTTP ${res.status}): ${errText}`);
    process.exit(1);
  }

  const json = await res.json();
  console.log(`✅ Acknowledged successfully via worker:`, json);
}

main().catch(err => {
  console.error('Fatal error acknowledging instruction:', err);
  process.exit(1);
});
