import { Tree } from '../tree'
import { nodes } from './nodes'

const variables = [
  { name: '--tree-background', value: '#fff', description: 'Background of the tree, search field, and expansion buttons.' },
  { name: '--tree-foreground', value: '#26364a', description: 'Node labels, input text, and expansion icons.' },
  { name: '--tree-border', value: '#d4dce5', description: 'Container and control borders, dotted branch lines, and the loader border.' },
  { name: '--tree-accent', value: '#137e70', description: 'Selected radios and checkboxes, keyboard focus outlines, and the loader highlight.' },
  { name: '--tree-muted', value: '#68778b', description: 'Loading text and the no-matches message.' },
  { name: '--tree-row-height', value: '24px', description: 'Row line height and minimum height. Also centers inputs, connectors, expand buttons, and loaders.' },
]

const themeCss = `.roomy-tree .tree {
  --tree-background: #172b2b;
  --tree-foreground: #e3f3ed;
  --tree-border: #3d5855;
  --tree-accent: #79dcc5;
  --tree-muted: #a6bdb8;
  --tree-row-height: 32px;
}`

export default function TreeCssVariables() {
  return <section className="css-variables" id="css-variables" aria-labelledby="css-variables-heading">
    <div className="section-heading"><h2 id="css-variables-heading">CSS variables</h2><p>Customize colors and row spacing.</p></div>
    <div className="parameter-table-scroll" role="region" aria-label="CSS variable reference" tabIndex={0}>
      <table className="parameter-table css-variable-table">
        <thead><tr><th scope="col">Variable</th><th scope="col">Default</th><th scope="col">Controls</th></tr></thead>
        <tbody>{variables.map(variable => <tr key={variable.name}>
          <th scope="row"><code>{variable.name}</code></th>
          <td><code>{variable.value}</code></td><td>{variable.description}</td>
        </tr>)}</tbody>
      </table>
    </div>
    <p className="parameter-note">Override variables on <code>.tree</code> with a more specific selector, such as <code>.roomy-tree .tree</code>. Setting variables only on the wrapper will be overridden by the component defaults. Use a CSS length for row height; 24px or larger provides comfortable spacing.</p>
    <div className="css-theme-grid">
      <div className="json-code-panel"><div className="json-code-heading"><h3>Theme example</h3></div>
        <pre><code>{themeCss}</code></pre>
        <pre className="css-theme-usage"><code>{'<div className="roomy-tree">\n  <Tree nodes={nodes} searchable defaultExpanded\n    selectionMode="multi" defaultValue={[4]}\n    aria-label="Themed categories" />\n</div>'}</code></pre>
      </div>
      <div className="css-theme-preview"><h3>Live preview · 32px rows</h3>
        <div className="roomy-tree"><Tree nodes={nodes} searchable defaultExpanded selectionMode="multi" defaultValue={[4]} aria-label="Themed categories" /></div>
      </div>
    </div>
  </section>
}
