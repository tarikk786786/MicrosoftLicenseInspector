import { execFile } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { safeLog } from '../utils/sanitize.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SCRIPT_PATH = path.resolve(__dirname, '../../scripts/Invoke-LicenseDiagnostic.ps1');

export async function runHostDiagnostic() {
  return new Promise((resolve, reject) => {
    // Invoke PowerShell directly with script and capture JSON stdout
    const args = [
      '-NoProfile',
      '-ExecutionPolicy', 'Bypass',
      '-Command',
      `& '${SCRIPT_PATH}' -Quiet -ExportJson ''`
    ];

    execFile('powershell.exe', args, { timeout: 15000, maxBuffer: 1024 * 1024 }, (error, stdout, stderr) => {
      if (error) {
        safeLog('[Diagnostic Server] PowerShell probe error:', error.message);
        return reject(new Error(`Failed to execute Windows licensing probe: ${error.message}`));
      }

      try {
        const trimmed = stdout.trim();
        // Locate first { and last } to avoid any non-JSON prefix/suffix
        const firstBrace = trimmed.indexOf('{');
        const lastBrace = trimmed.lastIndexOf('}');
        if (firstBrace === -1 || lastBrace === -1) {
          throw new Error('No valid JSON returned from diagnostic agent');
        }

        const jsonStr = trimmed.substring(firstBrace, lastBrace + 1);
        const parsed = JSON.parse(jsonStr);
        resolve(parsed);
      } catch (parseErr) {
        safeLog('[Diagnostic Server] JSON Parse failure from probe output');
        reject(new Error(`Failed to parse diagnostic JSON output: ${parseErr.message}`));
      }
    });
  });
}
