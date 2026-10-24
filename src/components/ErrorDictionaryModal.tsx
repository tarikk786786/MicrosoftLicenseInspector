import React, { useState } from 'react';
import { X, Search, AlertCircle, Wrench, ShieldAlert } from 'lucide-react';
import { ACTIVATION_ERROR_DICTIONARY } from '../services/errorCodes';

interface ErrorDictionaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCode?: string;
}

export const ErrorDictionaryModal: React.FC<ErrorDictionaryModalProps> = ({
  isOpen,
  onClose,
  initialCode = '',
}) => {
  const [searchTerm, setSearchTerm] = useState(initialCode);

  if (!isOpen) return null;

  const entries = Object.values(ACTIVATION_ERROR_DICTIONARY);
  const filtered = entries.filter(e => 
    e.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#111827] border border-[#273549] rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-[#273549] flex items-center justify-between bg-[#0F172A]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Microsoft Activation Error Dictionary</h2>
              <p className="text-xs text-slate-400">
                Official diagnostic definitions and administrative remediation protocols
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

        {/* Search Input */}
        <div className="p-4 border-b border-[#273549] bg-[#0A0E17]">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search error codes (e.g. 0xC004C003, 0xC004C020, 0x803FA067)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#111827] border border-[#273549] focus:border-amber-500 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Error Items List */}
        <div className="p-5 overflow-y-auto space-y-4">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No matching activation error codes found for "{searchTerm}".
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.code}
                className="bg-[#0A0E17] border border-[#273549] rounded-xl p-4 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-rose-950 border border-rose-800 text-rose-300">
                      {item.code}
                    </span>
                    <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                  <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800/80">
                    <span className="text-amber-400 font-semibold flex items-center gap-1.5 mb-1">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      Technical Root Cause:
                    </span>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      {item.technicalCause}
                    </p>
                  </div>

                  <div className="bg-emerald-950/20 p-2.5 rounded border border-emerald-900/40">
                    <span className="text-emerald-400 font-semibold flex items-center gap-1.5 mb-1">
                      <Wrench className="w-3.5 h-3.5" />
                      Remediation Protocol:
                    </span>
                    <p className="text-emerald-300/90 text-[11px] leading-relaxed">
                      {item.recommendedRemediation}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#273549] bg-[#0F172A] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
          >
            Close Dictionary
          </button>
        </div>
      </div>
    </div>
  );
};
