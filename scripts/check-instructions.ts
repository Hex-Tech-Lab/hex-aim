import { Redis } from '@upstash/redis';

const url = process.env.UPSTASH_REDIS_REST_URL || 'https://becoming-lioness-125833.upstash.io';
const token = process.env.UPSTASH_REDIS_REST_TOKEN || 'gQAAAAAAAeuJAAIgcDI1NTZmNDNiMzlkZjU0NTcxODQ4MTU4ZjRmMzdmNmU2Nw';

const redis = new Redis({ url, token });

async function main() {
  console.log('📡 Fetching latest Telegram instructions from Upstash Redis...');
  
  const latest = await redis.get<any>('aim:instructions:latest');
  if (!latest) {
    console.log('ℹ️ No instructions found in aim:instructions:latest');
    return;
  }

  console.log('\n======================================================');
  console.log('📌 LATEST AGY INSTRUCTION:');
  console.log(`👤 Chat ID:   ${latest.chatId}`);
  console.log(`⏱️ Timestamp: ${latest.timestamp}`);
  console.log(`📝 Text:      "${latest.instruction || latest.text}"`);

  if (latest.recentTurns && Array.isArray(latest.recentTurns) && latest.recentTurns.length > 0) {
    console.log('\n🔍 PRECEDING CHAT CONTEXT (Last turns before instruction):');
    latest.recentTurns.forEach((turn: any, i: number) => {
      const role = turn.role === 'user' ? '👤 USER' : '🤖 BOT';
      console.log(`  [${i + 1}] ${role} (${turn.timestamp}):`);
      console.log(`      ${turn.text.replace(/\n/g, '\n      ')}`);
    });
  } else {
    console.log('\nℹ️ No preceding chat context attached to this instruction.');
  }

  const logLen = await redis.llen('aim:instructions:log');
  console.log(`\n📚 Total logged instructions in history: ${logLen}`);
  console.log('======================================================\n');
}

main().catch(err => {
  console.error('Fatal error checking instructions:', err);
  process.exit(1);
});
