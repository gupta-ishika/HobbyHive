# Design System & UI Specifications — HobbyHive

## 1. Visual Theme & Philosophy
- **Aesthetic:** Warm Editorial, Earthy Minimalist, Craft-focused, Tactile & Organic.
- **Tone:** Inviting, grounded, structured, and modern.

---

## 2. Color Palette & Design Tokens

| Token | Hex | Role / Usage |
|---|---|---|
| `--color-background` | `#F5F3ED` | Primary page background (warm neutral canvas) |
| `--color-surface` | `#FFFFFF` | Card backgrounds, modals, input containers |
| `--color-text` | `#272822` | High-contrast primary body text & headings |
| `--color-primary` | `#4F5148` | Primary brand action color (deep earthy olive) |
| `--color-secondary` | `#DCE4E6` | Soft slate accent, subtle pill highlights |
| `--color-accent` | `#E8DCDC` | Warm blush accent, active state backgrounds |
| `--color-muted` | `#6B6E5F` | Subtext, timestamps, secondary labels |
| `--color-border` | `#EAE8E3` | Standard hairline dividers & subtle card borders |
| `--color-border-strong` | `#DDDBD6` | Focused states & active boundaries |

---

## 3. Typography

- **Headline Font:** `Manrope, sans-serif` (letter-spacing: -0.02em, tight, bold display)
- **Body Font:** `"Work Sans", sans-serif` (legible, warm, clean neutral)
- **Icons:** Google `Material Symbols Outlined`

---

## 4. Components & Elevation

### 4.1 Cards & Containers
- Border Radius: `rounded-2xl` (16px) or `rounded-3xl` (24px) for prominent containers.
- Borders: `1px solid var(--color-border)`
- Elevation: Crisp hover-lift with subtle shadow `0 8px 24px rgba(39, 40, 34, 0.06)`.

### 4.2 Buttons
- **Primary:** `bg-primary text-background rounded-full px-6 py-2.5 font-semibold hover:bg-[#3E403A]`
- **Secondary:** `bg-surface border border-border text-text rounded-full px-5 py-2 hover:bg-secondary/40`
- **Destructive / Danger:** `bg-red-50 text-red-600 border border-red-200 rounded-full hover:bg-red-100`

---

## 5. UI States & Standards
- **Loading:** Subtle shimmer skeleton using `.skeleton` animation.
- **Empty States:** Clean illustration or Material Symbol icon, concise explanation, and an actionable CTA button.
- **Error States:** Descriptive inline banner with retry action.
- **Accessibility:** Visible focus ring on all interactive elements (`outline: 2px solid #4F5148; outline-offset: 2px`).
