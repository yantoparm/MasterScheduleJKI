export interface ProductionSteps {
  filling: boolean;
  labeling: boolean;
  cukai: boolean;
  finishing: boolean;
}

export type StepKey = keyof ProductionSteps;

export interface ProjectItem {
  id: string;
  selesai: boolean;
  date: string;
  name: string;
  qty: string;
  shift?: string;
  notes?: string;
  steps: ProductionSteps;
  createdAt: number;
  updatedAt?: number;
}

export interface RunningTextConfig {
  text: string;
  speed: 'slow' | 'normal' | 'fast';
  theme: 'amber' | 'crimson' | 'emerald' | 'blue';
  isEnabled: boolean;
}

export const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: 'proj-1',
    selesai: true,
    date: 'Selasa, 20 Oktober 2026',
    name: 'NIXX XCAPE APPLE BAE 15ML',
    qty: '10.900',
    shift: 'Shift 1',
    steps: { filling: false, labeling: false, cukai: false, finishing: false },
    createdAt: Date.now() - 86400000,
  },
  {
    id: 'proj-2',
    selesai: false,
    date: 'Rabu, 21 Oktober 2026',
    name: 'NIXX XCAPE MUSC LICIOUS 15ML',
    qty: '10.700',
    shift: 'Shift 1',
    steps: { filling: false, labeling: false, cukai: true, finishing: true },
    createdAt: Date.now() - 72000000,
  },
  {
    id: 'proj-3',
    selesai: false,
    date: 'Rabu, 21 Oktober 2026',
    name: 'NIXX XCAPE YUBAE 15ML',
    qty: '10.900',
    shift: 'Shift 1',
    steps: { filling: false, labeling: false, cukai: true, finishing: true },
    createdAt: Date.now() - 60000000,
  },
  {
    id: 'proj-4',
    selesai: false,
    date: 'Rabu, 21 Oktober 2026',
    name: 'NIXX XCAPE PINK GUASH 15ML',
    qty: '10.900',
    shift: 'Shift 2',
    steps: { filling: false, labeling: false, cukai: false, finishing: true },
    createdAt: Date.now() - 45000000,
  },
  {
    id: 'proj-5',
    selesai: false,
    date: 'Rabu, 21 Oktober 2026',
    name: 'NIXX XCAPE SOUR PEACH 15ML',
    qty: '10.900',
    shift: 'Shift 2',
    steps: { filling: false, labeling: false, cukai: false, finishing: true },
    createdAt: Date.now() - 30000000,
  },
  {
    id: 'proj-6',
    selesai: false,
    date: 'Rabu, 21 Oktober 2026',
    name: 'NIXX XCAPE HOP SICLE 15ML',
    qty: '10.900',
    shift: 'Shift 2',
    steps: { filling: false, labeling: false, cukai: false, finishing: true },
    createdAt: Date.now() - 15000000,
  },
];

export const INITIAL_RUNNING_TEXT: RunningTextConfig = {
  text: 'PENGUMUMAN: Harap jaga kebersihan area produksi dan pastikan target harian tercapai tepat waktu! • UTAMAKAN K3 & HIGIENITAS LABZ • TARGET PRODUKSI OKTOBER TERCAPAI 94%',
  speed: 'normal',
  theme: 'amber',
  isEnabled: true,
};
