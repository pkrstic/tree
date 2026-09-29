# Tree

Version **1.0.0** · Author **Predrag Krstić**

A React + TypeScript component for browsing and selecting nodes in a hierarchy. Supports single and multiple selection, local search, native HTML forms, per-node disabling, and lazy loading over HTTP. Uses React and scoped CSS; no Tailwind, icon library, or application aliases are required.

This repository includes the component and a runnable example gallery. The library build is configured, but it is **not published yet**. The final package name and npm account are still needed. Imports below use the local component entry point; use the package name for npm installations.

## Installation

### Use the component now

Create `src/tree` in your React application and copy `Tree.tsx`, `TreeList.tsx`, `Tree.types.ts`, `Tree.css`, and `index.ts` from this repository's `src/tree` directory. The test file is only needed when developing this component. Import the component through its entry point:

```tsx
import { Tree, type TreeNode } from './tree'
```

This import assumes your consuming file is directly inside `src`; adjust the relative path for other locations. The component imports its stylesheet automatically. No additional UI dependencies are needed.

Use a React application with CSS-import support. This repository develops and tests against React 19; compatibility with earlier React versions has not been verified. TypeScript is optional for consumers, but the copied source needs a build tool that can compile TSX.

### Install from npm after publication

`@your-scope/react-tree` below is a **placeholder**, not the name of a published release. Replace it with the final package name once the library has been built and published:

```sh
npm install @your-scope/react-tree
```

Then use the package entry point in place of the local import:

```tsx
import { Tree, type TreeNode } from '@your-scope/react-tree'
import '@your-scope/react-tree/style.css'
```

The built package requires the explicit stylesheet import above. It provides an ES module entry and TypeScript declarations, with React 19 as a peer dependency. React is not bundled. See [Preparing an npm release](#preparing-an-npm-release) for publishing steps.

## Run the examples

```sh
npm install
npm run dev
```

Open the URL printed by Vite. Each example has an interactive preview and expandable code. Source: [`src/examples/TreeExamples.tsx`](src/examples/TreeExamples.tsx); shared data: [`src/examples/nodes.ts`](src/examples/nodes.ts).

```sh
npm run build      # Build the library and TypeScript declarations
npm run build:docs # Type-check and build the gallery
npm run lint
npm test        # Component behavior tests
npm run preview # Serve the built gallery
```

## Usage

### Render a tree

Define your nodes outside the component so their array reference remains stable. The following complete example uses the local installation described above:

```tsx
import { Tree, type TreeNode } from './tree'

const nodes: TreeNode[] = [
  {
    entry_id: 1,
    parent_entry_id: null,
    name: 'Team',
    hasChildren: true,
    collapsed: true,
    children: [
      {
        entry_id: 2,
        parent_entry_id: 1,
        name: 'Design',
        hasChildren: false,
        collapsed: false,
        children: [],
      },
    ],
  },
]

export default function Categories() {
  return <Tree nodes={nodes} searchable defaultExpanded />
}
```

`searchable` adds a search field, and `defaultExpanded` opens all supplied branches initially. Omit both options to render a browse-only tree using each node's `collapsed` state.

### Enable selection

Using the same `nodes` array, add `selectionMode` for radio buttons or checkboxes:

```tsx
// One selected node; Tree manages its selection internally.
<Tree nodes={nodes} selectionMode="single"
  defaultValue={2} defaultExpanded
  onChange={value => console.log(value)} aria-label="Category" />

// Multiple independent selections.
<Tree nodes={nodes} selectionMode="multi"
  defaultValue={[2]} defaultExpanded
  onChange={values => console.log(values)} aria-label="Categories" />
```

Use `value` and `onChange` together when your application should manage selection. See the [controlled single-selection example](#controlled-single-selection), [controlled multiple-selection example](#controlled-multiple-selection), and [native form example](#uncontrolled-selection-and-native-forms) below.

## Node data

Pass a **nested array**, not a flat list. `parent_entry_id` is metadata; it does not build the hierarchy. The `children` arrays determine nesting.

| Field | Type | Purpose |
| --- | --- | --- |
| `entry_id` | `string \| number` | Unique ID throughout the tree. IDs retain their original types in callbacks. |
| `parent_entry_id` | `string \| number \| null` | Parent ID; use `null` for roots. |
| `name` | `string` | Visible label and searchable text. |
| `children` | `TreeNode[]` | Nested descendants. Use `[]` for leaves or unloaded branches. |
| `hasChildren` | `boolean` | Whether a branch can expand. Use `true` for lazy branches with no loaded children. |
| `collapsed` | `boolean` | Initial branch state unless `defaultExpanded` or `hideExpandControls` overrides it at mount. |
| `disabled` | `boolean` (optional) | Disables this node’s selection input; descendants and expansion remain available. |
| `isLoadingChildren` | `boolean` (optional) | Internal loading indicator; normalized to `false` on ingestion. Do not use to initiate loading. |

The TypeScript contract requires `children`, `hasChildren`, and `collapsed`. At runtime, omitted children normalize to `[]`, omitted `hasChildren` is inferred from loaded children, and branches with omitted `collapsed` start collapsed. Supply the complete contract in typed code.

IDs must be unique and consistent: numeric `2` and string `'2'` are distinct selection values. Avoid either as duplicate IDs because native form values are stringified.

### JSON input example

The input is a JSON array of root nodes. Each child follows the same node definition above. This complete example includes an expanded branch, two children, a disabled choice, and a second root:

```json
[
  {
    "entry_id": 1,
    "parent_entry_id": null,
    "name": "Engineering",
    "children": [
      {
        "entry_id": 2,
        "parent_entry_id": 1,
        "name": "Frontend",
        "children": [],
        "hasChildren": false,
        "collapsed": false
      },
      {
        "entry_id": 3,
        "parent_entry_id": 1,
        "name": "Backend",
        "children": [],
        "hasChildren": false,
        "collapsed": false,
        "disabled": true
      }
    ],
    "hasChildren": true,
    "collapsed": false
  },
  {
    "entry_id": 4,
    "parent_entry_id": null,
    "name": "Design",
    "children": [],
    "hasChildren": false,
    "collapsed": false
  }
]
```

The same data is available in [`src/examples/tree-input.json`](src/examples/tree-input.json) and in the gallery's **JSON input** section, with a download and live preview.

To use a JSON file in a React application:

```tsx
import inputNodes from './tree-input.json'
import { Tree } from './tree'

export function JsonTree() {
  return <Tree nodes={inputNodes} aria-label="Category" />
}
```

For TypeScript projects, enable `resolveJsonModule` in your application tsconfig to import JSON files. This repository already enables it. A `route` endpoint may return the same array directly. Supply valid node data; the component does not perform runtime schema validation.

## Props

| Prop | Type | Default / behavior |
| --- | --- | --- |
| `nodes` | `TreeNode[]` | Empty array. A new array reference resets tree data and expansion; keep the reference stable during unrelated renders. |
| `route` | `string` | Optional root JSON URL. When present, a request runs on mount and whenever the URL changes. |
| `selectionMode` | `'single' \| 'multi'` | Omitted: browse only. |
| `value` | Selection value or readonly array | Controlled selection. Single accepts an ID, custom no-option value, or `null`; multi accepts an array. |
| `defaultValue` | Selection value or readonly array | Initial uncontrolled selection. Single defaults to none, multi to `[]`. Read once at mount. |
| `onChange` | `(value) => void` | Receives the selected value in single mode, or the next array in multi mode. |
| `defaultExpanded` | `boolean` | `false`. Expands every loaded branch at initialization. Captured at mount; it is not a controlled expansion prop. |
| `hideExpandControls` | `boolean` | `false`. Hides per-branch toggles; at mount also expands supplied branches. Without search, loaded descendants stay visible. |
| `searchable` | `boolean` | `false`. Shows local search plus separate “Expand all” and “Collapse all” buttons. |
| `noOption` | `string` | Optional label above the nodes. In selection mode it becomes an extra input; in browse mode it is plain text. |
| `noOptionValue` | Generic `TNoOptionValue` | Numeric `0` when omitted or `undefined`. Can be `null`, a string, number, boolean, or other value. |
| `name` | `string` | Generated per-instance input name. Set explicitly for native form submission. |
| `disabled` | `boolean` | `false`. Disables all selection, search, and expansion controls. |
| `aria-label` | `string` | Accessible name for the single-selection radiogroup or multi-selection group. |

Selection props form a discriminated union: `value`, `defaultValue`, and `onChange` require `selectionMode`. Prefer one selection model per mounted instance. `value={undefined}` means uncontrolled; use `null` to clear controlled single selection and `[]` to clear controlled multiple selection.

## Examples by option

### Browse and expansion

```tsx
<Tree nodes={nodes} />
<Tree nodes={nodes} defaultExpanded />
<Tree nodes={nodes} hideExpandControls />
<Tree nodes={nodes} searchable defaultExpanded />
```

`defaultExpanded` sets initial state; users may still collapse branches. `hideExpandControls` suppresses the individual buttons. When combined with `searchable`, both global buttons remain visible and can change branch expansion; the combination does not guarantee that all descendants remain visible.

### Controlled single selection

```tsx
import { useState } from 'react'
import { Tree, type TreeSelectionValue } from './tree'
import { nodes } from './examples/nodes'

export function SingleSelection() {
  const [value, setValue] = useState<TreeSelectionValue>(7)
  return <>
    <Tree nodes={nodes} selectionMode="single"
      value={value} onChange={setValue}
      defaultExpanded aria-label="Category" />
    <button type="button" onClick={() => setValue(null)}>Clear selection</button>
  </>
}
```

The parent must update `value` in response to `onChange`. Expansion never changes selection.

### Controlled multiple selection

```tsx
import { useState } from 'react'
import { Tree, type TreeSelectionValue } from './tree'
import { nodes } from './examples/nodes'

export function MultipleSelection() {
  const [value, setValue] = useState<TreeSelectionValue[]>([4, 8])
  return <Tree nodes={nodes} selectionMode="multi"
    value={value} onChange={setValue}
    searchable defaultExpanded aria-label="Categories" />
}
```

Each checkbox is independent. Selecting a parent does not select descendants. There is no cascading selection or indeterminate state.

### Uncontrolled selection and native forms

```tsx
<form onSubmit={event => {
  event.preventDefault()
  const values = new FormData(event.currentTarget).getAll('categories')
  console.log(values)
}}>
  <Tree nodes={nodes} selectionMode="multi" name="categories"
    defaultValue={[4]} searchable defaultExpanded
    aria-label="Categories" />
  <button type="submit">Submit</button>
</form>
```

Use `FormData.get(name)` for single selection and `getAll(name)` for multiple selection. Form values are strings, while callbacks retain the original ID types. Collapsed descendants remain mounted, and filtered selections use hidden inputs so search does not discard them. Disabled inputs do not submit. Selections referring to missing nodes are not validated or automatically cleared; keep values consistent with your dataset.

A native form reset does not reset React selection state. For reset behavior, use controlled selection and update it in your form’s `onReset` handler, or remount the uncontrolled Tree with a new key.

### An extra “None” option

```tsx
<Tree nodes={nodes} selectionMode="single"
  noOption="No parent category" noOptionValue={null}
  defaultValue={null} aria-label="Parent category" />

// Omitting noOptionValue uses numeric 0.
<Tree nodes={nodes} selectionMode="single"
  noOption="None" defaultValue={0} aria-label="Category" />
```

Use a value that does not collide with a node ID. In multi mode, the extra option is an independent checkbox: it can coexist with other selections. Choosing it does not clear them.

Custom object values are compared by reference. If using an object as `noOptionValue`, keep it stable and use the same reference in your selection. Native forms stringify custom values, so prefer scalar values for forms. A `null` no-option value submits the string `'null'`; `value={null}` without that option leaves all radios unselected.

### Disable selection

```tsx
<Tree nodes={nodes} selectionMode="multi" disabled
  searchable defaultExpanded aria-label="Disabled categories" />
```

For one disabled choice, set `disabled: true` on that node. It does not disable its children or prevent browsing the branch.

## Search behavior

Search trims whitespace and performs a case-insensitive substring match on `name`. It searches **loaded nodes only**, retains ancestors of matching descendants, and opens matching paths initially. A matching parent does not automatically include nonmatching descendants. Search never requests remote children.

Selected values survive filtering. The extra no-option row remains visible even when there are no matches. Clearing the query restores the unfiltered tree. Individual branch toggles during search affect the filtered view; the global buttons also change expansion in the underlying tree.

## Remote loading

```tsx
<Tree route="/examples/tree.json" searchable
  selectionMode="single" aria-label="Remote category" />
```

Root responses must be JSON arrays of `TreeNode`. The root request shows `Loading...`; a failed HTTP response or invalid JSON displays `Could not load tree content.` Root requests are aborted when the route changes or the component unmounts. Supply either `nodes` or `route` for predictable behavior: a successful root request replaces local data.

A branch fetches its children when manually opened if it has `hasChildren: true`, no loaded children, and a `route` exists:

```json
[
  {
    "entry_id": 1,
    "parent_entry_id": null,
    "name": "Product",
    "children": [],
    "hasChildren": true,
    "collapsed": true
  }
]
```

The child URL is fixed by the current implementation:

| Root route | Child request for ID `1` |
| --- | --- |
| `/api/tree` | `/sub_tree/1` |
| `https://example.com/api/tree` | `https://example.com/sub_tree/1` |

The root path and query are not preserved. IDs are interpolated without URL encoding, so use URL-safe IDs for remote trees. There is no configurable child URL, request headers, credentials override, or custom loader. Cross-origin requests require an appropriate server CORS policy.

Child responses are arrays of nodes to insert under the opened branch. Loaded nonempty children are reused on subsequent expansion. On child failure the spinner stops with no visible error; collapse and reopen to retry. Empty responses may be requested again. Child requests currently have no abort controller or stale-response protection.

`defaultExpanded`, hiding controls, and the global expand button do not proactively fetch children. Lazy nodes should start collapsed and retain individual controls so users can initiate their requests. Search can hide an unloaded branch’s expand button because only loaded descendants participate in filtering.

The gallery provides root JSON at `public/examples/tree.json` and a child fixture at `public/sub_tree/1`. Its invalid JSON fixture demonstrates a root-loading error.

## CSS variables

The component’s CSS uses `.tree-*` classes and these six variables:

| Variable | Default | Controls |
| --- | --- | --- |
| `--tree-background` | `#fff` | Tree, search field, and expansion-button backgrounds. |
| `--tree-foreground` | `#26364a` | Node labels, input text, and expansion icons. |
| `--tree-border` | `#d4dce5` | Container and control borders, dotted branch lines, and the loader border. |
| `--tree-accent` | `#137e70` | Selected radios and checkboxes, focus outlines, and the loader highlight. |
| `--tree-muted` | `#68778b` | Loading text and the no-matches message. |
| `--tree-row-height` | `24px` | Row line height and minimum height; also centers selection inputs, connector lines, branch buttons, and loaders. |

Override variables on `.tree` beneath a wrapper with a more specific selector. Setting them only on the wrapper does not override the defaults declared on `.tree`. Use a CSS length for row height; 24px or larger provides comfortable spacing:

```css
.custom-tree .tree {
  --tree-background: #172b2b;
  --tree-foreground: #e3f3ed;
  --tree-border: #3d5855;
  --tree-accent: #79dcc5;
  --tree-muted: #a6bdb8;
  --tree-row-height: 32px;
}
```

```tsx
<div className="custom-tree">
  <Tree nodes={nodes} searchable defaultExpanded />
</div>
```

Use wrapper CSS to set width, maximum height, or scrolling. There is currently no `className`, `style`, or arbitrary DOM-prop forwarding on Tree.

## Accessibility

Selection uses native radio buttons and checkboxes with labels. Single selection exposes a `radiogroup`; multi selection exposes a `group`. Give selection groups an `aria-label`, and use a visible heading or other surrounding context for browse-only trees. Branch buttons have node-specific labels and `aria-expanded`; search is labeled “Search tree”.

This is a nested list, not an ARIA tree widget. It does not implement tree-specific arrow-key navigation or roving focus. Browse-only row clicks work with a pointer; keyboard users can use the branch buttons. Loading animation respects reduced-motion preferences.

## Preparing an npm release

The reusable entry point is [`src/tree/index.ts`](src/tree/index.ts), exporting `Tree`, `TreeProps`, `TreeNode`, `TreeNodeId`, `TreeSelectionProps`, and `TreeSelectionValue`.

`npm run build` creates `dist/index.js`, TypeScript declarations, and `dist/style.css`. Only `dist`, this README, `LICENSE`, and package metadata are included in the tarball. The example site has a separate `npm run build:docs` build in `dist-docs`.

Before the first release:

1. Create an npm account and sign in locally with `npm login`.
2. Choose an available package name or a scope you own. The unscoped name `tree` is already registered; the current name is a development placeholder.
3. Update the package and lockfile name, and replace `@your-scope/react-tree` in this README with the chosen name.
4. Run `npm run lint`, `npm test`, `npm run build`, and `npm run build:docs`.
5. Inspect `npm pack --dry-run`, then install an actual packed tarball in a separate React app to check exports, types, and the explicit stylesheet import.
6. Remove `private: true` when the package name is finalized and the release is ready.
7. Publish with `npm publish --access public`, completing any npm authentication prompts yourself.

The `prepublishOnly` script runs lint, behavior tests, and the library build before a registry publication. Version **1.0.0**, author **Predrag Krstić**, and the WTFPL license are already configured.

## Author and license

Created by **Predrag Krstić**. Current version: **1.0.0**.

Licensed under [WTFPL version 2](LICENSE). The license text is available from the [official WTFPL site](https://www.wtfpl.net/txt/copying/).
