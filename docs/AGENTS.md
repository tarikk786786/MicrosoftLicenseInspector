# AI Agent Operational Directives — Microsoft License Inspector

## 1. Operating Boundaries & Sources of Truth
When modifying, extending, or maintaining the **Microsoft License Inspector**, all AI agents MUST strictly comply with these directives:

1. **Source of Truth for Specifications**: `docs/PRD.md` and `docs/ARCHITECTURE.md` are the single source of truth for features and behavior.
2. **Never Claim Fake Activation**: The agent must NEVER implement or suggest algorithms that simulate key activation or claim an uninstalled key is active.
3. **Preserve Read-Only Licensing Integrity**: The agent must never write scripts that invoke license modification commands (`/ipk`, `/ato`, `/upk`, `/cpky`). All diagnostic hooks must remain strictly observational (`/dli`, `/dlv`, `/xpr`, `/dstatus`, CIM queries).
4. **Enforce Masking Everywhere**: The agent must verify that any new table, export, or log output implements key masking via `maskProductKey()`.

## 2. Step-by-Step Implementation Protocol
- **Step 1: Scaffolding**: Setup Vite + React + TypeScript + Tailwind CSS and Express backend in `apps/MicrosoftLicenseInspector/`.
- **Step 2: Core Algorithmic Engines**: Implement pure mathematical Base-24 verification, official Microsoft GVLK registry, and activation error code mapping.
- **Step 3: Test-Driven Validation**: Write comprehensive test suites for format checks, GVLK lookup, error definitions, and report masking.
- **Step 4: Local Device Diagnostic Agent**: Build safe PowerShell probe (`Get-CimInstance SoftwareLicensingProduct`) and Office probe (`ospp.vbs /dstatus`), wrapping them in Express loopback API endpoints.
- **Step 5: Interactive Web UI**: Build Executive Dashboard with Bulk Intake, Live Host Inspection tab, Offline JSON Importer, Results Table with filtering and sorting, Error Dictionary Modal, and Masked Exporter.
- **Step 6: Standalone Offline PowerShell Script**: Author `scripts/Invoke-LicenseDiagnostic.ps1` for air-gapped system inspections.
- **Step 7: Verification**: Execute automated tests, start backend and frontend, test live probes, and verify zero errors.

## 3. Validation Gates Before Completion
Before reporting completion to the user, the agent must verify:
- [ ] All 10 Vibe Coding Blueprint documents are complete and populated in `docs/`.
- [ ] TypeScript compilation passes (`npm run build` or `tsc --noEmit`) with 0 errors.
- [ ] Unit tests pass with 0 failures (`npm test`).
- [ ] Express backend launches on `127.0.0.1:4820` without crashes.
- [ ] Frontend loads and runs successfully in browser.
- [ ] Root `README.md` is populated with clear quickstart instructions.
