import { LicenseKeyRecord, ParseOptions, LicenseChannel } from '../types/licensing';
import { validateProductKeyFormat, simpleKeyHash } from './base24Validator';
import { lookupGVLK } from './gvlkRegistry';

/**
 * Parses raw text input (from textarea, TXT file, or CSV upload),
 * normalizes entries, deduplicates if requested, and runs format & GVLK checks.
 */
export function parseBulkKeys(
  rawInput: string,
  options: ParseOptions = { deduplicate: true, defaultProduct: 'auto' }
): { records: LicenseKeyRecord[]; duplicateCount: number } {
  if (!rawInput || typeof rawInput !== 'string') {
    return { records: [], duplicateCount: 0 };
  }

  // Split lines by newlines, commas, or semicolons
  const rawLines = rawInput
    .split(/[\r\n,;]+/)
    .map(line => line.trim())
    .filter(line => line.length > 0);

  const seenHashes = new Set<string>();
  const records: LicenseKeyRecord[] = [];
  let duplicateCount = 0;
  let rowCounter = 1;

  for (const line of rawLines) {
    // If CSV row with multiple columns, extract key-like column or first token
    let candidateKey = line;
    if (line.includes('\t') || line.includes('"')) {
      const parts = line.split(/[\t,"]+/).filter(Boolean);
      const keyLike = parts.find(p => p.trim().length >= 20);
      if (keyLike) candidateKey = keyLike.trim();
    }

    const formatDetail = validateProductKeyFormat(candidateKey);
    const hash = simpleKeyHash(formatDetail.normalizedKey || candidateKey);

    if (options.deduplicate && seenHashes.has(hash)) {
      duplicateCount++;
      continue;
    }
    seenHashes.add(hash);

    // Stage A: Check against GVLK database
    const gvlkMatch = lookupGVLK(formatDetail.normalizedKey);

    let detectedProduct = options.defaultProduct !== 'auto' ? options.defaultProduct : 'Unknown Microsoft Product';
    let edition = 'Standard / Unspecified';
    let channel: LicenseChannel = 'Unknown';
    let isKnownGVLK = false;
    let gvlkDescription: string | undefined = undefined;
    let evidenceSource = 'Local Base-24 Structural Engine';
    let recommendedAction = 'Key passes structure checks. Requires activation service or host deployment to test validity.';

    if (gvlkMatch) {
      isKnownGVLK = true;
      detectedProduct = gvlkMatch.product;
      edition = gvlkMatch.edition;
      channel = gvlkMatch.channel;
      gvlkDescription = `${gvlkMatch.product} ${gvlkMatch.edition} (${gvlkMatch.officialSource})`;
      evidenceSource = `Microsoft Learn Official KMS Setup Key Database (${gvlkMatch.family})`;
      recommendedAction = 'Official GVLK / KMS Setup Key. Deploy in conjunction with Active Directory-based Activation (ADBA) or an organizational KMS Host.';
    } else if (formatDetail.isValid) {
      // Heuristic detection based on default product selector or format
      if (options.defaultProduct !== 'auto') {
        detectedProduct = options.defaultProduct;
      } else {
        detectedProduct = 'Windows or Office 5x5 Product Key';
      }
      channel = 'Unknown';
      recommendedAction = 'Valid 5x5 Base-24 format. Note: Valid structure does NOT verify activation or authenticity. Verify via official VLSC, M365 Admin Center, or host installation.';
    } else {
      evidenceSource = 'Base-24 Rule Engine';
      recommendedAction = formatDetail.errorMessage || 'Invalid key structure or illegal characters.';
    }

    const record: LicenseKeyRecord = {
      id: `key_${rowCounter}_${Math.random().toString(36).substring(2, 9)}`,
      rowNumber: rowCounter++,
      rawKey: formatDetail.normalizedKey || candidateKey,
      maskedKey: formatDetail.maskedKey,
      keyHash: hash,
      detectedProduct,
      edition,
      channel,
      formatResult: formatDetail.isValid ? 'FORMAT_VALID' : 'FORMAT_INVALID',
      localStatus: 'NOT_TESTED',
      officialStatus: 'UNKNOWN',
      overallStatus: formatDetail.isValid ? 'FORMAT_VALID' : 'FORMAT_INVALID',
      isKnownGVLK,
      gvlkDescription,
      verificationMethod: isKnownGVLK ? 'GVLK Signature Match' : 'Base-24 Structural Analysis',
      evidenceSource,
      recommendedAction,
      timestamp: new Date().toISOString(),
    };

    records.push(record);
  }

  return { records, duplicateCount };
}
