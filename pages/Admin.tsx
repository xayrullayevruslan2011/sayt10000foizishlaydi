import React, { useState, useMemo } from 'react';
import { Track, Language, Theme, PaymentStatus } from '../types';
import { translations, BOT_TOKEN } from '../constants';
import { Save, Scale, DollarSign, Search, ShieldCheck, CheckCircle2, XCircle, Clock, Filter, Package, BellRing } from 'lucide-react';

interface AdminProps {
  tracks: Track[];
  updateTrack: (id: string, updates: Partial<Track>) => void;
  lang: Language;
  theme: Theme;
}

const Admin: React.FC<AdminProps> = ({ tracks, updateTrack, lang, theme }) => {
  const t = translations[lang];
  const [search, setSearch] = useState('');
  const [filterPending, setFilterPending] = useState(false);

  const filteredTracks = useMemo(() => {
    return tracks.filter(t => {
      const matchesSearch = t.trackNumber.toLowerCase().includes(search.toLowerCase());
      const isPending = t.paymentStatus === 'awaiting_verification';
      return filterPending ? (matchesSearch && isPending) : matchesSearch;
    });
  }, [tracks, search, filterPending]);

  const pendingCount = tracks.filter(t => t.paymentStatus === 'awaiting_verification').length;

  const handleVerifyPayment = (track: Track, success: boolean) => {
    const status: PaymentStatus = success ? 'paid' : 'pending';
    updateTrack(track.id, { paymentStatus: status });

    const text = success 
      ? `✅ To'lovingiz tasdiqlandi!\nTrek: ${track.trackNumber}\nYukingiz keyingi bosqichga o'tdi.`
      : `❌ To'lovingiz bekor qilindi.\nTrek: ${track.trackNumber}\nIltimos to'lovni qaytadan tekshirib kiring.`;

    // Foydalanuvchining ID siga xabar yuborish
    fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: track.userId, 
        text: text
      })
    }).catch(e => console.warn(e));
  };

  const updateWeightAndPrice = (track: Track, weight: number, price: number) => {
    const updates: Partial<Track> = { weight, price };
    if (track.paymentStatus === 'not_assigned' && price > 0) {
      updates.paymentStatus = 'pending';
    }
    updateTrack(track.id, updates);
  };

  return (
    <div className="p-6 space-y-8 bg-[#0a0a0a] min-h-screen pb-32">
      <header className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-[#BF953F]" size={20} />
            <p className="text-[10px] font-black text-[#BF953F] uppercase tracking-[0.3em]">Ruslan Market Admin</p>
          </div>
          {pendingCount > 0 && (
            <div className="flex items-center gap-2 bg-red-500/10 px-3 py-1 rounded-full animate-pulse">
              <BellRing size={12} className="text-red-500" />
              <span className="text-[9px] font-black text-red-500 uppercase">{pendingCount} Yangi to'lov</span>
            </div>
          )}
        </div>
        <h1 className="text-4xl font-black text-white tracking-tight">BOSHQARUV</h1>
      </header>

      <div className="flex flex-col gap-4">
        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="text-gray-500 group-focus-within:text-[#BF953F] transition-colors" size={20} />
          </div>
          <input
            type="text"
            placeholder="Trek raqamini qidirish..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 outline-none transition-all focus:border-[#BF953F]/50 focus:bg-white/10 text-white placeholder:text-gray-600 font-bold"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button 
          onClick={() => setFilterPending(!filterPending)}
          className={`flex items-center justify-center gap-2 py-3 rounded-xl border transition-all text-[10px] font-black uppercase tracking-widest ${
            filterPending 
              ? 'bg-[#BF953F] border-[#BF953F] text-black shadow-lg shadow-gold-500/20' 
              : 'bg-white/5 border-white/10 text-gray-400'
          }`}
        >
          <Filter size={16} /> {filterPending ? "Barcha treklarni ko'rish" : "Faqat to'lovlarni ko'rish"}
        </button>
      </div>

      <div className="space-y-6">
        {filteredTracks.map((track) => (
          <div key={track.id} className={`premium-card p-6 rounded-[32px] space-y-6 group transition-all duration-300 ${
            track.paymentStatus === 'awaiting_verification' ? 'border-[#BF953F] shadow-lg shadow-gold-500/10' : 'hover:border-[#BF953F]/40'
          }`}>
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Trek Raqam</p>
                <p className="font-black text-lg tracking-tight text-white">{track.trackNumber}</p>
                <div className="flex gap-2 items-center mt-2">
                   <span className="text-[8px] text-blue-400 font-black uppercase tracking-tighter bg-blue-400/10 px-2 py-0.5 rounded-full">
                    {track.status}
                  </span>
                  <span className="text-[8px] text-gray-500 font-black">ID: {track.userId.slice(0, 6)}</span>
                </div>
              </div>
              
              <div className={`px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${
                track.paymentStatus === 'paid' ? 'bg-green-500/10 border-green-500/20 text-green-500' :
                track.paymentStatus === 'awaiting_verification' ? 'bg-[#BF953F]/20 border-[#BF953F]/40 text-[#BF953F] animate-pulse' :
                track.paymentStatus === 'pending' ? 'bg-orange-500/10 border-orange-500/20 text-orange-500' :
                'bg-white/5 border-white/10 text-gray-400'
              }`}>
                {track.paymentStatus === 'awaiting_verification' ? "TO'LOV KUTILMOQDA" : track.paymentStatus.replace('_', ' ')}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest ml-1">Vazn (kg)</label>
                <div className="relative">
                  <Scale className="absolute left-3 top-1/2 -translate-y-1/2 text-[#BF953F]" size={16} />
                  <input
                    type="number"
                    step="0.1"
                    placeholder="0.0"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none text-sm font-black focus:border-[#BF953F]/50 text-white"
                    value={track.weight || ''}
                    onChange={(e) => updateWeightAndPrice(track, parseFloat(e.target.value) || 0, track.price)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest ml-1">Narx (sum)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500" size={16} />
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none text-sm font-black focus:border-green-500/50 text-white"
                    value={track.price || ''}
                    onChange={(e) => updateWeightAndPrice(track, track.weight, parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>

            {track.paymentStatus === 'awaiting_verification' && (
              <div className="p-5 rounded-[24px] bg-[#BF953F]/10 border border-[#BF953F]/30 space-y-4 animate-in fade-in zoom-in-95">
                <div className="text-center">
                  <p className="text-[9px] font-black text-[#BF953F] uppercase tracking-[0.2em]">Tasdiqlash kutilmoqda</p>
                  <p className="text-lg font-black text-white mt-1">{track.price.toLocaleString()} UZS</p>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => handleVerifyPayment(track, false)}
                    className="flex-1 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 tap-scale hover:bg-red-500/20"
                  >
                    <XCircle size={16} /> Rad etish
                  </button>
                  <button 
                    onClick={() => handleVerifyPayment(track, true)}
                    className="flex-[2] py-3 rounded-xl bg-[#BF953F] text-black text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 tap-scale hover:opacity-90 shadow-lg shadow-gold-500/20"
                  >
                    <CheckCircle2 size={16} /> To'lovni tasdiqlash
                  </button>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => updateTrack(track.id, { status: 'delivered', paymentStatus: 'paid' })}
                className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 text-gray-500 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 tap-scale hover:bg-white/10 transition-colors"
              >
                Topshirildi deb belgilash
              </button>
              <button 
                onClick={() => {
                  updateTrack(track.id, { updatedAt: Date.now() });
                  alert("Ma'lumotlar saqlandi!");
                }}
                className="w-16 h-14 flex items-center justify-center rounded-2xl gold-bg text-black shadow-lg shadow-gold-500/20 tap-scale transition-transform"
                title="Saqlash"
              >
                <Save size={24} strokeWidth={3} />
              </button>
            </div>
          </div>
        ))}

        {filteredTracks.length === 0 && (
          <div className="text-center py-24 opacity-30 flex flex-col items-center">
            <Package size={64} className="mb-4 text-gray-600" strokeWidth={1} />
            <p className="text-xs font-black uppercase tracking-widest">Hech narsa topilmadi</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;