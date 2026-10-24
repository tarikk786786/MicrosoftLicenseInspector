import React, { useState } from 'react';
import { UploadCloud, Play, Sparkles, Trash2, Info } from 'lucide-react';
import { ParseOptions } from '../types/licensing';

interface BulkInputPanelProps {
  onAnalyze: (rawText: string, options: ParseOptions) => void;
  isProcessing: boolean;
}

export const BulkInputPanel: React.FC<BulkInputPanelProps> = ({ onAnalyze, isProcessing }) => {
  const [inputText, setInputText] = useState<string>('');
  const [deduplicate, setDeduplicate] = useState<boolean>(true);
  const [defaultProduct, setDefaultProduct] = useState<string>('auto');

  const lineCount = inputText
    ? inputText.split(/[\r\n]+/).filter(l => l.trim().length > 0).length
    : 0;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setInputText(prev => (prev ? `${prev}\n${content}` : content));
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const loadSampleWindowsGVLK = () => {
    const sample = [
      'W269N-WFGWX-YVC9B-4J6C9-T83GX', // Win 10/11 Pro
      'NPPR9-FWDCX-D2C8J-H872K-2YT43', // Win 10/11 Enterprise
      'NW6C2-QMPVW-D7KKK-3GKT6-VCFB2', // Win 10/11 Education
      'NRG8B-432QR-6WYPH-B9R8P-P9424', // Win 10/11 Pro for Workstations
      'WX4NM-KYWYW-QJJR4-XV3QB-6VM33', // Server 2022 Datacenter
      'VDYBN-27WPP-V4HQT-9VMD4-VMK7H', // Server 2022 Standard
    ].join('\n');
    setInputText(sample);
  };

  const loadSampleOfficeKMS = () => {
    const sample = [
      '2T8TR-NVVBB-VW3P3-TJ9G2-B9GJR', // Office LTSC 2024 Pro Plus
      'SH9ND-F8JHQ-78VBG-H8P2H-7D68H', // Office LTSC 2024 Standard
      'FXYTK-NJJ8C-GB6DW-3DYQT-6F7TH', // Office LTSC 2021 Pro Plus
      'KDX7X-BNVR8-TXXGX-4Q7Y8-78VT3', // Office LTSC 2021 Standard
      'NMMKJ-6RK4F-KMJVX-8D9MJ-6MWKP', // Office 2019 Pro Plus
      'XQNVK-8JYDB-WJ9W3-YJ8YR-WFG99', // Office 2016 Pro Plus
    ].join('\n');
    setInputText(sample);
  };

  const loadMixedSample = () => {
    const sample = [
      'W269N-WFGWX-YVC9B-4J6C9-T83GX', // Valid Win Pro GVLK
      'W269N-WFGWX-YVC9B-4J6C9-T83GX', // Duplicate to test deduplication
      'VK7JG-NPHTM-C97JM-9MPGT-3V66T', // Valid Win Pro Retail Upgrade Key
      'FXYTK-NJJ8C-GB6DW-3DYQT-6F7TH', // Valid Office 2021 Pro Plus GVLK
      'W2690-WFGWO-YVC9B-4J6C9-T83GX', // INVALID: Contains '0' and 'O'
      'BH9T4-4N7CW-PPW7M-VD3W4-28RD3', // Valid Base-24 Synthetic Key
      'SHORT-KEY-1234',                // INVALID: Too short
      'ZZZZZ-AAAAA-EEEEE-IIIII-OOOOO', // INVALID: Excluded vowels and Z
    ].join('\n');
    setInputText(sample);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onAnalyze(inputText, { deduplicate, defaultProduct });
  };

  return (
    <div className="bg-[#111827] border border-[#273549] rounded-xl p-5 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <span>Bulk License Intake & Formatting Engine</span>
            <span className="text-xs font-normal text-slate-400">({lineCount} keys entered)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Paste product keys (one per line, comma or semicolon separated) or upload raw TXT/CSV files.
          </p>
        </div>

        {/* Quick Sample Action Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            type="button"
            onClick={loadSampleWindowsGVLK}
            className="px-2.5 py-1 rounded-lg bg-blue-950/60 hover:bg-blue-900/60 border border-blue-800/60 text-blue-300 font-medium transition"
          >
            + Windows GVLK
          </button>
          <button
            type="button"
            onClick={loadSampleOfficeKMS}
            className="px-2.5 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/60 text-emerald-300 font-medium transition"
          >
            + Office KMS
          </button>
          <button
            type="button"
            onClick={loadMixedSample}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-medium transition flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            Mixed Benchmark Set
          </button>
          {inputText && (
            <button
              type="button"
              onClick={() => setInputText('')}
              className="p-1 rounded-lg hover:bg-rose-950/50 text-slate-400 hover:text-rose-400 transition"
              title="Clear input"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Input Textarea */}
        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Paste 25-character Microsoft Product Keys here (one per line)...\nExample:\nW269N-WFGWX-YVC9B-4J6C9-T83GX\nFXYTK-NJJ8C-GB6DW-3DYQT-6F7TH`}
            rows={5}
            className="w-full bg-[#0A0E17] border border-[#273549] focus:border-blue-500 rounded-lg p-3 text-sm font-mono text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition resize-y"
          />
        </div>

        {/* Options & Action Row */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-1">
          {/* Controls */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
            {/* Deduplicate checkbox */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={deduplicate}
                onChange={(e) => setDeduplicate(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900"
              />
              <span>Deduplicate identical keys</span>
            </label>

            {/* Default Product Selector */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Target Product:</span>
              <select
                value={defaultProduct}
                onChange={(e) => setDefaultProduct(e.target.value)}
                className="bg-[#0A0E17] border border-[#273549] text-slate-200 rounded px-2.5 py-1 text-xs focus:outline-none focus:border-blue-500"
              >
                <option value="auto">Auto-Detect / Unknown</option>
                <option value="Windows 11 / 10">Windows 11 / 10</option>
                <option value="Windows Server">Windows Server</option>
                <option value="Microsoft Office 2024">Microsoft Office 2024</option>
                <option value="Microsoft Office 2021">Microsoft Office 2021</option>
                <option value="Microsoft Office 2019">Microsoft Office 2019</option>
                <option value="Microsoft Office 2016">Microsoft Office 2016</option>
                <option value="Microsoft 365 Apps">Microsoft 365 Apps</option>
              </select>
            </div>

            {/* File Upload Button */}
            <label className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-slate-700 hover:border-slate-600 bg-slate-800/80 hover:bg-slate-700 text-slate-200 cursor-pointer transition">
              <UploadCloud className="w-3.5 h-3.5 text-blue-400" />
              <span>Upload TXT / CSV</span>
              <input
                type="file"
                accept=".txt,.csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Primary Submit Button */}
          <button
            type="submit"
            disabled={!inputText.trim() || isProcessing}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#0078D4] to-[#0284C7] hover:from-[#106EBE] hover:to-[#0369A1] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold shadow-lg shadow-blue-500/20 transition active:scale-[0.99]"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{isProcessing ? 'Analyzing Keys...' : 'Analyze Product Keys'}</span>
          </button>
        </div>

        {/* Transparency / Authority Disclaimer */}
        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-blue-950/20 border border-blue-900/40 text-xs text-blue-200/90 leading-relaxed">
          <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
          <p>
            <strong>Authoritative Evidence Policy:</strong> Microsoft does not publish an arbitrary product key activation verification API. Passing Base-24 format checks confirms structural validity, but does not guarantee genuine entitlement, non-revocation, or unused status. Keys are verified safely on your local device or via official Microsoft volume licensing infrastructure.
          </p>
        </div>
      </form>
    </div>
  );
};
