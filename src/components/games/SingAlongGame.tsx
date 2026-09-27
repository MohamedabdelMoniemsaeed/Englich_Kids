import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, Sparkles, Music } from 'lucide-react';
import { playChime, speakWord, playNote } from '../../utils/sound';
import confetti from 'canvas-confetti';

interface SingAlongGameProps {
  speechRate: number;
  soundEnabled: boolean;
  onWin: (score: number, stars: number) => void;
}

interface SongInfo {
  id: string;
  titleEn: string;
  titleAr: string;
  icon: string;
  notes: number[];
  lyrics: string[];
}

const SONGS: SongInfo[] = [
  {
    id: 'abc',
    titleEn: 'ABC Alphabet Song',
    titleAr: 'أنشودة الحروف الإنجليزية',
    icon: '🔤',
    notes: [261.63, 261.63, 392.0, 392.0, 440.0, 440.0, 392.0, 349.23, 349.23, 329.63, 329.63, 293.66, 293.66, 261.63],
    lyrics: [
      'A', 'B', 'C', 'D', 'E', 'F', 'G',
      'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
      'Q', 'R', 'S', 'T', 'U', 'V',
      'W', 'X', 'Y', 'and', 'Z',
      'Now', 'I', 'know', 'my', 'ABCs',
      'Next', 'time', 'won\'t', 'you', 'sing', 'with', 'me!'
    ],
  },
  {
    id: 'numbers',
    titleEn: 'Numbers 1 to 10',
    titleAr: 'أنشودة الأرقام من 1 إلى 10',
    icon: '🔢',
    notes: [261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 493.88, 523.25],
    lyrics: [
      'One', 'Two', 'Three', 'Four', 'Five',
      'Six', 'Seven', 'Eight', 'Nine', 'Ten',
      'Let\'s', 'count', 'again', 'together',
      'One', 'Two', 'Three', 'Four', 'Five',
      'Six', 'Seven', 'Eight', 'Nine', 'Ten!'
    ],
  },
  {
    id: 'twinkle',
    titleEn: 'Twinkle Twinkle Little Star',
    titleAr: 'تألقي أيتها النجمة الصغيرة',
    icon: '⭐',
    notes: [261.63, 261.63, 392.0, 392.0, 440.0, 440.0, 392.0, 349.23, 349.23, 329.63, 329.63, 293.66, 293.66, 261.63],
    lyrics: [
      'Twinkle', 'twinkle', 'little', 'star',
      'How', 'I', 'wonder', 'what', 'you', 'are!',
      'Up', 'above', 'the', 'world', 'so', 'high',
      'Like', 'a', 'diamond', 'in', 'the', 'sky',
      'Twinkle', 'twinkle', 'little', 'star!'
    ],
  },
  {
    id: 'macdonald',
    titleEn: 'Old MacDonald Had a Farm',
    titleAr: 'مزرعة العم ماكدونالد',
    icon: '🚜',
    notes: [392.0, 392.0, 392.0, 261.63, 293.66, 293.66, 261.63],
    lyrics: [
      'Old', 'MacDonald', 'had', 'a', 'farm',
      'E', 'I', 'E', 'I', 'O!',
      'And', 'on', 'his', 'farm', 'he', 'had', 'a', 'cow',
      'E', 'I', 'E', 'I', 'O!',
      'With', 'a', 'Moo', 'Moo', 'here',
      'And', 'a', 'Moo', 'Moo', 'there!',
      'Old', 'MacDonald', 'had', 'a', 'farm!'
    ],
  },
  {
    id: 'happy',
    titleEn: 'If You\'re Happy and You Know It',
    titleAr: 'إذا كنت سعيداً صفق بيديك',
    icon: '👏',
    notes: [261.63, 261.63, 349.23, 349.23, 349.23, 349.23, 329.63, 349.23, 392.0],
    lyrics: [
      'If', 'you\'re', 'happy', 'and', 'you', 'know', 'it',
      'Clap', 'your', 'hands! 👏',
      'If', 'you\'re', 'happy', 'and', 'you', 'know', 'it',
      'Clap', 'your', 'hands! 👏',
      'If', 'you\'re', 'happy', 'and', 'you', 'know', 'it',
      'And', 'you', 'really', 'want', 'to', 'show', 'it',
      'If', 'you\'re', 'happy', 'and', 'you', 'know', 'it',
      'Shout', 'Hooray! 🎉'
    ],
  },
];

export const SingAlongGame: React.FC<SingAlongGameProps> = ({
  speechRate,
  soundEnabled,
  onWin,
}) => {
  const [selectedSongId, setSelectedSongId] = useState('abc');
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeWordIdx, setActiveWordIdx] = useState(-1);
  const isPlayingRef = useRef(false);

  const currentSong = SONGS.find((s) => s.id === selectedSongId) || SONGS[0];

  useEffect(() => {
    return () => {
      isPlayingRef.current = false;
      window.speechSynthesis?.cancel();
    };
  }, []);

  const handleStop = () => {
    isPlayingRef.current = false;
    setIsPlaying(false);
    setActiveWordIdx(-1);
    window.speechSynthesis?.cancel();
  };

  const handlePlay = () => {
    if (isPlaying) {
      handleStop();
      return;
    }

    setIsPlaying(true);
    isPlayingRef.current = true;

    let index = 0;
    const lyrics = currentSong.lyrics;
    const notes = currentSong.notes;

    const playNextWord = () => {
      if (!isPlayingRef.current) return;

      if (index >= lyrics.length) {
        setIsPlaying(false);
        isPlayingRef.current = false;
        setActiveWordIdx(-1);
        playChime('success');
        onWin(20, 5);
        confetti({ particleCount: 75, spread: 80 });
        return;
      }

      setActiveWordIdx(index);
      const word = lyrics[index];

      // Play corresponding musical synth note if enabled
      if (soundEnabled && notes && notes.length > 0) {
        const noteFreq = notes[index % notes.length];
        playNote(noteFreq, 0.28);
      }

      index++;

      if (soundEnabled) {
        speakWord(word.replace(/[!?,.👏🎉]/g, ''), speechRate * 1.08, () => {
          setTimeout(playNextWord, 130);
        });
      } else {
        setTimeout(playNextWord, 450);
      }
    };

    playNextWord();
  };

  return (
    <div className="w-full max-w-xl bg-white rounded-3xl p-4 sm:p-6 shadow-xl border-4 border-amber-200 flex flex-col items-center text-center">
      {/* Top Title */}
      <div className="w-full flex items-center justify-between mb-3">
        <div>
          <h3 className="font-fun text-xl sm:text-2xl font-black text-amber-700 flex items-center gap-1.5">
            <span>Sing-Along Karaoke</span>
            <span className="text-xl">🎵</span>
          </h3>
          <p className="text-xs text-slate-500 font-bold">أناشيد الأطفال التعليمية التفاعلية مع الكلمات والموسيقى</p>
        </div>
      </div>

      {/* Song Selectors Carousel */}
      <div className="w-full flex items-center gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
        {SONGS.map((song) => {
          const isSelected = song.id === selectedSongId;

          return (
            <button
              key={song.id}
              onClick={() => {
                handleStop();
                setSelectedSongId(song.id);
              }}
              className={`px-3 py-2 rounded-2xl font-fun font-bold text-xs shrink-0 transition-all flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-amber-500 text-white shadow-md scale-102 ring-2 ring-amber-400'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span className="text-base">{song.icon}</span>
              <span>{song.titleEn}</span>
            </button>
          );
        })}
      </div>

      {/* Big Play / Stop Button */}
      <div className="my-2">
        <button
          onClick={handlePlay}
          className={`w-20 h-20 rounded-full text-white shadow-xl flex items-center justify-center transition-all active:scale-90 cursor-pointer ${
            isPlaying
              ? 'bg-amber-600 animate-pulse ring-4 ring-amber-300'
              : 'bg-gradient-to-tr from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-emerald-200'
          }`}
          title={isPlaying ? 'Pause Song' : 'Start Sing-Along'}
        >
          {isPlaying ? <Pause className="w-10 h-10" /> : <Play className="w-10 h-10 ml-1" />}
        </button>
      </div>

      <span className="text-xs font-bold text-slate-400 mb-3">
        {isPlaying ? 'Now Playing Karaoke... 🎤' : 'Press Play to Sing Together!'}
      </span>

      {/* Karaoke Lyrics Area */}
      <div className="w-full bg-amber-50/80 border-2 border-amber-200 rounded-3xl p-5 max-h-72 overflow-y-auto flex flex-wrap justify-center gap-2 shadow-inner">
        {currentSong.lyrics.map((word, i) => {
          const isCurrent = activeWordIdx === i;

          return (
            <span
              key={i}
              className={`font-fun text-lg sm:text-xl font-bold px-2.5 py-1 rounded-xl transition-all duration-200 ${
                isCurrent
                  ? 'bg-amber-500 text-white scale-120 shadow-md -translate-y-1 ring-2 ring-amber-300'
                  : 'text-slate-700 bg-white/60'
              }`}
            >
              {word}
            </span>
          );
        })}
      </div>
    </div>
  );
};
