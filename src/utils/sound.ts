// Offline Audio Player & Web Speech API fallback for English Kids
let audioCtx: AudioContext | null = null;
let activeAudio: HTMLAudioElement | null = null;
let persistentUtterance: SpeechSynthesisUtterance | null = null;

export function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioCtxClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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
    try {
      const ctx = getAudioContext();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      if ('speechSynthesis' in window && window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    } catch {
      // ignore
    }
  };

  window.addEventListener('click', unlockAudio, { passive: true });
  window.addEventListener('touchstart', unlockAudio, { passive: true });
}

// Map English text/letters/numbers to local MP3 audio files
export function resolveAudioPath(text: string): string | null {
  if (!text) return null;

  const clean = text
    .replace(/\[IMAGE:.*?\]/gi, '')
    .replace(/[\u0600-\u06FF]/g, '') // remove Arabic
    .replace(/[\(\)\[\]\{\}\/\\,\.\:\;\!\?]/g, ' ')
    .trim()
    .toLowerCase();

  if (!clean) return null;

  // Handle two-character letter strings like "Aa", "Bb", "Zz"
  if (clean.length === 2 && clean[0] === clean[1]) {
    return `./audio/${clean[0]}.mp3`;
  }

  // Handle single letters: "a", "b", "c"...
  if (clean.length === 1 && clean >= 'a' && clean <= 'z') {
    return `./audio/${clean}.mp3`;
  }

  // Replace spaces with underscores
  const slug = clean.replace(/\s+/g, '_');
  return `./audio/${slug}.mp3`;
}

// Play offline MP3 audio file directly within user tap event
export function playAudioFile(
  path: string,
  onEnd?: () => void,
  onError?: () => void
): boolean {
  if (typeof window === 'undefined') {
    onError?.();
    return false;
  }

  try {
    // Stop any previously playing audio to avoid overlapping sound
    if (activeAudio) {
      activeAudio.pause();
      activeAudio.currentTime = 0;
      activeAudio = null;
    }

    const audio = new Audio(path);
    audio.volume = 1.0;
    audio.playbackRate = 1.0;
    activeAudio = audio;

    let finished = false;
    const handleEnd = () => {
      if (!finished) {
        finished = true;
        if (activeAudio === audio) activeAudio = null;
        onEnd?.();
      }
    };

    const handleError = () => {
      if (!finished) {
        finished = true;
        if (activeAudio === audio) activeAudio = null;
        onError?.();
      }
    };

    audio.onended = handleEnd;
    audio.onerror = handleError;

    const playPromise = audio.play();
    if (playPromise && typeof playPromise.then === 'function') {
      playPromise.catch(() => {
        handleError();
      });
    }

    return true;
  } catch {
    onError?.();
    return false;
  }
}

// Fallback to Web Speech API (speechSynthesis) if MP3 is unavailable
export function speakWithSpeechSynthesis(
  text: string,
  rate = 0.85,
  onEnd?: () => void
) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    onEnd?.();
    return;
  }

  try {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    const cleanText = text
      .replace(/\[IMAGE:.*?\]/gi, '')
      .replace(/[\u0600-\u06FF]/g, '')
      .trim();

    if (!cleanText) {
      onEnd?.();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    persistentUtterance = utterance;

    utterance.volume = 1.0;
    utterance.rate = Math.max(0.6, Math.min(rate, 1.05));
    utterance.pitch = 1.1;
    utterance.lang = 'en-US';

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice =
      voices.find(
        (v) =>
          v.lang === 'en-US' &&
          (v.name.includes('Google') ||
            v.name.includes('Natural') ||
            v.name.includes('Samantha') ||
            v.name.includes('Ava'))
      ) ||
      voices.find((v) => v.lang === 'en-US') ||
      voices[0];

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    let finished = false;
    const finish = () => {
      if (!finished) {
        finished = true;
        persistentUtterance = null;
        onEnd?.();
      }
    };

    utterance.onend = finish;
    utterance.onerror = finish;

    setTimeout(() => {
      if (!finished && !window.speechSynthesis.speaking) {
        finish();
      }
    }, 3500);

    window.speechSynthesis.speak(utterance);
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  } catch {
    onEnd?.();
  }
}

// Main word pronunciation function:
// 1. Tries offline local MP3 file in public/audio/
// 2. Automatically falls back to Web Speech API if file fails or is missing
export function speakWord(text: string, rate = 0.85, onEnd?: () => void) {
  if (typeof window === 'undefined') {
    onEnd?.();
    return;
  }

  const audioPath = resolveAudioPath(text);

  if (audioPath) {
    const success = playAudioFile(
      audioPath,
      () => {
        onEnd?.();
      },
      () => {
        // Fallback to synthesis if MP3 not found or blocked
        speakWithSpeechSynthesis(text, rate, onEnd);
      }
    );

    if (success) {
      return;
    }
  }

  // If no audio path matched, speak directly with synthesis
  speakWithSpeechSynthesis(text, rate, onEnd);
}

// Sequential pronunciation (e.g. letter "A", then word "Apple")
export function speakSequence(words: string[], rate = 0.85, onComplete?: () => void, gapMs = 120) {
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
      setTimeout(speakNext, gapMs);
    });
  }

  speakNext();
}

export function stopSpeaking() {
  if (activeAudio) {
    try {
      activeAudio.pause();
      activeAudio.currentTime = 0;
      activeAudio = null;
    } catch {
      // ignore
    }
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      persistentUtterance = null;
    } catch {
      // ignore
    }
  }
}

// UI Sound Effects
export function playChime(
  type: 'success' | 'click' | 'pop' | 'star' | 'fanfare' | 'wrong' | 'balloon' = 'click'
) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    if (type === 'success') {
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
    } else if (type === 'fanfare') {
      const chords = [
        [523.25, 659.25],
        [587.33, 698.46],
        [659.25, 783.99],
        [783.99, 1046.5, 1318.5],
      ];
      chords.forEach((chord, step) => {
        const time = now + step * 0.14;
        chord.forEach((freq) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, time);
          gain.gain.setValueAtTime(0.18, time);
          gain.gain.exponentialRampToValueAtTime(
            0.001,
            time + (step === chords.length - 1 ? 0.6 : 0.2)
          );
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(time);
          osc.stop(time + (step === chords.length - 1 ? 0.65 : 0.22));
        });
      });
    } else if (type === 'balloon') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(250, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    } else if (type === 'wrong') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.15);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.22);
    } else if (type === 'pop') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(650, now + 0.08);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === 'star') {
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
  } catch {
    // Ignore audio context errors
  }
}

export function playNote(freq: number, duration = 0.25) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.05);
  } catch {
    // Ignore
  }
}
