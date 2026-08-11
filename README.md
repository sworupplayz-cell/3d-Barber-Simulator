# 3D Barber Simulator

## Phase 0 — Clean Project Foundation

A minimal Vite + Three.js foundation for a stylized, mobile-first first-person 3D simulator. The current screen is a renderer validation scene only; it intentionally contains no gameplay or final environment.

### Development

```bash
npm install
npm run dev
npm run build
```

### Structure

- `src/main.js` — clean application and test-scene entry point
- `src/core/renderer.js` — mobile-conscious renderer and viewport configuration
- `src/assets/materials.js` — shared low-poly palette/material factory
- `src/styles.css` — responsive presentation layer
