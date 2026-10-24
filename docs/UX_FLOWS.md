# User Experience Flows — Microsoft License Inspector

## 1. Primary User Journeys

### Flow 1: Bulk Key Parsing & Format Analysis
```mermaid
flowchart TD
    Start([User opens Web App]) --> TabSelect[Bulk Inspector Tab]
    TabSelect --> InputMode{Input Method}
    InputMode -->|Paste Text| PasteBox[Paste keys in textarea]
    InputMode -->|Upload File| FileDrop[Drag & drop TXT/CSV file]
    InputMode -->|Quick Test| SampleBtn[Click 'Load Sample GVLK Test Keys']
    
    PasteBox --> Normalize[Auto-clean & normalize Base-24]
    FileDrop --> Normalize
    SampleBtn --> Normalize
    
    Normalize --> DedupCheck{Deduplication On?}
    DedupCheck -->|Yes| Dedup[Filter identical key hashes]
    DedupCheck -->|No| KeepAll[Retain all rows]
    
    Dedup --> FormatEngine[Run Base-24 & GVLK Matcher]
    KeepAll --> FormatEngine
    
    FormatEngine --> RenderTable[Populate Results Table]
    RenderTable --> FilterSort[Filter by Status, Product, Channel]
    FilterSort --> Export[Export Masked CSV / JSON / Markdown]
```

### Flow 2: Host Machine Licensing Diagnostics
```mermaid
flowchart TD
    HostStart([User switches to 'Host Diagnostics' tab]) --> ConsentNotice[Display Read-Only Disclosure & Queries]
    ConsentNotice --> ProbeTrigger[Click 'Run Live Host Diagnostic Scan']
    
    ProbeTrigger --> BackendReq[POST /api/diagnostics/run]
    BackendReq --> WinProbe[CIM SoftwareLicensingProduct Query]
    BackendReq --> OfficeProbe[Scan Office Paths & ospp.vbs /dstatus]
    
    WinProbe --> HostResult[Aggregate Diagnostic Evidence]
    OfficeProbe --> HostResult
    
    HostResult --> UIUpdate[Render Host Licensing Summary Cards]
    UIUpdate --> OSDetails[Windows Edition, Channel, Status, Partial Key]
    UIUpdate --> OfficeDetails[Office Version, Expiration, License Family]
    UIUpdate --> ActionSteps[Display Remediation Advice if Unlicensed]
```

### Flow 3: Offline Machine Inspection (Air-Gapped Systems)
```mermaid
flowchart TD
    AirGapStart([Technician has offline PC]) --> DownloadScript[Download Invoke-LicenseDiagnostic.ps1]
    DownloadScript --> RunOffline[Run script in PowerShell on target PC]
    RunOffline --> OutJSON[Generates machine-license-audit.json]
    OutJSON --> Transfer[Copy JSON file to dashboard machine]
    Transfer --> UploadModal[Click 'Import Offline Audit JSON']
    UploadModal --> MergeResults[Merge into Dashboard & Host Inspector]
```

## 2. Interface States

### 2.1 Empty States
- **Bulk Input Table**: Shows an empty-slate illustration with two prominent action pills: "Load Windows GVLK Demo Keys" and "Load Office KMS Demo Keys" to allow immediate evaluation without risking real private keys.
- **Host Diagnostic Card**: Shows "No diagnostic scan performed yet. Click 'Run Live Host Diagnostic Scan' to query local licensing status safely."

### 2.2 Loading & In-Progress States
- **Processing Keys**: Progress bar indicating `Processed X of Y keys...` with an animated pulse indicator.
- **Running Host Probes**: Skeleton loaders for Windows and Office telemetry cards with real-time status messages: "Querying SoftwareLicensingProduct...", "Inspecting ospp.vbs status...".

### 2.3 Error States
- **Format Errors in Keys**: Highlighted in dark red with specific reason (e.g., "Contains forbidden character 'O' (did you mean digit 0?)", "Length is 24 characters, expected 25").
- **Backend Disconnected**: If the local Node server is not running, the dashboard shows a clear amber badge: "Local Diagnostic Engine Offline — Bulk validation operates purely in-browser. To enable host scans, start `npm run server`."

### 2.4 Success States
- Toast notifications on successful CSV export, JSON download, or key copy.
- Confirmation badge when 100% of keys pass structural validation.
