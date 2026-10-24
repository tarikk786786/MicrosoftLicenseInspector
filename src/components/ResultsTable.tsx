import React, { useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronRight, 
  Search, 
  Filter, 
  Cpu, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert,
  Info
} from 'lucide-react';
import { LicenseKeyRecord, ResultStatus } from '../types/licensing';

interface ResultsTableProps {
  records: LicenseKeyRecord[];
  onOpenErrorModalWithCode?: (code: string) => void;
}

export const ResultsTable: React.FC<ResultsTableProps> = ({ records, onOpenErrorModalWithCode }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [productFilter, setProductFilter] = useState<string>('ALL');
  const [revealedKeys, setRevealedKeys] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  // Temporary reveal with 10s auto-remask
  const toggleKeyReveal = (id: string) => {
    setRevealedKeys(prev => {
      const isCurrentlyRevealed = !!prev[id];
      const next = { ...prev, [id]: !isCurrentlyRevealed };
      
      if (!isCurrentlyRevealed) {
        setTimeout(() => {
          setRevealedKeys(curr => ({ ...curr, [id]: false }));
        }, 10000);
      }
      return next;
    });
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Distinct products for filter
  const distinctProducts = Array.from(new Set(records.map(r => r.detectedProduct))).filter(Boolean);

  // Filtered records
  const filteredRecords = records.filter(r => {
    const matchesSearch = 
      r.maskedKey.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.detectedProduct.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.edition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.rawKey && r.rawKey.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || r.overallStatus === statusFilter;
    const matchesProduct = productFilter === 'ALL' || r.detectedProduct === productFilter;

    return matchesSearch && matchesStatus && matchesProduct;
  });

  const getStatusBadge = (status: ResultStatus) => {
    switch (status) {
      case 'ACTIVATED_ON_THIS_DEVICE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-950/80 border border-emerald-600/60 text-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Activated on Host
          </span>
        );
      case 'FORMAT_VALID':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-950/40 border border-emerald-800/60 text-emerald-400">
            <Check className="w-3 h-3" />
            Format Valid
          </span>
        );
      case 'FORMAT_INVALID':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-950/80 border border-rose-600/60 text-rose-300">
            <AlertTriangle className="w-3 h-3 text-rose-400" />
            Format Invalid
          </span>
        );
      case 'NOT_ACTIVATED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-950/80 border border-amber-600/60 text-amber-300">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            Not Activated
          </span>
        );
      case 'ENTITLEMENT_CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-950/80 border border-blue-600/60 text-blue-300">
            <ShieldAlert className="w-3 h-3 text-blue-400" />
            Entitlement Confirmed
          </span>
        );
      case 'ACTIVATION_ERROR':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-950/80 border border-red-600/60 text-red-300">
            <AlertTriangle className="w-3 h-3 text-red-400" />
            Activation Error
          </span>
        );
      case 'EXPIRED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-950/60 border border-amber-500/60 text-amber-400">
            Expired
          </span>
        );
      case 'BLOCKED_OR_REVOKED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-950/80 border border-purple-600/60 text-purple-300">
            Blocked / Revoked
          </span>
        );
      case 'ALREADY_IN_USE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-950/80 border border-violet-600/60 text-violet-300">
            Already In Use
          </span>
        );
      case 'UNKNOWN':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 border border-slate-700 text-slate-400">
            <HelpCircle className="w-3 h-3" />
            Unknown
          </span>
        );
    }
  };

  return (
    <div className="bg-[#111827] border border-[#273549] rounded-xl overflow-hidden shadow-xl">
      {/* Header & Filter Controls */}
      <div className="p-4 border-b border-[#273549] bg-[#0F172A]/90 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white">Diagnostic Results Table</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            {filteredRecords.length} of {records.length} items
          </span>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search keys, products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0A0E17] border border-[#273549] focus:border-blue-500 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#0A0E17] border border-[#273549] text-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="FORMAT_VALID">FORMAT_VALID</option>
              <option value="FORMAT_INVALID">FORMAT_INVALID</option>
              <option value="ACTIVATED_ON_THIS_DEVICE">ACTIVATED_ON_THIS_DEVICE</option>
              <option value="NOT_ACTIVATED">NOT_ACTIVATED</option>
              <option value="ENTITLEMENT_CONFIRMED">ENTITLEMENT_CONFIRMED</option>
              <option value="ACTIVATION_ERROR">ACTIVATION_ERROR</option>
              <option value="EXPIRED">EXPIRED</option>
              <option value="BLOCKED_OR_REVOKED">BLOCKED_OR_REVOKED</option>
              <option value="ALREADY_IN_USE">ALREADY_IN_USE</option>
              <option value="UNKNOWN">UNKNOWN</option>
            </select>
          </div>

          {/* Product Filter */}
          {distinctProducts.length > 0 && (
            <select
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              className="bg-[#0A0E17] border border-[#273549] text-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-500 max-w-[160px] truncate"
            >
              <option value="ALL">All Products</option>
              {distinctProducts.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Table Content */}
      {filteredRecords.length === 0 ? (
        <div className="py-16 text-center text-slate-400">
          <HelpCircle className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-300">No matching product key records</p>
          <p className="text-xs text-slate-500 mt-1">
            {records.length === 0 ? 'Enter or paste product keys above to run diagnostic analysis.' : 'Try clearing search filters.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#273549] bg-[#0A0E17]/60 text-slate-400 font-medium">
                <th className="py-3 px-3 w-10 text-center">#</th>
                <th className="py-3 px-4">Masked Product Key</th>
                <th className="py-3 px-4">Detected Product</th>
                <th className="py-3 px-4">Edition / Channel</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Evidence Source</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F2937]/70">
              {filteredRecords.map((item) => {
                const isRevealed = !!revealedKeys[item.id];
                const displayKey = isRevealed ? item.rawKey : item.maskedKey;
                const isExpanded = expandedRowId === item.id;

                return (
                  <React.Fragment key={item.id}>
                    <tr className={`hover:bg-[#1E293B]/40 transition ${isExpanded ? 'bg-[#1E293B]/30' : ''}`}>
                      {/* Row sequence */}
                      <td className="py-3 px-3 text-center text-slate-500 font-mono">
                        {item.rowNumber}
                      </td>

                      {/* Product Key Column */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <code className="font-mono text-[13px] font-medium tracking-wide text-slate-100 bg-[#0A0E17] px-2 py-0.5 rounded border border-[#273549]">
                            {displayKey}
                          </code>
                          
                          {/* Reveal toggle */}
                          <button
                            type="button"
                            onClick={() => toggleKeyReveal(item.id)}
                            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
                            title={isRevealed ? 'Hide full key' : 'Temporarily reveal key (10s auto-remask)'}
                          >
                            {isRevealed ? <EyeOff className="w-3.5 h-3.5 text-amber-400" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>

                          {/* Copy button */}
                          <button
                            type="button"
                            onClick={() => copyToClipboard(item.id, displayKey)}
                            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
                            title="Copy key string"
                          >
                            {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>

                      {/* Detected Product */}
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-200 flex items-center gap-1.5">
                          {item.isKnownGVLK && <Cpu className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />}
                          <span>{item.detectedProduct}</span>
                        </div>
                      </td>

                      {/* Edition / Channel */}
                      <td className="py-3 px-4">
                        <div className="text-slate-300 font-medium">{item.edition}</div>
                        <div className="text-[11px] text-slate-500">{item.channel}</div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        {getStatusBadge(item.overallStatus)}
                      </td>

                      {/* Evidence Source */}
                      <td className="py-3 px-4 text-slate-400 max-w-[200px] truncate" title={item.evidenceSource}>
                        {item.evidenceSource}
                      </td>

                      {/* Expand Button */}
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setExpandedRowId(isExpanded ? null : item.id)}
                          className="px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition inline-flex items-center gap-1"
                        >
                          <span>{isExpanded ? 'Hide' : 'Trace'}</span>
                          {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                        </button>
                      </td>
                    </tr>

                    {/* Expandable Diagnostic Row Detail */}
                    {isExpanded && (
                      <tr className="bg-[#0A0E17]/80 border-b border-[#273549]">
                        <td colSpan={7} className="p-4">
                          <div className="rounded-lg border border-[#273549] bg-[#111827] p-4 space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
                              <span className="font-semibold text-slate-200 flex items-center gap-2">
                                <Info className="w-4 h-4 text-blue-400" />
                                Comprehensive Diagnostic Evidence Breakdown
                              </span>
                              <span className="text-[11px] font-mono text-slate-400">
                                Deduplication Index: {item.keyHash}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                              <div>
                                <span className="text-slate-400 font-medium">Verification Method:</span>
                                <p className="text-slate-200 mt-0.5">{item.verificationMethod}</p>
                              </div>
                              <div>
                                <span className="text-slate-400 font-medium">Evidence Source:</span>
                                <p className="text-slate-200 mt-0.5">{item.evidenceSource}</p>
                              </div>
                            </div>

                            <div className="text-xs">
                              <span className="text-slate-400 font-medium">Prescriptive Next Step / IT Remediation:</span>
                              <p className="text-sky-300 mt-0.5 bg-sky-950/30 p-2.5 rounded border border-sky-900/40 leading-relaxed">
                                {item.recommendedAction}
                              </p>
                            </div>

                            {item.errorCode && (
                              <div className="text-xs flex items-center gap-2">
                                <span className="text-rose-400 font-medium">Reported Error Code:</span>
                                <button
                                  type="button"
                                  onClick={() => onOpenErrorModalWithCode?.(item.errorCode!)}
                                  className="font-mono text-rose-300 underline hover:text-rose-200"
                                >
                                  {item.errorCode}
                                </button>
                              </div>
                            )}

                            {item.isKnownGVLK && (
                              <div className="text-[11px] text-slate-400 bg-slate-900/80 p-2 rounded border border-slate-800">
                                <strong>Official GVLK Notice:</strong> This key is a public Generic Volume License Key published by Microsoft. It is designed for Volume Licensing clients connecting to a Key Management Service (KMS) or Active Directory Activation. It cannot be activated directly through Microsoft retail activation servers.
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
