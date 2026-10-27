import { AudioFactory, MessagingFactory } from '@hex-aim/adapters';
import { SocraticOralEvaluator } from '@hex-aim/core';
import type { Env } from '../worker.js';

export async function handleVoiceMessage(
  message: any,
  env: Env,
  chatId: string
): Promise<Response> {
  const messaging = MessagingFactory.getMessaging();
  const voice = message.voice || message.audio;

  if (!voice?.file_id) {
    return new Response(JSON.stringify({ ok: false, error: 'No voice file_id present' }), { status: 400 });
  }

  const durationSec = voice.duration || 5;
  await messaging.sendMessage(
    chatId,
    `🎙️ <b>Processing Voice Note (${durationSec}s)...</b>\n<i>Transcribing oral explanation and preparing Socratic guidance...</i>`
  );

  try {
    let audioBuffer: Uint8Array = new Uint8Array([0, 1, 2]); // fallback minimal buffer

    if (env.TELEGRAM_BOT_TOKEN) {
      const fileRes = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/getFile?file_id=${voice.file_id}`);
      if (fileRes.ok) {
        const fileData = await fileRes.json() as any;
        if (fileData?.result?.file_path) {
          const downloadUrl = `https://api.telegram.org/file/bot${env.TELEGRAM_BOT_TOKEN}/${fileData.result.file_path}`;
          const audioDownload = await fetch(downloadUrl);
          if (audioDownload.ok) {
            const arr = await audioDownload.arrayBuffer();
            audioBuffer = new Uint8Array(arr);
          }
        }
      }
    }

    // 1. Transcribe audio
    const audioPort = AudioFactory.getAudioTranscription();
    const transcription = await audioPort.transcribeAudio(audioBuffer, voice.mime_type || 'audio/ogg');

    // 2. Evaluate with SocraticOralEvaluator
    const evaluator = SocraticOralEvaluator.getInstance();
    const evaluation = evaluator.evaluateOralTurn({
      transcript: transcription.text,
      drillQuestion: 'Explain the difference between a vertebrate and an invertebrate.',
      targetConceptCode: 'ASTEN.Y4.SCI.VERTEBRATES.1',
      expectedKeywords: ['backbone', 'vertebrate', 'invertebrate', 'endoskeleton', 'exoskeleton'],
      commonMisconceptions: ['insects have bones', 'jellyfish are vertebrates'],
    });

    // 3. Format immediate pedagogical response
    const statusLight = evaluation.conceptMasteryPct >= 80 ? '🟢' : evaluation.conceptMasteryPct >= 50 ? '🟡' : '🔴';
    const vocabTags = evaluation.detectedKeyVocab.length > 0
      ? evaluation.detectedKeyVocab.map(v => `<code>${v}</code>`).join(' • ')
      : '<i>None detected</i>';

    const replyText = 
      `🎙️ <b>Socratic Oral Evaluation</b> (${statusLight} ${evaluation.conceptMasteryPct}% Mastery)\n\n` +
      `🗣️ <i>Transcribed:</i> "${evaluation.transcript}"\n\n` +
      `🔑 <i>Key Vocab Used:</i> ${vocabTags}\n\n` +
      `${evaluation.affirmationPraise}\n\n` +
      `🧭 <b>Next Drill Question:</b>\n${evaluation.socraticFollowUpQuestion}`;

    await messaging.sendMessage(chatId, replyText, message.message_id);

    return new Response(JSON.stringify({
      ok: true,
      action: 'voice_socratic_evaluated',
      masteryPct: evaluation.conceptMasteryPct,
      transcript: evaluation.transcript,
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('[VoiceHandler] Error processing voice note:', err);
    await messaging.sendMessage(
      chatId,
      `⚠️ <b>Audio Processing Warning:</b> Could not transcribe voice note.\n<i>${err?.message || String(err)}</i>`
    );
    return new Response(JSON.stringify({ ok: false, error: err?.message }), { status: 500 });
  }
}
