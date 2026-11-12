// Read-only: show the latest Telegram #I: instruction queued by the bot worker.
// Credentials come only from the environment. Nothing is stored in this file.
const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;
const prefix = process.env.REDIS_PREFIX ?? '';
const key = (...parts) => [prefix.replace(/:+$/, ''), ...parts].filter(Boolean).join(':');

if (!url || !token) {
  console.error('Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in the environment first.');
  process.exit(1);
}

const headers = { Authorization: 'Bearer ' + token };
const call = async (path) => {
  const res = await fetch(url + path, { headers, signal: AbortSignal.timeout(12000) });
  return res.json();
};

async function main() {
  const dbHost = new URL(url).host.split('.')[0];
  console.log(`Fetching latest instruction from ${dbHost}...`);

  const latest = await call('/get/' + key('instructions', 'latest'));
  if (latest.error) {
    console.error('Upstash error:', latest.error);
    process.exit(1);
  }
  if (!latest.result) {
    console.log('Queue is empty: no entry at ' + key('instructions', 'latest') + '.');
  } else {
    const data = typeof latest.result === 'string' ? JSON.parse(latest.result) : latest.result;
    console.log('\nLATEST INSTRUCTION');
    console.log(`Chat ID:   ${data.chatId}`);
    console.log(`Timestamp: ${data.timestamp}`);
    console.log(`Text:      "${data.instruction || data.text}"`);
    const turns = Array.isArray(data.recentTurns) ? data.recentTurns : [];
    if (turns.length) {
      console.log('\nPRECEDING CHAT CONTEXT');
      turns.forEach((turn, i) => {
        console.log(`  [${i + 1}] ${turn.role} (${turn.timestamp}): ${String(turn.text).replace(/\n/g, ' ')}`);
      });
    }
  }

  const logLen = await call('/llen/' + key('instructions', 'log'));
  console.log(`\nLogged instructions in history: ${logLen.result ?? 0}`);
}

main().catch((err) => {
  console.error('Fatal error checking instructions:', err);
  process.exit(1);
});
