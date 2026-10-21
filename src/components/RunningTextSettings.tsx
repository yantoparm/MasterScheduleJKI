import React, { useState } from 'react';
import { Megaphone, Save, Eye, Sparkles, Check, Flame, AlertCircle, Clock } from 'lucide-react';
import { RunningTextConfig } from '../types/production';
import { sound } from '../utils/sound';

interface RunningTextSettingsProps {
  config: RunningTextConfig;
  onSave: (config: RunningTextConfig) => void;
}

export const RunningTextSettings: React.FC<RunningTextSettingsProps> = ({
  config,
  onSave,
}) => {
  const [text, setText] = useState(config.text);
  const [speed, setSpeed] = useState<'slow' | 'normal' | 'fast'>(config.speed);
  const [theme, setTheme] = useState<'amber' | 'crimson' | 'emerald' | 'blue'>(config.theme);
  const [showSavedToast, setShowSavedToast] = useState(false);

  const presets = [
    {
      title: 'K3 & Target Harian (Default)',
      content:
        'PENGUMUMAN: Harap jaga kebersihan area produksi dan pastikan target harian tercapai tepat waktu! • UTAMAKAN K3 & HIGIENITAS LABZ',
    },
    {
      title: 'Target Shift 1 & Efisiensi',
      content:
        'TARGET SHIFT 1: 65.000 PCS • PASTIKAN KECEPATAN FILLING & LABELING SESUAI SOP • TETAP JAGA KUALITAS SEALING BOTOL!',
    },
    {
      title: 'Pemeriksaan Pita Cukai',
      content:
        'PERHATIAN: Pastikan penempelan pita cukai presisi dan barcode terbaca sempurna oleh mesin scanner sebelum masuk tahap finishing!',
    },
    {
      title: 'Inspeksi & Sterilisasi Lab',
      content:
        'PEMBERITAHUAN: Audit sanitasi dan sterilisasi ruangan lab akan dilaksanakan pukul 16:30 WIB. Harap rapikan meja kerja.',
    },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      text: text.trim(),
      speed,
      theme,
      isEnabled: true,
    });
    sound.playComplete();
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
    }, 3000);
  };

  const getThemeBadge = (th: typeof theme) => {
    switch (th) {
      case 'amber':
        return 'bg-amber-400 text-black border-amber-500';
      case 'crimson':
        return 'bg-red-600 text-white border-red-700';
      case 'emerald':
        return 'bg-emerald-500 text-black border-emerald-600';
      case 'blue':
        return 'bg-cyan-500 text-black border-cyan-600';
    }
  };

  const getSpeedClass = () => {
    if (speed === 'slow') return 'animate-marquee-slow';
    if (speed === 'fast') return 'animate-marquee-fast';
    return 'animate-marquee-normal';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-lg bg-amber-500/15 text-amber-600 border border-amber-500/30">
              <Megaphone className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900">Pengaturan Running Text</h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Ubah teks pengumuman berjalan yang akan disiarkan di bagian bawah layar TV produksi secara real-time.
              </p>
            </div>
          </div>

          {showSavedToast && (
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs px-3.5 py-1.5 rounded-full font-medium shadow-xs animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Running text tersimpan & aktif di TV!</span>
            </div>
          )}
        </div>

        {/* Live TV Preview Card */}
        <div className="mb-6 bg-zinc-950 rounded-xl p-4 border border-zinc-800 shadow-md">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-2.5 px-1">
            <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px] text-amber-400">
              <Eye className="w-3.5 h-3.5" />
              Simulasi Tampilan di Layar TV
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">Kecepatan: {speed.toUpperCase()}</span>
          </div>

          <div className="relative overflow-hidden rounded-lg bg-zinc-900 border border-zinc-800 py-3 px-2 flex items-center">
            {/* Tag Badge */}
            <div className={`z-10 px-3 py-1 rounded text-[11px] font-black uppercase tracking-wider shadow shrink-0 mr-3 flex items-center gap-1.5 ${getThemeBadge(theme)}`}>
              <Flame className="w-3.5 h-3.5" />
              <span>JVS INFO</span>
            </div>

            {/* Marquee Container */}
            <div className="overflow-hidden whitespace-nowrap flex-1 relative">
              <div className={`inline-block ${getSpeedClass()} text-sm font-semibold tracking-wide text-zinc-100`}>
                <span className="mr-8">{text || 'Tidak ada running text aktif'}</span>
                <span className="mr-8">{text || 'Tidak ada running text aktif'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSave} className="space-y-5 max-w-3xl">
          <div>
            <label className="block text-xs font-bold text-zinc-800 mb-1.5 flex items-center gap-1">
              <span>Teks Berjalan / Pengumuman Layar TV</span>
              <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
              className="w-full border border-zinc-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none leading-relaxed"
              placeholder="Masukkan teks pengumuman yang ingin disiarkan ke lantai produksi..."
            />
            <p className="text-[11px] text-zinc-400 mt-1">
              Gunakan simbol tanda pemisah • atau strip untuk mempercantik ritme pembacaan di TV.
            </p>
          </div>

          {/* Preset Buttons */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-2">
              Pilih Template Pengumuman Cepat:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setText(p.content)}
                  className="p-2.5 text-left border border-zinc-200 rounded-lg hover:border-amber-400 hover:bg-amber-50/50 transition group"
                >
                  <p className="text-xs font-bold text-zinc-800 group-hover:text-amber-800">{p.title}</p>
                  <p className="text-[11px] text-zinc-500 line-clamp-1 mt-0.5">{p.content}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Options: Speed & Color */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-zinc-500" />
                Kecepatan Animasi Marquee
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { key: 'slow', label: 'Lambat' },
                    { key: 'normal', label: 'Normal' },
                    { key: 'fast', label: 'Cepat' },
                  ] as const
                ).map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setSpeed(item.key)}
                    className={`py-2 text-xs font-medium rounded-lg border transition ${
                      speed === item.key
                        ? 'bg-amber-500 text-black font-bold border-amber-600 shadow-xs'
                        : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Warna Sorotan Badge TV
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(
                  [
                    { key: 'amber', label: 'Amber', color: 'bg-amber-400' },
                    { key: 'crimson', label: 'Merah', color: 'bg-red-500' },
                    { key: 'emerald', label: 'Hijau', color: 'bg-emerald-500' },
                    { key: 'blue', label: 'Sian', color: 'bg-cyan-500' },
                  ] as const
                ).map((thm) => (
                  <button
                    key={thm.key}
                    type="button"
                    onClick={() => setTheme(thm.key)}
                    className={`py-2 px-1 text-xs rounded-lg border flex items-center justify-center gap-1.5 transition ${
                      theme === thm.key
                        ? 'border-zinc-900 bg-zinc-100 font-bold ring-1 ring-zinc-900'
                        : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${thm.color}`}></span>
                    <span>{thm.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-3">
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs sm:text-sm px-6 py-2.5 rounded-lg transition shadow-sm hover:shadow flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan & Terapkan ke TV</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
