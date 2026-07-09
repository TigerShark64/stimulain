# Stimulain Official Artist Portal

A cybernetic, dark-themed static artist portal featuring an advanced custom audio player, reactive HTML5 canvas visualizer, backup MIDI synthesizer engine, and third-party media embeds.

## Live Site
*   **Production URL**: Currently deployed locally. Ready for deployment to [GitHub Pages](https://stimulain.github.io).

## Technical Stack
*   **Structure**: HTML5 (Semantic DOM structure, Canvas 2D API)
*   **Styles**: CSS3 (Vanilla design tokens, Grid, Flexbox layouts, keyframe animation loops)
*   **Logic**: JavaScript (ES6+, Web Audio API context, analyser nodes, synth oscillators)
*   **Widget Integrations**: SoundCloud Player Widget API, Mixcloud Widget API

## Prerequisites
*   **Node.js**: Version 18.0.0 or higher (required for local development server utility)
*   **Package Manager**: `npm` (v9+) or `npx` (pre-bundled with Node)
*   **Environment**: Modern web browser with Web Audio API and HTML5 Canvas support (Chrome, Safari, Firefox, Edge)

## Installation Steps
Clone this repository to your local directory:
```bash
git clone https://github.com/stimulain/stimulain.git
cd stimulain
```

## Running Locally
To bypass modern web browser Cross-Origin Resource Sharing (CORS) security restrictions, which prevent the custom audio player's `MediaElementSource` from reading raw byte streams via the `file://` protocol, serve the project using a local HTTP server:

```bash
# Serve the directory on port 8080 using npx
npx http-server -p 8080
```
Open your browser and navigate to: `http://localhost:8080`

*Note: If run directly from the local directory via `file://index.html`, the custom player will activate simulated visualizer waves and display a warning banner.*

## Environment Variables
This project runs entirely client-side. **No environment variables are required or consumed** by the frontend.

## Build and Deploy

### Build
This project utilizes native static web technologies and **requires no build compiling, transpiling, or bundling steps**. The source files in the root folder are served directly.

### Deploy
To deploy the portal to GitHub Pages:
1.  Initialize a Git repository and commit your files:
    ```bash
    git init
    git add .
    git commit -m "Initial commit - Release v0.1.1"
    ```
2.  Add your remote repository and push to the primary branch:
    ```bash
    git remote add origin https://github.com/stimulain/stimulain.git
    git branch -M main
    git push -u origin main
    ```
3.  Configure GitHub Pages on your repository settings pointing to the `/root` directory of the `main` branch.

## Project Documentation
Detailed specifications and guidelines are located in the `/docs` folder:
*   [Product Requirements Document (PRD)](file:///c:/Users/equin/OneDrive/Documents/Antigravity%20Dark%20Matter%20Projects/projects/stimulain/docs/PRD.md) - Features, roadmap, runbooks, metrics, technical requirements, and FAQ.
*   [Design Guidelines (DESIGN)](file:///c:/Users/equin/OneDrive/Documents/Antigravity%20Dark%20Matter%20Projects/projects/stimulain/docs/DESIGN.md) - Custom styling system tokens, typography scale, component blueprints, and breakpoints.
*   [Changelog (PATCHNOTES)](file:///c:/Users/equin/OneDrive/Documents/Antigravity%20Dark%20Matter%20Projects/projects/stimulain/docs/PATCHNOTES.md) - Historical version changelog and update logs.
