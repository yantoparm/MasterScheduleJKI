import React, { useState, useMemo } from 'react';
import {
  Plus,
  Trash2,
  Edit2,
  Copy,
  CheckCircle2,
  Search,
  Filter,
  Download,
  AlertTriangle,
  ArrowUpDown,
  Sparkles,
  CheckSquare,
  Square,
  Clock,
  Layers,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ProjectItem, StepKey } from '../types/production';
import { sound } from '../utils/sound';

interface ProjectTableProps {
  projects: ProjectItem[];
  onToggleProjectStatus: (id: string) => void;
  onToggleStep: (id: string, stepName: StepKey) => void;
  onDeleteProject: (id: string) => void;
  onDeleteCompleted: () => void;
  onOpenAddModal: () => void;
  onOpenEditModal: (project: ProjectItem) => void;
  onDuplicateProject: (project: ProjectItem) => void;
}

export const ProjectTable: React.FC<ProjectTableProps> = ({
  projects,
  onToggleProjectStatus,
  onToggleStep,
  onDeleteProject,
  onDeleteCompleted,
  onOpenAddModal,
  onOpenEditModal,
  onDuplicateProject,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unfinished' | 'finished'>('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [showConfirmDeleteAllCompleted, setShowConfirmDeleteAllCompleted] = useState(false);

  // Statistics calculation
  const totalCount = projects.length;
  const finishedCount = projects.filter((p) => p.selesai).length;
  const unfinishedCount = totalCount - finishedCount;

  // Filtered dataset
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.notes && p.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.shift && p.shift.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      if (statusFilter === 'unfinished') return !p.selesai;
      if (statusFilter === 'finished') return p.selesai;
      return true;
    });
  }, [projects, searchQuery, statusFilter]);

  const handleToggleFinished = (project: ProjectItem) => {
    const nextStatus = !project.selesai;
    if (nextStatus) {
      sound.playComplete();
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#f59e0b', '#fbbf24', '#10b981', '#3b82f6'],
        });
      } catch {
        // ignore
      }
    } else {
      sound.playCheck();
    }
    onToggleProjectStatus(project.id);
  };

  const handleStepClick = (projectId: string, stepName: StepKey) => {
    sound.playCheck();
    onToggleStep(projectId, stepName);
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Status', 'Date', 'Project', 'QTY', 'Filling', 'Labeling', 'Cukai', 'Finishing', 'Shift', 'Catatan'];
    const rows = projects.map((p) => [
      p.id,
      p.selesai ? 'SELESAI' : 'BELUM',
      `"${p.date}"`,
      `"${p.name}"`,
      `"${p.qty}"`,
      p.steps.filling ? 'V' : '-',
      p.steps.labeling ? 'V' : '-',
      p.steps.cukai ? 'V' : '-',
      p.steps.finishing ? 'V' : '-',
      `"${p.shift || '-'}"`,
      `"${p.notes || '-'}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Master_Production_Schedule_JVS_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate step progress percentage
  const getStepProgress = (steps: ProjectItem['steps']) => {
    const count = [steps.filling, steps.labeling, steps.cukai, steps.finishing].filter(Boolean).length;
    return { count, total: 4, pct: Math.round((count / 4) * 100) };
  };

  return (
    <div className="space-y-4">
      {/* Top Card: Title, Counter & Action Buttons */}
      <div className="bg-white border border-amber-200/90 rounded-xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold text-zinc-900 tracking-tight">
                Jadwal produksi
              </h2>
              <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2 py-0.5 rounded-full border border-amber-300">
                Lantai Produksi
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-1 font-medium">
              <span className="font-bold text-zinc-800">{totalCount} project</span> &middot;{' '}
              <span className="font-bold text-amber-600">{unfinishedCount} belum selesai</span> &middot;{' '}
              <span className="font-bold text-emerald-600">{finishedCount} selesai</span> &middot;{' '}
              <span className="text-zinc-400">centang langsung tersimpan dan tampil di TV</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            {/* Hapus yang selesai */}
            <button
              onClick={() => {
                if (finishedCount === 0) {
                  alert('Tidak ada project dengan status selesai untuk dihapus.');
                  return;
                }
                setShowConfirmDeleteAllCompleted(true);
              }}
              disabled={finishedCount === 0}
              className={`text-xs font-semibold px-3.5 py-2 rounded-lg border transition shadow-xs flex items-center gap-1.5 cursor-pointer ${
                finishedCount > 0
                  ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300 hover:border-amber-400'
                  : 'bg-zinc-100 text-zinc-400 border-zinc-200 cursor-not-allowed'
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus yang selesai ({finishedCount})</span>
            </button>

            {/* Export CSV */}
            <button
              onClick={handleExportCSV}
              title="Unduh laporan jadwal ke file CSV"
              className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-300 text-xs font-medium px-3 py-2 rounded-lg transition shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            {/* Tambah project */}
            <button
              onClick={onOpenAddModal}
              className="bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs px-4 py-2 rounded-lg transition shadow-sm hover:shadow flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Tambah project</span>
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-zinc-100">
          {/* Quick status tabs */}
          <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-lg border border-zinc-200 self-start sm:self-auto text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-md font-semibold transition ${
                statusFilter === 'all'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Semua ({totalCount})
            </button>
            <button
              onClick={() => setStatusFilter('unfinished')}
              className={`px-3 py-1 rounded-md font-semibold transition ${
                statusFilter === 'unfinished'
                  ? 'bg-amber-500 text-black shadow-xs font-bold'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Belum Selesai ({unfinishedCount})
            </button>
            <button
              onClick={() => setStatusFilter('finished')}
              className={`px-3 py-1 rounded-md font-semibold transition ${
                statusFilter === 'finished'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Selesai ({finishedCount})
            </button>
          </div>

          {/* Search input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari project, tanggal, batch..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-zinc-50 hover:bg-white focus:bg-white border border-zinc-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 text-[11px]"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Table Container */}
        <div className="mt-4 overflow-x-auto border border-zinc-200 rounded-xl shadow-xs">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="bg-amber-50/80 text-zinc-800 uppercase tracking-wider text-[11px] font-bold border-b border-amber-200/90 select-none">
                <th className="py-3 px-3 sm:px-4 text-center w-16 sm:w-20">Selesai</th>
                <th className="py-3 px-3 sm:px-4 font-bold min-w-[150px]">Date (Estimasi)</th>
                <th className="py-3 px-3 sm:px-4 font-bold min-w-[220px]">Project</th>
                <th className="py-3 px-3 sm:px-4 font-bold text-right min-w-[90px]">Qty</th>
                <th className="py-3 px-2 sm:px-4 font-bold text-center w-20">Filling</th>
                <th className="py-3 px-2 sm:px-4 font-bold text-center w-20">Labeling</th>
                <th className="py-3 px-2 sm:px-4 font-bold text-center w-20">Cukai</th>
                <th className="py-3 px-2 sm:px-4 font-bold text-center w-20">Finishing</th>
                <th className="py-3 px-3 sm:px-4 font-bold text-center w-28">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 bg-white">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-zinc-400 bg-zinc-50/50">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Layers className="w-8 h-8 text-zinc-300" />
                      <p className="font-semibold text-zinc-600">Tidak ada jadwal project yang cocok</p>
                      <p className="text-xs text-zinc-400">
                        {searchQuery ? 'Coba ubah kata kunci pencarian Anda' : 'Klik tombol "Tambah project" untuk mulai membuat antrean produksi.'}
                      </p>
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="mt-2 text-xs text-amber-600 hover:underline font-semibold"
                        >
                          Reset Pencarian
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProjects.map((p) => {
                  const stepProg = getStepProgress(p.steps);
                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-amber-50/50 transition-colors border-b border-zinc-100 ${
                        p.selesai ? 'bg-amber-50/25 text-zinc-500' : 'text-zinc-900'
                      }`}
                    >
                      {/* Selesai Overall Checkbox */}
                      <td className="py-3.5 px-3 sm:px-4 text-center">
                        <input
                          type="checkbox"
                          checked={p.selesai}
                          onChange={() => handleToggleFinished(p)}
                          title={p.selesai ? 'Tandai belum selesai' : 'Tandai selesai'}
                          className="w-4 h-4 text-amber-600 rounded border-zinc-300 focus:ring-amber-500 cursor-pointer accent-amber-500 transition"
                        />
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-3 sm:px-4 text-zinc-600 font-medium whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                          <span className={p.selesai ? 'line-through text-zinc-400' : ''}>
                            {p.date}
                          </span>
                        </div>
                      </td>

                      {/* Project Name */}
                      <td className="py-3.5 px-3 sm:px-4 font-bold text-zinc-900">
                        <div className="flex flex-col">
                          <span className={`tracking-tight ${p.selesai ? 'line-through text-zinc-400 font-medium' : ''}`}>
                            {p.name}
                          </span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {p.shift && (
                              <span className="text-[10px] bg-zinc-100 text-zinc-600 px-1.5 py-0.2 rounded font-medium">
                                {p.shift}
                              </span>
                            )}
                            {p.notes && (
                              <span className="text-[10px] text-zinc-400 italic">
                                &bull; {p.notes}
                              </span>
                            )}
                            {/* Step progress pills on desktop */}
                            <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-medium ${
                              stepProg.count === 4
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100/70 text-amber-800'
                            }`}>
                              {stepProg.count}/4 langkah
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* QTY */}
                      <td className="py-3.5 px-3 sm:px-4 text-right font-mono-num font-bold text-zinc-700 whitespace-nowrap">
                        <span className={p.selesai ? 'line-through text-zinc-400' : 'text-zinc-800'}>
                          {p.qty}
                        </span>
                        <span className="text-[10px] text-zinc-400 ml-1 font-normal">PCS</span>
                      </td>

                      {/* Step 1: Filling */}
                      <td className="py-3.5 px-2 sm:px-4 text-center">
                        <label className="inline-flex items-center justify-center p-1 rounded-md hover:bg-amber-100/60 cursor-pointer transition">
                          <input
                            type="checkbox"
                            checked={p.steps.filling}
                            onChange={() => handleStepClick(p.id, 'filling')}
                            className="w-4 h-4 rounded border-zinc-300 cursor-pointer accent-amber-500"
                          />
                        </label>
                      </td>

                      {/* Step 2: Labeling */}
                      <td className="py-3.5 px-2 sm:px-4 text-center">
                        <label className="inline-flex items-center justify-center p-1 rounded-md hover:bg-amber-100/60 cursor-pointer transition">
                          <input
                            type="checkbox"
                            checked={p.steps.labeling}
                            onChange={() => handleStepClick(p.id, 'labeling')}
                            className="w-4 h-4 rounded border-zinc-300 cursor-pointer accent-amber-500"
                          />
                        </label>
                      </td>

                      {/* Step 3: Cukai */}
                      <td className="py-3.5 px-2 sm:px-4 text-center">
                        <label className="inline-flex items-center justify-center p-1 rounded-md hover:bg-amber-100/60 cursor-pointer transition">
                          <input
                            type="checkbox"
                            checked={p.steps.cukai}
                            onChange={() => handleStepClick(p.id, 'cukai')}
                            className="w-4 h-4 rounded border-zinc-300 cursor-pointer accent-amber-500"
                          />
                        </label>
                      </td>

                      {/* Step 4: Finishing */}
                      <td className="py-3.5 px-2 sm:px-4 text-center">
                        <label className="inline-flex items-center justify-center p-1 rounded-md hover:bg-amber-100/60 cursor-pointer transition">
                          <input
                            type="checkbox"
                            checked={p.steps.finishing}
                            onChange={() => handleStepClick(p.id, 'finishing')}
                            className="w-4 h-4 rounded border-zinc-300 cursor-pointer accent-amber-500"
                          />
                        </label>
                      </td>

                      {/* Aksi: Edit, Duplicate, Hapus */}
                      <td className="py-3.5 px-3 sm:px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center space-x-1.5 sm:space-x-2">
                          <button
                            onClick={() => onOpenEditModal(p)}
                            title="Edit project"
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-1.5 rounded transition font-semibold"
                          >
                            <span className="hidden sm:inline">Edit</span>
                            <Edit2 className="w-3.5 h-3.5 sm:hidden" />
                          </button>

                          <button
                            onClick={() => onDuplicateProject(p)}
                            title="Duplikasi project ini"
                            className="text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 p-1.5 rounded transition"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setDeleteConfirmId(p.id)}
                            title="Hapus project"
                            className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1.5 rounded transition font-semibold"
                          >
                            <span className="hidden sm:inline">Hapus</span>
                            <Trash2 className="w-3.5 h-3.5 sm:hidden" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal for Single Project Deletion */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-xl border border-zinc-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h4 className="font-bold text-zinc-900 text-sm">Konfirmasi Hapus</h4>
                <p className="text-[11px] text-zinc-500">Tindakan ini tidak dapat dibatalkan</p>
              </div>
            </div>
            <p className="text-xs text-zinc-700 mb-4">
              Yakin ingin menghapus project ini dari Master Production Schedule?
            </p>
            <div className="flex justify-end gap-2 text-xs">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3.5 py-1.5 rounded-lg border border-zinc-300 text-zinc-700 hover:bg-zinc-50 font-medium"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  onDeleteProject(deleteConfirmId);
                  setDeleteConfirmId(null);
                  sound.playAlert();
                }}
                className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold transition shadow-xs"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Delete All Completed */}
      {showConfirmDeleteAllCompleted && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-xl border border-zinc-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-amber-600 mb-3">
              <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h4 className="font-bold text-zinc-900 text-sm">Hapus Semua Selesai</h4>
                <p className="text-[11px] text-zinc-500">Membersihkan antrean produksi</p>
              </div>
            </div>
            <p className="text-xs text-zinc-700 mb-4">
              Yakin ingin menghapus <strong>{finishedCount} project</strong> yang berstatus selesai? Project yang belum selesai akan tetap dipertahankan.
            </p>
            <div className="flex justify-end gap-2 text-xs">
              <button
                onClick={() => setShowConfirmDeleteAllCompleted(false)}
                className="px-3.5 py-1.5 rounded-lg border border-zinc-300 text-zinc-700 hover:bg-zinc-50 font-medium"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  onDeleteCompleted();
                  setShowConfirmDeleteAllCompleted(false);
                  sound.playCheck();
                }}
                className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-black font-bold transition shadow-xs"
              >
                Hapus ({finishedCount}) Selesai
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
