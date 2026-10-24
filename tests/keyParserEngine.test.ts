import { describe, it, expect } from 'vitest';
import { parseBulkKeys } from '../src/services/keyParserEngine';

describe('Bulk Key Parser & Diagnostic Engine', () => {
  it('parses multi-line text input with duplicates removed', () => {
    const input = `
      W269N-WFGWX-YVC9B-4J6C9-T83GX
      W269N-WFGWX-YVC9B-4J6C9-T83GX
      NPPR9-FWDCX-D2C8J-H872K-2YT43
      INVALID-KEY-STRUCTURE
    `;

    const { records, duplicateCount } = parseBulkKeys(input, { deduplicate: true, defaultProduct: 'auto' });
    expect(duplicateCount).toBe(1);
    expect(records.length).toBe(3);

    const proKey = records.find(r => r.edition === 'Pro');
    expect(proKey?.isKnownGVLK).toBe(true);
    expect(proKey?.formatResult).toBe('FORMAT_VALID');
    expect(proKey?.overallStatus).toBe('FORMAT_VALID');

    const invalidRec = records.find(r => r.formatResult === 'FORMAT_INVALID');
    expect(invalidRec).toBeDefined();
    expect(invalidRec?.overallStatus).toBe('FORMAT_INVALID');
  });

  it('preserves duplicates when deduplicate option is false', () => {
    const input = `
      W269N-WFGWX-YVC9B-4J6C9-T83GX
      W269N-WFGWX-YVC9B-4J6C9-T83GX
    `;

    const { records, duplicateCount } = parseBulkKeys(input, { deduplicate: false, defaultProduct: 'auto' });
    expect(duplicateCount).toBe(0);
    expect(records.length).toBe(2);
  });

  it('assigns user-selected default product when specified', () => {
    const key = 'BH9T4-4N7CW-PPW7M-VD3W4-28RD3'; // Synthetic format-valid key
    const { records } = parseBulkKeys(key, { deduplicate: true, defaultProduct: 'Microsoft Office 2021' });
    expect(records[0].detectedProduct).toBe('Microsoft Office 2021');
    expect(records[0].formatResult).toBe('FORMAT_VALID');
  });

  it('never marks uninstalled keys as genuine or activated solely on format', () => {
    const syntheticKey = 'BH9T4-4N7CW-PPW7M-VD3W4-28RD3';
    const { records } = parseBulkKeys(syntheticKey);
    expect(records[0].overallStatus).toBe('FORMAT_VALID');
    expect(records[0].overallStatus).not.toBe('ACTIVATED_ON_THIS_DEVICE');
    expect(records[0].overallStatus).not.toBe('ENTITLEMENT_CONFIRMED');
    expect(records[0].recommendedAction).toContain('does NOT verify activation');
  });
});
