import { ActivationErrorCode } from '../types/licensing';

export const ACTIVATION_ERROR_DICTIONARY: Record<string, ActivationErrorCode> = {
  '0XC004C003': {
    code: '0xC004C003',
    title: 'Product Key Blocked on Activation Server',
    description: 'The Microsoft activation server determined the specified product key has been blocked or revoked.',
    technicalCause: 'The key was flagged by Microsoft due to unauthorized redistribution, fraudulent purchase, chargeback, or leaked volume licensing status.',
    recommendedRemediation: 'Do not attempt reactivation with this key. Procure a legitimate retail or volume license via Microsoft 365 Admin Center or authorized distributor.',
  },
  '0XC004C008': {
    code: '0xC004C008',
    title: 'Product Key Exceeded Activation / Unlock Limit',
    description: 'The activation server reported that the product key has exceeded its maximum permitted number of activations.',
    technicalCause: 'The key has already been used on the maximum number of hardware configurations allowed by the End User License Agreement (EULA).',
    recommendedRemediation: 'If hardware was upgraded or transferred legitimately, contact Microsoft Support via telephone activation wizard (slui.exe 4) to reset the counter.',
  },
  '0XC004C020': {
    code: '0xC004C020',
    title: 'Multiple Activation Key (MAK) Limit Exceeded',
    description: 'The Volume Licensing Multiple Activation Key (MAK) has exhausted its activation allocation.',
    technicalCause: 'All activation seats allocated to this MAK contract have been consumed by endpoints.',
    recommendedRemediation: 'Sign in to the Microsoft Volume Licensing Service Center (VLSC) or Microsoft 365 Admin Center to request an additional MAK seat limit increase.',
  },
  '0X803FA067': {
    code: '0x803FA067',
    title: 'Digital License or Edition Upgrade Mismatch',
    description: 'Windows cannot find a valid digital license for this device edition.',
    technicalCause: 'Often occurs when attempting an in-place upgrade from Windows Home to Windows Pro without an active digital entitlement or while disconnected from Microsoft servers.',
    recommendedRemediation: 'Disconnect network adapter, enter the generic Windows Pro GVLK to complete the edition switch, then reconnect and enter the legitimate Pro key.',
  },
  '0X8007007B': {
    code: '0x8007007B',
    title: 'KMS Host DNS Name Does Not Exist',
    description: 'The KMS client machine cannot locate a Key Management Service (KMS) SRV record in DNS.',
    technicalCause: 'The client is configured with a GVLK expecting an internal corporate KMS host, but DNS does not publish the _vlmcs._tcp record or client is off-network.',
    recommendedRemediation: 'Connect to corporate VPN, verify DNS suffix, or manually point to KMS host via slmgr.vbs /skms <kms-hostname>:<port>.',
  },
  '0XC004F074': {
    code: '0xC004F074',
    title: 'KMS Server Unreachable or Time Desynchronization',
    description: 'The Software Licensing Service reported that the computer could not be activated via Key Management Service (KMS).',
    technicalCause: 'The system clock on the client and the KMS host differ by more than 4 hours, or the firewall is blocking TCP port 1688.',
    recommendedRemediation: 'Synchronize client system clock with corporate domain controller (NTP) and ensure TCP port 1688 outbound traffic is permitted.',
  },
  '0XC004F038': {
    code: '0xC004F038',
    title: 'KMS Activation Count Threshold Not Met',
    description: 'The KMS host reported that the computer could not be activated because the minimum activation count was not reached.',
    technicalCause: 'KMS requires a minimum threshold of 25 distinct Windows client machines or 5 Windows Server machines before it begins activating clients.',
    recommendedRemediation: 'Wait until additional corporate endpoints contact the KMS host to surpass the activation threshold, or use MAK for smaller branch offices.',
  },
  '0XC004F211': {
    code: '0xC004F211',
    title: 'Major Hardware Change Detected',
    description: 'Windows reported that the hardware of your device has changed significantly.',
    technicalCause: 'Motherboard or primary processor replacement invalidating the hardware hash of an OEM license tied to the original motherboard.',
    recommendedRemediation: 'Launch Windows Activation Settings and run the Activation Troubleshooter ("I changed hardware on this device recently") linked to your Microsoft Account.',
  },
  '0X80072EE7': {
    code: '0x80072EE7',
    title: 'Network Name Resolution Failure',
    description: 'The server name or address could not be resolved.',
    technicalCause: 'Internet connectivity failure or DNS resolver unable to reach Microsoft activation servers (activation.sls.microsoft.com).',
    recommendedRemediation: 'Check internet connectivity, gateway, and DNS configuration. Ensure HTTPS port 443 outbound to Microsoft activation hosts is open.',
  },
  '0X80072F8F': {
    code: '0x80072F8F',
    title: 'Security Certificate Date Mismatch',
    description: 'A security error occurred due to an incorrect system date or time.',
    technicalCause: 'The client device clock is substantially incorrect, causing SSL/TLS certificate verification against Microsoft servers to fail.',
    recommendedRemediation: 'Correct the local system date and time, enable automatic time synchronization in Windows Settings, and retry activation.',
  },
};

/**
 * Normalizes error code strings (handles prefixes like 0x or uppercase/lowercase)
 */
export function lookupErrorCode(rawCode?: string): ActivationErrorCode | undefined {
  if (!rawCode) return undefined;
  const clean = rawCode.trim().toUpperCase();
  const hexKey = clean.startsWith('0X') ? clean : `0X${clean}`;
  return ACTIVATION_ERROR_DICTIONARY[hexKey];
}
