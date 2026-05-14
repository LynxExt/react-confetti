# react-confetti 🎉

> A tiny, customizable canvas confetti component for React. Built for celebrations, achievements, and special moments, without bloating your bundle.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Bundle size](https://img.shields.io/badge/gzipped-1.35%20kB-brightgreen.svg)
![Types](https://img.shields.io/badge/types-included-blue.svg)

## ✨ Why this one?

There are plenty of confetti libraries out there. This one is for you if you care about:

- **Bundle size**: 1.35 kB gzipped, less than half of comparable libraries.
- **Zero dependencies**: only `react` as a peer.
- **Modern stack**: TypeScript, ESM + CJS, tree-shakeable, side-effect free.
- **Tiny API surface**: one component, two modes, all props optional.

## 📦 Install

```bash
bun add @lynxext/react-confetti
# or
npm install @lynxext/react-confetti
# or
pnpm add @lynxext/react-confetti
```

## 🚀 Quick start

```tsx
import Confetti from "@lynxext/react-confetti";

function App() {
  return (
    <>
      <h1>You did it!</h1>
      <Confetti />
    </>
  );
}
```

That's it. The component renders a full-viewport absolutely-positioned canvas (with `pointer-events: none`), fires one burst, and tears itself down when all particles fade.

## 🎨 Two modes

### `boom`: explosion at a point

The default. One or more bursts of particles flying outward from a single point, settling under gravity.

```tsx
<Confetti mode="boom" x={0.5} y={0.5} particleCount={80} />
```

### `fall`: continuous rain

Particles spawn at random positions above the viewport and drift down. Runs forever (or until unmounted).

```tsx
<Confetti mode="fall" particleCount={150} />
```

## 🔧 Props

All props are optional. The discriminating `mode` prop changes which other props apply.

### Common

| Name            | Type                 | Default                                        | Description                             |
|-----------------|----------------------|------------------------------------------------|-----------------------------------------|
| `mode`          | `"boom"` \| `"fall"` | `"boom"`                                       | Animation style.                        |
| `particleCount` | `number`             | `30`                                           | Particles emitted per burst.            |
| `shapeSize`     | `number`             | `12`                                           | Pixel size of each particle.            |
| `colors`        | `string[]`           | `["#ff577f", "#ff884b", "#ffd384", "#fff9b0"]` | Hex color palette to sample from.       |
| `className`     | `string`             | _none_                                         | Forwarded to the underlying `<canvas>`. |
| `style`         | `CSSProperties`      | _none_                                         | Merged with the default canvas style.   |

### Boom-only

| Name                     | Type     | Default | Description                                               |
|--------------------------|----------|---------|-----------------------------------------------------------|
| `x`                      | `number` | `0.5`   | Horizontal origin as a ratio of viewport width (0 to 1).  |
| `y`                      | `number` | `0.5`   | Vertical origin as a ratio of viewport height (0 to 1).   |
| `deg`                    | `number` | `270`   | Center angle in degrees (270 = up).                       |
| `spreadDeg`              | `number` | `30`    | Half-angle of the spread cone around `deg`.               |
| `launchSpeed`            | `number` | `1`     | Multiplier on the initial velocity.                       |
| `effectInterval`         | `number` | `3000`  | Milliseconds between consecutive bursts.                  |
| `effectCount`            | `number` | `1`     | How many bursts to fire before the animation stops.       |
| `opacityDeltaMultiplier` | `number` | `1`     | Multiplier on how quickly particles fade out (`min 0.1`). |

### Fall-only

| Name            | Type     | Default | Description                                                |
|-----------------|----------|---------|------------------------------------------------------------|
| `fadeOutHeight` | `number` | `0.8`   | Height ratio (0 to 1) at which particles have fully faded. |

## 🧪 Examples

**A celebration burst on click:**

```tsx
const [fire, setFire] = useState(0);

return (
  <>
    <button onClick={() => setFire((n) => n + 1)}>Celebrate</button>
    {fire > 0 && <Confetti key={fire} particleCount={80} />}
  </>
);
```

The `key` ensures each click remounts the component for a fresh burst.

**A rainbow rain while a banner is visible:**

```tsx
{showBanner && (
  <Confetti mode="fall" particleCount={150} colors={["#ff595e", "#ffca3a", "#8ac926", "#1982c4", "#6a4c93"]} />
)}
```

**A corner cannon:**

```tsx
<Confetti x={0.1} y={0.9} deg={315} spreadDeg={45} particleCount={60} launchSpeed={2} />
```

## 🧰 Local development

Clone the repo, then:

```bash
bun install
bun run example       # boots the demo app at http://localhost:5173
bun run build         # builds dist/ via bunup
bun run typecheck
bun run size          # prints gzipped bundle size
```

The demo lives in `example/` and renders against the local `src/`, useful for iterating on the component.

## 📏 Bundle size

| Library                          | Raw min | Gzipped |
|----------------------------------|--------:|--------:|
| **react-confetti** (this)        | 2,564 B | 1,384 B |
| react-confetti-boom (competitor) | 4,606 B | 2,062 B |

Measured by running both bundles through `esbuild --minify` with `react` externalized.

## 📜 License

MIT.
