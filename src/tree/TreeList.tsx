import type {TreeNode, TreeNodeId, TreeSelection} from './Tree.types'

type TreeListProps = {
    items: TreeNode[]
    onToggle: (entryId: TreeNodeId) => Promise<void> | void
    level: number
    collapsed?: boolean
    disabled?: boolean
    hideExpandControls?: boolean
    forceExpanded?: boolean
    selection?: TreeSelection
}

function TreeList({items, onToggle, level, collapsed = false, disabled = false, hideExpandControls = false, forceExpanded = hideExpandControls, selection}: TreeListProps) {
    return (
        <ul
            className={`tree-list${selection ? ' tree-list-selectable' : ''}`} hidden={collapsed}
        >
            {items.map((item, index) => {
                const hasChildren = Boolean(item.hasChildren)
                const isLast = index === items.length - 1

                return (
                    <li
                        key={item.entry_id}
                        className={`tree-node ${isLast ? 'tree-node-last' : ''} ${hasChildren && !selection && !disabled && !hideExpandControls ? 'tree-node-clickable' : ''}`}
                        onClick={(event) => {
                            event.stopPropagation()
                            if (!hasChildren || selection || disabled || hideExpandControls) {
                                return
                            }
                            void onToggle(item.entry_id)
                        }}

                    >
                        <div className={`tree-stem ${level === 0 && index === 0 ? 'tree-stem-first' : ''}`} />
                        <div className="tree-connector" />
                        {hasChildren && !hideExpandControls && (
                            <button type="button" disabled={disabled} onClick={event => { event.stopPropagation(); void onToggle(item.entry_id) }} aria-label={`${item.collapsed ? "Expand" : "Collapse"} ${item.name}`} aria-expanded={!item.collapsed} className="tree-branch-toggle">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="tree-branch-icon">
                                {item.collapsed ? (
                                    <>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14"/>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14"/>
                                    </>
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14"/>
                                )}
                                </svg>

                            </button>
                        )}

                        <div className="tree-node-content">
                            <div className="tree-row">
                                {selection ? <label className="tree-choice" onClick={event => event.stopPropagation()}>
                                    <input type={selection.mode === 'single' ? 'radio' : 'checkbox'} name={selection.name} value={String(item.entry_id)} checked={selection.selectedIds.includes(item.entry_id)} disabled={selection.disabled || item.disabled} onChange={event => selection.onSelect(item.entry_id, event.target.checked)} className="tree-selection" />
                                    <span>{item.name}</span>
                                </label> : item.name}

                                {item.isLoadingChildren && (
                                    <div className="tree-loader" role="status" aria-label={`Loading children of ${item.name}`}></div>
                                )}
                            </div>

                            {item.children.length > 0 && (
                                <TreeList
                                    items={item.children ?? []} onToggle={onToggle}
                                    level={level + 1} collapsed={forceExpanded ? false : item.collapsed} disabled={disabled} hideExpandControls={hideExpandControls} forceExpanded={forceExpanded} selection={selection}
                                />
                            )}
                        </div>
                    </li>
                )
            })}
        </ul>
    )
}

export default TreeList
