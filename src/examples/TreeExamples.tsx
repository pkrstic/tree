import { useState, type ReactNode } from 'react'
import { Tree, type TreeSelectionValue } from '../tree'
import { nodes } from './nodes'

function Example({ id, title, description, code, children }: { id: string; title: string; description: string; code: string; children: ReactNode }) {
  return <section className="example" id={id}>
    <div className="example-heading"><span className="example-number">{id}</span><h2>{title}</h2></div>
    <p>{description}</p>
    <div className="example-preview">{children}</div>
    <details><summary>View example code</summary><pre><code>{code}</code></pre></details>
  </section>
}

export default function TreeExamples() {
  const [single, setSingle] = useState<TreeSelectionValue>(7)
  const [multi, setMulti] = useState<TreeSelectionValue[]>([4, 8])
  const [submitted, setSubmitted] = useState<string[]>([])
  const [remoteRoute, setRemoteRoute] = useState('/examples/tree.json')
  const [remoteKey, setRemoteKey] = useState(0)

  return <div className="examples">
    <Example id="01" title="Browse a hierarchy" description="A simple tree with clickable branches. Each node defines its initial collapsed state." code={'<Tree nodes={nodes} />'}>
      <Tree nodes={nodes} />
    </Example>
    <Example id="02" title="Start expanded" description="Open every supplied branch on mount. Users can still collapse individual branches." code={'<Tree nodes={nodes} defaultExpanded />'}>
      <Tree nodes={nodes} defaultExpanded />
    </Example>
    <Example id="03" title="Always show branches" description="Hide the individual expansion controls and show all supplied descendants." code={'<Tree nodes={nodes} hideExpandControls />'}>
      <Tree nodes={nodes} hideExpandControls />
    </Example>
    <Example id="04" title="Search loaded nodes" description="Try “tokens”. Matching descendants retain their ancestors; use the adjacent buttons to expand or collapse all." code={'<Tree nodes={nodes} searchable defaultExpanded />'}>
      <Tree nodes={nodes} searchable defaultExpanded />
    </Example>
    <Example id="05" title="Controlled single selection" description="Choose one category. The disabled Archive node cannot be selected. Clear selection from your own UI." code={"const [value, setValue] = useState<TreeSelectionValue>(7)\n\n<Tree nodes={nodes} selectionMode=\"single\"\n  value={value} onChange={setValue}\n  defaultExpanded aria-label=\"Category\" />\n<button onClick={() => setValue(null)}>Clear selection</button>"}>
      <Tree nodes={nodes} selectionMode="single" value={single} onChange={setSingle} defaultExpanded aria-label="Category" />
      <div className="example-result"><output>Value: {JSON.stringify(single)}</output><button type="button" onClick={() => setSingle(null)}>Clear selection</button></div>
    </Example>
    <Example id="06" title="Controlled multiple selection" description="Select nodes independently. Selecting a parent leaves its children unchanged. Search keeps your hidden selections." code={"const [value, setValue] = useState<TreeSelectionValue[]>([4, 8])\n\n<Tree nodes={nodes} selectionMode=\"multi\"\n  value={value} onChange={setValue} searchable\n  defaultExpanded aria-label=\"Categories\" />"}>
      <Tree nodes={nodes} selectionMode="multi" value={multi} onChange={setMulti} searchable defaultExpanded aria-label="Categories" />
      <div className="example-result"><output>Value: {JSON.stringify(multi)}</output><button type="button" onClick={() => setMulti([])}>Clear selection</button></div>
    </Example>
    <Example id="07" title="Add a “None” option" description="Use an explicit null value for the extra radio option. Without noOptionValue, the extra option uses numeric 0." code={'<Tree nodes={nodes} selectionMode="single"\n  noOption="No parent category" noOptionValue={null}\n  defaultValue={null} defaultExpanded\n  aria-label="Parent category" />'}>
      <Tree nodes={nodes} selectionMode="single" noOption="No parent category" noOptionValue={null} defaultValue={null} defaultExpanded aria-label="Parent category" />
    </Example>
    <Example id="08" title="Native form submission" description="Use an uncontrolled tree with a name and defaultValue. Submit to inspect the selected strings, including selections hidden by search." code={'<form onSubmit={event => {\n  event.preventDefault()\n  const values = new FormData(event.currentTarget).getAll("categories")\n  console.log(values)\n}}>\n  <Tree nodes={nodes} selectionMode="multi"\n    name="categories" defaultValue={[4]}\n    searchable defaultExpanded aria-label="Form categories" />\n  <button type="submit">Read form values</button>\n</form>'}>
      <form onSubmit={event => { event.preventDefault(); setSubmitted(new FormData(event.currentTarget).getAll('categories').map(String)) }}>
        <Tree nodes={nodes} selectionMode="multi" name="categories" defaultValue={[4]} searchable defaultExpanded aria-label="Form categories" />
        <div className="example-result"><output>Submitted: {JSON.stringify(submitted)}</output><button type="submit">Read form values</button></div>
      </form>
    </Example>
    <Example id="09" title="Disable the whole tree" description="Disable selection, search, and expansion. Disabled selections are excluded from native form submission." code={'<Tree nodes={nodes} selectionMode="multi"\n  defaultValue={[7]} defaultExpanded\n  searchable disabled aria-label="Disabled categories" />'}>
      <Tree nodes={nodes} selectionMode="multi" defaultValue={[7]} defaultExpanded searchable disabled aria-label="Disabled categories" />
    </Example>
    <Example id="10" title="Load from a URL" description="Load root nodes from a JSON endpoint. Expand Product to request its children from /sub_tree/1. Switch to an invalid response to see the error state." code={'<Tree route="/examples/tree.json" searchable\n  selectionMode="single" aria-label="Remote category" />\n\n// Root: GET /examples/tree.json\n// Children: GET /sub_tree/1'}>
      <Tree key={remoteKey} route={remoteRoute} searchable selectionMode="single" aria-label="Remote category" />
      <div className="example-result"><span>Static JSON demo</span><button type="button" onClick={() => { setRemoteRoute(remoteRoute === '/examples/tree.json' ? '/examples/invalid.json' : '/examples/tree.json'); setRemoteKey(key => key + 1) }}>{remoteRoute === '/examples/tree.json' ? 'Show load error' : 'Reload example'}</button></div>
    </Example>
    <Example id="11" title="Theme with CSS variables" description="Override the component’s colors through a wrapper. Styles are scoped to the tree." code={'.custom-tree .tree {\n  --tree-background: #172b2b;\n  --tree-foreground: #e3f3ed;\n  --tree-border: #3d5855;\n  --tree-accent: #79dcc5;\n  --tree-muted: #a6bdb8;\n}\n\n<div className="custom-tree">\n  <Tree nodes={nodes} searchable defaultExpanded />\n</div>'}>
      <div className="custom-tree"><Tree nodes={nodes} searchable defaultExpanded /></div>
    </Example>
  </div>
}
