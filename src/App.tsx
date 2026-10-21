/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ProjectTable } from './components/ProjectTable';
import { RunningTextSettings } from './components/RunningTextSettings';
import { ProjectModal } from './components/ProjectModal';
import { TvDisplayView } from './components/TvDisplayView';
import {
  ProjectItem,
  RunningTextConfig,
  StepKey,
  INITIAL_PROJECTS,
  INITIAL_RUNNING_TEXT,
} from './types/production';
import { sound } from './utils/sound';

export default function App() {
  const [currentView, setCurrentView] = useState<'admin' | 'tv'>('admin');
  const [activeTab, setActiveTab] = useState<'production' | 'running-text'>('production');
  const [userEmail] = useState<string>('yantoparmanto@gmail.com');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Projects state with LocalStorage persistence
  const [projects, setProjects] = useState<ProjectItem[]>(() => {
    try {
      const saved = localStorage.getItem('jvs_mps_projects_v2');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return INITIAL_PROJECTS;
  });

  // Running text configuration
  const [runningText, setRunningText] = useState<RunningTextConfig>(() => {
    try {
      const saved = localStorage.getItem('jvs_mps_running_text_v2');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return INITIAL_RUNNING_TEXT;
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);

  // Synchronize projects to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('jvs_mps_projects_v2', JSON.stringify(projects));
    } catch {
      // ignore
    }
  }, [projects]);

  // Synchronize running text to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('jvs_mps_running_text_v2', JSON.stringify(runningText));
    } catch {
      // ignore
    }
  }, [runningText]);

  // Cross-tab synchronization
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'jvs_mps_projects_v2' && e.newValue) {
        try {
          setProjects(JSON.parse(e.newValue));
        } catch {
          // ignore
        }
      } else if (e.key === 'jvs_mps_running_text_v2' && e.newValue) {
        try {
          setRunningText(JSON.parse(e.newValue));
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Sound effects toggle
  const handleToggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    sound.setEnabled(nextState);
  };

  // Toggle finished status
  const handleToggleProjectStatus = (id: string) => {
    setProjects((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              selesai: !item.selesai,
              updatedAt: Date.now(),
            }
          : item
      )
    );
  };

  // Toggle individual step
  const handleToggleStep = (id: string, stepName: StepKey) => {
    setProjects((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextSteps = {
            ...item.steps,
            [stepName]: !item.steps[stepName],
          };
          return {
            ...item,
            steps: nextSteps,
            updatedAt: Date.now(),
          };
        }
        return item;
      })
    );
  };

  // Delete single project
  const handleDeleteProject = (id: string) => {
    setProjects((prev) => prev.filter((item) => item.id !== id));
  };

  // Delete all completed
  const handleDeleteCompleted = () => {
    setProjects((prev) => prev.filter((item) => !item.selesai));
  };

  // Save new or edit project
  const handleSaveProject = (
    projectData: Omit<ProjectItem, 'id' | 'createdAt'>,
    id?: string
  ) => {
    if (id) {
      // Update existing
      setProjects((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                ...projectData,
                updatedAt: Date.now(),
              }
            : item
        )
      );
    } else {
      // Add new
      const newProject: ProjectItem = {
        ...projectData,
        id: `proj-${Date.now()}`,
        createdAt: Date.now(),
      };
      setProjects((prev) => [newProject, ...prev]);
    }
  };

  // Duplicate project
  const handleDuplicateProject = (project: ProjectItem) => {
    const duplicate: ProjectItem = {
      ...project,
      id: `proj-${Date.now()}`,
      name: `${project.name} (SALINAN)`,
      selesai: false,
      createdAt: Date.now(),
    };
    setProjects((prev) => [duplicate, ...prev]);
    sound.playCheck();
  };

  // Reset to initial demo data
  const handleResetData = () => {
    if (confirm('Kembalikan semua data project dan running text ke pengaturan awal bawaan?')) {
      setProjects(INITIAL_PROJECTS);
      setRunningText(INITIAL_RUNNING_TEXT);
      localStorage.removeItem('jvs_mps_projects_v2');
      localStorage.removeItem('jvs_mps_running_text_v2');
      sound.playAlert();
    }
  };

  // Open Add modal
  const handleOpenAddModal = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  // Open Edit modal
  const handleOpenEditModal = (project: ProjectItem) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  // Logout handler
  const handleLogout = () => {
    if (confirm(`Apakah Anda yakin ingin keluar dari akun ${userEmail}?`)) {
      alert('Sesi admin telah ditutup.');
    }
  };

  // If user is in TV view, show dedicated Layar TV display
  if (currentView === 'tv') {
    return (
      <TvDisplayView
        projects={projects}
        runningText={runningText}
        onBackToAdmin={() => setCurrentView('admin')}
        onToggleStep={handleToggleStep}
        onToggleProjectStatus={handleToggleProjectStatus}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />
    );
  }

  // Admin View
  return (
    <div className="bg-[#fcfaf6] min-h-screen text-zinc-800 flex flex-col justify-between selection:bg-amber-500 selection:text-black">
      {/* Top Header */}
      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        userEmail={userEmail}
        onLogoutClick={handleLogout}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onResetData={handleResetData}
      />

      {/* Main Navigation Tabs */}
      <nav className="bg-white border-b border-zinc-200 px-4 sm:px-6 pt-3 shadow-xs sticky top-[57px] z-30">
        <div className="max-w-7xl mx-auto flex space-x-8">
          <button
            onClick={() => setActiveTab('production')}
            className={`pb-3 text-sm font-bold border-b-2 transition cursor-pointer ${
              activeTab === 'production'
                ? 'border-amber-500 text-zinc-900'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Jadwal produksi
          </button>
          <button
            onClick={() => setActiveTab('running-text')}
            className={`pb-3 text-sm font-semibold border-b-2 transition cursor-pointer ${
              activeTab === 'running-text'
                ? 'border-amber-500 text-zinc-900'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Running text
          </button>
        </div>
      </nav>

      {/* Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'production' ? (
          <ProjectTable
            projects={projects}
            onToggleProjectStatus={handleToggleProjectStatus}
            onToggleStep={handleToggleStep}
            onDeleteProject={handleDeleteProject}
            onDeleteCompleted={handleDeleteCompleted}
            onOpenAddModal={handleOpenAddModal}
            onOpenEditModal={handleOpenEditModal}
            onDuplicateProject={handleDuplicateProject}
          />
        ) : (
          <RunningTextSettings
            config={runningText}
            onSave={(newConfig) => setRunningText(newConfig)}
          />
        )}
      </main>

      {/* Footer matching prototype */}
      <footer className="text-center py-6 text-xs text-zinc-500 border-t border-zinc-200 bg-white mt-12">
        <p className="font-medium">&copy; 2026 JVS Group &ndash; damnhadi</p>
        <p className="text-[11px] text-zinc-400 mt-0.5">
          Master Production Schedule &middot; JVS Labz Indonesia
        </p>
      </footer>

      {/* Add / Edit Project Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProject}
        editingProject={editingProject}
      />
    </div>
  );
}
