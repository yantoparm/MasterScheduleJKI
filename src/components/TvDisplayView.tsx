import React, { useState, useEffect, useRef } from 'react';
import {
  Maximize2,
  Minimize2,
  ArrowLeft,
  Volume2,
  VolumeX,
  CheckCircle2,
  Clock,
  Flame,
  Radio,
  Play,
  Pause,
  Layers,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { ProjectItem, RunningTextConfig, StepKey } from '../types/production';
import { sound } from '../utils/sound';
import confetti from 'canvas-confetti';

interface TvDisplayViewProps {
  projects: ProjectItem[];
  runningText: RunningTextConfig;
  onBackToAdmin: () => void;
  onToggleStep: (id: string, stepName: StepKey) => void;
  onToggleProjectStatus: (id: string) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const TvDisplayView: React.FC<TvDisplayViewProps> = ({
  projects,
  runningText,
  onBackToAdmin,
  onToggleStep,
  onToggleProjectStatus,
  soundEnabled,
  onToggleSound,
}) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [autoScroll, setAutoScroll] = useState<boolean>(false);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // Live ticking clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Auto-scroll logic for TV displays with lots of items
  useEffect(() => {
    if (!autoScroll) return;
    const interval = setInterval(() => {
      if (!tableContainerRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = tableContainerRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 20) {
        tableContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        tableContainerRef.current.scrollBy({ top: 180, behavior: 'smooth' });
      }
    }, 6000);
    return () => clearInterval(interval);
  }, [autoScroll]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Indonesian date formatter
  const formatIndonesianDate = (date: Date) => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
    ];
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const formatClock = (date: Date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  // Metrics
  const totalCount = projects.length;
  const finishedCount = projects.filter((p) => p.selesai).length;
  const unfinishedCount = totalCount - finishedCount;
  const completionRate = totalCount > 0 ? Math.round((finishedCount / totalCount) * 100) : 0;

  // Total quantity calculation
  const totalQtyNumber = projects.reduce((acc, curr) => {
    const cleanQty = curr.qty.replace(/\./g, '').replace(/,/g, '');
    const num = parseInt(cleanQty, 10);
    return acc + (isNaN(num) ? 0 : num);
  }, 0);

  const getMarqueeSpeedClass = () => {
    if (runningText.speed === 'slow') return 'animate-marquee-slow';
    if (runningText.speed === 'fast') return 'animate-marquee-fast';
    return 'animate-marquee-normal';
  };

  const getThemeClass = () => {
    switch (runningText.theme) {
      case 'amber':
        return 'bg-amber-400 text-black border-amber-300';
      case 'crimson':
        return 'bg-rose-600 text-white border-rose-500';
      case 'emerald':
        return 'bg-emerald-500 text-black border-emerald-400';
      case 'blue':
        return 'bg-cyan-400 text-black border-cyan-300';
      default:
        return 'bg-amber-400 text-black border-amber-300';
    }
  };

  const handleStepTap = (projectId: string, stepName: StepKey) => {
    sound.playCheck();
    onToggleStep(projectId, stepName);
  };

  const handleRowStatusTap = (p: ProjectItem) => {
    const willFinish = !p.selesai;
    if (willFinish) {
      sound.playComplete();
      try {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#fbbf24', '#10b981'],
        });
      } catch {
        // ignore
      }
    } else {
      sound.playCheck();
    }
    onToggleProjectStatus(p.id);
  };

  return (
    <div className="min-h-screen bg-[#0e0e11] text-zinc-100 flex flex-col justify-between selection:bg-amber-500 selection:text-black">
      {/* Top TV Bar: Brand, Live Ticker, Metrics, Fullscreen */}
      <div className="bg-[#16161a] border-b border-zinc-800/80 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        {/* Brand & Line info */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="bg-amber-400 text-black font-black px-3.5 py-1.5 rounded border border-amber-300 tracking-wider text-base md:text-lg shadow-sm flex items-center font-mono-num">
              J V S
            </div>
            <div className="flex flex-col">
              <span className="text-xs tracking-widest text-zinc-400 uppercase font-black">
                LABZ &bull; INDONESIA
              </span>
              <span className="text-[11px] text-amber-400 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                LINE PRODUKSI A (LIVE TV)
              </span>
            </div>
          </div>
        </div>

        {/* Live Big Clock & Date */}
        <div className="flex items-center space-x-6 bg-zinc-900/90 border border-zinc-800 px-5 py-2 rounded-xl shadow-inner">
          <div className="text-right">
            <p className="text-xs text-zinc-400 font-medium">{formatIndonesianDate(currentTime)}</p>
            <p className="text-2xl md:text-3xl font-extrabold font-mono-num text-amber-400 tracking-wider">
              {formatClock(currentTime)}{' '}
              <span className="text-xs font-sans text-zinc-500 font-bold">WIB</span>
            </p>
          </div>
        </div>

        {/* Action Controls for TV Screen */}
        <div className="flex items-center space-x-2">
          {/* Sound Toggle */}
          <button
            onClick={() => {
              onToggleSound();
              sound.playCheck();
            }}
            title={soundEnabled ? 'Matikan Suara Chime' : 'Aktifkan Suara Chime'}
            className="p-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition"
          >
            {soundEnabled ? (
              <Volume2 className="w-5 h-5 text-amber-400" />
            ) : (
              <VolumeX className="w-5 h-5 text-zinc-500" />
            )}
          </button>

          {/* Auto Scroll toggle */}
          <button
            onClick={() => {
              setAutoScroll(!autoScroll);
              sound.playCheck();
            }}
            title="Auto-Scroll Otomatis untuk Layar TV Besar"
            className={`px-3 py-2 rounded-lg text-xs font-bold border transition flex items-center gap-1.5 ${
              autoScroll
                ? 'bg-amber-500 text-black border-amber-400 shadow'
                : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-zinc-200'
            }`}
          >
            {autoScroll ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span className="hidden md:inline">{autoScroll ? 'Scroll Aktif' : 'Auto Scroll'}</span>
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh (TV Fullscreen)'}
            className="px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{isFullscreen ? 'Kecilkan' : 'Fullscreen'}</span>
          </button>

          {/* Back to Admin */}
          <button
            onClick={() => {
              onBackToAdmin();
              sound.playCheck();
            }}
            className="bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs sm:text-sm px-4 py-2 rounded-lg shadow transition flex items-center gap-1.5 cursor-pointer ml-1"
          >
            <ArrowLeft className="w-4 h-4 stroke-[3]" />
            <span>Kembali ke Admin</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Banner for TV */}
      <div className="bg-[#121216] border-b border-zinc-800 px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Card 1: Total Project */}
          <div className="bg-zinc-900/80 border border-zinc-800/80 p-3 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Total Project</p>
              <p className="text-xl sm:text-2xl font-black font-mono-num text-zinc-100">{totalCount}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-zinc-800 text-amber-400 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
          </div>

          {/* Card 2: Target Volume / Qty */}
          <div className="bg-zinc-900/80 border border-zinc-800/80 p-3 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Total Target QTY</p>
              <p className="text-xl sm:text-2xl font-black font-mono-num text-amber-400">
                {totalQtyNumber.toLocaleString('id-ID')} <span className="text-xs text-zinc-400">PCS</span>
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center font-bold">
              <Radio className="w-5 h-5" />
            </div>
          </div>

          {/* Card 3: Belum Selesai (In Progress) */}
          <div className="bg-zinc-900/80 border border-zinc-800/80 p-3 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-amber-400">Sedang Berjalan</p>
              <p className="text-xl sm:text-2xl font-black font-mono-num text-amber-300">
                {unfinishedCount} <span className="text-xs text-zinc-400 font-sans">Batch</span>
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
              <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>
          </div>

          {/* Card 4: Selesai & Progress Bar */}
          <div className="bg-zinc-900/80 border border-zinc-800/80 p-3 rounded-xl flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">Progres Selesai</p>
              <span className="text-xs font-mono-num font-bold text-emerald-400">{completionRate}%</span>
            </div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-xl sm:text-2xl font-black font-mono-num text-emerald-400">{finishedCount}</span>
              <span className="text-xs text-zinc-400">/ {totalCount} Selesai</span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-1.5 mt-1 overflow-hidden">
              <div
                className="bg-emerald-400 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Big Table for TV Floor Display */}
      <main
        ref={tableContainerRef}
        className="flex-grow px-4 sm:px-8 py-4 overflow-y-auto max-w-7xl w-full mx-auto"
      >
        <div className="bg-[#151518] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-900/90 border-b border-zinc-800 text-zinc-400 uppercase tracking-widest text-xs font-extrabold select-none">
                <th className="py-4 px-4 text-center w-24">STATUS</th>
                <th className="py-4 px-4 min-w-[170px]">DATE (ESTIMASI)</th>
                <th className="py-4 px-4 min-w-[280px]">PROJECT / PRODUK</th>
                <th className="py-4 px-4 text-right min-w-[120px]">QTY</th>
                <th className="py-4 px-3 text-center w-28">FILLING</th>
                <th className="py-4 px-3 text-center w-28">LABELING</th>
                <th className="py-4 px-3 text-center w-28">CUKAI</th>
                <th className="py-4 px-3 text-center w-28">FINISHING</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-zinc-500">
                    Tidak ada data antrean produksi saat ini.
                  </td>
                </tr>
              ) : (
                projects.map((p, idx) => {
                  return (
                    <tr
                      key={p.id}
                      className={`transition-colors duration-150 ${
                        p.selesai
                          ? 'bg-zinc-900/40 text-zinc-500'
                          : idx === 0
                          ? 'bg-amber-500/5 hover:bg-amber-500/10 text-zinc-100'
                          : 'hover:bg-zinc-800/50 text-zinc-200'
                      }`}
                    >
                      {/* Status Column */}
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => handleRowStatusTap(p)}
                          title="Klik untuk mengubah status selesai"
                          className="focus:outline-none cursor-pointer"
                        >
                          {p.selesai ? (
                            <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              SELESAI
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping mr-0.5" />
                              PROSES
                            </span>
                          )}
                        </button>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 font-medium text-xs sm:text-sm whitespace-nowrap text-zinc-400">
                        <span className={p.selesai ? 'line-through opacity-60' : 'text-zinc-300'}>
                          {p.date}
                        </span>
                      </td>

                      {/* Project Name */}
                      <td className="py-4 px-4 font-bold text-sm sm:text-base">
                        <div className="flex flex-col">
                          <span
                            className={`tracking-tight ${
                              p.selesai
                                ? 'line-through text-zinc-500 font-normal'
                                : 'text-zinc-100 font-extrabold'
                            }`}
                          >
                            {p.name}
                          </span>
                          <div className="flex items-center gap-2 mt-1">
                            {p.shift && (
                              <span className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded font-mono font-bold">
                                {p.shift}
                              </span>
                            )}
                            {p.notes && (
                              <span className="text-[11px] text-amber-400/80 font-medium">
                                &bull; {p.notes}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* QTY */}
                      <td className="py-4 px-4 text-right font-mono-num font-black text-sm sm:text-base whitespace-nowrap">
                        <span className={p.selesai ? 'line-through text-zinc-600' : 'text-amber-400'}>
                          {p.qty}
                        </span>
                        <span className="text-xs text-zinc-500 ml-1 font-sans">PCS</span>
                      </td>

                      {/* Step: Filling */}
                      <td className="py-4 px-3 text-center">
                        <button
                          onClick={() => handleStepTap(p.id, 'filling')}
                          className="focus:outline-none cursor-pointer"
                        >
                          {p.steps.filling ? (
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500 text-black font-extrabold shadow-[0_0_12px_rgba(16,185,129,0.5)] transition-transform hover:scale-105">
                              ✓
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-800/80 border border-zinc-700/80 text-zinc-600 hover:border-amber-500/50 hover:text-zinc-400 transition">
                              &mdash;
                            </span>
                          )}
                        </button>
                      </td>

                      {/* Step: Labeling */}
                      <td className="py-4 px-3 text-center">
                        <button
                          onClick={() => handleStepTap(p.id, 'labeling')}
                          className="focus:outline-none cursor-pointer"
                        >
                          {p.steps.labeling ? (
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500 text-black font-extrabold shadow-[0_0_12px_rgba(16,185,129,0.5)] transition-transform hover:scale-105">
                              ✓
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-800/80 border border-zinc-700/80 text-zinc-600 hover:border-amber-500/50 hover:text-zinc-400 transition">
                              &mdash;
                            </span>
                          )}
                        </button>
                      </td>

                      {/* Step: Cukai */}
                      <td className="py-4 px-3 text-center">
                        <button
                          onClick={() => handleStepTap(p.id, 'cukai')}
                          className="focus:outline-none cursor-pointer"
                        >
                          {p.steps.cukai ? (
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500 text-black font-extrabold shadow-[0_0_12px_rgba(16,185,129,0.5)] transition-transform hover:scale-105">
                              ✓
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-800/80 border border-zinc-700/80 text-zinc-600 hover:border-amber-500/50 hover:text-zinc-400 transition">
                              &mdash;
                            </span>
                          )}
                        </button>
                      </td>

                      {/* Step: Finishing */}
                      <td className="py-4 px-3 text-center">
                        <button
                          onClick={() => handleStepTap(p.id, 'finishing')}
                          className="focus:outline-none cursor-pointer"
                        >
                          {p.steps.finishing ? (
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500 text-black font-extrabold shadow-[0_0_12px_rgba(16,185,129,0.5)] transition-transform hover:scale-105">
                              ✓
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-800/80 border border-zinc-700/80 text-zinc-600 hover:border-amber-500/50 hover:text-zinc-400 transition">
                              &mdash;
                            </span>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Bottom Running Text Marquee for TV Display */}
      <footer className="bg-[#141417] border-t-2 border-amber-500/80 py-2.5 px-4 sm:px-6 relative overflow-hidden shadow-2xl flex items-center">
        {/* Urgent / Info Badge */}
        <div
          className={`z-20 px-3 py-1 rounded text-xs font-black uppercase tracking-wider shadow-md shrink-0 mr-4 flex items-center gap-1.5 border ${getThemeClass()}`}
        >
          <Flame className="w-4 h-4" />
          <span>PENGUMUMAN</span>
        </div>

        {/* Scrolling text marquee */}
        <div className="overflow-hidden whitespace-nowrap flex-1 relative">
          <div
            className={`inline-block ${getMarqueeSpeedClass()} text-sm sm:text-base font-bold tracking-wide text-zinc-100 uppercase`}
          >
            <span className="mr-12">{runningText.text || 'TIDAK ADA PENGUMUMAN AKTIF'}</span>
            <span className="mr-12">{runningText.text || 'TIDAK ADA PENGUMUMAN AKTIF'}</span>
          </div>
        </div>

        {/* JVS Signature */}
        <div className="hidden lg:flex items-center pl-4 text-[10px] text-zinc-500 font-mono shrink-0 border-l border-zinc-800 ml-3">
          JVS LABZ &copy; 2026
        </div>
      </footer>
    </div>
  );
};
