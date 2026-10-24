import React from 'react';
import { X, CheckCircle2, AlertTriangle, ShieldCheck, Cpu, Building2 } from 'lucide-react';

interface LegitimateVerificationGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LegitimateVerificationGuide: React.FC<LegitimateVerificationGuideProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#111827] border border-[#273549] rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-[#273549] flex items-center justify-between bg-[#0F172A]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Microsoft Licensing & Verification Standards</h2>
              <p className="text-xs text-slate-400">
                Understanding the 3 validation stages, official boundaries, and diagnostic evidence
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

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300 leading-relaxed">
          {/* Critical Disclaimer Banner */}
          <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/60 text-amber-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-300 text-sm">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>Fundamental Microsoft Activation Limitation</span>
            </div>
            <p>
              Microsoft provides <strong>no universal, unauthenticated public API</strong> that reveals whether an arbitrary, uninstalled product key is active, genuine, or blocked. Any third-party website claiming to "check any key online" either violates Microsoft Terms of Service, steals proprietary keys, or displays fabricated results.
            </p>
          </div>

          {/* The 3 Validation Stages */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-400">
              The 3 Verification Stages Enforced by This Tool
            </h3>

            {/* Stage A */}
            <div className="bg-[#0A0E17] border border-[#273549] rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>Stage A — Mathematical & Base-24 Format Verification</span>
              </div>
              <p className="text-slate-400">
                Checks whether the string strictly conforms to Microsoft 5x5 Base-24 specifications (excluding ambiguous characters 0, 1, 5, A, E, I, O, U, L, S, Z). Compares against Microsoft Learn's published KMS/GVLK setup keys to detect product edition and volume channel with 100% certainty.
              </p>
              <div className="text-[11px] bg-slate-900 p-2 rounded text-slate-300">
                <strong>Status Result:</strong> <code className="text-emerald-400">FORMAT_VALID</code> or <code className="text-rose-400">FORMAT_INVALID</code>. Passing does NOT mean the key is activated.
              </div>
            </div>

            {/* Stage B */}
            <div className="bg-[#0A0E17] border border-[#273549] rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-sky-400 font-semibold text-sm">
                <Cpu className="w-4 h-4" />
                <span>Stage B — Installed Host License Diagnostics (CIM / WMI & ospp.vbs)</span>
              </div>
              <p className="text-slate-400">
                For a Windows computer you own or administer, executes legitimate, read-only system queries to inspect installed OS and Office activation status, partial product key (last 5 chars), channel, and remaining grace period.
              </p>
              <div className="text-[11px] bg-slate-900 p-2 rounded text-slate-300">
                <strong>Status Result:</strong> <code className="text-emerald-400">ACTIVATED_ON_THIS_DEVICE</code>, <code className="text-amber-400">NOT_ACTIVATED</code>, or <code className="text-rose-400">ACTIVATION_ERROR</code>.
              </div>
            </div>

            {/* Stage C */}
            <div className="bg-[#0A0E17] border border-[#273549] rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm">
                <Building2 className="w-4 h-4" />
                <span>Stage C — Official Enterprise Entitlement Verification</span>
              </div>
              <p className="text-slate-400">
                For complete key-level ownership, seat counts, and revocation checks, use Microsoft's authorized administration tools:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-300 text-[11px]">
                <li><strong>Microsoft 365 Admin Center:</strong> View active user subscription assignments and device tokens.</li>
                <li><strong>Microsoft Volume Licensing Service Center (VLSC):</strong> View MAK counts and agreements.</li>
                <li><strong>Volume Activation Management Tool (VAMT):</strong> Official Microsoft MMC snap-in for managing MAK and KMS keys across corporate subnets.</li>
                <li><strong>slui.exe 4 / Phone Activation:</strong> Authoritative telephone verification for retail keys.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#273549] bg-[#0F172A] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
