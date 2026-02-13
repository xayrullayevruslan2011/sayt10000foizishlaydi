
import React, { useState } from 'react';
import { User, Language, Theme } from '../types';
import { translations, BOT_TOKEN, ADMIN_ID, BOT_ADMIN_ID } from '../constants';
import { User as UserIcon, Phone, ArrowRight, Package, ShieldCheck, Loader2, Globe, Truck, Hash } from 'lucide-react';

interface OnboardingProps {
  onLogin: (user: User) => void;
  lang: Language;
  theme: Theme;
}

const Onboarding: React.FC<OnboardingProps> = ({ onLogin, lang, theme }) => {
  const [showAuth, setShowAuth] = useState(false);
  const [name, setName] = useState('');
  const [telegramId, setTelegramId] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const t = translations[lang];

  const handleStart = async () => {
    if (!name || !telegramId || !phone) return;
    setIsLoading(true);

    const isAdmin = telegramId === ADMIN_ID;
    const message = `🚀 YANGLI KIRISH:\n👤 Ism: ${name}\n🆔 ID: ${telegramId}\n📞 Tel: ${phone}`;
    
    try {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: BOT_ADMIN_ID, text: message })
      });
    } catch (e) { console.warn(e); }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      telegramId,
      phone,
      name,
      role: isAdmin ? 'admin' : 'user',
      totalKg: 0,
      totalSpent: 0,
      createdAt: Date.now()
    };

    setTimeout(() => onLogin(newUser), 1500);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505] p-6 text-center space-y-6">
        <div className="relative animate-float">
          <div className="absolute inset-0 gold-bg opacity-20 blur-3xl animate-pulse"></div>
          <div className="w-24 h-24 gold-bg rounded-[32px] flex items-center justify-center shadow-2xl">
            <Loader2 size={40} className="text-black animate-spin" />
          </div>
        </div>
        <h2 className="text-2xl font-black gold-gradient tracking-widest uppercase">Ruslan Market</h2>
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em]">Profil yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] overflow-x-hidden flex flex-col">
      {!showAuth ? (
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          <div className="animate-float mb-12">
            <div className="w-24 h-24 gold-bg rounded-[32px] flex items-center justify-center shadow-[0_0_50px_rgba(191,149,63,0.3)]">
              <Package size={48} className="text-black" />
            </div>
          </div>
          
          <div className="text-center space-y-6 max-w-sm mb-16">
            <h1 className="text-5xl font-black tracking-tighter gold-gradient uppercase leading-none">
              RUSLAN<br/>MARKET
            </h1>
            <p className="text-gray-400 text-sm font-medium leading-relaxed opacity-70">
              Xitoydan yuklarni yetkazib berish va boshqarish tizimi.
            </p>
          </div>

          <button
            onClick={() => setShowAuth(true)}
            className="w-full max-w-xs group relative px-8 py-5 gold-bg rounded-2xl text-black font-black uppercase tracking-[0.2em] text-sm overflow-hidden transition-all hover:shadow-[0_0_40px_rgba(191,149,63,0.5)] active:scale-95"
          >
            <span className="relative z-10 flex items-center justify-center gap-4">
              KIRISH <ArrowRight size={20} strokeWidth={3} />
            </span>
          </button>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="w-full max-w-md space-y-12">
            <div className="space-y-4">
              <h2 className="text-4xl font-black gold-gradient uppercase tracking-tight">Xush kelibsiz</h2>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">Ro'yxatdan o'tish uchun to'ldiring</p>
            </div>

            <div className="space-y-5">
              <div className="group relative">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                  <UserIcon className="text-gray-600 group-focus-within:text-[#BF953F] transition-colors" size={18} />
                </div>
                <input
                  type="text"
                  placeholder="Ism va Familiya"
                  className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white/5 border border-white/10 outline-none transition-all focus:border-[#BF953F]/50 focus:bg-white/10 text-white font-bold text-sm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="group relative">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                  <Hash className="text-gray-600 group-focus-within:text-[#BF953F] transition-colors" size={18} />
                </div>
                <input
                  type="text"
                  placeholder="Mijoz ID (masalan: 12345)"
                  className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white/5 border border-white/10 outline-none transition-all focus:border-[#BF953F]/50 focus:bg-white/10 text-white font-bold text-sm"
                  value={telegramId}
                  onChange={(e) => setTelegramId(e.target.value)}
                />
              </div>

              <div className="group relative">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                  <Phone className="text-gray-600 group-focus-within:text-[#BF953F] transition-colors" size={18} />
                </div>
                <input
                  type="tel"
                  placeholder="+998 00 000 00 00"
                  className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white/5 border border-white/10 outline-none transition-all focus:border-[#BF953F]/50 focus:bg-white/10 text-white font-bold text-sm"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <button
                onClick={handleStart}
                disabled={!name || !telegramId || !phone}
                className="w-full gold-bg py-5 rounded-2xl text-black font-black uppercase text-xs tracking-[0.2em] shadow-[0_20px_40px_rgba(191,149,63,0.15)] disabled:opacity-20 active:scale-95 transition-all"
              >
                Tizimga kirish
              </button>
              <button 
                onClick={() => setShowAuth(false)} 
                className="w-full text-[10px] font-black text-gray-600 uppercase tracking-widest hover:text-[#BF953F] transition-colors"
              >
                ← Orqaga qaytish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Onboarding;
