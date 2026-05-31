# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
npm run dev          # Vite dev server on port 5500, CORS enabled for HA cross-origin
npm run build        # Type-check (vue-tsc -b) then build library (vite build)
npm run preview      # Preview production build
npx vue-tsc --noEmit # Type-check only (faster than full build)
```

## Architecture

This is a **Home Assistant custom card** built as a Vue 3 library. It produces a single ES module (`dist/room-elves-card.es.js`) that HA loads as a custom element.

### Dual Entry Points

- **`src/main.ts`** — dev-only entry. Creates a full Vue app mounting `App.vue` to `#app` for local development/demo.
- **`src/custom-elements.ts`** — production entry. Uses Vue's `defineCustomElement` to register `<my-room-elves-card>` as a Web Component. The `RoomElvesHACard` class bridges HA's `setConfig(hassConfig)` lifecycle into Vue's reactive `config` prop, and registers the card with HA's card picker (type: `room-elves-card`).

When working on card logic, the real runtime path is `custom-elements.ts` → `RoomElvesCard.vue` → `HeadMode.vue` → individual entity/interactive/chart cards. `App.vue` is only for visual demos during development.

### Component Registry (`src/common/card-registry.ts`)

Central mapping from string type names to Vue component objects. Every card component is registered once under both a **short name** (for HeadMode YAML config: `light`, `chart_line`) and a **tag name** (for FreeLayoutPopup: `entity-light`, `chart-line`).

- `getCardComponent(type)` — lookup by short name, used by HeadMode
- `resolveCardComponent(tag)` — lookup by tag name, used by FreeLayoutPopup
- `mapButtonProps(btn)` — converts snake_case config keys (e.g., `on_color`) to camelCase component props (e.g., `onColor`)

**Important:** Do NOT re-introduce a circular import — `card-registry.ts` must not import any component that itself imports from `card-registry.ts` (HeadMode, FreeLayoutPopup). Currently clean.

### Component Categories

| Directory | Purpose |
|---|---|
| `src/components/entity/` | Entity display: Light, Switch, Sensor, Curtain, Media, Device |
| `src/components/climate/` | Climate: ClimateCard, HeaterCard |
| `src/components/interactive/` | Interactive: ButtonGroup, UserCard, SceneMode, Timeline, Slider, Select, Text, Html, Number |
| `src/components/chart/` | ECharts-based charts: Line, Bar, Pie, Mixed, Sankey, Calendar, Gauge, Metric, OverviewBar |
| `src/components/layout/` | Layout containers: HeadMode (grid layout), PopupOverlay, DynamicIcon |
| `src/components/popup/` | Control popups opened via more-info: Light, Device, Curtain, AC, Media, etc., plus FreeLayoutPopup (arbitrary card grid) |

### Data Flow

1. HA calls `card.setConfig(config)` → `RoomElvesCard.setConfig()` deep-clones config into `localConfig` ref
2. `RoomElvesCard` passes `hass` and `buttons`/`columns`/`theme` props to `HeadMode`
3. `HeadMode` iterates `buttons[]`, resolves each `btn.type` via `getCardComponent()`, renders as dynamic `<component :is="...">`
4. Each leaf component receives `hass` plus its own mapped props — it reads entity state directly from `hass.states[entityId]`

### Key Points for Entity State

- Entity cards read state reactively from `hass.states[entityId]` — no separate data fetching
- `isEntityOn()` (in `common/hass.ts`) checks `state.state === 'on'` for common binary domains
- `tap-action.ts` handles click routing: toggle, call-service, navigate, url, more-info (dispatches `hass-more-info` custom event)

### Home Assistant Integration

- Build output: `dist/room-elves-card.es.js` (fixed filename, no hash)
- HA resource URL: `/local/room-elves-card.es.js` (type: module)
- Card type in YAML: `custom:my-room-elves-card`
- Example YAML config in `example-ha-config.yaml`
