---
description: Use Bun instead of Node.js, npm, pnpm, or vite.
globs: "*.ts, *.tsx, *.html, *.css, *.js, *.jsx, package.json"
alwaysApply: false
---

Default Bun over Node.js.

- `bun <file>` not `node <file>` or `ts-node <file>`
- `bun test` not `jest` or `vitest`
- `bun build <file.html|file.ts|file.css>` not `webpack` or `esbuild`
- `bun install` not `npm install` or `yarn install` or `pnpm install`
- `bun run <script>` not `npm run <script>` or `yarn run <script>` or `pnpm run <script>`
- `bunx <package> <command>` not `npx <package> <command>`
- Bun auto-loads .env. No dotenv.

## APIs

- `Bun.serve()` — WebSockets, HTTPS, routes. No `express`.
- `bun:sqlite` for SQLite. No `better-sqlite3`.
- `Bun.redis` for Redis. No `ioredis`.
- `Bun.sql` for Postgres. No `pg` or `postgres.js`.
- `WebSocket` built-in. No `ws`.
- `Bun.file` over `node:fs` readFile/writeFile
- Bun.$`ls` not execa.

## Testing

Run tests: `bun test`.

```ts#index.test.ts
import { test, expect } from "bun:test";

test("hello world", () => {
  expect(1).toBe(1);
});
```

## Frontend

HTML imports with `Bun.serve()`. No `vite`. Full React, CSS, Tailwind support.

Server:

```ts#index.ts
import index from "./index.html"

Bun.serve({
  routes: {
    "/": index,
    "/api/users/:id": {
      GET: (req) => {
        return new Response(JSON.stringify({ id: req.params.id }));
      },
    },
  },
  // optional websocket support
  websocket: {
    open: (ws) => {
      ws.send("Hello, world!");
    },
    message: (ws, message) => {
      ws.send(message);
    },
    close: (ws) => {
      // handle close
    }
  },
  development: {
    hmr: true,
    console: true,
  }
})
```

HTML files import .tsx, .jsx, .js directly — Bun transpiles + bundles auto. `<link>` tags point to stylesheets, Bun CSS bundler handles.

```html#index.html
<html>
  <body>
    <h1>Hello, world!</h1>
    <script type="module" src="./frontend.tsx"></script>
  </body>
</html>
```

With `frontend.tsx`:

```tsx#frontend.tsx
import React from "react";
import { createRoot } from "react-dom/client";

// import .css files directly and it works
import './index.css';

const root = createRoot(document.body);

export default function Frontend() {
  return <h1>Hello, world!</h1>;
}

root.render(<Frontend />);
```

Run:

```sh
bun --hot ./index.ts
```

More info: Bun API docs in `node_modules/bun-types/docs/**.mdx`.

## Component Structure

```
src/components/
  component-name/
    component-name.tsx         # component implementation
    component-name.types.ts    # props, types, tv definitions
    component-name.stories.tsx # storybook stories
    component-name.mdx         # storybook docs
    variants/                  # optional, for variant sub-components
      variant-name.tsx
```

- Each component own folder — co-located types, stories, docs
- Types file exports all public types (props interfaces, variant types, tv defs)
- Variant sub-components import shared types from parent types file

## Storybook

### Stories

- `fn()` from `storybook/test` for all callback props — never bare `() => {}`
- Hoist shared args (like `onClick: fn()`) to meta `args`, not per story
- One story per meaningful state (variant, size, disabled, loading, with icon, etc.)
- `render` for composite/showcase stories (e.g. AllVariants grid)

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn, expect } from 'storybook/test';
import Button from './button';

const meta = {
  component: Button,
  args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { label: 'Button', variant: 'primary' },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button'));
    await expect(args.onClick).toHaveBeenCalled();
  },
};
```

### Tests (play functions)

- Add `play` to stories with testable behavior (clicks, disabled states, content presence)
- Skip play for visual-only stories (variant/size without interaction)
- `canvas.getByRole`/`getByText` — semantic queries over test IDs
- `userEvent` for interactions, `expect` for assertions
- Spy assertions: `await expect(args.onClick).toHaveBeenCalled()` / `.not.toHaveBeenCalled()`
- Run: `bunx vitest --project=storybook --run`

### Docs (MDX)

- One `.mdx` per component, co-located in component folder
- No `autodocs` tag with MDX — one or other (we use MDX)
- Docs describe behavior + API surface only — no internal libs or implementation details
- Minimal: one-liner desc, `<Controls />`, `<Stories />`

```mdx
import { Meta, Controls, Stories } from '@storybook/addon-docs/blocks';
import * as ButtonStories from './button.stories';

<Meta of={ButtonStories} />

# Button

Short description of what the component does.

<Controls />

<Stories />
```

## TypeScript + React

### DO

- Plain functions with typed props: `const Button = ({ label }: ButtonProps) => ...`
- `interface` for public props in types files
- `type` for internal/private types
- Destructuring defaults not defaultProps: `({ size = 16 }: Props)`
- `import type` for type-only imports
- Derive types from source of truth (`keyof typeof variants`, `VariantProps<typeof tv>`)
- `as const` for tuple returns from hooks
- `ComponentPropsWithRef<"element">` when extending native HTML elements
- React 19: pass `ref` directly as prop — no `forwardRef`
- Discriminated unions for complex prop combos
- Hoist static JSX (icons, decorative elements) outside component — avoid re-creation each render
- `useId()` for unique ARIA IDs (`aria-controls` linking trigger to panel) not hardcoded strings
- Named `type` for every sub-component's props — never inline anonymous object types in the destructure
- Derive sub-component prop types from TV: `type XProps = { field: VariantProps<typeof xVariants>["field"] }`

### DON'T

- Never `React.FC` or `React.FunctionComponent`
- Never `React.HTMLProps` (too-wide types)
- Never barrel files or index.ts re-exports
- Never `defaultProps` (deprecated)
- Never `{}`, `object`, or `Object` as types
- Never `Function` type (too loose)
- Never comments restating code
- Never return non-function/non-undefined from useEffect
- Never `FormEvent`/`FormEventHandler` (deprecated React 19.2+ — use `SubmitEvent`)
- Never `&&` conditional render — prefer a small sub-component with an early return (`if (!x) return null;`) over `{x ? ... : null}` when the JSX is more than a word or two
- Never inline anonymous prop types like `({ label }: { label?: string; size: ParentProps["size"] }) =>` — extract a named `type` above the component
- Never `React.MutableRefObject` (deprecated React 19) — use `React.RefObject`
- Never `as` casts for refs — type properly or `useMergedRef` helper

## Code Style

- Pessimistic code — assume null inputs, API failures, edge cases. Guard checks + fallbacks where needed, but concise — no bloated redundant validation
- Sub-component extraction over inline ternaries — when a conditional subtree needs its own styling or animation, extract to a named sub-component with a named prop type; call sites read as `<Foo show={cond} />` not `{cond ? <motion.div ...> : null}`

## Quality Checks

- After creating/modifying component: Playwright (MCP) visual verify in Storybook — screenshot + check visual bugs
- After creating/modifying files: `bunx biome check <path>` — fix all lint errors properly, never `biome-ignore` comments
- Unsure about `motion/react` API: context7 MCP lookup docs first
- Writing motion/react animation: use `motion-dev-animations` skill (`~/.claude/skills/motion-dev-animations/SKILL.md`) for patterns + validation

## React Keys

- Static arrays that never reorder/add/remove: index key fine — list stable
- Never dynamic random keys (`key={Math.random()}`, `key={crypto.randomUUID()}`) — destroys component state every render, worse than index
- Dynamic lists (editable, sortable, filterable): unique constant ID from data (`key={item.id}`)
- Never hack linter rules by renaming vars (e.g. `Array.from({}, (_, n) => n).map((n) => ... key={n})` — same as index, just tricks linter)
- Biome lint false positives for static arrays: disable rule in `biome.json`, not hack around

## Styling

- Tailwind CSS + `tailwind-variants` (TV) for variant styling
- `motion/react` for animations — animate wrapper div not SVG directly (avoids expensive repaints)
- TV defs in component types file alongside props interface
- Never hardcoded values like `text-[13px]`, `bg-[#f62222]`, `text-[#050505]` — use design tokens in `src/index.css`
- Missing color/size token: ask user to add to design system before arbitrary value
- TV `size` variants only when multiple sizes genuinely needed (form controls: Button, Input, Badge, Checkbox). No size variants by default — most components single well-chosen size
- Never a runtime `color` prop — consumers set color via `className` `text-*` utility; SVG/div internals use `currentColor`

## tailwind-variants (TV)

- Define `tv()` **at module scope only** — never inside a component or render function (TV caches slot/variant resolver on call)
- `base` is the first key (replaces CVA's positional first-arg string):
  ```ts
  export const buttonVariants = tv({ base: "...", variants: { ... }, defaultVariants: { ... } });
  ```
- `VariantProps<typeof buttonVariants>` — identical to CVA usage
- **className merge**: pass `className` into the variant call — TV tailwind-merges it automatically:
  ```tsx
  className={buttonVariants({ variant, size, className })}
  ```
  No separate `cn()` call needed for the common case
- **Compound variants**: use `class:` (not `className:`) as the rule key inside `compoundVariants`
- **Utility exports** (from `tailwind-variants`):
  - `cn(...inputs)` — merge + tailwind-merge (use when merging strings outside a `tv()` call)
  - `cnMerge(config)(...inputs)` — merge with custom tailwind-merge config
  - `cx(...inputs)` — plain string concat, no tailwind-merge
- **Slots**: use `slots` key for multi-element components; `compoundSlots` for cross-slot compound rules. Keep single-element components as flat `tv()` (no slots)
- **No `responsiveVariants`** under Tailwind v4 — use Tailwind's responsive prefix in className
- Never use the `tailwind-variants/lite` build — the project relies on default tailwind-merge behavior

## Tailwind CSS v4

- Tailwind v4: data attribute selectors use `data-<name>:` (no brackets), e.g. `data-highlighted:bg-red-500` not `data-[highlighted]:bg-red-500`
- Bracket syntax `data-[attr]:` = Tailwind v3 — never use
- CSS variable refs: parentheses syntax `min-w-(--anchor-width)` not `min-w-[var(--anchor-width)]`

## Motion (motion/react)

### DO

- Import from `motion/react` (not `framer-motion`)
- `initial={false}` to skip mount animation, only animate on state change
- Spring over tween for interactive elements (stiffness: 300-400, damping: 20-30)
- Only animate GPU properties: `opacity`, `transform` (`x`, `y`, `scale`, `rotate`)
- `AnimatePresence` + conditional render + `key` for exit animations on own components
- Base UI `render` prop: cherry-pick `ref`, `style`, `children` only — avoid type conflicts (`onDrag`/`onDragEnd` clash between Base UI + Motion)

### DON'T

- Never `AnimatePresence` for Base UI popup exits — Base UI controls mount/unmount, `exit` won't fire. Use CSS transitions: `data-starting-style:`/`data-ending-style:`
- Never spread all Base UI render props (`{...props}`) onto `motion.*` — `onDrag`, `onDragEnd`, `onDragStart`, `onAnimationStart` types conflict
- Never animate `width`, `height`, `left`, `top` — layout thrashing. Use `transform` equivalents
- Never `duration` with `type: "spring"` — springs physics-based, duration ignored

## Base UI

- `@base-ui/react` for complex interactive primitives (Select, Combobox, Popover, Dialog, Menu, etc.) — no custom keyboard nav, focus management, or ARIA from scratch
- Style via Tailwind `className`, `data-*` selectors for state (`data-popup-open:`, `data-highlighted:`, `data-selected:`, `data-disabled:`)
- Open/close animations: CSS transitions with `data-starting-style:` / `data-ending-style:` — not motion/react `AnimatePresence` (CSS transitions cancel mid-transition)
- `motion/react` + Base UI `render` prop when need spring physics or layout animations CSS can't do (chevron rotation, shared layout)
- Base UI CSS vars on Positioner/Popup: `--anchor-width`, `--available-height`, `--transform-origin` — use for sizing + animation origin
- Unsure about Base UI API: context7 MCP lookup `@base-ui/react` docs