import React, { useState } from 'react';
import { 
  ShieldCheck, 
  RefreshCw, 
  UploadCloud, 
  Terminal, 
  Laptop, 
  CheckCircle2, 
  AlertTriangle, 
  FileCode,
  HardDrive
} from 'lucide-react';
import { DeviceDiagnosticReport } from '../types/licensing';
import { fetchHostDiagnostics, uploadOfflineReport } from '../services/apiService';

interface DeviceDiagnosticsPanelProps {
  deviceReport: DeviceDiagnosticReport | null;
  onReportUpdated: (report: DeviceDiagnosticReport) => void;
  isBackendAvailable: boolean;
}

export const DeviceDiagnosticsPanel: React.FC<DeviceDiagnosticsPanelProps> = ({
  deviceReport,
  onReportUpdated,
  isBackendAvailable,
}) => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const runLiveScan = async () => {
    setIsRunning(true);
    setErrorMessage(null);
    try {
      const data = await fetchHostDiagnostics();
      onReportUpdated(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Diagnostic execution failed';
      setErrorMessage(msg);
    } finally {
      setIsRunning(false);
    }
  };

  const handleJsonUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (isBackendAvailable) {
          const verified = await uploadOfflineReport(parsed);
          onReportUpdated(verified);
        } else {
          onReportUpdated(parsed);
        }
        setErrorMessage(null);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Invalid JSON file';
        setErrorMessage(`Failed to import diagnostic JSON: ${msg}`);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Audit Controls */}
      <div className="bg-[#111827] border border-[#273549] rounded-xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Laptop className="w-5 h-5 text-blue-400" />
              <span>Host Machine Licensing Diagnostics (Stage B)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Directly query the host operating system and Microsoft Office installation using official, read-only system tools.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Import Offline Audit JSON */}
            <label className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-700 hover:border-slate-600 bg-slate-800 text-slate-200 text-xs font-medium cursor-pointer transition">
              <UploadCloud className="w-4 h-4 text-sky-400" />
              <span>Import Offline JSON</span>
              <input type="file" accept=".json" onChange={handleJsonUpload} className="hidden" />
            </label>

            {/* Run Live Diagnostic Button */}
            <button
              type="button"
              onClick={runLiveScan}
              disabled={isRunning || !isBackendAvailable}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0078D4] hover:bg-[#106EBE] disabled:opacity-40 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
              <span>{isRunning ? 'Querying CIM & WMI...' : 'Run Live Host Diagnostic Scan'}</span>
            </button>
          </div>
        </div>

        {/* Read-Only Safety Disclosure */}
        <div className="mt-4 p-3 rounded-lg bg-emerald-950/20 border border-emerald-900/40 text-xs text-emerald-200/90 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-emerald-300">Strictly Read-Only & Safe:</p>
            <p className="text-[11px] text-emerald-300/80 leading-relaxed">
              Diagnostic probes execute only observational queries: <code className="bg-emerald-950 px-1 py-0.5 rounded text-emerald-200">Get-CimInstance SoftwareLicensingProduct</code> and <code className="bg-emerald-950 px-1 py-0.5 rounded text-emerald-200">ospp.vbs /dstatus</code>. No product keys are altered, and only the partial key (last 5 characters) exposed by Windows is captured.
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="mt-3 p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Diagnostic Results Cards */}
      {deviceReport ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Windows OS License Card */}
          <div className="bg-[#111827] border border-[#273549] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <HardDrive className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Windows Operating System</h3>
                  <p className="text-[11px] text-slate-400">{deviceReport.hostname} • {deviceReport.osArchitecture}</p>
                </div>
              </div>

              {/* Status Badge */}
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                deviceReport.windowsLicense.licenseStatus === 1
                  ? 'bg-emerald-950 border border-emerald-600 text-emerald-300'
                  : 'bg-amber-950 border border-amber-600 text-amber-300'
              }`}>
                {deviceReport.windowsLicense.licenseStatus === 1 ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                )}
                <span>{deviceReport.windowsLicense.licenseStatusText}</span>
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Installed OS:</span>
                <span className="font-medium text-slate-200">{deviceReport.osName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Build Version:</span>
                <span className="font-mono text-slate-300">{deviceReport.osVersion}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">License Product:</span>
                <span className="font-medium text-slate-200">{deviceReport.windowsLicense.productName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Installed Partial Key:</span>
                <span className="font-mono text-sky-400 font-semibold bg-[#0A0E17] px-2 py-0.5 rounded border border-[#273549]">
                  *****-{deviceReport.windowsLicense.partialKey}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Licensing Channel:</span>
                <span className="font-medium text-slate-200">{deviceReport.windowsLicense.channel}</span>
              </div>
              {deviceReport.windowsLicense.kmsMachine && (
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">KMS Server:</span>
                  <span className="font-mono text-slate-300">{deviceReport.windowsLicense.kmsMachine}</span>
                </div>
              )}
              {deviceReport.windowsLicense.expirationDate && (
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Grace Expiration:</span>
                  <span className="text-amber-400 font-medium">{deviceReport.windowsLicense.expirationDate}</span>
                </div>
              )}
            </div>

            <div className="text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded border border-slate-800">
              <span className="font-medium text-slate-300">Audit Evidence:</span> {deviceReport.windowsLicense.evidence}
            </div>
          </div>

          {/* Microsoft Office License Card */}
          <div className="bg-[#111827] border border-[#273549] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <FileCode className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Microsoft Office / Microsoft 365</h3>
                  <p className="text-[11px] text-slate-400">Productivity Suite Diagnostics</p>
                </div>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                deviceReport.officeLicense?.isInstalled
                  ? 'bg-emerald-950 border border-emerald-600 text-emerald-300'
                  : 'bg-slate-800 border border-slate-700 text-slate-400'
              }`}>
                {deviceReport.officeLicense?.isInstalled ? 'Installed & Detected' : 'Not Detected'}
              </span>
            </div>

            {deviceReport.officeLicense?.detectedVersions && deviceReport.officeLicense.detectedVersions.length > 0 ? (
              <div className="space-y-3">
                {deviceReport.officeLicense.detectedVersions.map((off, idx) => (
                  <div key={idx} className="bg-[#0A0E17] border border-[#273549] rounded-lg p-3 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">{off.productName}</span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-950/60 border border-emerald-700/60 text-emerald-400">
                        {off.licenseStatus}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-slate-400 pt-1 border-t border-slate-800">
                      <div>
                        <span>Channel: </span>
                        <strong className="text-slate-200">{off.channel}</strong>
                      </div>
                      <div>
                        <span>Partial Key: </span>
                        <strong className="font-mono text-sky-400">{off.partialKey}</strong>
                      </div>
                      {off.gracePeriodDays !== undefined && off.gracePeriodDays > 0 && (
                        <div className="col-span-2">
                          <span>Remaining Grace Period: </span>
                          <strong className="text-amber-400">{off.gracePeriodDays} days</strong>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-slate-400 text-xs">
                <p>No active standalone Office volume license blocks found via ospp.vbs.</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  (Note: Cloud-connected Microsoft 365 Personal/Family accounts activate via Azure AD token rather than local product key).
                </p>
              </div>
            )}

            <div className="text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded border border-slate-800">
              <span className="font-medium text-slate-300">Tool Employed:</span>{' '}
              {deviceReport.officeLicense?.toolUsed || 'None'}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#111827] border border-[#273549] rounded-xl p-12 text-center text-slate-400">
          <Terminal className="w-12 h-12 text-blue-500/40 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-200">No Host License Diagnostic Executed Yet</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 leading-relaxed">
            Click <strong>"Run Live Host Diagnostic Scan"</strong> above to inspect this machine's installed Windows and Office license states in real-time.
          </p>
        </div>
      )}

      {/* Offline Agent & Air-Gapped Machine Support */}
      <div className="bg-[#111827] border border-[#273549] rounded-xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-purple-400" />
              <span>Offline & Air-Gapped Computer Audits</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Need to audit remote machines, air-gapped servers, or client PCs without internet access?
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <code className="bg-[#0A0E17] border border-[#273549] px-2.5 py-1.5 rounded font-mono text-slate-300">
              Invoke-LicenseDiagnostic.ps1
            </code>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-[#0A0E17] border border-[#273549] rounded-lg p-3">
            <span className="font-bold text-sky-400">1. Run Script</span>
            <p className="text-slate-400 mt-1 text-[11px]">
              Execute <code className="text-slate-300 font-mono">Invoke-LicenseDiagnostic.ps1</code> in PowerShell on any target PC.
            </p>
          </div>
          <div className="bg-[#0A0E17] border border-[#273549] rounded-lg p-3">
            <span className="font-bold text-sky-400">2. Generate Safe JSON</span>
            <p className="text-slate-400 mt-1 text-[11px]">
              Generates a standardized, encrypted JSON audit report with masked keys.
            </p>
          </div>
          <div className="bg-[#0A0E17] border border-[#273549] rounded-lg p-3">
            <span className="font-bold text-sky-400">3. Import to Dashboard</span>
            <p className="text-slate-400 mt-1 text-[11px]">
              Use the "Import Offline JSON" button above to inspect results inside this dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
