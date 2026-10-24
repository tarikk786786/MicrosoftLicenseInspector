# Code Conventions & Engineering Standards — Microsoft License Inspector

## 1. Core Principles
1. **Explicit Typing & Strict Soundness**: Every module, interface, and utility in TypeScript must have explicit types. No `any` types in business logic or data parsers.
2. **Defensive Diagnostic Execution**: System calls to Windows management instruments (WMI/CIM/CScript) must have explicit timeouts (5000ms), structured error captures, and non-blocking asynchronous wrappers.
3. **Immutability of Key Data**: Operations on keys (sanitization, hashing, masking, GVLK matching) are pure functions that return new immutable objects without modifying source inputs.

## 2. Directory Structure
```
apps/MicrosoftLicenseInspector/
├── docs/                     # 10 Vibe Coding Blueprint documents
├── scripts/                  # Standalone PowerShell diagnostic scripts
│   └── Invoke-LicenseDiagnostic.ps1
├── src/                      # Frontend Application (React + Vite + TS)
│   ├── assets/               # Icons and static brand assets
│   ├── components/           # UI Components
│   │   ├── BulkInputPanel.tsx
│   │   ├── DashboardStats.tsx
│   │   ├── DeviceDiagnosticsPanel.tsx
│   │   ├── ResultsTable.tsx
│   │   ├── ErrorDictionaryModal.tsx
│   │   └── ExportModal.tsx
│   ├── services/             # Core Logic & Utilities
│   │   ├── base24Validator.ts # Base-24 algorithm and regex
│   │   ├── gvlkRegistry.ts    # Official Microsoft KMS/GVLK Database
│   │   ├── errorCodes.ts      # Activation error code lookup engine
│   │   ├── reportGenerator.ts # Masked CSV/JSON/MD exports
│   │   └── apiService.ts      # Backend communication client
│   ├── types/                # Strict TypeScript schemas
│   │   └── licensing.ts
│   ├── App.tsx               # Main Dashboard container
│   ├── main.tsx              # Entry point
│   └── index.css             # Tailwind & design system theme
├── server/                   # Local Diagnostic Node Service
│   ├── index.js              # Express loopback server
│   ├── probes/
│   │   ├── windowsProbe.js   # CIM / slmgr diagnostic runner
│   │   └── officeProbe.js    # ospp.vbs diagnostic runner
│   └── utils/
│       └── sanitize.js       # Log scrubber and parameter checks
├── tests/                    # Automated Test Suite (Jest / Vitest)
│   ├── base24Validator.test.ts
│   ├── gvlkRegistry.test.ts
│   ├── errorCodes.test.ts
│   └── bulkParser.test.ts
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 3. Naming Conventions
- **Files**: `camelCase.ts` for pure utilities; `PascalCase.tsx` for React components; `kebab-case.ps1` or `PascalCase.ps1` for PowerShell scripts.
- **Interfaces & Types**: `PascalCase` with descriptive semantic nouns (`LicenseKeyRecord`, `DeviceDiagnosticReport`, `ValidationStageResult`).
- **Constants & Enums**: `UPPER_SNAKE_CASE` for status codes (`FORMAT_VALID`, `ACTIVATED_ON_THIS_DEVICE`, `GVLK_WINDOWS_11_PRO`).
- **Functions**: `camelCase` starting with action verbs (`validateBase24Key`, `detectProductEdition`, `maskProductKey`).

## 4. Do's and Don'ts

### Do's:
- **DO** always mask product keys before rendering or exporting (`maskProductKey(key)`).
- **DO** explain why format validity is different from genuine activation in all UI tooltips and reports.
- **DO** handle process execution failures gracefully if the host is running non-Windows or if Office is absent.
- **DO** provide actionable, plain-language remediation steps for every known Microsoft activation error code.

### Don'ts:
- **DON'T** ever use `console.log` with raw unmasked keys.
- **DON'T** execute `eval()` or pass unvalidated strings to shell interpreters.
- **DON'T** mark any uninstalled key as `ACTIVATED` or `GENUINE` purely based on structural validation.
- **DON'T** claim an Office license is permanent if it is governed by a 180-day KMS renewal interval or monthly Microsoft 365 token.
