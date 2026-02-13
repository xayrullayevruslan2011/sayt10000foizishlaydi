import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { User, Track, Language, Theme } from './types';
import { ADMIN_ID, translations } from './constants';
import Home from './pages/Home';
import Trackers from './pages/Trackers';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Onboarding from './pages/Onboarding';
import Admin from './pages/Admin';
import BottomNav from './components/BottomNav';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [tracks, setTracks] = useState<Track[]>(() => {
    const saved = localStorage.getItem('tracks');
    return saved ? JSON.parse(saved) : [];
  });
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('lang') as Language) || 'uz';
  });
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('theme') as Theme) || 'light';
  });

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('tracks', JSON.stringify(tracks));
  }, [tracks]);

  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.body.classList.add('bg-gray-900', 'text-white');
      document.body.classList.remove('bg-gray-50', 'text-gray-900');
    } else {
      document.body.classList.add('bg-gray-50', 'text-gray-900');
      document.body.classList.remove('bg-gray-900', 'text-white');
    }
  }, [theme]);

  const updateTrack = useCallback((trackId: string, updates: Partial<Track>) => {
    setTracks(prev => prev.map(t => t.id === trackId ? { ...t, ...updates, updatedAt: Date.now() } : t));
  }, []);

  return (
    <HashRouter>
      <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'dark' : ''}`}>
        <main className="flex-grow pb-24">
          <Routes>
            <Route 
              path="/onboarding" 
              element={user ? <Navigate to="/" /> : <Onboarding onLogin={setUser} lang={lang} theme={theme} />} 
            />
            <Route 
              path="/" 
              element={user ? <Home user={user} tracks={tracks} lang={lang} theme={theme} /> : <Navigate to="/onboarding" />} 
            />
            <Route 
              path="/trackers" 
              element={user ? <Trackers user={user} tracks={tracks} setTracks={setTracks} lang={lang} theme={theme} /> : <Navigate to="/onboarding" />} 
            />
            <Route 
              path="/profile" 
              element={user ? <Profile user={user} tracks={tracks} lang={lang} theme={theme} /> : <Navigate to="/onboarding" />} 
            />
            <Route 
              path="/settings" 
              element={user ? <Settings lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} /> : <Navigate to="/onboarding" />} 
            />
            <Route 
              path="/admin" 
              element={user?.telegramId === ADMIN_ID ? <Admin tracks={tracks} updateTrack={updateTrack} lang={lang} theme={theme} /> : <Navigate to="/" />} 
            />
          </Routes>
        </main>
        {user && <BottomNav lang={lang} theme={theme} isAdmin={user.telegramId === ADMIN_ID} />}
      </div>
    </HashRouter>
  );
};

export default App;
