/**
 * Base-24 / Base-25 Product Key Engine & Structural Validator
 *
 * Modern Microsoft product keys (Windows 10/11, Windows Server, Office) use an
 * alphabet designed to prevent transcription errors and ambiguity:
 * - Allowed Digits: 2, 3, 4, 6, 7, 8, 9 (Excludes: 0, 1, 5)
 * - Allowed Letters: B, C, D, F, G, H, J, K, M, N, P, Q, R, T, V, W, X, Y
 *   (Excludes vowels A, E, I, O, U to avoid accidental offensive words,
 *    plus L, S, Z to prevent digit confusion with 1, 5, 2)
 */

export const BASE24_ALLOWED_CHARS = '2346789BCDFGHJKMNPQRTVWXY';
export const BASE24_FORBIDDEN_CHARS = {
  '0': 'Confused with letter O (not allowed)',
  '1': 'Confused with letter I or L (not allowed)',
  '5': 'Confused with letter S (not allowed)',
  'A': 'Vowel excluded to prevent offensive words',
  'E': 'Vowel excluded to prevent offensive words',
  'I': 'Vowel and confused with digit 1',
  'L': 'Confused with digit 1',
  'O': 'Vowel and confused with digit 0',
  'S': 'Confused with digit 5',
  'U': 'Vowel and confused with letter V',
  'Z': 'Confused with digit 2',
};

export interface FormatCheckDetail {
  isValid: boolean;
  normalizedKey: string;
  maskedKey: string;
  errorMessage?: string;
  forbiddenCharsFound: string[];
  cleanCharactersOnly: string;
}

/**
 * Normalizes user input: strips whitespace, converts to uppercase,
 * and standardizes 5x5 hyphen separation if provided without hyphens.
 */
export function normalizeProductKey(input: string): string {
  if (!input) return '';
  const cleaned = input.trim().toUpperCase().replace(/[\s\r\n\t_]/g, '');
  
  // If user passed 25 continuous characters without hyphens, chunk into 5x5
  if (/^[A-Z0-9]{25}$/.test(cleaned)) {
    return (cleaned.match(/.{1,5}/g) || []).join('-');
  }
  return cleaned;
}

/**
 * Validates a single product key string according to Microsoft Base-24/25 rules.
 */
export function validateProductKeyFormat(rawInput: string): FormatCheckDetail {
  const normalized = normalizeProductKey(rawInput);
  const cleanChars = normalized.replace(/-/g, '');
  const forbiddenFound: string[] = [];

  // Check empty
  if (!normalized) {
    return {
      isValid: false,
      normalizedKey: '',
      maskedKey: '*****',
      errorMessage: 'Empty or blank key entry',
      forbiddenCharsFound: [],
      cleanCharactersOnly: '',
    };
  }

  // Check character legality
  for (const char of cleanChars) {
    if (!BASE24_ALLOWED_CHARS.includes(char)) {
      if (!forbiddenFound.includes(char)) {
        forbiddenFound.push(char);
      }
    }
  }

  // Check group structure
  const parts = normalized.split('-');
  if (parts.length !== 5 || parts.some(p => p.length !== 5)) {
    const errorMsg = cleanChars.length !== 25
      ? `Invalid length: Expected 25 characters, found ${cleanChars.length}.`
      : 'Invalid grouping: Must consist of exactly 5 groups of 5 characters separated by hyphens.';
    
    return {
      isValid: false,
      normalizedKey: normalized,
      maskedKey: maskProductKey(normalized),
      errorMessage: errorMsg + (forbiddenFound.length > 0 ? ` Contains invalid characters: [${forbiddenFound.join(', ')}].` : ''),
      forbiddenCharsFound: forbiddenFound,
      cleanCharactersOnly: cleanChars,
    };
  }

  if (forbiddenFound.length > 0) {
    const reasons = forbiddenFound.map(c => {
      const reason = BASE24_FORBIDDEN_CHARS[c as keyof typeof BASE24_FORBIDDEN_CHARS];
      return `'${c}' (${reason || 'non-Base-24'})`;
    }).join('; ');

    return {
      isValid: false,
      normalizedKey: normalized,
      maskedKey: maskProductKey(normalized),
      errorMessage: `Violates Base-24 character set. Invalid characters found: ${reasons}.`,
      forbiddenCharsFound: forbiddenFound,
      cleanCharactersOnly: cleanChars,
    };
  }

  return {
    isValid: true,
    normalizedKey: normalized,
    maskedKey: maskProductKey(normalized),
    forbiddenCharsFound: [],
    cleanCharactersOnly: cleanChars,
  };
}

/**
 * Safely masks a product key so sensitive secrets are never displayed in full.
 * Output format: "XXXXX-*****-*****-*****-XXXXX"
 */
export function maskProductKey(key: string): string {
  if (!key) return '*****';
  const norm = normalizeProductKey(key);
  const parts = norm.split('-');
  if (parts.length === 5) {
    return `${parts[0]}-*****-*****-*****-${parts[4]}`;
  }
  if (norm.length >= 10) {
    return `${norm.slice(0, 5)}...${norm.slice(-5)}`;
  }
  return '*****';
}

/**
 * Simple synchronous hash implementation for key deduplication and indexing
 * without storing plaintext secrets.
 */
export function simpleKeyHash(key: string): string {
  const norm = normalizeProductKey(key);
  let hash = 0;
  for (let i = 0; i < norm.length; i++) {
    const char = norm.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  const hex = (hash >>> 0).toString(16).padStart(8, '0');
  return `hash_${hex}_${norm.slice(0, 5)}`;
}
