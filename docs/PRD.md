# Product Requirements Document (PRD) — Microsoft License Inspector

## 1. Product Overview
- **Product Name**: Microsoft License Inspector
- **One-Line Description**: Professional desktop and web-based licensing audit and diagnostic tool for Windows and Microsoft Office product keys, installed software licenses, and activation status verification.
- **Product Type**: Dual-mode Desktop Web App with Local Windows Diagnostic Engine & CLI Agent
- **Primary Platform**: Windows 10/11 & Windows Server (Web UI + Node/PowerShell Local Engine)

## 2. Problem Statement
IT administrators, system builders, refurbished PC vendors, and compliance managers frequently receive batches of Microsoft product keys (Windows 10/11, Windows Server, Office 2016-2024, Microsoft 365).
However:
1. Microsoft provides **no public, universal, unauthenticated API** to query arbitrary retail or OEM product key activation status or ownership.
2. Unscrupulous websites claim to "check keys online," which leaks proprietary license keys, exposes organizations to credential theft, or uses pirated/black-box validation that violates Microsoft TOS.
3. Users and admins confuse **format validity** (matching the 5x5 Base-24 algorithm) with **genuine activation or entitlement**.
4. Diagnosing the current machine's legitimate licensing state requires complex `slmgr.vbs` or `ospp.vbs` scripts, cryptic WMI properties, and hexadecimal error codes (e.g., `0xC004C003`, `0xC004C008`, `0xC004C020`).

## 3. Goals
- **Primary Goal**: Provide a secure, transparent, evidence-grounded licensing inspection suite that bulk-parses and validates format and edition matching, conducts real read-only device diagnostics for installed Windows and Office licenses, and provides authoritative guidance without misleading claims or data leakage.
- **Secondary Goals**:
  - Bulk processing of pasted keys, TXT, and CSV files with automatic deduplication, sanitization, and masking.
  - Identification of known Generic Volume License Keys (GVLK), KMS client keys, default setup keys, OEM keys, and retail structures.
  - Safe, local-only diagnostic agent that runs read-only commands (`slmgr /dli`, `slmgr /xpr`, `Get-CimInstance SoftwareLicensingProduct`, `ospp.vbs /dstatus`) with explicit user consent.
  - Detailed error dictionary explaining activation error codes with actionable remediation steps.
  - Exporting tamper-safe diagnostic audit reports (CSV, JSON, Markdown).

## 4. Target Users
1. **IT System Administrators & MSPs**: Auditing fleet license compliance, checking installed Windows and Office activation states, and verifying GVLK vs MAK deployments.
2. **Refurbished Hardware Vendors & System Builders**: Processing batches of COA/OEM keys, confirming structural integrity, and checking machine pre-activation status.
3. **Enterprise Compliance & Asset Managers**: Recording licensing inventory without exposing unmasked secret keys to cloud databases or unauthorized third-party services.

## 5. User Stories
- **US-01**: As an IT administrator, I want to paste 50+ Windows and Office product keys into a bulk parser so that I can immediately detect formatting errors, invalid Base-24 characters, and known GVLK installation keys.
- **US-02**: As an admin, I want all product keys to be masked by default (`XXXXX-*****-*****-*****-XXXXX`) so that sensitive license keys are never leaked in screenshots, exports, or application logs.
- **US-03**: As a technician, I want to run read-only local device diagnostics to inspect the active Windows edition, license status, partial product key, channel, and KMS expiration without running untrusted scripts.
- **US-04**: As a support engineer, I want to inspect installed Office / Microsoft 365 licenses and view the remaining grace period and license channel (Retail, KMS, Subscription).
- **US-05**: As a compliance officer, I want the system to clearly distinguish between `FORMAT_VALID`, `ACTIVATED_ON_THIS_DEVICE`, `NOT_ACTIVATED`, and `UNKNOWN`, and never declare an arbitrary uninstalled key "genuine" without authoritative evidence.
- **US-06**: As a field technician, I want a standalone PowerShell diagnostic script (`Invoke-LicenseDiagnostic.ps1`) that I can run offline on air-gapped computers and export a signed JSON file back into the dashboard.

## 6. Core Features & Functional Requirements

### Stage A — Bulk Key Intake & Format Engine
- Accept multiline text, comma/semicolon/newline-delimited strings, TXT files, and CSV spreadsheets.
- Automatic key normalization: strip whitespace, hyphens, and convert to uppercase.
- Strict Base-24 verification: Microsoft product keys do not use `0`, `1`, `5`, `A`, `E`, `I`, `L`, `N`, `O`, `S`, `U`, `Z` to prevent confusion with digits.
- Match keys against the official Microsoft Learn GVLK database (Windows 10/11 Pro/Enterprise/Education, Windows Server 2016-2025, Office 2016-2024 LTSC).
- Manual product/edition selector when key origin is ambiguous.

### Stage B — Installed Machine Diagnostic Engine
- Execute safe read-only queries against Windows Software Licensing Service (`SoftwareLicensingProduct`, `SoftwareLicensingService`).
- Query installed Microsoft Office installations (`ospp.vbs` across Program Files x86/x64, Click-to-Run vNext registry).
- Extract:
  - Product Name & Description
  - License Status (Unlicensed, Licensed, OOBGrace, OOTGrace, NonGenuineGrace, Notification, ExtendedGrace)
  - Partial Product Key (last 5 characters)
  - Key Management Service (KMS) client configuration & expiration time
  - Activation error code & plain-language explanation
- Never extract or display full installed OEM/Digital secrets.

### Stage C — Official Entitlement Verification Pathways
- Transparent documentation of official Microsoft entitlement verification: Microsoft 365 Admin Center, Azure portal, Volume Licensing Service Center (VLSC), Microsoft Support, and VAMT (Volume Activation Management Tool).
- Zero reliance on sketchy unauthorized activation scrapers.

### Result Status Taxonomy
1. `FORMAT_VALID` — Input strictly matches Microsoft 5x5 Base-24 structure.
2. `FORMAT_INVALID` — Structure, length, or character set violated.
3. `ACTIVATED_ON_THIS_DEVICE` — Local machine diagnostics confirm authentic licensed state.
4. `NOT_ACTIVATED` — Installed license is not in licensed state.
5. `ENTITLEMENT_CONFIRMED` — Authorized official source (e.g., local OEM DM table or KMS host) confirms entitlement.
6. `ACTIVATION_ERROR` — Device diagnostics return an explicit activation failure code.
7. `EXPIRED` — Trial, evaluation, or KMS grace period has lapsed.
8. `BLOCKED_OR_REVOKED` — Returned only when authoritative diagnostic source explicitly records revocation.
9. `ALREADY_IN_USE` — Explicitly indicated by local activation service (e.g., error 0xC004C020).
10. `UNKNOWN` — Uninstalled key where format is valid but activation state cannot be queried without Microsoft Activation servers.

## 7. Non-Goals
- **No Keygen or License Bypassing**: The tool does NOT generate keys, crack software, bypass KMS, or simulate KMS emulators.
- **No Universal Remote Key Activation Scraper**: The tool does NOT send keys to unauthorized third-party servers claiming to test keys against Microsoft backend endpoints.
- **No Writing or Modifying Activation State Without Explicit Administrative Action**: All diagnostic probes are read-only.

## 8. Definition of Done (DoD)
- [x] All 10 Blueprint documentation files present in `apps/MicrosoftLicenseInspector/docs/`.
- [x] Web dashboard in React + TypeScript + Tailwind CSS with responsive design.
- [x] Express/Node.js API backend with secure local PowerShell execution module.
- [x] Standalone `Invoke-LicenseDiagnostic.ps1` script for offline machine audits.
- [x] Complete Base-24 validator and Microsoft GVLK registry matching 50+ editions.
- [x] Comprehensive test suite with synthetic product keys and edge cases passing with 0 errors.
- [x] Key masking enforced across all logs, table displays, and exports.
