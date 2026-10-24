import { DeviceDiagnosticReport } from '../types/licensing';

const API_BASE = '/api';

export interface BackendHealth {
  status: string;
  version: string;
  platform: string;
  isWindows: boolean;
  nodeVersion: string;
  loopbackOnly: boolean;
  timestamp: string;
}

export async function checkBackendHealth(): Promise<BackendHealth | null> {
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchHostDiagnostics(): Promise<DeviceDiagnosticReport> {
  const res = await fetch(`${API_BASE}/diagnostics/host`, { signal: AbortSignal.timeout(20000) });
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody.error || `HTTP ${res.status}: Failed to execute diagnostic probe.`);
  }
  return await res.json();
}

export async function uploadOfflineReport(jsonData: unknown): Promise<DeviceDiagnosticReport> {
  const res = await fetch(`${API_BASE}/diagnostics/import`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(jsonData),
  });
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody.error || 'Failed to import diagnostic report.');
  }
  const result = await res.json();
  return result.report;
}
