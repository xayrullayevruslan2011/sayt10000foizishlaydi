import React from 'react';
import { Language, Theme } from '../types';
import { translations } from '../constants';
import { Globe, Moon, Sun, LogOut, ChevronRight } from 'lucide-react';

interface SettingsProps {
  lang: Language;
  setLang: (l: Language) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
}

const Settings: React.FC<SettingsProps> = ({ lang, setLang, theme, setTheme }) => {
  const t = translations[lang];

  return (
    <div className="p-6 space-y-8 max-w-lg mx-auto">
      <header>
        <p className="text-[10px] font-black text-[#BF953F] uppercase tracking-[0.4em]">Personalization</p>
        <h1 className="text-3xl font-black text-white">{t.settings}</h1>
      </header>

      <div className="space-y-6">
        <section className="space-y-3">
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-2">{t.language}</p>
          <div className="premium-card overflow-hidden">
            {(['uz', 'ru', 'en'] as Language[]).map((l, i) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`w-full px-6 py-5 flex items-center justify-between border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors ${lang === l ? 'text-[#BF953F]' : 'text-gray-400'}`}
              >
                <div className="flex items-center gap-4">
                  <Globe size={18} />
                  <span className="font-black text-xs uppercase tracking-widest">{l === 'uz' ? "O'zbekcha" : l === 'ru' ? "Русский" : "English"}</span>
                </div>
                {lang === l && <div className="w-2 h-2 rounded-full gold-bg shadow-[0_0_10px_rgba(191,149,63,0.5)]" />}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-2">{t.theme}</p>
          <div className="premium-card p-2">
            <div className="flex p-1 bg-black/40 rounded-2xl">
              <button 
                onClick={() => setTheme('light')}
                className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl transition-all ${theme === 'light' ? 'gold-bg text-black font-black' : 'text-gray-500'}`}
              >
                <Sun size={18} /> <span className="text-[10px] uppercase font-black">Light</span>
              </button>
              <button 
                onClick={() => setTheme('dark')}
                className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl transition-all ${theme === 'dark' ? 'gold-bg text-black font-black' : 'text-gray-500'}`}
              >
                <Moon size={18} /> <span className="text-[10px] uppercase font-black">Dark</span>
              </button>
            </div>
          </div>
        </section>

        <button
          onClick={() => { localStorage.clear(); window.location.reload(); }}
          className="w-full premium-card py-5 flex items-center justify-center gap-3 text-red-500 hover:bg-red-500/5 transition-all active:scale-95"
        >
          <LogOut size={18} />
          <span className="font-black text-xs uppercase tracking-widest">Tizimdan chiqish</span>
        </button>
      </div>
    </div>
  );
};

export default Settings;