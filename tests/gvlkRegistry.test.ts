import { describe, it, expect } from 'vitest';
import { lookupGVLK, GVLK_DATABASE } from '../src/services/gvlkRegistry';

describe('GVLK & KMS Client Registry Engine', () => {
  it('contains over 25 official Microsoft GVLK entries', () => {
    expect(GVLK_DATABASE.length).toBeGreaterThan(25);
  });

  it('correctly identifies Windows 10/11 Pro GVLK', () => {
    const key = 'W269N-WFGWX-YVC9B-4J6C9-T83GX';
    const match = lookupGVLK(key);
    expect(match).toBeDefined();
    expect(match?.product).toBe('Windows 10/11');
    expect(match?.edition).toBe('Pro');
    expect(match?.channel).toBe('Volume (GVLK/KMS)');
  });

  it('correctly identifies Windows Server 2022 Datacenter GVLK', () => {
    const key = 'WX4NM-KYWYW-QJJR4-XV3QB-6VM33';
    const match = lookupGVLK(key);
    expect(match).toBeDefined();
    expect(match?.product).toBe('Windows Server 2022');
    expect(match?.edition).toBe('Datacenter');
  });

  it('correctly identifies Microsoft Office LTSC 2021 Professional Plus GVLK', () => {
    const key = 'FXYTK-NJJ8C-GB6DW-3DYQT-6F7TH';
    const match = lookupGVLK(key);
    expect(match).toBeDefined();
    expect(match?.product).toBe('Microsoft Office LTSC 2021');
    expect(match?.edition).toBe('Professional Plus');
  });

  it('returns undefined for non-GVLK retail or arbitrary keys', () => {
    const arbitraryKey = 'BH9T4-4N7CW-PPW7M-VD3W4-28RD3';
    const match = lookupGVLK(arbitraryKey);
    expect(match).toBeUndefined();
  });
});
