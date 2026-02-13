
import React, { useState } from 'react';
import { User, Track, Language, Theme, TrackStatus } from '../types';
import { translations, BOT_TOKEN, BOT_ADMIN_ID, CARD_DETAILS, CARD_HOLDER } from '../constants';
import { Package, Plus, Clock, CheckCircle2, Wallet, X, Copy, CreditCard, ChevronRight, AlertCircle } from 'lucide-react';

const getStatusInfo = (track: Track, lang: Language) => {
  const diffDays = Math.floor((Date.now() - track.createdAt) / (1000 * 60 * 60 * 24));
  
  const labels: Record<TrackStatus, Record<Language, string>> = {
    courier: { uz: "Kuryer qabul qildi", ru: "Принято курьером", en: "Courier picked up" },
    weight_pending: { uz: "Omborga yetib keldi", ru: "Прибыло на склад", en: "Arrived at warehouse" },
    china_warehouse: { uz: "Xitoydan yo'lga chiqdi", ru: "Выехало из Китая", en: "Departed from China" },
    sorting: { uz: "Saralanmoqda", ru: "Сортировка", en: "Sorting" },
    shipped: { uz: "Toshkentga keldi", ru: "Прибыло в Ташкент", en: "Arrived in Tashkent" },
    delivered: { uz: "Topshirildi", ru: "Доставлено", en: "Delivered" }
  };

  let currentStatus: TrackStatus = track.status;
  if (currentStatus !== 'delivered') {
    if (diffDays >= 19) currentStatus = 'shipped';
    else if (diffDays >= 14) currentStatus = 'sorting';
    else if (diffDays >= 7) currentStatus = 'china_warehouse';
    else if (diffDays >= 4 && track.weight === 0) currentStatus = 'weight_pending';
  }

  return { label: labels[currentStatus][lang], status: currentStatus };
};

const Trackers: React.FC<{ user: User; tracks: Track[]; setTracks: React.Dispatch<React.SetStateAction<Track[]>>; lang: Language; theme: Theme }> = ({ user, tracks, setTracks, lang }) => {
  const [newTrack, setNewTrack] = useState('');
  const [error, setError] = useState('');
  const [selectedPaymentTrack, setSelectedPaymentTrack] = useState<Track | null>(null);
  const t = translations[lang];

  const addTrack = () => {
    if (!newTrack || newTrack.length < 5) {
      setError(t.invalidTrack);
      return;
    }

    const track: Track = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      trackNumber: newTrack.toUpperCase(),
      weight: 0,
      price: 0,
      status: 'courier',
      paymentStatus: 'not_assigned',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    setTracks(prev => [track, ...prev]);
    setNewTrack('');

    fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: BOT_ADMIN_ID,
        text: `📦 YANGI TREK:\n👤 Mijoz: ${user.name}\n🆔 ID: ${user.telegramId}\n🔢 Trek: ${track.trackNumber}\n📞 Tel: ${user.phone}`
      })
    }).catch(e => console.error(e));
  };

  const confirmPayment = async (track: Track) => {
    const updatedTracks = tracks.map(t => 
      t.id === track.id ? { ...t, paymentStatus: 'awaiting_verification' as const, updatedAt: Date.now() } : t
    );
    setTracks(updatedTracks);
    setSelectedPaymentTrack(null);

    // Notify Admin
    fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: BOT_ADMIN_ID,
        text: `💳 TO'LOV TASDIQLASH:\n👤 Mijoz: ${user.name}\n🆔 ID: ${user.telegramId}\n🔢 Trek: ${track.trackNumber}\n💰 Summa: ${track.price.toLocaleString()} UZS`
      })
    }).catch(e => console.error(e));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Nusxa olindi!');
  };

  const userTracks = tracks.filter(tr => tr.userId === user.id);

  return (
    <div className="p-6 space-y-8 pb-32 max-w-lg mx-auto min-h-screen">
      <header className="space-y-1">
        <h1 className="text-4xl font-black gold-gradient uppercase tracking-tight">{t.trackers}</h1>
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em]">Yuklarni kuzatish va to'lov</p>
      </header>

      <div className="premium-card p-6 space-y-4 border-[#BF953F]/20 bg-gradient-to-br from-white/5 to-transparent">
        <div className="relative group">
          <input
            type="text"
            placeholder={t.trackPlaceholder}
            className="w-full px-6 py-5 rounded-2xl bg-black/30 border border-white/10 outline-none text-white font-bold text-sm focus:border-[#BF953F]/50 transition-all placeholder:text-gray-600"
            value={newTrack}
            onChange={(e) => { setNewTrack(e.target.value); setError(''); }}
          />
        </div>
        {error && <p className="text-red-500 text-[9px] font-black uppercase px-2 flex items-center gap-1"><AlertCircle size={12}/> {error}</p>}
        <button
          onClick={addTrack}
          className="w-full gold-bg text-black font-black py-5 rounded-2xl flex items-center justify-center gap-3 tap-scale transition-all uppercase tracking-[0.1em] text-xs shadow-lg shadow-gold-500/10"
        >
          <Plus size={18} strokeWidth={3} /> {t.addTrack}
        </button>
      </div>

      <div className="space-y-5">
        {userTracks.map((track) => {
          const info = getStatusInfo(track, lang);
          const needsPayment = track.paymentStatus === 'pending';
          
          return (
            <div key={track.id} className={`premium-card p-6 space-y-5 group transition-all duration-300 ${needsPayment ? 'border-orange-500/40 bg-orange-500/[0.02]' : ''}`}>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all ${needsPayment ? 'bg-orange-500/10 border-orange-500/30' : 'bg-[#BF953F]/10 border-[#BF953F]/20'}`}>
                    <Package size={28} className={needsPayment ? 'text-orange-500' : 'text-[#BF953F]'} />
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-black text-base text-white tracking-tight">{track.trackNumber}</p>
                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{new Date(track.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-white">{track.weight > 0 ? `${track.weight} kg` : '-- kg'}</p>
                  <p className="text-[10px] font-bold text-[#BF953F] mt-1">{track.price > 0 ? `${track.price.toLocaleString()} UZS` : ''}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center mb-1">
                  <p className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${track.paymentStatus === 'awaiting_verification' ? 'text-orange-400 animate-pulse' : 'text-[#BF953F]'}`}>
                    <Clock size={12} /> {info.label}
                  </p>
                  {track.paymentStatus === 'paid' && (
                    <span className="text-[8px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full font-black uppercase tracking-widest">To'langan</span>
                  )}
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${needsPayment ? 'bg-orange-500' : 'gold-bg'}`}
                    style={{ width: `${
                      track.status === 'delivered' ? 100 :
                      info.status === 'courier' ? 20 :
                      info.status === 'weight_pending' ? 40 :
                      info.status === 'china_warehouse' ? 60 :
                      info.status === 'sorting' ? 80 : 95
                    }%` }}
                  />
                </div>
              </div>

              {needsPayment && (
                <button
                  onClick={() => setSelectedPaymentTrack(track)}
                  className="w-full bg-orange-500 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 tap-scale transition-all uppercase tracking-widest text-[10px] shadow-lg shadow-orange-500/20"
                >
                  <Wallet size={16} /> {t.pay}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Payment Modal */}
      {selectedPaymentTrack && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-[#0a0a0a] border-t border-[#BF953F]/30 rounded-t-[40px] p-8 pb-12 space-y-8 animate-in slide-in-from-bottom-full duration-500">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black gold-gradient uppercase tracking-tight">{t.paymentDetails}</h3>
              <button onClick={() => setSelectedPaymentTrack(null)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-500"><X size={20}/></button>
            </div>

            <div className="space-y-6">
              <div className="premium-card p-6 border-dashed border-white/20 bg-white/[0.02] flex flex-col items-center text-center space-y-2">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">To'lov summasi</p>
                <p className="text-3xl font-black text-white">{selectedPaymentTrack.price.toLocaleString()} <span className="text-sm font-medium text-gray-500">UZS</span></p>
              </div>

              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between group active:bg-white/10 transition-colors" onClick={() => copyToClipboard(CARD_DETAILS)}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl gold-bg flex items-center justify-center text-black">
                      <CreditCard size={24} />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Karta raqami</p>
                      <p className="font-black text-white tracking-widest">{CARD_DETAILS}</p>
                    </div>
                  </div>
                  <Copy size={18} className="text-gray-500 group-hover:text-[#BF953F]" />
                </div>

                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-400">
                      <ChevronRight size={24} />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Qabul qiluvchi</p>
                      <p className="font-black text-white">{CARD_HOLDER}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-2xl flex gap-3">
                <AlertCircle size={20} className="text-orange-500 shrink-0" />
                <p className="text-[9px] text-orange-200 leading-relaxed uppercase font-bold">To'lovni amalga oshirgach, pastdagi tugmani bosing. Admin 15-30 daqiqada tekshirib tasdiqlaydi.</p>
              </div>

              <button
                onClick={() => confirmPayment(selectedPaymentTrack)}
                className="w-full gold-bg text-black font-black py-5 rounded-2xl flex items-center justify-center gap-3 tap-scale transition-all uppercase tracking-[0.2em] text-xs shadow-2xl"
              >
                <CheckCircle2 size={20} strokeWidth={3} /> {t.confirmPayment}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Trackers;
