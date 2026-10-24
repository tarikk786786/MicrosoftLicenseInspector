# Design System — Microsoft License Inspector

## 1. Visual Direction & Brand Voice
The visual language of **Microsoft License Inspector** is grounded in precision IT infrastructure: clean, authoritative, technical, and dependable. It combines principles of Microsoft Fluent Design 2 with high-density data analytics.

- **Mood**: Precise, enterprise-grade, secure, transparent.
- **Surface**: Deep midnight obsidian with subtle borders, glass headers, and distinct status indicators.

## 2. Color Palette (Exact HEX)

### Primary & Brand Colors
- **Brand Windows Blue**: `#0078D4` (Primary actions, Windows identifiers)
- **Brand Office Green**: `#107C41` (Microsoft Office badges, Excel/365 markers)
- **Brand Azure Accent**: `#0284C7` (Interactive highlights, focus rings)
- **Brand Violet Focus**: `#6366F1` (Diagnostic probes, agent status)

### Neutral Backgrounds & Surfaces (Dark Mode Primary)
- **App Background**: `#0A0E17` (Deep slate black)
- **Surface Card**: `#111827` (Card panels, table containers)
- **Surface Card Elevated**: `#1E293B` (Modals, popovers, active tabs)
- **Surface Input / Well**: `#0B0F19` (Input textareas, code blocks)
- **Border Default**: `#273549` (Subtle boundary borders)
- **Border Active / Focused**: `#3B82F6` (Focus indicator)

### Text & Typography Colors
- **Text Primary**: `#F8FAFC` (High contrast headers and values)
- **Text Secondary**: `#94A3B8` (Labels, captions, helper text)
- **Text Muted**: `#64748B` (Inactive states, placeholders, timestamps)

### Status & Diagnostic Badges
| Status Code | Background | Text Color | Border | Meaning |
|---|---|---|---|---|
| `FORMAT_VALID` | `#064E3B` | `#34D399` | `#059669` | Valid 5x5 Base-24 Structure |
| `FORMAT_INVALID` | `#450A0A` | `#F87171` | `#DC2626` | Structure / Character Error |
| `ACTIVATED_ON_THIS_DEVICE` | `#065F46` | `#6EE7B7` | `#10B981` | Fully Licensed on Host |
| `NOT_ACTIVATED` | `#7C2D12` | `#FDBA74` | `#EA580C` | Installed but Unlicensed |
| `ENTITLEMENT_CONFIRMED` | `#1E3A8A` | `#93C5FD` | `#3B82F6` | Official Entitlement Verified |
| `ACTIVATION_ERROR` | `#7F1D1D` | `#FCA5A5` | `#EF4444` | slmgr/ospp Error Code Raised |
| `EXPIRED` | `#78350F` | `#FCD34D` | `#F59E0B` | Grace Period Expired |
| `BLOCKED_OR_REVOKED` | `#4C0519` | `#FDA4AF` | `#E11D48` | Explicitly Revoked |
| `ALREADY_IN_USE` | `#581C87` | `#D8B4FE` | `#A855F7` | Max Activation Limit Reached |
| `UNKNOWN` | `#1E293B` | `#94A3B8` | `#475569` | Unverified Uninstalled Key |

## 3. Typography Scale
- **Display / Headers**: System Sans (`Inter`, `Segoe UI Variable`, `Segoe UI`, `-apple-system`, `sans-serif`)
  - `H1`: 28px (Bold, 700), Line Height 34px
  - `H2`: 22px (Semi-Bold, 600), Line Height 28px
  - `H3`: 18px (Semi-Bold, 600), Line Height 24px
- **Body / Content**:
  - `Body Regular`: 14px (Regular, 400), Line Height 20px
  - `Body Medium`: 14px (Medium, 500), Line Height 20px
  - `Caption / Meta`: 12px (Regular, 400), Line Height 16px
- **Code & Product Keys**: Monospace (`Cascadia Code`, `Consolas`, `Menlo`, `monospace`)
  - `Key Display`: 13px (Medium, 500), Letter Spacing: 1px (Monospaced alignment)

## 4. Spacing & Grid System
- Standard base grid: 4px / 8px scale.
- Padding:
  - Button: `px-4 py-2` (8px x 16px)
  - Card: `p-5` (20px)
  - Table Cell: `px-4 py-3`
  - Gap: `gap-3` (12px), `gap-4` (16px), `gap-6` (24px)
- Border Radius:
  - Input & Button: `rounded-lg` (8px)
  - Card & Container: `rounded-xl` (12px)
  - Status Pill: `rounded-full` (9999px)

## 5. Component States & Interactions
- **Key Masking Toggle**: An eye icon beside each key allows temporary unmasking with a 10-second automatic re-mask timer.
- **Progress & Activity Bars**: Subtle glowing pulse animation while diagnostics run.
- **Empty State**: Explanatory illustration with quick sample key buttons ("Load Synthetic GVLK Test Keys", "Load Mixed Test Set").
- **Table Density**: High-density table with sticky headers, horizontal scrolling for deep evidence columns, and row expanders for detailed diagnostic traces.

## 6. Accessibility (A11y)
- WCAG AA contrast ratio (> 4.5:1) for all text and badges.
- Screen reader labels (`aria-label`) on all icon-only buttons (copy, toggle mask, export).
- Keyboard navigable tabs and modals.
- Focus outlines in high-contrast cyan (`outline-2 outline-offset-2 outline-sky-500`).
