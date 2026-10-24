# Microsoft License Inspector

Professional Windows & Microsoft Office licensing audit, bulk key diagnostic, and host system verification suite built for IT administrators, system engineers, and compliance auditors.

---

## 1. Executive Summary & Purpose

Microsoft product keys (Windows 10/11, Windows Server, Office 2016–2024, Microsoft 365) are sensitive digital assets. However, Microsoft does **not** provide a universal, public, unauthenticated API to check arbitrary retail or OEM product keys.

**Microsoft License Inspector** provides a transparent, evidence-grounded diagnostic architecture that strictly separates:
1. **Stage A — Local Format Checks**: Base-24 structural parsing, exclusion rules, and known GVLK / KMS client signature matching.
2. **Stage B — Installed License Diagnostics**: Authentic, read-only system queries via Windows CIM (`SoftwareLicensingProduct`) and Office (`ospp.vbs` / Click-to-Run vNext) on the host computer.
3. **Stage C — Official Entitlement Verification**: Authoritative enterprise pathways (Microsoft 365 Admin Center, VLSC, VAMT, and Microsoft Activation Support).

> **Privacy & Security Guarantee:** Keys are processed purely in-memory. Unmasked product keys are never sent to third-party servers, stored in databases, or displayed in exported reports.

---

## 2. Supported Products & Licensing Channels

| Category | Products Supported | Licensing Channels |
|---|---|---|
| **Windows Desktop** | Windows 11 & 10 (Home, Pro, Pro for Workstations, Enterprise, Education, LTSC/LTSB) | Retail, OEM (COA/DM), Volume (GVLK/KMS), Volume (MAK), Digital License |
| **Windows Server** | Windows Server 2025, 2022, 2019, 2016 (Standard, Datacenter, Essentials) | Volume (GVLK/KMS), Volume (MAK), Retail, OEM |
| **Microsoft Office** | Office LTSC 2024, Office LTSC 2021, Office 2019, Office 2016 (Pro Plus, Standard, Home & Business) | Volume (GVLK/KMS), Volume (MAK), Click-to-Run, Retail |
| **Microsoft 365** | Microsoft 365 Apps for Enterprise, Business, Family, Personal | Cloud Identity / Azure AD vNext Subscription Tokens |
| **Specialized Suites** | Microsoft Visio LTSC 2024 / 2021, Microsoft Project LTSC 2024 / 2021 | Volume (GVLK/KMS), Volume (MAK) |

---

## 3. Architecture & Directory Layout

```
apps/MicrosoftLicenseInspector/
├── docs/                             # The 10 Vibe Coding Blueprint Standard documents
│   ├── PRD.md                        # Product Requirements Document
│   ├── DESIGN_SYSTEM.md              # UI tokens, color palette, badges
│   ├── ARCHITECTURE.md               # Technical system architecture
│   ├── DATABASE.md                   # In-memory storage & privacy rules
│   ├── SECURITY.md                   # Command isolation & loopback security
│   ├── CODE_STYLE.md                 # Engineering guidelines & TypeScript standards
│   ├── TESTING.md                    # Vitest testing strategy & test plan
│   ├── AGENTS.md                     # AI agent operational directives
│   ├── UX_FLOWS.md                   # User journeys & component states
│   └── API.md                        # REST API contracts & JSON schemas
├── scripts/                          # Portable PowerShell diagnostic tools
│   └── Invoke-LicenseDiagnostic.ps1  # Standalone read-only audit agent for air-gapped PCs
├── server/                           # Local loopback diagnostic service (Port 4820)
│   ├── index.js                      # Express API router (bound strictly to 127.0.0.1)
│   ├── probes/
│   │   ├── windowsProbe.js           # Executes CIM SoftwareLicensingProduct queries
│   │   └── officeProbe.js            # Scans ospp.vbs / Click-to-Run registries
│   └── utils/
│       └── sanitize.js               # In-flight log scrubber removing 25-char keys
├── src/                              # Frontend Application (React 18 + TS + Tailwind)
│   ├── components/
│   │   ├── Header.tsx                # Navigation, host status, quick actions
│   │   ├── DashboardStats.tsx        # High-density KPI summary cards
│   │   ├── BulkInputPanel.tsx        # Paste box, CSV upload, deduplication
│   │   ├── ResultsTable.tsx          # Masked results, filters, 10s key reveal
│   │   ├── DeviceDiagnosticsPanel.tsx # Live host inspection & offline JSON importer
│   │   ├── ErrorDictionaryModal.tsx  # Searchable activation error code dictionary
│   │   ├── ExportModal.tsx           # Masked CSV, JSON, Markdown exporter
│   │   └── LegitimateVerificationGuide.tsx # 3-stage validation explanation modal
│   ├── services/
│   │   ├── base24Validator.ts        # Base-24 mathematical rules & masking
│   │   ├── gvlkRegistry.ts           # Microsoft Learn official GVLK database
│   │   ├── errorCodes.ts             # Activation error code lookup dictionary
│   │   ├── keyParserEngine.ts        # Bulk intake parser & deduplication
│   │   ├── reportGenerator.ts        # Safe CSV, JSON, Markdown generator
│   │   └── apiService.ts             # REST client for loopback API
│   ├── types/
│   │   └── licensing.ts              # Strict TypeScript definitions
│   ├── App.tsx                       # Main dashboard container
│   ├── main.tsx                      # React root
│   └── index.css                     # Tailwind & Fluent design CSS
├── tests/                            # Automated Unit Test Suites (Vitest)
│   ├── base24Validator.test.ts       # 7 tests (format, length, normalization)
│   ├── gvlkRegistry.test.ts          # 5 tests (GVLK signature detection)
│   ├── errorCodes.test.ts            # 4 tests (error dictionary normalization)
│   ├── keyParserEngine.test.ts       # 4 tests (deduplication & parsing)
│   └── reportGenerator.test.ts       # 3 tests (masked CSV/JSON/MD exports)
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

---

## 4. Setup, Installation & How to Run

### Prerequisites
- Node.js 18+ (tested on Node v24.15)
- Windows PowerShell 5.1 or PowerShell 7+ (for local host device diagnostics)

### Installation
```bash
# Navigate to the project directory
cd "apps/MicrosoftLicenseInspector"

# Install dependencies
npm install
```

### Running the Application

**Option 1: Complete Dual-Engine Mode (Recommended)**
Runs both the local diagnostic server (Port 4820) and the web dashboard (Port 5180) simultaneously:
```bash
npm run dev
```
Open [http://localhost:5180](http://localhost:5180) in your web browser.

**Option 2: Web Dashboard Only (Client-Side Format Validation)**
```bash
npm run dev:web
```

**Option 3: Standalone Diagnostic Backend Only**
```bash
npm run server
```

---

## 5. Automated Testing

Run the Vitest test suites:
```bash
# Run all 23 unit tests across 5 test suites
npm test

# Run tests in watch mode during development
npm run test:watch
```

### Test Coverage Highlights
- Base-24 character set assertions (rejects illegal characters like `0, 1, 5, O, I, L, S, Z`).
- GVLK matching against Microsoft Learn official setup key tables.
- Error dictionary mapping with prescriptive IT remediation protocols.
- Deduplication and RFC-4180 CSV export key masking guarantees.

---

## 6. Standalone Offline PowerShell Diagnostic Agent

For air-gapped computers, branch offices, or machines without Node.js installed, use the portable diagnostic agent:

```powershell
# Run read-only audit on any Windows machine
powershell -ExecutionPolicy Bypass -File .\scripts\Invoke-LicenseDiagnostic.ps1 -ExportJson "C:\Audits\host-license.json"
```

The resulting `host-license.json` contains only partial keys (last 5 characters) and activation statuses. You can import it directly into the web dashboard using the **"Import Offline JSON"** button in the Host Device Diagnostics tab.

---

## 7. Configuration & Environment Variables (`appinfo11.txt`)

Recorded in the workspace master configuration file `appinfo11.txt` (Section 13):

```ini
MLI_APP_PATH="c:\Users\tarik\Desktop\MY TOOLS\apps\MicrosoftLicenseInspector"
MLI_BACKEND_PORT=4820
MLI_BACKEND_HOST=127.0.0.1
MLI_FRONTEND_PORT=5180
MLI_VIBE_BLUEPRINT_PATH="c:\Users\tarik\Desktop\MY TOOLS\templates\vibe_coding_blueprint"
```

---

## 8. Definition of Result Statuses

| Result Status | Meaning & Validation Criteria |
|---|---|
| `FORMAT_VALID` | Input matches the Microsoft 5x5 Base-24 structure. Does not imply active license. |
| `FORMAT_INVALID` | Character set violation, illegal length, or malformed separators. |
| `ACTIVATED_ON_THIS_DEVICE` | Local Windows or Office licensing service reports status as active (`LicenseStatus = 1`). |
| `NOT_ACTIVATED` | Host product is installed but currently unlicensed or in grace period. |
| `ENTITLEMENT_CONFIRMED` | Official licensing authority (e.g., Active Directory / KMS Host) confirms entitlement. |
| `ACTIVATION_ERROR` | Host diagnostics return an explicit activation failure code (e.g., `0xC004C003`). |
| `EXPIRED` | Evaluation edition or KMS grace period has lapsed. |
| `BLOCKED_OR_REVOKED` | Authoritative source explicitly flags key revocation. |
| `ALREADY_IN_USE` | Activation server indicates maximum seat threshold reached (e.g., MAK limit `0xC004C020`). |
| `UNKNOWN` | Uninstalled key passing format check whose live status cannot be verified without Microsoft activation servers. |

---

## 9. Security & Compliance Rules
- Keys are scrubbed from all terminal outputs, error messages, and log streams.
- Local diagnostic service binds exclusively to loopback interface `127.0.0.1`.
- Probes are strictly read-only; no state-modifying commands (`/ipk`, `/ato`, `/upk`) exist in the codebase.
