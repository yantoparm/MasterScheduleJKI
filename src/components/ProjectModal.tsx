import React, { useState, useEffect } from 'react';
import { X, CheckSquare, Layers, Calendar, Hash, Tag, Sparkles } from 'lucide-react';
import { ProjectItem, ProductionSteps } from '../types/production';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Omit<ProjectItem, 'id' | 'createdAt'>, id?: string) => void;
  editingProject: ProjectItem | null;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingProject,
}) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('Rabu, 21 Oktober 2026');
  const [qty, setQty] = useState('10.900');
  const [shift, setShift] = useState('Shift 1');
  const [notes, setNotes] = useState('');
  const [steps, setSteps] = useState<ProductionSteps>({
    filling: false,
    labeling: false,
    cukai: false,
    finishing: false,
  });

  useEffect(() => {
    if (editingProject) {
      setName(editingProject.name);
      setDate(editingProject.date);
      setQty(editingProject.qty);
      setShift(editingProject.shift || 'Shift 1');
      setNotes(editingProject.notes || '');
      setSteps(editingProject.steps || {
        filling: false,
        labeling: false,
        cukai: false,
        finishing: false,
      });
    } else {
      // Default new project
      setName('');
      // Generate current Indonesian date or default
      const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
      ];
      const now = new Date();
      const dayName = days[now.getDay()];
      const dayNum = now.getDate();
      const monthName = months[now.getMonth()];
      const year = now.getFullYear();
      setDate(`${dayName}, ${dayNum} ${monthName} ${year}`);
      setQty('10.900');
      setShift('Shift 1');
      setNotes('');
      setSteps({
        filling: false,
        labeling: false,
        cukai: false,
        finishing: false,
      });
    }
  }, [editingProject, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave(
      {
        name: name.trim(),
        date: date.trim(),
        qty: qty.trim(),
        shift,
        notes: notes.trim(),
        selesai: editingProject ? editingProject.selesai : false,
        steps,
      },
      editingProject?.id
    );
    onClose();
  };

  const handleStepToggle = (stepKey: keyof ProductionSteps) => {
    setSteps(prev => ({
      ...prev,
      [stepKey]: !prev[stepKey],
    }));
  };

  const quickPresets = [
    'NIXX XCAPE MANGO BLAZE 15ML',
    'NIXX XCAPE FROSTED BERRY 15ML',
    'JVS SUPREME PODS 30ML',
    'MOVI X JVS SALTNIC 30ML',
    'OAT DRIPS V10 ORIGINAL 60ML',
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-zinc-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-600 flex items-center justify-center font-bold">
              <Layers className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900">
                {editingProject ? 'Edit Project Produksi' : 'Tambah Project Baru'}
              </h3>
              <p className="text-[11px] text-zinc-500">
                Data akan otomatis disinkronkan ke Master Schedule & Tampilan Layar TV
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 p-1.5 rounded-lg hover:bg-zinc-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-xs">
          {/* Project Name */}
          <div>
            <label className="block font-semibold text-zinc-700 mb-1 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-amber-500" />
              Nama Project / Produk <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-zinc-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none uppercase font-medium"
              placeholder="Contoh: NIXX XCAPE APPLE BAE 15ML"
            />
            {/* Quick Suggestions */}
            {!editingProject && (
              <div className="mt-1.5 flex flex-wrap gap-1">
                <span className="text-[10px] text-zinc-400 self-center">Preset:</span>
                {quickPresets.slice(0, 3).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setName(item)}
                    className="text-[10px] bg-zinc-100 hover:bg-amber-100 text-zinc-700 px-2 py-0.5 rounded border border-zinc-200 transition"
                  >
                    {item.split(' ')[2] || item}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Date */}
            <div>
              <label className="block font-semibold text-zinc-700 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-500" />
                Date (Estimasi) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-zinc-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none font-medium"
                placeholder="Contoh: Rabu, 21 Oktober 2026"
              />
            </div>

            {/* QTY */}
            <div>
              <label className="block font-semibold text-zinc-700 mb-1 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-amber-500" />
                Quantity (QTY) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                className="w-full border border-zinc-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none font-mono-num font-semibold"
                placeholder="Contoh: 10.900"
              />
            </div>
          </div>

          {/* Shift selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-zinc-700 mb-1">Shift Kerja</label>
              <select
                value={shift}
                onChange={(e) => setShift(e.target.value)}
                className="w-full border border-zinc-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none bg-white font-medium"
              >
                <option value="Shift 1">Shift 1 (Pagi: 07:00 - 15:00)</option>
                <option value="Shift 2">Shift 2 (Siang: 15:00 - 23:00)</option>
                <option value="Shift 3">Shift 3 (Malam: 23:00 - 07:00)</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-zinc-700 mb-1">Catatan / No. Batch (Opsional)</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full border border-zinc-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none"
                placeholder="Misal: Batch A-109 / Botol Chubby"
              />
            </div>
          </div>

          {/* Steps Status Checkboxes */}
          <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-3.5">
            <span className="block font-bold text-amber-900 mb-2">
              Status Alur Produksi (Checklist Tahapan):
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {(['filling', 'labeling', 'cukai', 'finishing'] as const).map((stepKey) => {
                const label = stepKey.charAt(0).toUpperCase() + stepKey.slice(1);
                const isChecked = steps[stepKey];
                return (
                  <button
                    key={stepKey}
                    type="button"
                    onClick={() => handleStepToggle(stepKey)}
                    className={`flex items-center justify-between p-2 rounded-lg border text-left transition ${
                      isChecked
                        ? 'bg-amber-400 border-amber-500 text-black font-bold shadow-xs'
                        : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300'
                    }`}
                  >
                    <span>{label}</span>
                    <CheckSquare className={`w-3.5 h-3.5 ${isChecked ? 'text-black' : 'text-zinc-300'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-3 border-t border-zinc-100">
            <button
              type="button"
              onClick={onClose}
              className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 px-4 py-2 rounded-lg font-medium transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-5 py-2 rounded-lg transition shadow-sm hover:shadow cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{editingProject ? 'Simpan Perubahan' : 'Simpan Project'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
