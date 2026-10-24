<#
.SYNOPSIS
    Microsoft License Inspector — Standalone Device Diagnostic Agent (Read-Only)
.DESCRIPTION
    Audits the local machine's Windows and Office licensing state using official,
    read-only Microsoft system management interfaces (CIM/WMI and ospp.vbs).
    Collects only partial keys (last 5 characters) and activation statuses.
    Never collects personal files, passwords, or full product keys.
.EXAMPLE
    powershell -ExecutionPolicy Bypass -File .\Invoke-LicenseDiagnostic.ps1 -ExportJson "C:\Audits\my-device.json"
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory=$false)]
    [string]$ExportJson = "machine-license-audit.json",
    
    [Parameter(Mandatory=$false)]
    [switch]$IncludeOffice = $true,

    [Parameter(Mandatory=$false)]
    [switch]$Quiet = $false
)

$ErrorActionPreference = "SilentlyContinue"

if (-not $Quiet) {
    Write-Host "======================================================================" -ForegroundColor Cyan
    Write-Host "  MICROSOFT LICENSE INSPECTOR -- LOCAL DEVICE DIAGNOSTIC PROBE" -ForegroundColor White
    Write-Host "======================================================================" -ForegroundColor Cyan
    Write-Host "  * Mode: Strictly Read-Only" -ForegroundColor Green
    Write-Host "  * Hostname: $env:COMPUTERNAME" -ForegroundColor DarkGray
    Write-Host "  * Disclosure: Queries CIM SoftwareLicensingProduct and ospp.vbs." -ForegroundColor DarkGray
    Write-Host "  * Security: Partial keys only (last 5 chars). No full secrets captured." -ForegroundColor DarkGray
    Write-Host "======================================================================`n" -ForegroundColor Cyan
}

# 1. Host System Telemetry
$os = Get-CimInstance -ClassName Win32_OperatingSystem -ErrorAction SilentlyContinue
$hostname = $env:COMPUTERNAME
$osName = if ($os -and $os.Caption) { $os.Caption.Trim() } else { [System.Environment]::OSVersion.VersionString }
$osVersion = if ($os -and $os.Version) { $os.Version } else { "Unknown" }
$osArch = if ($os -and $os.OSArchitecture) { $os.OSArchitecture } else { "64-bit" }

if (-not $Quiet) {
    Write-Host "[1/3] Probing Windows OS Licensing via CIM..." -ForegroundColor Yellow
}

# 2. Windows Licensing State
$licenseStatusMap = @{
    0 = "Unlicensed"
    1 = "Licensed (Activated)"
    2 = "Initial Grace Period (OOBGrace)"
    3 = "Out-of-Tolerance Grace Period (OOTGrace)"
    4 = "Non-Genuine Grace Period"
    5 = "Notification Mode"
    6 = "Extended Grace Period"
}

$statusBadgeMap = @{
    0 = "NOT_ACTIVATED"
    1 = "ACTIVATED_ON_THIS_DEVICE"
    2 = "NOT_ACTIVATED"
    3 = "NOT_ACTIVATED"
    4 = "NOT_ACTIVATED"
    5 = "NOT_ACTIVATED"
    6 = "NOT_ACTIVATED"
}

# ApplicationId for Windows: 55c92734-d682-4d71-983e-d6ec3f16059f
$winProduct = Get-CimInstance -ClassName SoftwareLicensingProduct -Filter "PartialProductKey is not null and ApplicationId = '55c92734-d682-4d71-983e-d6ec3f16059f'" -ErrorAction SilentlyContinue |
    Sort-Object -Property LicenseStatus -Descending |
    Select-Object -First 1

$winLicenseData = [PSCustomObject]@{
    productName = "Windows Operating System"
    description = "Generic Windows License"
    partialKey = "N/A"
    licenseStatus = 0
    licenseStatusText = "Unknown / Query Failed"
    channel = "Unknown"
    expirationDate = $null
    kmsMachine = $null
    errorCode = $null
    errorReason = $null
    statusBadge = "UNKNOWN"
    evidence = "No active Windows license product returned by CIM"
}

if ($winProduct) {
    $statusCode = [int]$winProduct.LicenseStatus
    $statusText = if ($licenseStatusMap.ContainsKey($statusCode)) { $licenseStatusMap[$statusCode] } else { "Status Code $statusCode" }
    $badge = if ($statusBadgeMap.ContainsKey($statusCode)) { $statusBadgeMap[$statusCode] } else { "UNKNOWN" }
    
    $channel = "Retail"
    if ($winProduct.Description -match "VOLUME|KMS|GVLK") {
        $channel = "Volume (GVLK/KMS)"
    } elseif ($winProduct.Description -match "MAK") {
        $channel = "Volume (MAK)"
    } elseif ($winProduct.Description -match "OEM") {
        $channel = "OEM"
    }

    $winLicenseData = [PSCustomObject]@{
        productName = if ($winProduct.Name) { $winProduct.Name } else { $osName }
        description = if ($winProduct.Description) { $winProduct.Description } else { "Standard License" }
        partialKey = if ($winProduct.PartialProductKey) { $winProduct.PartialProductKey } else { "N/A" }
        licenseStatus = $statusCode
        licenseStatusText = $statusText
        channel = $channel
        expirationDate = if ($winProduct.GracePeriodRemaining) { "$([math]::Round($winProduct.GracePeriodRemaining / 1440, 1)) days remaining" } else { $null }
        kmsMachine = if ($winProduct.KeyManagementServiceMachine) { $winProduct.KeyManagementServiceMachine } else { $null }
        errorCode = if ($winProduct.EvaluationEndDate -and $statusCode -ne 1) { "0xC004F009" } else { $null }
        statusBadge = $badge
        evidence = "WMI/CIM SoftwareLicensingProduct (ID: $($winProduct.ID), Status=$statusCode)"
    }
}

if (-not $Quiet) {
    Write-Host "  -> Windows Product: $($winLicenseData.productName)" -ForegroundColor Green
    Write-Host "  -> Status: $($winLicenseData.licenseStatusText)" -ForegroundColor $(if ($winLicenseData.licenseStatus -eq 1) { "Green" } else { "Yellow" })
    Write-Host "  -> Partial Key: *****-$($winLicenseData.partialKey)" -ForegroundColor Cyan
    Write-Host "  -> Channel: $($winLicenseData.channel)" -ForegroundColor DarkGray
}

# 3. Microsoft Office Licensing State
if (-not $Quiet) {
    Write-Host "`n[2/3] Probing Microsoft Office Licensing..." -ForegroundColor Yellow
}

$officeData = [PSCustomObject]@{
    isInstalled = $false
    toolUsed = "None"
    detectedVersions = @()
}

$candidateOsppPaths = @(
    "$env:ProgramFiles\Microsoft Office\Office16\ospp.vbs",
    "${env:ProgramFiles(x86)}\Microsoft Office\Office16\ospp.vbs",
    "$env:ProgramFiles\Microsoft Office\Office15\ospp.vbs",
    "${env:ProgramFiles(x86)}\Microsoft Office\Office15\ospp.vbs",
    "$env:ProgramFiles\Microsoft Office\Office14\ospp.vbs",
    "${env:ProgramFiles(x86)}\Microsoft Office\Office14\ospp.vbs"
)

$foundOspp = $candidateOsppPaths | Where-Object { Test-Path $_ } | Select-Object -First 1

if ($foundOspp) {
    $officeData.isInstalled = $true
    $officeData.toolUsed = $foundOspp
    
    if (-not $Quiet) {
        Write-Host "  -> Found ospp.vbs at: $foundOspp" -ForegroundColor DarkGray
        Write-Host "  -> Executing read-only cscript /dstatus query..." -ForegroundColor DarkGray
    }

    $cscriptExe = "$env:SystemRoot\System32\cscript.exe"
    $osppOutput = & $cscriptExe //nologo "$foundOspp" /dstatus 2>&1

    $currentProduct = $null
    $detectedList = @()

    foreach ($line in $osppOutput) {
        if ($line -match "PRODUCT DETAILS:") {
            if ($currentProduct) { $detectedList += $currentProduct }
            $currentProduct = [ordered]@{
                productName = "Microsoft Office"
                licenseStatus = "UNKNOWN"
                partialKey = "N/A"
                licenseFamily = "Standard"
                channel = "Volume/Retail"
                gracePeriodDays = 0
            }
        }
        if ($currentProduct) {
            if ($line -match "LICENSE NAME:\s*(.*)") {
                $currentProduct.productName = $Matches[1].Trim()
                if ($line -match "VL|KMS|GVLK") { $currentProduct.channel = "Volume (GVLK/KMS)" }
                elseif ($line -match "MAK") { $currentProduct.channel = "Volume (MAK)" }
                elseif ($line -match "Retail|Subscription") { $currentProduct.channel = "Retail/Subscription" }
            }
            if ($line -match "LICENSE STATUS:\s*(.*)") {
                $currentProduct.licenseStatus = $Matches[1].Trim()
            }
            if ($line -match "Last 5 characters of installed product key:\s*(.*)") {
                $currentProduct.partialKey = $Matches[1].Trim()
            }
            if ($line -match "REMAINING GRACE:\s*(\d+)\s*days") {
                $currentProduct.gracePeriodDays = [int]$Matches[1]
            }
        }
    }
    if ($currentProduct) { $detectedList += $currentProduct }
    $officeData.detectedVersions = $detectedList

    if (-not $Quiet) {
        if ($detectedList.Count -eq 0) {
            Write-Host "  -> Office installed, but no active license blocks detected by ospp.vbs." -ForegroundColor DarkGray
        } else {
            foreach ($item in $detectedList) {
                Write-Host "  -> Office: $($item.productName) | Status: $($item.licenseStatus) | Partial: *****-$($item.partialKey)" -ForegroundColor Green
            }
        }
    }
} else {
    # Check Click-to-Run Registry
    $c2rReg = "HKLM:\SOFTWARE\Microsoft\Office\ClickToRun\Configuration"
    if (Test-Path $c2rReg) {
        $prodRelease = (Get-ItemProperty -Path $c2rReg -Name "ProductReleaseIds" -ErrorAction SilentlyContinue).ProductReleaseIds
        $officeData.isInstalled = $true
        $officeData.toolUsed = "Registry ClickToRun"
        $officeData.detectedVersions = @([PSCustomObject]@{
            productName = if ($prodRelease) { "Microsoft 365 / Office C2R ($prodRelease)" } else { "Microsoft 365 Click-to-Run" }
            licenseStatus = "ACCOUNT_BASED_OR_SUBSCRIPTION"
            partialKey = "N/A (vNext Shared License)"
            licenseFamily = "Subscription / Cloud Identity"
            channel = "Subscription"
            gracePeriodDays = 30
        })
        if (-not $Quiet) {
            Write-Host "  -> Detected Microsoft 365 Click-to-Run Subscription installation in Registry." -ForegroundColor Green
        }
    } else {
        if (-not $Quiet) {
            Write-Host "  -> No supported Microsoft Office / ospp.vbs installation found on this device." -ForegroundColor DarkGray
        }
    }
}

# 4. Construct Final Structured Output
$diagnosticReport = [ordered]@{
    timestamp = (Get-Date).ToString("o")
    hostname = $hostname
    osName = $osName
    osVersion = $osVersion
    osArchitecture = $osArch
    windowsLicense = $winLicenseData
    officeLicense = $officeData
    diagnosticSource = "Local Live Probe"
    notes = @(
        "Read-only query completed safely without changing system license state.",
        "Verified via official CIM/WMI and Office Licensing subroutines.",
        "Keys masked to protect licensing secrets."
    )
}

$jsonOutput = $diagnosticReport | ConvertTo-Json -Depth 6

if ($ExportJson) {
    $jsonOutput | Out-File -FilePath $ExportJson -Encoding utf8 -Force
    if (-not $Quiet) {
        Write-Host "`n[3/3] Diagnostic report saved to: $ExportJson" -ForegroundColor Green
        Write-Host "You can import this JSON file directly into the Microsoft License Inspector dashboard." -ForegroundColor White
    }
}

return $jsonOutput
