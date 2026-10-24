# Data Storage & Schema Design — Microsoft License Inspector

## 1. Storage Architecture & Privacy Mandate
Under the strict security mandates of the **Microsoft License Inspector**, **raw, unmasked product keys must never be persisted to a permanent database or disk storage**. Doing so creates a security hazard and violates licensing compliance standards.

Therefore, the application employs a **Zero-Permanent-Key-Storage Model**:
- **In-Memory Store**: Active session keys and diagnostic results reside exclusively in process memory during execution.
- **Session Cache (Browser)**: Ephemeral `sessionStorage` containing ONLY masked representations and diagnostic metadata. Cleared on browser close.
- **Exported Audit Schemas**: When users export reports (CSV, JSON, Markdown), exported keys are masked by default (`XXXXX-*****-*****-*****-XXXXX`), accompanied by diagnostic timestamps, host identifiers, and cryptographic hash verification (`SHA-256` of key for deduplication indexing without revealing plaintext).

## 2. In-Memory Data Models & Types

### 2.1 Product Key Entry Schema (`LicenseKeyRecord`)
```typescript
interface LicenseKeyRecord {
  id: string; // UUID v4
  rowNumber: number; // Input line sequence
  rawKey: string; // Kept in memory only; scrubbed on export
  maskedKey: string; // e.g. "VK7JG-*****-*****-*****-W66T6"
  keyHash: string; // SHA-256 for duplicate detection
  detectedProduct: string; // e.g. "Windows 10/11", "Office 2021", "Unknown"
  edition: string; // e.g. "Pro", "Enterprise", "Home", "LTSC Professional Plus"
  channel: 'Retail' | 'OEM' | 'Volume (GVLK/KMS)' | 'Volume (MAK)' | 'Subscription' | 'Unknown';
  formatResult: 'FORMAT_VALID' | 'FORMAT_INVALID';
  localStatus: 'ACTIVATED_ON_THIS_DEVICE' | 'NOT_ACTIVATED' | 'NOT_TESTED' | 'EXPIRED' | 'ACTIVATION_ERROR';
  officialStatus: 'ENTITLEMENT_CONFIRMED' | 'BLOCKED_OR_REVOKED' | 'ALREADY_IN_USE' | 'UNKNOWN';
  overallStatus: 
    | 'FORMAT_VALID'
    | 'FORMAT_INVALID'
    | 'ACTIVATED_ON_THIS_DEVICE'
    | 'NOT_ACTIVATED'
    | 'ENTITLEMENT_CONFIRMED'
    | 'ACTIVATION_ERROR'
    | 'EXPIRED'
    | 'BLOCKED_OR_REVOKED'
    | 'ALREADY_IN_USE'
    | 'UNKNOWN';
  errorCode?: string; // e.g. "0xC004C003"
  errorDescription?: string;
  isKnownGVLK: boolean; // True if matched official Microsoft KMS setup key
  verificationMethod: 'Local Regex & Base24' | 'WMI/CIM Local Host' | 'ospp.vbs Script' | 'Offline Audit Import';
  evidenceSource: string; // Description of diagnostic proof
  recommendedAction: string; // Prescriptive next steps for administrator
  timestamp: string; // ISO 8601
}
```

### 2.2 Host System Diagnostic Schema (`DeviceDiagnosticReport`)
```typescript
interface DeviceDiagnosticReport {
  timestamp: string;
  hostname: string;
  osName: string; // e.g. "Microsoft Windows 11 Pro"
  osVersion: string; // e.g. "10.0.26100"
  osArchitecture: string; // "64-bit"
  windowsLicense: {
    productName: string;
    description: string;
    partialKey: string; // Last 5 chars only, e.g. "W66T6"
    licenseStatus: number; // 0=Unlicensed, 1=Licensed, 2=OOBGrace, etc.
    licenseStatusText: string;
    channel: string;
    expirationDate?: string;
    kmsMachine?: string;
    errorCode?: string;
    errorReason?: string;
  };
  officeLicense?: {
    isInstalled: boolean;
    detectedVersions: Array<{
      productName: string;
      licenseStatus: string;
      partialKey: string;
      licenseFamily: string;
      errorCode?: string;
      gracePeriodRemainingDays?: number;
    }>;
  };
  diagnosticSource: 'Local Live Probe' | 'Offline Agent Import';
}
```

## 3. Database & File Migrations
Not applicable. The stateless and ephemeral nature of in-memory key processing guarantees no database schema migrations are necessary, eliminating stale data risks.
