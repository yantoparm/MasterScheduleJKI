import React from 'react';
import { Tv, LogOut, Volume2, VolumeX, ShieldCheck, ArrowLeft, RefreshCw, Sparkles } from 'lucide-react';
import { sound } from '../utils/sound';

interface HeaderProps {
  currentView: 'admin' | 'tv';
  setCurrentView: (view: 'admin' | 'tv') => void;
  userEmail: string;
  onLogoutClick: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  setCurrentView,
  userEmail,
  onLogoutClick,
  soundEnabled,
  onToggleSound,
  onResetData,
}) => {
  return (
    <header className="bg-[#18181b] text-white px-4 sm:px-6 py-3.5 flex flex-wrap justify-between items-center shadow-lg border-b border-zinc-800 sticky top-0 z-40">
      {/* Brand / Logo */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <div className="bg-amber-400 text-black font-black px-2.5 py-1 rounded border border-amber-300 tracking-wider text-sm shadow-sm flex items-center gap-1 font-mono-num">
            <span>J V S</span>
          </div>
          <span className="text-xs tracking-widest text-zinc-400 uppercase font-bold">LABZ</span>
        </div>

        <div className="hidden sm:flex items-center border-l border-zinc-700 pl-3 space-x-2">
          <span className="text-zinc-200 font-semibold text-sm md:text-base">
            Master Production Schedule
          </span>
          {currentView === 'tv' ? (
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Layar TV Aktif
            </span>
          ) : (
            <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[11px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-amber-400" />
              Admin Portal
            </span>
          )}
        </div>
      </div>

      {/* User Actions & TV Mode Switch */}
      <div className="flex items-center space-x-2 sm:space-x-3 mt-2 sm:mt-0 text-xs sm:text-sm">
        {/* Sound toggle */}
        <button
          onClick={() => {
            onToggleSound();
            sound.playCheck();
          }}
          title={soundEnabled ? 'Matikan Suara Chime' : 'Aktifkan Suara Chime'}
          className="p-1.5 rounded-md border border-zinc-700 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 transition"
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-amber-400" />
          ) : (
            <VolumeX className="w-4 h-4 text-zinc-500" />
          )}
        </button>

        {/* User email badge */}
        <div className="hidden md:flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 text-zinc-300 px-2.5 py-1.5 rounded-md text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="font-mono text-zinc-300">{userEmail}</span>
        </div>

        {/* Reset to demo */}
        <button
          onClick={onResetData}
          title="Reset data ke contoh bawaan"
          className="hidden lg:flex items-center gap-1 bg-zinc-800/70 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 px-2.5 py-1.5 rounded border border-zinc-700 text-xs transition"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset Data</span>
        </button>

        {/* TV Mode Switcher */}
        {currentView === 'admin' ? (
          <button
            onClick={() => {
              setCurrentView('tv');
              sound.playCheck();
            }}
            className="bg-amber-500 hover:bg-amber-400 text-black font-semibold px-3 py-1.5 rounded border border-amber-400 shadow-sm transition flex items-center space-x-1.5 cursor-pointer"
          >
            <Tv className="w-4 h-4" />
            <span className="font-bold text-xs sm:text-sm">Lihat layar TV</span>
          </button>
        ) : (
          <button
            onClick={() => {
              setCurrentView('admin');
              sound.playCheck();
            }}
            className="bg-zinc-800 hover:bg-zinc-700 text-amber-400 px-3 py-1.5 rounded border border-amber-500/30 transition flex items-center space-x-1.5 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Admin</span>
          </button>
        )}

        {/* Keluar akun */}
        <button
          onClick={onLogoutClick}
          className="bg-zinc-800/80 hover:bg-rose-950/60 hover:text-rose-300 text-zinc-400 px-2.5 sm:px-3 py-1.5 rounded border border-zinc-700 transition flex items-center gap-1"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Keluar</span>
        </button>
      </div>
    </header>
  );
};
