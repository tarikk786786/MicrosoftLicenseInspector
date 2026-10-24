import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { DashboardStats } from './components/DashboardStats';
import { BulkInputPanel } from './components/BulkInputPanel';
import { ResultsTable } from './components/ResultsTable';
import { DeviceDiagnosticsPanel } from './components/DeviceDiagnosticsPanel';
import { ErrorDictionaryModal } from './components/ErrorDictionaryModal';
import { ExportModal } from './components/ExportModal';
import { LegitimateVerificationGuide } from './components/LegitimateVerificationGuide';
import { LicenseKeyRecord, DeviceDiagnosticReport, DashboardMetrics, ParseOptions } from './types/licensing';
import { parseBulkKeys } from './services/keyParserEngine';
import { checkBackendHealth, BackendHealth } from './services/apiService';
import { Layers, Laptop } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'bulk' | 'host'>('bulk');
  const [records, setRecords] = useState<LicenseKeyRecord[]>([]);
  const [deviceReport, setDeviceReport] = useState<DeviceDiagnosticReport | null>(null);
  const [backendHealth, setBackendHealth] = useState<BackendHealth | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Modals state
  const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(false);
  const [selectedErrorCode, setSelectedErrorCode] = useState<string>('');
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState<boolean>(false);

  // Check diagnostic server health on load
  useEffect(() => {
    checkBackendHealth().then((health) => {
      setBackendHealth(health);
    });
  }, []);

  // Compute metrics
  const metrics: DashboardMetrics = useMemo(() => {
    return {
      totalKeys: records.length,
      formatValid: records.filter(r => r.formatResult === 'FORMAT_VALID').length,
      formatInvalid: records.filter(r => r.formatResult === 'FORMAT_INVALID').length,
      knownGvlks: records.filter(r => r.isKnownGVLK).length,
      activatedOnDevice: records.filter(r => r.overallStatus === 'ACTIVATED_ON_THIS_DEVICE').length,
      unknownStatus: records.filter(r => r.overallStatus === 'UNKNOWN' || (r.overallStatus === 'FORMAT_VALID' && !r.isKnownGVLK)).length,
      errorsFound: records.filter(r => !!r.errorCode).length,
    };
  }, [records]);

  // Bulk parse handler
  const handleAnalyzeKeys = (rawText: string, options: ParseOptions) => {
    setIsProcessing(true);
    setTimeout(() => {
      const { records: parsedRecords } = parseBulkKeys(rawText, options);

      // If host was previously scanned, cross-reference partial key
      if (deviceReport && deviceReport.windowsLicense.partialKey) {
        const hostPartial = deviceReport.windowsLicense.partialKey.toUpperCase();
        for (const r of parsedRecords) {
          if (r.rawKey.toUpperCase().endsWith(hostPartial)) {
            r.overallStatus = deviceReport.windowsLicense.licenseStatus === 1 ? 'ACTIVATED_ON_THIS_DEVICE' : 'NOT_ACTIVATED';
            r.localStatus = deviceReport.windowsLicense.licenseStatus === 1 ? 'ACTIVATED_ON_THIS_DEVICE' : 'NOT_ACTIVATED';
            r.verificationMethod = 'Host CIM Diagnostic Cross-Reference';
            r.evidenceSource = `Matched local host installed partial key (*****...${hostPartial}) on ${deviceReport.hostname}`;
            r.recommendedAction = 'Confirmed active on this host machine. In compliance.';
          }
        }
      }

      setRecords(parsedRecords);
      setIsProcessing(false);
    }, 150);
  };

  // Device report update handler
  const handleDeviceReportUpdate = (report: DeviceDiagnosticReport) => {
    setDeviceReport(report);
    // Cross-reference any loaded keys with host partial key
    if (report.windowsLicense.partialKey && report.windowsLicense.partialKey !== 'N/A') {
      const hostPartial = report.windowsLicense.partialKey.toUpperCase();
      setRecords(prev => prev.map(r => {
        if (r.rawKey.toUpperCase().endsWith(hostPartial)) {
          return {
            ...r,
            overallStatus: report.windowsLicense.licenseStatus === 1 ? 'ACTIVATED_ON_THIS_DEVICE' : 'NOT_ACTIVATED',
            localStatus: report.windowsLicense.licenseStatus === 1 ? 'ACTIVATED_ON_THIS_DEVICE' : 'NOT_ACTIVATED',
            verificationMethod: 'Host CIM Diagnostic Cross-Reference',
            evidenceSource: `Matched local host installed partial key (*****...${hostPartial}) on ${report.hostname}`,
            recommendedAction: 'Confirmed active on this host machine. In compliance.',
          };
        }
        return r;
      }));
    }
  };

  const openErrorModalWithCode = (code: string) => {
    setSelectedErrorCode(code);
    setIsErrorModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0A0E17] text-slate-100 flex flex-col">
      {/* Top Navigation & Status Bar */}
      <Header
        backendHealth={backendHealth}
        onOpenErrorModal={() => {
          setSelectedErrorCode('');
          setIsErrorModalOpen(true);
        }}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenGuideModal={() => setIsGuideModalOpen(true)}
        recordsCount={records.length}
      />

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex-1 space-y-6">
        {/* KPI / Dashboard Metrics */}
        <DashboardStats metrics={metrics} deviceReport={deviceReport} />

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#273549] gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('bulk')}
            className={`flex items-center gap-2 pb-3 text-xs font-semibold border-b-2 transition ${
              activeTab === 'bulk'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Bulk Key Inspector & Format Engine (Stage A)</span>
            {records.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-950 text-blue-300 border border-blue-800">
                {records.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('host')}
            className={`flex items-center gap-2 pb-3 text-xs font-semibold border-b-2 transition ${
              activeTab === 'host'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Laptop className="w-4 h-4" />
            <span>Host Device Diagnostics (Stage B)</span>
            {deviceReport && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>
        </div>

        {/* Tab 1: Bulk Input & Results Table */}
        {activeTab === 'bulk' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <BulkInputPanel onAnalyze={handleAnalyzeKeys} isProcessing={isProcessing} />
            <ResultsTable
              records={records}
              onOpenErrorModalWithCode={openErrorModalWithCode}
            />
          </div>
        )}

        {/* Tab 2: Host Diagnostics Panel */}
        {activeTab === 'host' && (
          <div className="animate-in fade-in duration-200">
            <DeviceDiagnosticsPanel
              deviceReport={deviceReport}
              onReportUpdated={handleDeviceReportUpdate}
              isBackendAvailable={!!backendHealth}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#273549] bg-[#0A0E17] py-4 px-6 text-center text-xs text-slate-500">
        <p>
          Microsoft License Inspector — Built strictly for compliance verification and diagnostic telemetry. Keys processed locally in memory.
        </p>
      </footer>

      {/* Modals */}
      <ErrorDictionaryModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        initialCode={selectedErrorCode}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        records={records}
        deviceReport={deviceReport}
      />

      <LegitimateVerificationGuide
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />
    </div>
  );
};

export default App;
