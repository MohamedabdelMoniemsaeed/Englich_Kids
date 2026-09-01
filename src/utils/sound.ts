// Audio synthesizer & Web Speech API integration
let audioCtx: AudioContext | null = null;
let cachedVoices: SpeechSynthesisVoice[] = [];

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioCtxClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

// Unlock audio on first user touch/click
if (typeof window !== 'undefined') {
  const unlockAudio = () => {
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    window.removeEventListener('click', unlockAudio);
    window.removeEventListener('touchstart', unlockAudio);
  };
  window.addEventListener('click', unlockAudio, { passive: true });
  window.addEventListener('touchstart', unlockAudio, { passive: true });

  // Pre-fetch speech voices
  if ('speechSynthesis' in window) {
    const updateVoices = () => {
      cachedVoices = window.speechSynthesis.getVoices();
    };
    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;
  }
}

// Play pleasant kid celebration sound
export function playChime(type: 'success' | 'click' | 'pop' | 'star' = 'click') {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    if (type === 'success') {
      // 3 pleasant harmonic notes (C5, E5, G5)
      const freqs = [523.25, 659.25, 783.99];
      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.1);
        gain.gain.setValueAtTime(0.2, now + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.1);
        osc.stop(now + i * 0.1 + 0.4);
      });
    } else if (type === 'pop') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.08);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === 'star') {
      // Sparkle sound
      const notes = [659.25, 783.99, 1046.5, 1318.5];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        gain.gain.setValueAtTime(0.15, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.3);
      });
    } else {
      // Subtle gentle tap
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    }
  } catch (err) {
    // Ignore audio context errors if browser blocks auto-audio
  }
}

// Text to speech with English accents & slow speed for kids
export function speakWord(text: string, rate = 0.85, onEnd?: () => void) {
  if (!('speechSynthesis' in window)) {
    onEnd?.();
    return;
  }

  try {
    window.speechSynthesis.cancel(); // Stop any pending speech

    const cleanText = text
      .replace(/\[IMAGE:.*?\]/gi, '')
      .replace(/[\u0600-\u06FF]/g, '') // remove Arabic text if combined so English synthesizer speaks cleanly
      .replace(/[•\-_—]/g, ' ')
      .trim();

    if (!cleanText) {
      onEnd?.();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = Math.max(0.4, Math.min(rate, 1.2));
    utterance.pitch = 1.08; // Friendly, clear kid tone
    utterance.lang = 'en-US';

    const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
    const preferredVoice =
      voices.find(
        v =>
          (v.lang === 'en-US' || v.lang.startsWith('en')) &&
          (v.name.includes('Google') ||
            v.name.includes('Natural') ||
            v.name.includes('Samantha') ||
            v.name.includes('Ava') ||
            v.name.includes('Zira'))
      ) || voices.find(v => v.lang.startsWith('en'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    let finished = false;
    const finish = () => {
      if (!finished) {
        finished = true;
        onEnd?.();
      }
    };

    utterance.onend = finish;
    utterance.onerror = finish;

    // Safety timeout in case browser gets stuck
    setTimeout(() => {
      if (!finished && window.speechSynthesis.speaking) {
        // Still speaking, that's fine
      } else if (!finished) {
        finish();
      }
    }, 5000);

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    onEnd?.();
  }
}

// Sequence speaker (e.g. speak letter "A", pause slightly, then speak word "Apple")
export function speakSequence(words: string[], rate = 0.85, onComplete?: () => void) {
  if (!words || words.length === 0) {
    onComplete?.();
    return;
  }

  let index = 0;
  function speakNext() {
    if (index >= words.length) {
      onComplete?.();
      return;
    }
    const currentWord = words[index];
    index++;
    speakWord(currentWord, rate, () => {
      setTimeout(speakNext, 250);
    });
  }

  speakNext();
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
