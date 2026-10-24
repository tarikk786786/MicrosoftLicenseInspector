import { describe, it, expect } from 'vitest';
import {
  validateProductKeyFormat,
  normalizeProductKey,
  maskProductKey,
  simpleKeyHash,
  BASE24_ALLOWED_CHARS
} from '../src/services/base24Validator';

describe('Base-24 Validator & Normalization Engine', () => {
  it('normalizes unhyphenated 25-character keys into 5x5 format', () => {
    const raw = 'w269nwfgwxyvc9b4j6c9t83gx';
    const normalized = normalizeProductKey(raw);
    expect(normalized).toBe('W269N-WFGWX-YVC9B-4J6C9-T83GX');
  });

  it('validates a correct 5x5 Microsoft key', () => {
    const key = 'W269N-WFGWX-YVC9B-4J6C9-T83GX';
    const result = validateProductKeyFormat(key);
    expect(result.isValid).toBe(true);
    expect(result.normalizedKey).toBe(key);
    expect(result.forbiddenCharsFound.length).toBe(0);
  });

  it('rejects keys containing non-Base-24 characters (e.g. 0, 1, 5, O, I, L, S, Z)', () => {
    // Contains '0' and 'O'
    const invalidKey = 'W2690-WFGWO-YVC9B-4J6C9-T83GX';
    const result = validateProductKeyFormat(invalidKey);
    expect(result.isValid).toBe(false);
    expect(result.forbiddenCharsFound).toContain('0');
    expect(result.forbiddenCharsFound).toContain('O');
    expect(result.errorMessage).toContain('Violates Base-24 character set');
  });

  it('rejects keys of improper length', () => {
    const shortKey = 'W269N-WFGWX-YVC9B-4J6C9';
    const result = validateProductKeyFormat(shortKey);
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toContain('Invalid length');
  });

  it('handles empty or whitespace-only inputs gracefully', () => {
    const result = validateProductKeyFormat('   ');
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toContain('Empty or blank');
  });

  it('masks product keys to prevent exposing secrets', () => {
    const key = 'VK7JG-NPHTM-C97JM-9MPGT-3V66T';
    const masked = maskProductKey(key);
    expect(masked).toBe('VK7JG-*****-*****-*****-3V66T');
    expect(masked).not.toContain('NPHTM');
    expect(masked).not.toContain('C97JM');
    expect(masked).not.toContain('9MPGT');
  });

  it('generates deterministic hashes for deduplication', () => {
    const hash1 = simpleKeyHash('W269N-WFGWX-YVC9B-4J6C9-T83GX');
    const hash2 = simpleKeyHash('w269n-wfgwx-yvc9b-4j6c9-t83gx');
    expect(hash1).toBe(hash2);
  });
});
