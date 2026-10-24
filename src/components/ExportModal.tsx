import React, { useState } from 'react';
import { X, Download, Copy, Check, FileSpreadsheet, FileJson, FileText, ShieldCheck } from 'lucide-react';
import { LicenseKeyRecord, DeviceDiagnosticReport } from '../types/licensing';
import { exportToCSV, exportToJSON, exportToMarkdown } from '../services/reportGenerator';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: LicenseKeyRecord[];
  deviceReport: DeviceDiagnosticReport | null;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  records,
  deviceReport,
}) => {
  const [activeTab, setActiveTab] = useState<'csv' | 'json' | 'md'>('csv');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  let content = '';
  let filename = '';
  let mimeType = '';

  if (activeTab === 'csv') {
    content = exportToCSV(records);
    filename = `microsoft-license-audit-${new Date().toISOString().slice(0, 10)}.csv`;
    mimeType = 'text/csv;charset=utf-8;';
  } else if (activeTab === 'json') {
    content = exportToJSON(records, deviceReport);
    filename = `microsoft-license-audit-${new Date().toISOString().slice(0, 10)}.json`;
    mimeType = 'application/json;charset=utf-8;';
  } else {
    content = exportToMarkdown(records, deviceReport);
    filename = `microsoft-license-audit-${new Date().toISOString().slice(0, 10)}.md`;
    mimeType = 'text/markdown;charset=utf-8;';
  }

  const handleDownload = () => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#111827] border border-[#273549] rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-[#273549] flex items-center justify-between bg-[#0F172A]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Export Diagnostic Audit Report</h2>
              <p className="text-xs text-slate-400">
                Export sanitized diagnostic evidence with keys masked for compliance records
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selectors */}
        <div className="p-4 border-b border-[#273549] bg-[#0A0E17] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('csv')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'csv'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>CSV Spreadsheet</span>
            </button>
            <button
              onClick={() => setActiveTab('json')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'json'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <FileJson className="w-3.5 h-3.5" />
              <span>Structured JSON</span>
            </button>
            <button
              onClick={() => setActiveTab('md')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'md'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Markdown Summary</span>
            </button>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/40 px-2 py-1 rounded border border-emerald-800/60">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Keys Protected & Masked</span>
          </div>
        </div>

        {/* Content Preview */}
        <div className="p-4 overflow-y-auto flex-1 font-mono text-[11px] bg-[#0A0E17]">
          <pre className="text-slate-300 whitespace-pre-wrap select-all leading-relaxed bg-[#111827] p-3 rounded-lg border border-[#273549]">
            {content}
          </pre>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#273549] bg-[#0F172A] flex items-center justify-between">
          <span className="text-xs text-slate-400 font-mono">
            Filename: {filename}
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0078D4] hover:bg-[#106EBE] text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download {activeTab.toUpperCase()}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
