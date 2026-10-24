# Security Guidelines & Privacy Protocol — Microsoft License Inspector

## 1. Zero Trust & Data Protection Principles
Microsoft product keys represent confidential licensing assets. Compromising a single volume MAK or retail key can invalidate organizational licenses or incur significant financial liability.
The **Microsoft License Inspector** adheres strictly to the following security covenants:

1. **Local-Only Processing**: All format validation, Base-24 verification, and GVLK matching occurs entirely on the local client or loopback service. No keys are EVER transmitted to third-party cloud servers, external validation APIs, or external telemetry collectors.
2. **Mandatory Default Key Masking**: All product keys displayed in UI tables, diagnostic summaries, clipboard copies (unless individually overridden), exported files, and console outputs are masked by default:
   - Example: `VK7JG-*****-*****-*****-W66T6`
3. **No Database Key Persistence**: Product keys are held in volatile process memory only. They are never written to unencrypted SQLite, localStorage, or persistent databases.
4. **Log Scrubbing & Redaction**: All internal loggers and exception handlers automatically run regex scrubbing filters that redact any pattern matching `([A-Z0-9]{5}-){4}[A-Z0-9]{5}` before emitting messages to stdout or stderr.

## 2. Command Execution & Local Diagnostic Safety
The local diagnostic server communicates with Windows licensing subroutines (`SoftwareLicensingProduct` CIM queries, `slmgr.vbs`, `ospp.vbs`). To eliminate vulnerability to Command Injection (CWE-78) or unauthorized system modification:

- **Loopback-Only Interface**: The diagnostic API server binds exclusively to IPv4 loopback (`127.0.0.1`) on a dedicated local port (`4820`). External connections and LAN requests are rejected with HTTP 403 Forbidden.
- **Strict Read-Only Enforcement**: The diagnostic engine accepts NO arbitrary command inputs or shell scripts from HTTP bodies. All commands are hardcoded in pre-compiled PowerShell functions.
- **Forbidden Activation Alterations**: Commands that modify license state (e.g., `slmgr.vbs /ipk`, `slmgr.vbs /ato`, `slmgr.vbs /upk`) are strictly absent from the diagnostic engine.
- **Whitelisted Executable Paths**: `cscript.exe` is invoked only with absolute paths to system-protected locations (`%SystemRoot%\System32\cscript.exe`) and verified Microsoft Office directories.

## 3. Explicit User Consent Protocol
Before invoking the local device diagnostic module:
1. The user must explicitly trigger the "Inspect Local Device" action.
2. The UI renders a transparent disclosure listing the exact read-only queries executed (`Get-CimInstance SoftwareLicensingProduct`, `ospp.vbs /dstatus`).
3. The user is informed that only the last 5 characters of installed keys (the partial key exposed by Windows itself) will be read.

## 4. Anti-Scraping & Brute-Force Safeguards
- The application will not support automated, brute-force guessing or continuous rotation of keys against Microsoft online servers.
- Format verification uses mathematical Base-24 structure tests rather than hitting any network service.

## 5. Security & Verification Checklist
- [x] Product keys masked by default across all UI views and exports.
- [x] API bound strictly to `127.0.0.1`.
- [x] CORS origin restricted to local dev / UI ports.
- [x] Child processes executed with isolated environment, no user-supplied arguments passed to command shells.
- [x] No persistent storage of raw keys in databases or files.
- [x] All logs scrubbed for Base-24 25-character patterns.
