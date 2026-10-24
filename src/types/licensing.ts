export type ResultStatus =
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

export type LicenseChannel =
  | 'Retail'
  | 'OEM'
  | 'Volume (GVLK/KMS)'
  | 'Volume (MAK)'
  | 'Subscription'
  | 'Evaluation'
  | 'Unknown';

export interface LicenseKeyRecord {
  id: string;
  rowNumber: number;
  rawKey: string; // Held in-memory only
  maskedKey: string; // e.g. "VK7JG-*****-*****-*****-3V66T"
  keyHash: string; // SHA-256 for deduplication
  detectedProduct: string;
  edition: string;
  channel: LicenseChannel;
  formatResult: 'FORMAT_VALID' | 'FORMAT_INVALID';
  localStatus: 'ACTIVATED_ON_THIS_DEVICE' | 'NOT_ACTIVATED' | 'NOT_TESTED' | 'EXPIRED' | 'ACTIVATION_ERROR';
  officialStatus: 'ENTITLEMENT_CONFIRMED' | 'BLOCKED_OR_REVOKED' | 'ALREADY_IN_USE' | 'UNKNOWN';
  overallStatus: ResultStatus;
  errorCode?: string;
  errorDescription?: string;
  isKnownGVLK: boolean;
  gvlkDescription?: string;
  verificationMethod: string;
  evidenceSource: string;
  recommendedAction: string;
  timestamp: string;
}

export interface GVLKDefinition {
  key: string;
  product: string;
  edition: string;
  channel: LicenseChannel;
  family: 'Windows Client' | 'Windows Server' | 'Office' | 'Other';
  officialSource: string;
}

export interface ActivationErrorCode {
  code: string;
  title: string;
  description: string;
  technicalCause: string;
  recommendedRemediation: string;
}

export interface WindowsHostLicenseInfo {
  productName: string;
  description: string;
  partialKey: string;
  licenseStatus: number;
  licenseStatusText: string;
  channel: string;
  expirationDate?: string;
  kmsMachine?: string;
  errorCode?: string;
  errorReason?: string;
  statusBadge: ResultStatus;
  evidence: string;
}

export interface OfficeHostLicenseInfo {
  productName: string;
  licenseStatus: string;
  partialKey: string;
  licenseFamily: string;
  gracePeriodDays?: number;
  channel: string;
}

export interface DeviceDiagnosticReport {
  timestamp: string;
  hostname: string;
  osName: string;
  osVersion: string;
  osArchitecture: string;
  windowsLicense: WindowsHostLicenseInfo;
  officeLicense?: {
    isInstalled: boolean;
    toolUsed?: string;
    detectedVersions: OfficeHostLicenseInfo[];
  };
  diagnosticSource: 'Local Live Probe' | 'Offline Agent Import';
  notes: string[];
}

export interface ParseOptions {
  deduplicate: boolean;
  defaultProduct: string;
}

export interface DashboardMetrics {
  totalKeys: number;
  formatValid: number;
  formatInvalid: number;
  knownGvlks: number;
  activatedOnDevice: number;
  unknownStatus: number;
  errorsFound: number;
}
