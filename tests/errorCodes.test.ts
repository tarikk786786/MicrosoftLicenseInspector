import { describe, it, expect } from 'vitest';
import { lookupErrorCode, ACTIVATION_ERROR_DICTIONARY } from '../src/services/errorCodes';

describe('Activation Error Code Dictionary', () => {
  it('correctly maps 0xC004C003 (Key Blocked)', () => {
    const error = lookupErrorCode('0xC004C003');
    expect(error).toBeDefined();
    expect(error?.title).toContain('Blocked');
    expect(error?.recommendedRemediation).toContain('Procure a legitimate');
  });

  it('correctly maps 0xC004C020 (MAK Limit Exceeded)', () => {
    const error = lookupErrorCode('0xC004C020');
    expect(error).toBeDefined();
    expect(error?.title).toContain('Multiple Activation Key');
    expect(error?.technicalCause).toContain('All activation seats');
  });

  it('normalizes error codes with lowercase or missing 0x prefix', () => {
    const errorLower = lookupErrorCode('c004c008');
    expect(errorLower).toBeDefined();
    expect(errorLower?.title).toContain('Exceeded');

    const errorNo0x = lookupErrorCode('803fa067');
    expect(errorNo0x).toBeDefined();
    expect(errorNo0x?.title).toContain('Edition Upgrade');
  });

  it('returns undefined for unknown error codes', () => {
    const error = lookupErrorCode('0x99999999');
    expect(error).toBeUndefined();
  });
});
