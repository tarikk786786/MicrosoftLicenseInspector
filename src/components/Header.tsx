import React from 'react';
import { ShieldCheck, Server, AlertCircle, FileSpreadsheet, BookOpen, KeyRound } from 'lucide-react';
import { BackendHealth } from '../services/apiService';

interface HeaderProps {
  backendHealth: BackendHealth | null;
  onOpenErrorModal: () => void;
  onOpenExportModal: () => void;
  onOpenGuideModal: () => void;
  recordsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  backendHealth,
  onOpenErrorModal,
  onOpenExportModal,
  onOpenGuideModal,
  recordsCount,
}) => {
  return (
    <header className="border-b border-[#273549] bg-[#0F172A]/80 backdrop-blur sticky top-0 z-30 px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0078D4] to-[#0284C7] p-2 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <KeyRound className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Microsoft License Inspector
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
                  v1.0.0 Enterprise
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400">
              Bulk Key Diagnostic, Base-24 Verification & Local Host Audit Engine
            </p>
          </div>
        </div>

        {/* Status Indicators & Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Backend Agent Indicator */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium ${
            backendHealth
              ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-400'
              : 'bg-amber-950/40 border-amber-800/60 text-amber-400'
          }`}>
            <Server className="w-3.5 h-3.5" />
            <span>
              {backendHealth ? 'Host Agent Connected (127.0.0.1)' : 'Host Agent Offline (Client Mode)'}
            </span>
          </div>

          {/* Privacy badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/50 text-slate-300 text-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Zero Cloud Uploads • In-Memory Only</span>
          </div>

          {/* Action buttons */}
          <button
            onClick={onOpenGuideModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-600 bg-slate-800/70 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
            title="Official Verification & Licensing Guidelines"
          >
            <BookOpen className="w-3.5 h-3.5 text-sky-400" />
            <span>Licensing Guide</span>
          </button>

          <button
            onClick={onOpenErrorModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-600 bg-slate-800/70 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
            title="Activation Error Code Dictionary"
          >
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Error Dictionary</span>
          </button>

          <button
            onClick={onOpenExportModal}
            disabled={recordsCount === 0}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0078D4] hover:bg-[#106EBE] disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-medium shadow-md shadow-blue-600/20 transition"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export Report ({recordsCount})</span>
          </button>
        </div>
      </div>
    </header>
  );
};
