import { describe, it, expect } from 'vitest';
import { parseBulkKeys } from '../src/services/keyParserEngine';
import { exportToCSV, exportToJSON, exportToMarkdown } from '../src/services/reportGenerator';

describe('Audit Report Generation & Privacy Masking', () => {
  const sampleInput = `
    W269N-WFGWX-YVC9B-4J6C9-T83GX
    VK7JG-NPHTM-C97JM-9MPGT-3V66T
  `;
  const { records } = parseBulkKeys(sampleInput);

  it('exports CSV with masked keys and zero unmasked keys', () => {
    const csv = exportToCSV(records);
    expect(csv).toContain('W269N-*****-*****-*****-T83GX');
    expect(csv).toContain('VK7JG-*****-*****-*****-3V66T');
    expect(csv).not.toContain('WFGWX');
    expect(csv).not.toContain('NPHTM');
  });

  it('exports valid JSON payload conforming to schema', () => {
    const jsonStr = exportToJSON(records);
    const parsed = JSON.parse(jsonStr);
    expect(parsed.metadata).toBeDefined();
    expect(parsed.licenseAuditRecords.length).toBe(2);
    expect(parsed.licenseAuditRecords[0].maskedKey).toBe('W269N-*****-*****-*****-T83GX');
  });

  it('exports formatted Markdown executive summary', () => {
    const md = exportToMarkdown(records);
    expect(md).toContain('# Microsoft License Audit & Diagnostic Report');
    expect(md).toContain('Total Keys Audited | 2');
    expect(md).toContain('W269N-*****-*****-*****-T83GX');
  });
});
