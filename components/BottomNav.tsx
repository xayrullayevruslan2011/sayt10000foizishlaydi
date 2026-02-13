
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Package, User, Settings, ShieldCheck } from 'lucide-react';
import { Language, Theme } from '../types';
import { translations } from '../constants';

interface BottomNavProps {
  lang: Language;
  theme: Theme;
  isAdmin: boolean;
}

const BottomNav: React.FC<BottomNavProps> = ({ lang, theme, isAdmin }) => {
  const t = translations[lang];

  const navItems = [
    { to: '/', icon: Home, label: t.home },
    { to: '/trackers', icon: Package, label: t.trackers },
    { to: '/profile', icon: User, label: t.profile },
    { to: '/settings', icon: Settings, label: t.settings },
  ];

  if (isAdmin) {
    navItems.splice(1, 0, { to: '/admin', icon: ShieldCheck, label: 'Admin' });
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-24 flex items-center justify-around px-4 z-50 glass-nav">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) => 
            `flex flex-col items-center gap-1.5 transition-all duration-500 tap-scale ${
              isActive 
                ? 'text-[#BF953F] -translate-y-2' 
                : 'text-gray-600 hover:text-gray-400'
            }`
          }
        >
          <div className={`p-2 rounded-xl transition-all duration-500 ${
            // Custom highlight for active tab
            "relative group"
          }`}>
            <item.icon size={26} strokeWidth={2.5} />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-current opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 transition-all"></div>
          </div>
          <span className="text-[8px] font-black uppercase tracking-[0.2em]">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
