import { GVLKDefinition } from '../types/licensing';
import { normalizeProductKey } from './base24Validator';

/**
 * Official Microsoft Generic Volume License Keys (GVLK) & KMS Client Setup Keys
 * Source: Microsoft Learn Documentation
 * (https://learn.microsoft.com/en-us/windows-server/get-started/kms-client-activation-keys)
 * (https://learn.microsoft.com/en-us/deployoffice/vlactivation/gvlks)
 */
export const GVLK_DATABASE: GVLKDefinition[] = [
  // --- Windows 11 & Windows 10 ---
  {
    key: 'W269N-WFGWX-YVC9B-4J6C9-T83GX',
    product: 'Windows 10/11',
    edition: 'Pro',
    channel: 'Volume (GVLK/KMS)',
    family: 'Windows Client',
    officialSource: 'Microsoft Learn (Windows Client GVLK)',
  },
  {
    key: 'MH37W-N47XK-V7XM9-C7227-GCQG9',
    product: 'Windows 10/11',
    edition: 'Pro N',
    channel: 'Volume (GVLK/KMS)',
    family: 'Windows Client',
    officialSource: 'Microsoft Learn (Windows Client GVLK)',
  },
  {
    key: 'NRG8B-432QR-6WYPH-B9R8P-P9424',
    product: 'Windows 10/11',
    edition: 'Pro for Workstations',
    channel: 'Volume (GVLK/KMS)',
    family: 'Windows Client',
    officialSource: 'Microsoft Learn (Windows Client GVLK)',
  },
  {
    key: '9FNHH-K3HBT-3W4TD-6383H-6XYWF',
    product: 'Windows 10/11',
    edition: 'Pro for Workstations N',
    channel: 'Volume (GVLK/KMS)',
    family: 'Windows Client',
    officialSource: 'Microsoft Learn (Windows Client GVLK)',
  },
  {
    key: '6TP4R-GNPTD-KYYHQ-2337H-RR977',
    product: 'Windows 10/11',
    edition: 'Pro Education',
    channel: 'Volume (GVLK/KMS)',
    family: 'Windows Client',
    officialSource: 'Microsoft Learn (Windows Client GVLK)',
  },
  {
    key: 'YVWGF-BXNMC-HTQYQ-CPQ99-66QFC',
    product: 'Windows 10/11',
    edition: 'Pro Education N',
    channel: 'Volume (GVLK/KMS)',
    family: 'Windows Client',
    officialSource: 'Microsoft Learn (Windows Client GVLK)',
  },
  {
    key: 'NW6C2-QMPVW-D7KKK-3GKT6-VCFB2',
    product: 'Windows 10/11',
    edition: 'Education',
    channel: 'Volume (GVLK/KMS)',
    family: 'Windows Client',
    officialSource: 'Microsoft Learn (Windows Client GVLK)',
  },
  {
    key: '2WH4N-8QGBV-H22JP-CT43Q-MDWWJ',
    product: 'Windows 10/11',
    edition: 'Education N',
    channel: 'Volume (GVLK/KMS)',
    family: 'Windows Client',
    officialSource: 'Microsoft Learn (Windows Client GVLK)',
  },
  {
    key: 'NPPR9-FWDCX-D2C8J-H872K-2YT43',
    product: 'Windows 10/11',
    edition: 'Enterprise',
    channel: 'Volume (GVLK/KMS)',
    family: 'Windows Client',
    officialSource: 'Microsoft Learn (Windows Client GVLK)',
  },
  {
    key: 'DPH2V-TTNVB-4X9Q3-TJR4H-KHJW4',
    product: 'Windows 10/11',
    edition: 'Enterprise N',
    channel: 'Volume (GVLK/KMS)',
    family: 'Windows Client',
    officialSource: 'Microsoft Learn (Windows Client GVLK)',
  },
  {
    key: 'YYVX9-NTFWV-6MDM3-9PT4T-4M68B',
    product: 'Windows 10/11',
    edition: 'Enterprise G',
    channel: 'Volume (GVLK/KMS)',
    family: 'Windows Client',
    officialSource: 'Microsoft Learn (Windows Client GVLK)',
  },
  {
    key: 'M7XTQ-FN8P6-TTKYV-9D4CC-J462D',
    product: 'Windows 10/11',
    edition: 'Enterprise LTSC 2019/2021',
    channel: 'Volume (GVLK/KMS)',
    family: 'Windows Client',
    officialSource: 'Microsoft Learn (Windows Client GVLK)',
  },
  {
    key: '92NFX-8DJQP-P6BBQ-THF9C-7CG2H',
    product: 'Windows 10/11',
    edition: 'Enterprise LTSC 2019 N',
    channel: 'Volume (GVLK/KMS)',
    family: 'Windows Client',
    officialSource: 'Microsoft Learn (Windows Client GVLK)',
  },
  {
    key: 'DCPHK-NFMTC-H88MJ-PFHPY-QJ4BJ',
    product: 'Windows 10',
    edition: 'Enterprise LTSB 2016',
    channel: 'Volume (GVLK/KMS)',
    family: 'Windows Client',
    officialSource: 'Microsoft Learn (Windows Client GVLK)',
  },
  // Generic retail setup keys
  {
    key: 'YTMG3-N6DKC-DKB77-7M9GH-8HVX7',
    product: 'Windows 10/11',
    edition: 'Home',
    channel: 'Retail',
    family: 'Windows Client',
    officialSource: 'Microsoft Default Setup Key (Installation Only)',
  },
  {
    key: 'BT79Q-G7N6G-PGBYW-4YWX6-6F4BT',
    product: 'Windows 10/11',
    edition: 'Home Single Language',
    channel: 'Retail',
    family: 'Windows Client',
    officialSource: 'Microsoft Default Setup Key (Installation Only)',
  },
  {
    key: 'VK7JG-NPHTM-C97JM-9MPGT-3V66T',
    product: 'Windows 10/11',
    edition: 'Pro',
    channel: 'Retail',
    family: 'Windows Client',
    officialSource: 'Microsoft Generic Digital License Upgrade Key',
  },

  // --- Windows Server 2025 ---
  {
    key: 'TVRH6-BRNXV-TM8PB-8BPR3-FRVT4',
    product: 'Windows Server 2025',
    edition: 'Standard',
    channel: 'Volume (GVLK/KMS)',
    family: 'Windows Server',
    officialSource: 'Microsoft Learn (Server 2025 GVLK)',
  },
  {
    key: 'D764K-2NDRG-44GXW-WR8Y8-JF92T',
    product: 'Windows Server 2025',
    edition: 'Datacenter',
    channel: 'Volume (GVLK/KMS)',
    family: 'Windows Server',
    officialSource: 'Microsoft Learn (Server 2025 GVLK)',
  },

  // --- Windows Server 2022 ---
  {
    key: 'VDYBN-27WPP-V4HQT-9VMD4-VMK7H',
    product: 'Windows Server 2022',
    edition: 'Standard',
    channel: 'Volume (GVLK/KMS)',
    family: 'Windows Server',
    officialSource: 'Microsoft Learn (Server 2022 GVLK)',
  },
  {
    key: 'WX4NM-KYWYW-QJJR4-XV3QB-6VM33',
    product: 'Windows Server 2022',
    edition: 'Datacenter',
    channel: 'Volume (GVLK/KMS)',
    family: 'Windows Server',
    officialSource: 'Microsoft Learn (Server 2022 GVLK)',
  },

  // --- Windows Server 2019 ---
  {
    key: 'N69G4-B89J2-4G8F4-WWYCC-J464C',
    product: 'Windows Server 2019',
    edition: 'Standard',
    channel: 'Volume (GVLK/KMS)',
    family: 'Windows Server',
    officialSource: 'Microsoft Learn (Server 2019 GVLK)',
  },
  {
    key: 'WMDGN-G9PQG-XVVXX-R3X43-63DFG',
    product: 'Windows Server 2019',
    edition: 'Datacenter',
    channel: 'Volume (GVLK/KMS)',
    family: 'Windows Server',
    officialSource: 'Microsoft Learn (Server 2019 GVLK)',
  },
  {
    key: 'WVDHN-86M79-2MDFR-348B4-B448M',
    product: 'Windows Server 2019',
    edition: 'Essentials',
    channel: 'Volume (GVLK/KMS)',
    family: 'Windows Server',
    officialSource: 'Microsoft Learn (Server 2019 GVLK)',
  },

  // --- Windows Server 2016 ---
  {
    key: 'WC2BQ-8NRM3-FDDYY-2BFGV-KHKQY',
    product: 'Windows Server 2016',
    edition: 'Standard',
    channel: 'Volume (GVLK/KMS)',
    family: 'Windows Server',
    officialSource: 'Microsoft Learn (Server 2016 GVLK)',
  },
  {
    key: 'CB7KF-BWN39-YR8TR-QKJW3-VY77V',
    product: 'Windows Server 2016',
    edition: 'Datacenter',
    channel: 'Volume (GVLK/KMS)',
    family: 'Windows Server',
    officialSource: 'Microsoft Learn (Server 2016 GVLK)',
  },

  // --- Office LTSC 2024 ---
  {
    key: '2T8TR-NVVBB-VW3P3-TJ9G2-B9GJR',
    product: 'Microsoft Office LTSC 2024',
    edition: 'Professional Plus',
    channel: 'Volume (GVLK/KMS)',
    family: 'Office',
    officialSource: 'Microsoft Learn (Office 2024 GVLK)',
  },
  {
    key: 'SH9ND-F8JHQ-78VBG-H8P2H-7D68H',
    product: 'Microsoft Office LTSC 2024',
    edition: 'Standard',
    channel: 'Volume (GVLK/KMS)',
    family: 'Office',
    officialSource: 'Microsoft Learn (Office 2024 GVLK)',
  },

  // --- Office LTSC 2021 ---
  {
    key: 'FXYTK-NJJ8C-GB6DW-3DYQT-6F7TH',
    product: 'Microsoft Office LTSC 2021',
    edition: 'Professional Plus',
    channel: 'Volume (GVLK/KMS)',
    family: 'Office',
    officialSource: 'Microsoft Learn (Office 2021 GVLK)',
  },
  {
    key: 'KDX7X-BNVR8-TXXGX-4Q7Y8-78VT3',
    product: 'Microsoft Office LTSC 2021',
    edition: 'Standard',
    channel: 'Volume (GVLK/KMS)',
    family: 'Office',
    officialSource: 'Microsoft Learn (Office 2021 GVLK)',
  },

  // --- Office 2019 ---
  {
    key: 'NMMKJ-6RK4F-KMJVX-8D9MJ-6MWKP',
    product: 'Microsoft Office 2019',
    edition: 'Professional Plus',
    channel: 'Volume (GVLK/KMS)',
    family: 'Office',
    officialSource: 'Microsoft Learn (Office 2019 GVLK)',
  },
  {
    key: '6NWWJ-YQWMR-QKGCB-6TMB3-9D9HK',
    product: 'Microsoft Office 2019',
    edition: 'Standard',
    channel: 'Volume (GVLK/KMS)',
    family: 'Office',
    officialSource: 'Microsoft Learn (Office 2019 GVLK)',
  },

  // --- Office 2016 ---
  {
    key: 'XQNVK-8JYDB-WJ9W3-YJ8YR-WFG99',
    product: 'Microsoft Office 2016',
    edition: 'Professional Plus',
    channel: 'Volume (GVLK/KMS)',
    family: 'Office',
    officialSource: 'Microsoft Learn (Office 2016 GVLK)',
  },
  {
    key: 'JNRGM-WHDWX-FJJG3-K47QV-DRTFM',
    product: 'Microsoft Office 2016',
    edition: 'Standard',
    channel: 'Volume (GVLK/KMS)',
    family: 'Office',
    officialSource: 'Microsoft Learn (Office 2016 GVLK)',
  },

  // --- Project & Visio ---
  {
    key: 'DFN4Y-J2442-9PBCH-3729G-M3P2X',
    product: 'Visio LTSC 2024',
    edition: 'Professional',
    channel: 'Volume (GVLK/KMS)',
    family: 'Office',
    officialSource: 'Microsoft Learn (Visio 2024 GVLK)',
  },
  {
    key: 'WQQ4N-DF36T-6M7K6-F2W98-BFRD2',
    product: 'Project LTSC 2024',
    edition: 'Professional',
    channel: 'Volume (GVLK/KMS)',
    family: 'Office',
    officialSource: 'Microsoft Learn (Project 2024 GVLK)',
  },
];

/**
 * Searches the official Microsoft GVLK registry for an exact match.
 */
export function lookupGVLK(rawKey: string): GVLKDefinition | undefined {
  const normalized = normalizeProductKey(rawKey);
  return GVLK_DATABASE.find(item => item.key === normalized);
}
