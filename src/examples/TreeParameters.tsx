import type { TreeProps } from '../tree'

const parameters = [
  { name: 'nodes', type: 'TreeNode[]', defaultValue: '[]', description: 'Nested nodes to render. A new array reference resets data and expansion.' },
  { name: 'route', type: 'string', defaultValue: 'undefined', description: 'Root JSON endpoint. Unloaded branches request children from /sub_tree/:id.' },
  { name: 'selectionMode', type: "'single' | 'multi'", defaultValue: 'undefined', description: 'Single selection uses radios; multiple selection uses independent checkboxes. Omit to browse only.' },
  { name: 'value', type: 'SelectionValue | readonly SelectionValue[]', defaultValue: 'undefined', description: 'Controlled selection: one value for single mode, an array for multi mode. Clear with null or [].' },
  { name: 'defaultValue', type: 'SelectionValue | readonly SelectionValue[]', defaultValue: 'No selection', description: 'Initial uncontrolled selection, read once at mount. Requires selectionMode.' },
  { name: 'onChange', type: '(value) => void', defaultValue: 'undefined', description: 'Receives the selected value in single mode or the next selection array in multi mode. Requires selectionMode.' },
  { name: 'defaultExpanded', type: 'boolean', defaultValue: 'false', description: 'Expand loaded branches initially. Users can still collapse them; later prop changes do not control expansion.' },
  { name: 'hideExpandControls', type: 'boolean', defaultValue: 'false', description: 'Hide individual branch buttons and initially expand supplied branches. Global buttons remain available when searchable.' },
  { name: 'searchable', type: 'boolean', defaultValue: 'false', description: 'Show search over loaded nodes and separate Expand all and Collapse all buttons.' },
  { name: 'noOption', type: 'string', defaultValue: 'undefined', description: 'Extra choice above the nodes, or plain text in browse mode. Remains visible during search.' },
  { name: 'noOptionValue', type: 'TNoOptionValue', defaultValue: '0', description: 'Value of the extra choice. Choose a value that does not collide with a node ID; null is supported.' },
  { name: 'name', type: 'string', defaultValue: 'Generated unique name', description: 'Input name for native forms. Submitted values are strings; use getAll(name) for multi selection.' },
  { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disable selection, search, and expansion. Disabled inputs are excluded from native form submission.' },
  { name: 'aria-label', type: 'string', defaultValue: 'undefined', description: 'Accessible name for the single-selection radiogroup or multi-selection group.' },
] satisfies { name: keyof TreeProps; type: string; defaultValue: string; description: string }[]

export default function TreeParameters() {
  return <section className="parameters" id="parameters" aria-labelledby="parameters-heading">
    <div className="section-heading"><h2 id="parameters-heading">Parameters</h2><p>All options at a glance.</p></div>
    <div className="parameter-table-scroll" role="region" aria-label="Tree parameter reference" tabIndex={0}>
      <table className="parameter-table">
        <thead><tr><th scope="col">Parameter</th><th scope="col">Type</th><th scope="col">Default</th><th scope="col">Description</th></tr></thead>
        <tbody>{parameters.map(parameter => <tr key={parameter.name}>
          <th scope="row"><code>{parameter.name}</code></th>
          <td><code>{parameter.type}</code></td>
          <td>{parameter.defaultValue}</td>
          <td>{parameter.description}</td>
        </tr>)}</tbody>
      </table>
    </div>
    <p className="parameter-note"><code>SelectionValue</code> means a string or number node ID, <code>null</code>, or your custom <code>noOptionValue</code> type. Selection props require <code>selectionMode</code>. Use either controlled <code>value</code> or uncontrolled <code>defaultValue</code>.</p>
  </section>
}
