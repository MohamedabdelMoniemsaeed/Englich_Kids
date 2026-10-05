import React, { useState, useEffect } from 'react';
import { Bell, X, Sparkles, ExternalLink } from 'lucide-react';
import { ActiveBannerItem, subscribeToNotificationBanner } from '../utils/notifications';
import { playChime } from '../utils/sound';

export const SystemNotificationBanner: React.FC = () => {
  const [activeItem, setActiveItem] = useState<ActiveBannerItem | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToNotificationBanner((item) => {
      setActiveItem(item);
      playChime('pop');

      // Auto dismiss after 6.5s
      const timer = setTimeout(() => {
        setActiveItem((current) => (current?.id === item.id ? null : current));
      }, 6500);

      return () => clearTimeout(timer);
    });

    return unsubscribe;
  }, []);

  if (!activeItem) return null;

  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[100] w-[94%] max-w-md animate-slide-down pointer-events-auto">
      <div
        onClick={() => {
          playChime('success');
          setActiveItem(null);
        }}
        className="bg-slate-900/95 backdrop-blur-md text-white p-3.5 sm:p-4 rounded-3xl shadow-2xl border-2 border-amber-400/80 cursor-pointer hover:bg-slate-900 transition-all flex items-start gap-3 transform active:scale-98"
        role="alert"
        aria-live="assertive"
      >
        {/* App Icon with notification pulse */}
        <div className="relative shrink-0 mt-0.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 flex items-center justify-center shadow-md">
            <Bell className="w-5 h-5 text-white animate-bounce" />
          </div>
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-900 rounded-full animate-ping" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center justify-between text-xs text-amber-300 font-bold mb-0.5">
            <span className="flex items-center gap-1">
              <span>English Kids</span>
              <span className="text-white/40">•</span>
              <span className="text-white/70 font-normal">الآن</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-mono">
              إشعار نظام
            </span>
          </div>

          <h4 className="text-sm font-black text-white truncate drop-shadow-xs">
            {activeItem.title}
          </h4>
          <p className="text-xs text-slate-200 mt-0.5 leading-relaxed line-clamp-2">
            {activeItem.body}
          </p>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setActiveItem(null);
          }}
          className="p-1 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors shrink-0"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
