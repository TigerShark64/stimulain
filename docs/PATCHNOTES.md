# Changelog - Stimulain Artist Portal

All notable changes to the Stimulain Artist Portal will be documented in this file. This project adheres to Semantic Versioning (MAJOR.MINOR.PATCH).

---

## [0.1.1] - 2026-07-09

### Added
*   Created `/docs` directory inside the project root for centralized documentation.
*   Created `/docs/PRD.md` containing detailed product requirements, target personas, product tenets, metrics, runbooks, technical specifications, and FAQs.
*   Created `/docs/DESIGN.md` mapping design tokens, color palette, typography systems, breakpoints, and component styling patterns.
*   Created `/docs/PATCHNOTES.md` to track historical version releases and updates.
*   Created root `README.md` to provide developers with instant setup, local server execution protocols, and deployment commands.

### Changed
*   Consolidated separate subdirectory README documentation (`artwork/README.md` and `music/README.md`) directly into the unified `/docs/PRD.md` under the "Consolidated Subdirectory README Contents" section.

### Removed
*   Deleted the redundant `artwork/README.md` file from the artwork assets folder.
*   Deleted the redundant `music/README.md` file from the music assets folder.

---

## [0.1.0] - 2026-07-08

### Added
*   Implemented custom Web Audio API player controller with support for local audio track indexing and playlist navigation.
*   Programmed a circular canvas-based visualizer (`vortex-canvas`) mapping frequency bands to radiating visualizers and oscilloscope wave rings.
*   Programmed a local simulated visualizer wave generator to bypass CORS constraints when files are executed via the `file://` protocol.
*   Implemented a backup electronic MIDI Synthesizer engine utilizing Web Audio `OscillatorNode` waves to generate rhythmic kicks and prevent script failures when local MP3 resources fail to stream.
*   Added CSS variables and styling classes in `style.css` to build a dark cybernetic glassmorphic branding card.
*   Embedded SoundCloud remix iframe widgets and Mixcloud extended sets mini widgets inside a responsive grids container.
*   Injected social media connection profiles and email booking linkages.
