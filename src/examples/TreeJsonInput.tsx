import { Tree, type TreeNode } from '../tree'
import inputNodes from './tree-input.json'
import inputUrl from './tree-input.json?url'

const jsonInput: TreeNode[] = inputNodes
const fields = [
  { name: 'entry_id', type: 'string | number', required: 'Yes', description: 'Unique node ID throughout the tree. Keep its type consistent.' },
  { name: 'parent_entry_id', type: 'string | number | null', required: 'Yes', description: 'Parent ID, or null for a root. Metadata only; children define the nesting.' },
  { name: 'name', type: 'string', required: 'Yes', description: 'Visible node label and text used for search.' },
  { name: 'children', type: 'TreeNode[]', required: 'Yes', description: 'Nested child nodes using this same definition. Use [] for leaves or unloaded children.' },
  { name: 'hasChildren', type: 'boolean', required: 'Yes', description: 'true for expandable branches, including branches whose children will load remotely.' },
  { name: 'collapsed', type: 'boolean', required: 'Yes', description: 'Initial branch state. true starts collapsed; false starts expanded.' },
  { name: 'disabled', type: 'boolean', required: 'No', description: 'Disable selection for this node. Descendants remain selectable.' },
  { name: 'isLoadingChildren', type: 'boolean', required: 'No', description: 'Internal loading state. Omit from input; the component resets it on ingestion.' },
] satisfies { name: keyof TreeNode; type: string; required: string; description: string }[]

export default function TreeJsonInput() {
  return <section className="json-input" id="json-input" aria-labelledby="json-input-heading">
    <div className="section-heading"><h2 id="json-input-heading">JSON input</h2><p>The node definition and a complete example.</p></div>
    <p className="json-input-description">Pass an array of root nodes to <code>nodes</code>, or return the same JSON array from your <code>route</code> endpoint. Each node nests its descendants inside <code>children</code>.</p>
    <div className="json-input-grid">
      <div>
        <h3>Node definition</h3>
        <div className="parameter-table-scroll" role="region" aria-label="JSON node definition" tabIndex={0}>
          <table className="parameter-table node-definition-table">
            <thead><tr><th scope="col">Field</th><th scope="col">Type</th><th scope="col">Required</th><th scope="col">Description</th></tr></thead>
            <tbody>{fields.map(field => <tr key={field.name}>
              <th scope="row"><code>{field.name}</code></th><td><code>{field.type}</code></td><td>{field.required}</td><td>{field.description}</td>
            </tr>)}</tbody>
          </table>
        </div>
        <p className="parameter-note">Required fields follow the exported <code>TreeNode</code> contract. Use unique IDs and a nested array rather than a flat parent-ID list. No runtime JSON validation is performed.</p>
        <div className="json-input-preview"><h3>Rendered input</h3><Tree nodes={jsonInput} aria-label="JSON input example" /></div>
      </div>
      <div className="json-code-panel">
        <div className="json-code-heading"><h3>Example JSON</h3><a href={inputUrl} download="tree-input.json">Download JSON ↓</a></div>
        <pre><code>{JSON.stringify(jsonInput, null, 2)}</code></pre>
        <div className="json-usage"><h3>Use the JSON in React</h3><pre><code>{'import inputNodes from "./tree-input.json"\nimport { Tree } from "./tree"\n\n<Tree nodes={inputNodes}\n  aria-label="Category" />'}</code></pre></div>
      </div>
    </div>
  </section>
}
