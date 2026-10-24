# Testing Strategy & Test Suites — Microsoft License Inspector

## 1. Testing Philosophy
The integrity of the **Microsoft License Inspector** relies on mathematical exactness and boundary safety:
1. **Never False Positive on Activation**: Tests must assert that format validation functions NEVER return `ACTIVATED_ON_THIS_DEVICE` or `ENTITLEMENT_CONFIRMED`.
2. **Deterministic Base-24 Verification**: Strict boundary tests asserting rejection of non-Base-24 characters (`0`, `1`, `5`, `A`, `E`, `I`, `L`, `N`, `O`, `S`, `U`, `Z`).
3. **GVLK Database Exactness**: Automated assertions testing official Microsoft Learn GVLK keys against their exact corresponding editions (Windows 10/11 Pro, Enterprise, Education, Server 2019/2022/2025, Office 2016/2019/2021/2024).
4. **Key Masking Guarantees**: Assert that log scrubbers, table models, and export transformers never leak unmasked characters.

## 2. Test Suites Overview

### Test Suite 1: `base24Validator.test.ts`
- Tests valid 5x5 keys with correct hyphens: `W269N-WFGWX-YVC9B-4J6C9-T83GX` (returns `FORMAT_VALID`).
- Tests keys without hyphens: automatically normalizes into 5x5 groups.
- Tests keys with forbidden characters (`O`, `I`, `1`, `0`, `Z`, `S`, `A`): returns `FORMAT_INVALID` with explanation.
- Tests keys with invalid segment counts (e.g., 4 groups, 6 groups, 24 characters, 26 characters).
- Tests completely malformed, blank, or random string inputs.

### Test Suite 2: `gvlkRegistry.test.ts`
- Tests lookup of Windows 11 / 10 Pro GVLK (`W269N-WFGWX-YVC9B-4J6C9-T83GX` -> "Windows 10/11 Pro", Channel: "Volume (GVLK/KMS)").
- Tests lookup of Windows 11 Enterprise GVLK (`NPPR9-FWDCX-D2C8J-H872K-2YT43`).
- Tests lookup of Windows Server 2022 Datacenter GVLK (`WX4NM-KYWYW-QJJR4-XV3QB-6VM33`).
- Tests lookup of Office LTSC 2021 Pro Plus GVLK (`FXYTK-NJJ8C-GB6DW-3DYQT-6F7TH`).
- Asserts that matching a GVLK designates `isKnownGVLK = true` and identifies channel as Volume KMS Client.

### Test Suite 3: `errorCodes.test.ts`
- Tests lookup of common activation errors:
  - `0xC004C003`: "The activation server determined the specified product key is blocked."
  - `0xC004C008`: "The activation server reported that the product key has exceeded its unlock limit."
  - `0xC004C020`: "The Multiple Activation Key (MAK) has exceeded its limit."
  - `0x803FA067`: "Hardware change or upgraded edition mismatch."
  - `0x8007007B`: "DNS name does not exist (KMS host not found)."
- Verifies that every error returns actionable remediation instructions for IT admins.

### Test Suite 4: `bulkParser.test.ts`
- Tests parsing mixed input containing multiple valid keys, invalid keys, duplicate keys, CSV lines, and whitespace.
- Tests deduplication logic: ensures identical keys are grouped or flagged.
- Tests safe masking utility: ensures `VK7JG-NPHTM-C97JM-9MPGT-3V66T` becomes `VK7JG-*****-*****-*****-3V66T`.

### Test Suite 5: `reportExporter.test.ts`
- Tests CSV export formatting: verifies CSV columns, header row, and key masking.
- Tests JSON export structure: ensures strict conformity with `LicenseKeyRecord` schema.
- Asserts zero occurrence of raw unmasked keys in exported content.

## 3. Test Execution Commands
```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run test coverage audit
npm run test:coverage
```

## 4. Coverage Target
- Core validation utilities (`base24Validator`, `gvlkRegistry`, `errorCodes`, `reportGenerator`): **> 95% line coverage**.
- 0 failed assertions required for deployment approval.
