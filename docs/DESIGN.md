# Design System & UI/UX Guidelines - Stimulain Artist Portal

This document outlines the design philosophy, visual assets, styling tokens, responsive breakpoints, component patterns, and motion guidelines for the Stimulain Artist Portal.

---

## 1. Design Philosophy
The Stimulain Artist Portal utilizes a **Cybernetic Dark / Dark Glassmorphism** design theme. The aesthetic mimics a futuristic hardware synthesizer or terminal screen, blending deep космический space backgrounds, neon glowing indicators (Cyan and Magenta), glass-like elements with high-blur backdrops, and interactive canvas components. The UX is designed to be highly focused, immersive, and responsive, emphasizing clean margins and immediate visual feedback.

---

## 2. Color Palette
Every color in the interface is defined by custom CSS properties to ensure consistency and speed during customization:

| Token | Hex / RGBA Value | Intended Visual Use |
| :--- | :--- | :--- |
| `--bg-dark` | `#04050a` | Absolute dark backdrop of the entire page and dark button containers. |
| `--bg-card` | `rgba(8, 10, 24, 0.65)` | Translucent card backdrop utilizing `backdrop-filter: blur(16px)` to create a frosted glass effect. |
| `--border-color` | `rgba(99, 102, 241, 0.2)` | Indigo-tinted border for layout separation, grid boxes, and buttons. |
| `--border-color-hover` | `rgba(217, 70, 239, 0.45)` | Magenta-tinted border that glows on hovering over grid boxes and elements. |
| `--color-cyan` | `#06b6d4` | Primary brand accent. Used for text links, subtitles, interactive volume slider accent, visualizer oscilloscope path, and button hover highlights. |
| `--color-indigo` | `#6366f1` | Brand base color. Used for progress bar gradient starting points, primary button glow layers, and background radial nebula effects. |
| `--color-magenta` | `#d946ef` | Secondary brand accent. Used for progress bar gradient endpoints, custom visualizer bars, active track indicators, and hover button highlights. |
| `--color-text` | `#f8fafc` | Primary body text (high readability, off-white). |
| `--color-text-secondary`| `#94a3b8` | Secondary content text (slate grey), icons, and inactive links. |
| `--color-text-muted` | `#475569` | Muted descriptions, footer copyright text, and playlist section headers. |

---

## 3. Typography
The portal imports the custom fonts `Outfit` and `Orbitron` from Google Fonts:
*   `font-family: 'Outfit', sans-serif;` (Body text, buttons, sliders)
*   `font-family: 'Orbitron', monospace;` (Display titles, logos, timers)

### Typography Hierarchy

| Role | Font Family | Size | Weight | Line Height | Case & Spacing |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Artist Logo** | `Orbitron` | `4.5rem` (72px) | 900 | 1 | Uppercase, `0.25em` tracking |
| **Subtext / Bio** | `Outfit` | `1rem` (16px) | 400 | 1.4 | Uppercase, `0.15em` tracking |
| **Section Title** | `Orbitron` | `0.9rem - 1rem` | 500+ | 1.2 | Uppercase, `0.1em` tracking |
| **Track Title** | `Orbitron` | `1.2rem` (19.2px) | 700 | 1.2 | Regular, `0.02em` tracking |
| **Track Artist** | `Outfit` | `0.85rem` (13.6px) | 400 | 1.2 | Uppercase, `0.1em` tracking |
| **Playlist Heading**| `Orbitron` | `0.8rem` (12.8px) | 500 | 1.2 | Uppercase, `0.1em` tracking |
| **Body / Copy** | `Outfit` | `0.88rem` (14px) | 400 | 1.4 | Regular, normal tracking |
| **Time & Counters** | `monospace` | `0.8rem` (12.8px) | 400 | 1.2 | Fixed width spacing |

---

## 4. Spacing System
All margins, paddings, and flex/grid gaps follow a standardized scale based on **4px base units** (`0.25rem` multiplier):

*   `4px` (`0.25rem`): Fine detail adjustments (e.g. padding adjustments for slider track buttons).
*   `8px` (`0.5rem`): Input spacing, button gaps.
*   `10px - 12px` (`0.625rem - 0.75rem`): Alert notifications and playlist items.
*   `16px` (`1rem`): Subtitle bottom margins, card body paddings on mobile, soundcloud widget margins.
*   `20px` (`1.25rem`): Media grid gaps, inner sections spacing.
*   `24px` (`1.5rem`): Main card gaps, volume adjuster row padding, playlist heights.
*   `32px` (`2rem`): Outer container gutters, custom player sections padding.
*   `48px` (`3rem`): Main artist card desktop padding, header bottom border margins.
*   `56px` (`3.5rem`): Main grid card divisions.

---

## 5. Breakpoints & Responsiveness
The layout adapts seamlessly to three primary layout stages:

### Desktop (Above 850px)
*   Full 2-column media grid for SoundCloud and Mixcloud widgets.
*   Custom player maps side-by-side: left column houses track meta and play buttons (1.8fr width), right column houses list frequencies (1fr width).

### Tablet (800px - 850px)
*   `@media (max-width: 850px)`: Media grid switches to a 1-column stack.
*   `@media (max-width: 800px)`: Custom player collapses to 1 column. The playlist divider (`border-left`) is removed and replaced by a top horizontal divider (`border-top`) with `1.5rem` padding-top.

### Mobile (Below 600px)
*   `@media (max-width: 600px)`:
    *   The artist branding logo (`STIMULAIN`) shrinks from `4.5rem` to `3rem` to prevent text-wrapping on small screens.
    *   Outer artist card padding shrinks from `3rem` to `1.5rem` to maximize screen real estate.
    *   Social buttons shrink to fit tight horizontal rows.

---

## 6. Component Patterns

### 1. The Glassmorphic Card (`.artist-card`)
*   **Structure**: Container wrapping all portal features.
*   **Visuals**: Translucent blue background (`rgba(8, 10, 24, 0.65)`), standard border (`1px solid rgba(99, 102, 241, 0.2)`), blur overlay (`backdrop-filter: blur(16px)`), deep shadow.

### 2. Social Links / Buttons (`.social-btn`)
*   **Structure**: Rounded anchor links (`<a>`).
*   **Visuals**: Deep background (`#04050a`), standard borders, `30px` border-radius. On hover, text color brightens, border shifts to `--color-magenta`, and drops a neon shadow (`rgba(217, 70, 239, 0.35)`).

### 3. Media Grid Item (`.media-box-compact`)
*   **Structure**: Translucent containers for embedded iframes.
*   **Visuals**: Subtly transparent backings. On hover, borders transition to `--border-color-hover` and expand a subtle hover shadow.

### 4. Player Controls (`.player-btn`, `.play-btn-main`)
*   **Regular buttons**: Standard transparent backings. Color shifts to Cyan with a drop-shadow glow on hover.
*   **Play button**: Gradient background (`--color-indigo` to `--color-magenta`). Scales up on hover (`transform: scale(1.05)`) and shifts its shadow to a heavy neon glow.

---

## 7. Accessibility Standards
The portal implements the following standards targeting **WCAG 2.1 Level AA**:

*   **Color Contrast**: All core readable text elements (slate grey and white) retain a contrast ratio above 4.5:1 against the deep dark background.
*   **Interactive Target Size**: Clickable controls (play/pause, track selection, links) have target heights and widths of at least `44px` or contain sufficient margins to prevent accidental touch errors.
*   **Accessibility Labels**: Keyboard and screen reader devices have clear indicators. Icon-only buttons utilize explicit HTML `title` attributes (e.g. `title="Play / Pause"`, `title="Previous Track"`).
*   **Focus Ring Indicators**: Interactive links support outlines indicating keyboard tab highlights.

---

## 8. Animation & Motion
Motion is reserved to enhance the sonic cybernetic feel of the site and should never distract or cause performance lag.

*   **Continuous Spin (`spin-vortex`)**: The background album artwork ring rotates continuously using a `linear` easing curve. Complete cycle takes 40 seconds. At the 50% mark, the artwork scales up by 1.1x to simulate a breathing visualizer.
*   **Vortex Visibility Transition**: The canvas visualizer container fades in and out smoothly using an opacity transition: `transition: opacity 2s cubic-bezier(0.16, 1, 0.3, 1)`. Activating play fades the background opacity to `0.55`.
*   **Interactive Transitions**: Hover states use a high-performance easing curve to prevent jarring shifts:
    ```css
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    ```

---

## 9. AI Developer Instructions
When creating new components or writing scripts for this portal, follow these design constraints:
1.  **Keep it Dark and Translucent**: Do not write components with opaque white backdrops or borders. Always use transparency and glassmorphism.
2.  **Use Gradients**: Maintain the core color direction by utilizing CSS linear gradients (`linear-gradient(135deg, ...)`) combining Indigo (`#6366f1`), Magenta (`#d946ef`), and Cyan (`#06b6d4`).
3.  **Strictly Monospace Displays**: Any numerical data, time trackers, frequency indicators, or title codes must use Orbitron or system monospace fonts.
4.  **No Rigid Scaling**: Always test layouts inside mobile margins (< 400px). Let elements stack vertically rather than shrinking below readable thresholds.
