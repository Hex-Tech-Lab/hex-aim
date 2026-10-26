const url = process.env.UPSTASH_REDIS_REST_URL || 'https://becoming-lioness-125833.upstash.io';
const token = process.env.UPSTASH_REDIS_REST_TOKEN || 'gQAAAAAAAeuJAAIgcDI1NTZmNDNiMzlkZjU0NTcxODQ4MTU4ZjRmMzdmNmU2Nw';

async function main() {
  console.log('📡 Fetching latest Telegram instructions from Upstash Redis via REST...');
  
  const res = await fetch(url + '/get/aim:instructions:latest', {
    headers: { Authorization: 'Bearer ' + token }
  });
  const json = await res.json();
  const raw = json.result;

  if (!raw) {
    console.log('ℹ️ No instructions found in aim:instructions:latest');
    return;
  }

  const data = typeof raw === 'string' ? JSON.parse(raw) : raw;

  console.log('\n======================================================');
  console.log('📌 LATEST AGY INSTRUCTION:');
  console.log(`👤 Chat ID:   ${data.chatId}`);
  console.log(`⏱️ Timestamp: ${data.timestamp}`);
  console.log(`📝 Text:      "${data.instruction || data.text}"`);

  if (data.recentTurns && Array.isArray(data.recentTurns) && data.recentTurns.length > 0) {
    console.log('\n🔍 PRECEDING CHAT CONTEXT (Last turns before instruction):');
    data.recentTurns.forEach((turn, i) => {
      const role = turn.role === 'user' ? '👤 USER' : '🤖 BOT';
      console.log(`  [${i + 1}] ${role} (${turn.timestamp}):`);
      console.log(`      ${String(turn.text).replace(/\n/g, '\n      ')}`);
    });
  } else {
    console.log('\nℹ️ No preceding chat context attached to this instruction.');
  }

  const logRes = await fetch(url + '/llen/aim:instructions:log', {
    headers: { Authorization: 'Bearer ' + token }
  });
  const logJson = await logRes.json();
  console.log(`\n📚 Total logged instructions in history: ${logJson.result || 0}`);
  console.log('======================================================\n');
}

main().catch(err => {
  console.error('Fatal error checking instructions:', err);
  process.exit(1);
});
