
import React from 'react';
import { User, Track, Language, Theme } from '../types';
import { translations } from '../constants';
import { Package, Truck, Clock, User as UserIcon, TrendingUp, Bell, MapPin, Wallet, ArrowRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface HomeProps {
  user: User;
  tracks: Track[];
  lang: Language;
  theme: Theme;
}

const Home: React.FC<HomeProps> = ({ user, tracks, lang, theme }) => {
  const t = translations[lang];
  const userTracks = tracks.filter(tr => tr.userId === user.id);
  const activeTracks = userTracks.filter(tr => tr.status !== 'delivered');
  const pendingPaymentTracks = userTracks.filter(tr => tr.paymentStatus === 'pending');

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10 animate-in fade-in duration-700 pb-32">
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <MapPin size={10} className="text-[#BF953F]" />
            <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Toshkent ombori • Faol</p>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter">Salom, <span className="gold-gradient">{user.name.split(' ')[0]}</span></h1>
          <p className="text-[10px] font-bold text-[#BF953F] uppercase tracking-widest">ID: {user.telegramId}</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-colors">
            <Bell size={18} />
          </button>
          <div className="w-12 h-12 rounded-2xl gold-bg p-[1px]">
            <div className="w-full h-full rounded-2xl bg-[#0a0a0a] flex items-center justify-center">
              <UserIcon size={20} className="text-[#BF953F]" />
            </div>
          </div>
        </div>
      </header>

      {pendingPaymentTracks.length > 0 && (
        <NavLink to="/trackers" className="block p-5 rounded-[28px] bg-orange-500/10 border border-orange-500/30 flex items-center justify-between group animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
              <Wallet size={24} />
            </div>
            <div>
              <p className="text-white font-black text-sm uppercase tracking-tight">{pendingPaymentTracks.length} ta yukka to'lov qiling</p>
              <p className="text-[9px] text-orange-200 font-bold uppercase tracking-widest mt-0.5">To'lov kutilmoqda</p>
            </div>
          </div>
          <ArrowRight size={20} className="text-orange-500 group-hover:translate-x-1 transition-transform" />
        </NavLink>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="premium-card p-7 rounded-[32px] relative overflow-hidden group">
          <Truck className="absolute -right-4 -bottom-4 text-white opacity-5 rotate-12" size={100} />
          <div className="relative z-10 space-y-4">
            <p className="text-[9px] font-black text-[#BF953F] uppercase tracking-[0.3em]">Logistika Holati</p>
            <h3 className="text-2xl font-black text-white leading-tight">Sizning {activeTracks.length} ta yukingiz yo'lda</h3>
            <div className="flex gap-3">
              <div className="px-4 py-2 bg-white/5 rounded-xl text-[9px] font-black uppercase text-gray-400">Jami: {userTracks.length}</div>
              <div className="px-4 py-2 bg-green-500/10 rounded-xl text-[9px] font-black uppercase text-green-500">Yetkazildi: {userTracks.length - activeTracks.length}</div>
            </div>
          </div>
        </div>

        <div className="premium-card p-7 rounded-[32px] flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-[#BF953F]/10 flex items-center justify-center shrink-0">
            <TrendingUp size={28} className="text-[#BF953F]" />
          </div>
          <div>
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-0.5">Loyallik Darajasi</p>
            <p className="text-lg font-black gold-gradient uppercase tracking-tight">{user.totalKg >= 20 ? 'Hamkor' : 'Premium Mijoz'}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Faol treklar</h3>
          <NavLink to="/trackers" className="text-[9px] font-black text-[#BF953F] uppercase tracking-widest">Hammasi</NavLink>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {activeTracks.length > 0 ? (
            activeTracks.slice(0, 3).map((track) => (
              <div key={track.id} className="premium-card p-6 rounded-[28px] flex items-center justify-between group hover:border-[#BF953F]/40 transition-all">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Package size={22} className="text-[#BF953F]" />
                  </div>
                  <div>
                    <p className="font-black text-sm text-white">{track.trackNumber}</p>
                    <p className="text-[9px] text-[#BF953F] font-black uppercase tracking-widest mt-1">{track.status.replace('_', ' ')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-white">{track.weight > 0 ? `${track.weight} kg` : '-- kg'}</p>
                  <Clock size={12} className="text-gray-600 ml-auto mt-1.5" />
                </div>
              </div>
            ))
          ) : (
            <div className="premium-card p-16 rounded-[40px] flex flex-col items-center justify-center text-center opacity-30 border-dashed">
              <Package size={48} className="mb-4 text-gray-600" />
              <p className="text-[9px] font-black uppercase tracking-widest">Hozircha faol yuklar yo'q</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
