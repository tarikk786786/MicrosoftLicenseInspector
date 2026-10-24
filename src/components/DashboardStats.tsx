import React from 'react';
import { KeyRound, CheckCircle2, ShieldAlert, Cpu, HelpCircle, AlertOctagon } from 'lucide-react';
import { DashboardMetrics, DeviceDiagnosticReport } from '../types/licensing';

interface DashboardStatsProps {
  metrics: DashboardMetrics;
  deviceReport: DeviceDiagnosticReport | null;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ metrics, deviceReport }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {/* Metric 1: Total */}
      <div className="bg-[#111827] border border-[#273549] rounded-xl p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-medium">Total Audited</span>
          <KeyRound className="w-4 h-4 text-blue-400" />
        </div>
        <div className="text-2xl font-bold text-white tracking-tight">{metrics.totalKeys}</div>
        <span className="text-[11px] text-slate-500 mt-1">Processed entries</span>
      </div>

      {/* Metric 2: Valid Format */}
      <div className="bg-[#111827] border border-[#273549] rounded-xl p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-medium">Format Valid</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="text-2xl font-bold text-emerald-400 tracking-tight">{metrics.formatValid}</div>
        <span className="text-[11px] text-slate-500 mt-1">Pass Base-24 rules</span>
      </div>

      {/* Metric 3: Known GVLKs */}
      <div className="bg-[#111827] border border-[#273549] rounded-xl p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-medium">KMS / GVLKs</span>
          <Cpu className="w-4 h-4 text-sky-400" />
        </div>
        <div className="text-2xl font-bold text-sky-400 tracking-tight">{metrics.knownGvlks}</div>
        <span className="text-[11px] text-slate-500 mt-1">Microsoft KMS setup keys</span>
      </div>

      {/* Metric 4: Format Invalid */}
      <div className="bg-[#111827] border border-[#273549] rounded-xl p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-medium">Format Invalid</span>
          <AlertOctagon className="w-4 h-4 text-rose-400" />
        </div>
        <div className="text-2xl font-bold text-rose-400 tracking-tight">{metrics.formatInvalid}</div>
        <span className="text-[11px] text-slate-500 mt-1">Illegal chars or length</span>
      </div>

      {/* Metric 5: Unknown Verification */}
      <div className="bg-[#111827] border border-[#273549] rounded-xl p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-medium">Unverified State</span>
          <HelpCircle className="w-4 h-4 text-amber-400" />
        </div>
        <div className="text-2xl font-bold text-amber-400 tracking-tight">{metrics.unknownStatus}</div>
        <span className="text-[11px] text-slate-500 mt-1">Needs official backend</span>
      </div>

      {/* Metric 6: Host Machine */}
      <div className="bg-[#111827] border border-[#273549] rounded-xl p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-medium">Host Machine</span>
          <ShieldAlert className="w-4 h-4 text-purple-400" />
        </div>
        <div className="text-sm font-semibold text-white truncate">
          {deviceReport ? deviceReport.windowsLicense.licenseStatusText : 'Not Scanned'}
        </div>
        <span className="text-[11px] text-slate-500 mt-1 truncate">
          {deviceReport ? `Key: *****-${deviceReport.windowsLicense.partialKey}` : 'Click Host Tab'}
        </span>
      </div>
    </div>
  );
};
