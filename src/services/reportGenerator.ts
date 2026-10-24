import { LicenseKeyRecord, DeviceDiagnosticReport } from '../types/licensing';

/**
 * Generates an RFC-4180 compliant CSV export with mandatory key masking.
 */
export function exportToCSV(records: LicenseKeyRecord[]): string {
  const headers = [
    'Row',
    'Masked Product Key',
    'Detected Product',
    'Edition',
    'Channel',
    'Format Result',
    'Overall Status',
    'Known GVLK',
    'Verification Method',
    'Evidence Source',
    'Recommended Action',
    'Audit Timestamp'
  ];

  const escapeField = (val: string | number | boolean | undefined): string => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    // Prevent Excel formula injection if text starts with =, +, -, @
    const safeStr = /^[=\+\-@]/.test(str) ? `'${str}` : str;
    return `"${safeStr}"`;
  };

  const rows = records.map(r => [
    escapeField(r.rowNumber),
    escapeField(r.maskedKey),
    escapeField(r.detectedProduct),
    escapeField(r.edition),
    escapeField(r.channel),
    escapeField(r.formatResult),
    escapeField(r.overallStatus),
    escapeField(r.isKnownGVLK ? 'YES' : 'NO'),
    escapeField(r.verificationMethod),
    escapeField(r.evidenceSource),
    escapeField(r.recommendedAction),
    escapeField(r.timestamp),
  ].join(','));

  return [headers.map(h => `"${h}"`).join(','), ...rows].join('\r\n');
}

/**
 * Generates a clean JSON diagnostic export.
 */
export function exportToJSON(records: LicenseKeyRecord[], deviceReport?: DeviceDiagnosticReport | null): string {
  const payload = {
    metadata: {
      generator: 'Microsoft License Inspector',
      exportVersion: '1.0.0',
      exportedAt: new Date().toISOString(),
      totalRecords: records.length,
      note: 'All product keys are masked by default to protect proprietary licensing secrets.',
    },
    hostDeviceDiagnostic: deviceReport || null,
    licenseAuditRecords: records.map(r => ({
      rowNumber: r.rowNumber,
      maskedKey: r.maskedKey,
      keyHash: r.keyHash,
      detectedProduct: r.detectedProduct,
      edition: r.edition,
      channel: r.channel,
      formatResult: r.formatResult,
      overallStatus: r.overallStatus,
      isKnownGVLK: r.isKnownGVLK,
      errorCode: r.errorCode || null,
      errorDescription: r.errorDescription || null,
      verificationMethod: r.verificationMethod,
      evidenceSource: r.evidenceSource,
      recommendedAction: r.recommendedAction,
      timestamp: r.timestamp,
    })),
  };

  return JSON.stringify(payload, null, 2);
}

/**
 * Generates an executive Markdown audit report.
 */
export function exportToMarkdown(records: LicenseKeyRecord[], deviceReport?: DeviceDiagnosticReport | null): string {
  const now = new Date().toUTCString();
  const validCount = records.filter(r => r.formatResult === 'FORMAT_VALID').length;
  const invalidCount = records.filter(r => r.formatResult === 'FORMAT_INVALID').length;
  const gvlkCount = records.filter(r => r.isKnownGVLK).length;

  let md = `# Microsoft License Audit & Diagnostic Report\n\n`;
  md += `**Generated**: ${now}\n`;
  md += `**Audit Engine**: Microsoft License Inspector v1.0.0\n`;
  md += `**Privacy Notice**: All product keys in this report are securely masked.\n\n`;

  md += `## 1. Executive Summary\n\n`;
  md += `| Metric | Count |\n|---|---|\n`;
  md += `| Total Keys Audited | ${records.length} |\n`;
  md += `| Format Valid Keys | ${validCount} |\n`;
  md += `| Format Invalid Keys | ${invalidCount} |\n`;
  md += `| Identified Official KMS/GVLK Keys | ${gvlkCount} |\n\n`;

  if (deviceReport) {
    md += `## 2. Host Device Diagnostic Snapshot\n\n`;
    md += `- **Computer Name**: \`${deviceReport.hostname}\`\n`;
    md += `- **Operating System**: ${deviceReport.osName} (${deviceReport.osVersion}, ${deviceReport.osArchitecture})\n`;
    md += `- **Windows License**: ${deviceReport.windowsLicense.productName}\n`;
    md += `- **Status**: **${deviceReport.windowsLicense.licenseStatusText}**\n`;
    md += `- **Partial Key**: \`*****...${deviceReport.windowsLicense.partialKey}\`\n`;
    md += `- **Channel**: ${deviceReport.windowsLicense.channel}\n`;
    md += `- **Diagnostic Source**: ${deviceReport.windowsLicense.evidence}\n\n`;
  }

  md += `## 3. Product Key Inventory\n\n`;
  md += `| # | Masked Key | Detected Product | Edition | Channel | Status | Recommended Action |\n`;
  md += `|---|---|---|---|---|---|---|\n`;

  for (const r of records) {
    md += `| ${r.rowNumber} | \`${r.maskedKey}\` | ${r.detectedProduct} | ${r.edition} | ${r.channel} | **${r.overallStatus}** | ${r.recommendedAction.replace(/\|/g, '-')} |\n`;
  }

  md += `\n---\n*Report compiled securely by Microsoft License Inspector. Format validity does not imply genuine Microsoft activation status.*`;
  return md;
}
