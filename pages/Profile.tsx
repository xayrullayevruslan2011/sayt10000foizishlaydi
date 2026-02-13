import React from 'react';
import { User, Track, Language, Theme } from '../types';
import { translations } from '../constants';
import { User as UserIcon, ShieldCheck, Star, Award, TrendingUp, Scale, Wallet } from 'lucide-react';

// Added Theme to ProfileProps to match App.tsx usage
interface ProfileProps {
  user: User;
  tracks: Track[];
  lang: Language;
  theme: Theme;
}

const Profile: React.FC<ProfileProps> = ({ user, tracks, lang, theme }) => {
  const t = translations[lang];
  const userTracks = tracks.filter(tr => tr.userId === user.id);
  const totalWeight = userTracks.reduce((sum, tr) => sum + tr.weight, 0);
  const totalPaid = userTracks.reduce((sum, tr) => sum + tr.price, 0);

  const getTier = (weight: number) => {
    if (weight >= 20) return { label: t.loyaltyPartner, icon: ShieldCheck, color: 'text-[#BF953F]', bg: 'bg-[#BF953F]/10' };
    if (weight >= 10) return { label: t.loyaltyDear, icon: Star, color: 'text-orange-400', bg: 'bg-orange-400/10' };
    if (weight >= 5) return { label: t.loyaltyFriend, icon: Award, color: 'text-blue-400', bg: 'bg-blue-400/10' };
    return { label: 'Yangi', icon: UserIcon, color: 'text-gray-500', bg: 'bg-white/5' };
  };

  const tier = getTier(totalWeight);

  return (
    <div className="p-6 space-y-10 pb-32 max-w-lg mx-auto animate-in fade-in duration-700">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="relative">
          <div className="absolute inset-0 gold-bg blur-2xl opacity-20 animate-pulse"></div>
          <div className="relative w-32 h-32 rounded-[40px] gold-bg p-[2px]">
            <div className="w-full h-full rounded-[38px] bg-[#050505] flex items-center justify-center">
              <UserIcon size={50} className="text-[#BF953F]" />
            </div>
          </div>
          <div className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl flex items-center justify-center shadow-2xl ${tier.bg} border border-white/10`}>
            <tier.icon size={20} className={tier.color} />
          </div>
        </div>
        
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-white tracking-tight uppercase">{user.name}</h2>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em]">{user.phone}</p>
        </div>

        <div className={`px-8 py-2.5 rounded-2xl border border-white/5 shadow-xl ${tier.bg}`}>
          <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${tier.color}`}>{tier.label}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="premium-card p-6 space-y-3">
          <Scale size={20} className="text-[#BF953F]" />
          <div>
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{t.totalWeight}</p>
            <p className="text-xl font-black text-white">{totalWeight.toFixed(1)} <span className="text-xs text-gray-500">kg</span></p>
          </div>
        </div>
        <div className="premium-card p-6 space-y-3">
          <Wallet size={20} className="text-green-500" />
          <div>
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{t.totalPaid}</p>
            <p className="text-xl font-black text-white">{totalPaid.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="premium-card p-8 flex flex-col items-center gap-6 relative overflow-hidden group">
         <TrendingUp className="absolute top-0 right-0 p-8 opacity-5 -rotate-12 scale-150" size={100} />
         <div className="w-full space-y-2">
            <div className="flex justify-between items-end">
               <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Progress</p>
               <p className="text-xs font-black text-white">{Math.min(100, (totalWeight/20)*100).toFixed(0)}%</p>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
               <div className="h-full gold-bg" style={{ width: `${Math.min(100, (totalWeight/20)*100)}%` }} />
            </div>
         </div>
         <p className="text-[10px] text-gray-400 text-center font-medium leading-relaxed uppercase tracking-widest">
           {totalWeight < 20 ? `Hamkor darajasi uchun yana ${(20 - totalWeight).toFixed(1)} kg yuk kerak` : "Siz oliy darajadagi Hamkorsiz!"}
         </p>
      </div>
    </div>
  );
};

export default Profile;