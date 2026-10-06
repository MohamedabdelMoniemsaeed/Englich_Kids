// Offline Audio Player & Web Speech API fallback for English Kids
import { AVAILABLE_AUDIO_SET } from '../data/availableAudio';

let audioCtx: AudioContext | null = null;
let activeAudio: HTMLAudioElement | null = null;
let persistentUtterance: SpeechSynthesisUtterance | null = null;
let cachedVoice: SpeechSynthesisVoice | null = null;

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

// Find and cache the best en-US voice consistently
function updateCachedVoice() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      cachedVoice =
        voices.find(
          (v) =>
            v.lang === 'en-US' &&
            (v.name.includes('Google') ||
              v.name.includes('Natural') ||
              v.name.includes('Samantha') ||
              v.name.includes('Ava') ||
              v.name.includes('Jenny'))
        ) ||
        voices.find((v) => v.lang === 'en-US') ||
        voices.find((v) => v.lang.startsWith('en')) ||
        voices[0] ||
        null;
    }
  } catch {
    // ignore
  }
}

// Unlock audio on first user touch/click
if (typeof window !== 'undefined') {
  const unlockAudio = () => {
    try {
      const ctx = getAudioContext();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      if ('speechSynthesis' in window) {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
        updateCachedVoice();
      }
    } catch {
      // ignore
    }
  };

  window.addEventListener('click', unlockAudio, { passive: true });
  window.addEventListener('touchstart', unlockAudio, { passive: true });

  if ('speechSynthesis' in window) {
    updateCachedVoice();
    window.speechSynthesis.onvoiceschanged = () => {
      updateCachedVoice();
    };
  }
}

// Map English text/letters/numbers to verified local MP3 audio files
export function resolveAudioPath(text: string): string | null {
  if (!text) return null;

  const clean = text
    .replace(/\[IMAGE:.*?\]/gi, '')
    .replace(/[\u0600-\u06FF]/g, '') // remove Arabic
    .replace(/[\(\)\[\]\{\}\/\\,\.\:\;\!\?]/g, ' ')
    .trim()
    .toLowerCase();

  if (!clean) return null;

  // 1. Two-character letter strings like "Aa", "Bb", "Zz"
  if (clean.length === 2 && clean[0] === clean[1] && AVAILABLE_AUDIO_SET.has(clean[0])) {
    return `./audio/${clean[0]}.mp3`;
  }

  // 2. Single letters: "a", "b", "c"...
  if (clean.length === 1 && AVAILABLE_AUDIO_SET.has(clean)) {
    return `./audio/${clean}.mp3`;
  }

  // 3. Numbers: "1" to "10"
  if (AVAILABLE_AUDIO_SET.has(clean)) {
    return `./audio/${clean}.mp3`;
  }

  // 4. Number word to digit or vice-versa
  const numToDigit: Record<string, string> = {
    one: '1', two: '2', three: '3', four: '4', five: '5',
    six: '6', seven: '7', eight: '8', nine: '9', ten: '10'
  };
  const digitToNum: Record<string, string> = {
    '1': 'one', '2': 'two', '3': 'three', '4': 'four', '5': 'five',
    '6': 'six', '7': 'seven', '8': 'eight', '9': 'nine', '10': 'ten'
  };
  if (numToDigit[clean] && AVAILABLE_AUDIO_SET.has(numToDigit[clean])) {
    return `./audio/${numToDigit[clean]}.mp3`;
  }
  if (digitToNum[clean] && AVAILABLE_AUDIO_SET.has(digitToNum[clean])) {
    return `./audio/${digitToNum[clean]}.mp3`;
  }

  // 5. Replace spaces with underscores
  const slug = clean.replace(/\s+/g, '_');
  if (AVAILABLE_AUDIO_SET.has(slug)) {
    return `./audio/${slug}.mp3`;
  }

  // If the file is not verified in local storage, return null immediately
  // This guarantees zero 404 network delays and instant speech fallback!
  return null;
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
    // Stop any previously playing audio
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
    let watchdog: any = null;

    const cleanup = () => {
      if (watchdog) clearTimeout(watchdog);
      if (activeAudio === audio) activeAudio = null;
    };

    const handleEnd = () => {
      if (!finished) {
        finished = true;
        cleanup();
        onEnd?.();
      }
    };

    const handleError = () => {
      if (!finished) {
        finished = true;
        cleanup();
        onError?.();
      }
    };

    audio.onended = handleEnd;
    audio.onerror = handleError;

    // Safety watchdog in case audio is interrupted or muted by OS
    watchdog = setTimeout(() => {
      if (!finished) {
        handleEnd();
      }
    }, 3800);

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

// Fallback to Web Speech API (speechSynthesis) with strict volume and voice control
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

    const cleanText = text
      .replace(/\[IMAGE:.*?\]/gi, '')
      .replace(/[\u0600-\u06FF]/g, '')
      .replace(/[\(\)\[\]\{\}\/\\,\.\:\;\!\?]/g, ' ')
      .trim();

    if (!cleanText) {
      onEnd?.();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    persistentUtterance = utterance;

    // Strict 100% volume for full audibility
    utterance.volume = 1.0;
    utterance.rate = Math.max(0.65, Math.min(rate, 1.05));
    utterance.pitch = 1.08;
    utterance.lang = 'en-US';

    if (!cachedVoice) {
      updateCachedVoice();
    }
    if (cachedVoice) {
      utterance.voice = cachedVoice;
    }

    let finished = false;
    let watchdog: any = null;

    const finish = () => {
      if (!finished) {
        finished = true;
        if (watchdog) clearTimeout(watchdog);
        persistentUtterance = null;
        onEnd?.();
      }
    };

    utterance.onend = finish;
    utterance.onerror = finish;

    // Watchdog to prevent speech synthesis queue lockup
    watchdog = setTimeout(() => {
      if (!finished) {
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
// 1. Tries offline verified studio MP3 file in public/audio/
// 2. Automatically falls back to Web Speech API instantly if missing
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
// Has clean 160ms spacing to prevent audio ducking or overlapping
export function speakSequence(
  words: string[],
  rate = 0.85,
  onComplete?: () => void,
  gapMs = 160
) {
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

// Unified praise helper:
// Plays the celebratory chime, waits 300ms for note decay, then speaks encouraging words!
// Eliminates audio ducking and volume fluctuation in all games!
export function playPraise(
  chime: 'success' | 'wrong' | 'star' | 'pop' | 'balloon' | null,
  words: string | string[],
  rate = 0.85,
  onComplete?: () => void
) {
  const wordList = Array.isArray(words) ? words : [words];
  if (chime) {
    playChime(chime);
    setTimeout(() => {
      speakSequence(wordList, rate, onComplete);
    }, 300);
  } else {
    speakSequence(wordList, rate, onComplete);
  }
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
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        gain.gain.setValueAtTime(0.25, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.28);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.3);
      });
    } else if (type === 'fanfare') {
      const chords = [
        [523.25, 659.25],
        [587.33, 698.46],
        [659.25, 783.99],
        [783.99, 1046.5, 1318.5],
      ];
      chords.forEach((chord, step) => {
        const time = now + step * 0.12;
        chord.forEach((freq) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, time);
          gain.gain.setValueAtTime(0.2, time);
          gain.gain.exponentialRampToValueAtTime(
            0.001,
            time + (step === chords.length - 1 ? 0.5 : 0.18)
          );
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(time);
          osc.stop(time + (step === chords.length - 1 ? 0.55 : 0.2));
        });
      });
    } else if (type === 'balloon') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(250, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);
      gain.gain.setValueAtTime(0.3, now);
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
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === 'pop') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(650, now + 0.07);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'star') {
      const notes = [659.25, 783.99, 1046.5, 1318.5];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        gain.gain.setValueAtTime(0.18, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.25);
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
    gain.gain.setValueAtTime(0.08, now); // Soft pleasant tone so speech is loud and clear
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.05);
  } catch {
    // Ignore
  }
}
