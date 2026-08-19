import React, { useState, useEffect, useRef } from 'react';
import { ThemeConfig, ChatMessage } from '../types';
import { Mic, MicOff, Send, Volume2, Sparkles, RefreshCw, Bot, Smile } from 'lucide-react';
import { speakWord, stopSpeaking, playChime } from '../utils/sound';

interface AiChatScreenProps {
  themeConfig: ThemeConfig;
  speechRate: number;
  soundEnabled: boolean;
}

export const AiChatScreen: React.FC<AiChatScreenProps> = ({ themeConfig, speechRate, soundEnabled }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: "Hello little friend! 🌟 I am your English teacher buddy! You can talk to me or ask me anything!",
      imageUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      timestamp: Date.now(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check for browser speech recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        playChime('pop');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputText(transcript);
          handleSendMessage(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setSpeechSupported(false);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. You can type your message below!');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      stopSpeaking();
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.warn('Recognition start error:', err);
      }
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);
    playChime('click');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query }),
      });

      const data = await res.json();
      const rawReply = data.response || data.fallback || "You are doing great learning English!";

      // Parse image tag if present [IMAGE: keyword]
      let cleanText = rawReply;
      let imageUrl = '';
      const imgMatch = rawReply.match(/\[IMAGE:\s*(.*?)\]/i);
      if (imgMatch) {
        const keyword = imgMatch[1].trim().replace(/\s+/g, ',');
        cleanText = rawReply.replace(/\[IMAGE:\s*.*?\]/gi, '').trim();
        imageUrl = `https://loremflickr.com/500/350/${encodeURIComponent(keyword)},cartoon/all`;
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: cleanText,
        imageUrl: imageUrl || undefined,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, aiMsg]);

      if (soundEnabled) {
        speakWord(cleanText, speechRate);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const fallbackMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: "Great job! Keep asking questions and practicing new words every day! 🌟",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      if (soundEnabled) {
        speakWord(fallbackMsg.text, speechRate);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const samplePrompts = [
    "Tell me a short bedtime story 📖",
    "What sound does a lion make? 🦁",
    "How do I say Good Morning in English? ☀️",
    "Teach me 3 animal names! 🐶",
  ];

  return (
    <div className="max-w-3xl mx-auto p-3 sm:p-4 flex flex-col h-[calc(100vh-80px)]">
      {/* AI Friend Intro Header */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200 flex items-center gap-4 mb-3">
        <div className="w-14 h-14 rounded-2xl bg-amber-100 p-1 flex items-center justify-center shrink-0 border-2 border-amber-300">
          <img
            src="/assets/images/AI Friend.png"
            alt="AI Friend"
            className="w-12 h-12 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/images/iconHome.png';
            }}
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-fun text-xl font-bold text-slate-800">AI Teacher Buddy</h3>
            <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-full font-bold">Online</span>
          </div>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">
            Ask questions, practice pronunciation, or listen to fun stories!
          </p>
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto space-y-4 p-2 sm:p-4 bg-white/60 backdrop-blur-xs rounded-3xl border border-white shadow-inner">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 shadow-xs ${
                  isUser ? 'bg-indigo-600 text-white' : 'bg-amber-500 text-white'
                }`}
              >
                {isUser ? '🧒' : '🤖'}
              </div>

              {/* Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-md p-4 rounded-3xl shadow-sm text-sm sm:text-base leading-relaxed ${
                  isUser
                    ? 'bg-indigo-600 text-white rounded-tr-xs font-semibold'
                    : 'bg-white text-slate-800 rounded-tl-xs border border-slate-100'
                }`}
              >
                {/* Optional Illustration image from AI */}
                {msg.imageUrl && (
                  <div className="rounded-2xl overflow-hidden mb-3 border border-slate-200 bg-slate-50 max-h-48">
                    <img
                      src={msg.imageUrl}
                      alt="Story Illustration"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}

                <div className="whitespace-pre-wrap">{msg.text}</div>

                {/* Speak button on AI responses */}
                {!isUser && (
                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => {
                        playChime('click');
                        speakWord(msg.text, speechRate);
                      }}
                      className="text-xs text-amber-600 hover:text-amber-700 font-bold flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-amber-50"
                    >
                      <Volume2 className="w-4 h-4" /> Listen
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-slate-500 bg-white/80 p-3 rounded-2xl w-fit shadow-xs animate-pulse">
            <Bot className="w-5 h-5 text-amber-500 animate-spin" />
            <span className="text-xs font-bold">AI Friend is thinking... / الصديق الذكي يجهز الرد</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto py-2 px-1 scrollbar-none">
        {samplePrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(prompt)}
            className="shrink-0 text-xs font-bold py-1.5 px-3 bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-800 rounded-full border border-slate-200 shadow-xs transition-all active:scale-95"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input / Mic Controls Bar */}
      <div className="bg-white rounded-3xl p-2.5 sm:p-3 shadow-lg border-2 border-slate-100 flex items-center gap-2">
        {/* Big Animated Mic Button */}
        <button
          id="ai-mic-button"
          onClick={toggleListening}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white transition-all shadow-md active:scale-90 shrink-0 ${
            isListening ? 'bg-red-500 animate-pulse ring-4 ring-red-200' : 'bg-amber-500 hover:bg-amber-600'
          }`}
          title={isListening ? 'Listening (Tap to stop)' : 'Tap to speak with voice'}
        >
          {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </button>

        {/* Text Input */}
        <input
          type="text"
          placeholder={isListening ? 'Listening... speak now!' : 'Type a message in English or Arabic...'}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
          className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
        />

        {/* Send Button */}
        <button
          id="ai-send-button"
          onClick={() => handleSendMessage()}
          disabled={!inputText.trim() || isLoading}
          className="p-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-2xl shadow-sm transition-all active:scale-95 shrink-0"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
