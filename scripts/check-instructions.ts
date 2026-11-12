// Read-only: show the latest Telegram #I: instruction queued by the bot worker.
// Credentials come only from the environment. Nothing is stored in this file.
import { Redis } from '@upstash/redis';

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;
const prefix = process.env.REDIS_PREFIX ?? '';
const key = (...parts: string[]) => [prefix.replace(/:+$/, ''), ...parts].filter(Boolean).join(':');

if (!url || !token) {
  console.error('Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in the environment first.');
  process.exit(1);
}

const redis = new Redis({ url, token });

async function main() {
  const latest = await redis.get<any>(key('instructions', 'latest'));
  if (!latest) {
    console.log('Queue is empty: no entry at ' + key('instructions', 'latest') + '.');
  } else {
    const data = typeof latest === 'string' ? JSON.parse(latest) : latest;
    console.log('\nLATEST INSTRUCTION');
    console.log(`Chat ID:   ${data.chatId}`);
    console.log(`Timestamp: ${data.timestamp}`);
    console.log(`Text:      "${data.instruction || data.text}"`);
  }
  const logLen = await redis.llen(key('instructions', 'log'));
  console.log(`\nLogged instructions in history: ${logLen}`);
}

main().catch((err) => {
  console.error('Fatal error checking instructions:', err);
  process.exit(1);
});
