import {type Dispatch, type SetStateAction, useEffect, useId, useMemo, useState} from 'react'
import './Tree.css'
import TreeList from './TreeList'
import type {TreeNode, TreeNodeId, TreeSelectionProps, TreeSelectionValue} from './Tree.types'

export type TreeProps<TNoOptionValue = never> = TreeSelectionProps<TNoOptionValue> & {
    route?: string
    nodes?: TreeNode[]
    defaultExpanded?: boolean
    hideExpandControls?: boolean
    searchable?: boolean
    noOption?: string
    noOptionValue?: TNoOptionValue
    name?: string
    disabled?: boolean
    "aria-label"?: string
}

function Tree<TNoOptionValue = never>(props: TreeProps<TNoOptionValue>) {
    const {route, nodes, selectionMode, name, disabled = false} = props
    const [initialExpanded] = useState(props.hideExpandControls || props.defaultExpanded || false)
    const [searchText, setSearchText] = useState("")
    const [searchExpanded, setSearchExpanded] = useState(true)
    const [searchBranches, setSearchBranches] = useState<Map<TreeNodeId, boolean>>(() => new Map())
    const generatedName = useId()
    const inputName = name ?? generatedName
    const noOptionValue = props.noOptionValue === undefined ? 0 : props.noOptionValue
    const [uncontrolledSelection, setUncontrolledSelection] = useState<TreeSelectionValue<TNoOptionValue>[]>(() =>
        props.selectionMode === 'single' ? (props.defaultValue === undefined ? [] : [props.defaultValue])
            : props.selectionMode === 'multi' ? [...(props.defaultValue ?? [])] : [],
    )
    const selectedIds: readonly TreeSelectionValue<TNoOptionValue>[] = props.value === undefined ? uncontrolledSelection
        : props.selectionMode === 'single' ? [props.value]
            : props.selectionMode === 'multi' ? props.value : []

    function selectNode(entryId: TreeSelectionValue<TNoOptionValue>, checked: boolean) {
        if (disabled || !selectionMode || findNodeById(items, entryId as TreeNodeId)?.disabled) return
        const next = selectionMode === 'single' ? [entryId]
            : checked ? [...selectedIds.filter(id => id !== entryId), entryId] : selectedIds.filter(id => id !== entryId)
        if (props.value === undefined) setUncontrolledSelection(next)
        if (props.selectionMode === 'single') props.onChange?.(entryId)
        else if (props.selectionMode === 'multi') props.onChange?.(next)
    }
    const [items, setItems] = useState<TreeNode[]>(() => normalizeNodes(nodes ?? [], initialExpanded))
    const [sourceNodes, setSourceNodes] = useState(nodes)
    if (sourceNodes !== nodes) {
        setSourceNodes(nodes)
        setItems(normalizeNodes(nodes ?? [], initialExpanded))
    }
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const subTreeRouteBase = route ? getSubTreeRouteBase(route) : undefined
    const searchQuery = props.searchable ? searchText.trim().toLowerCase() : ""
    const visibleItems = useMemo(() => searchQuery ? filterNodes(items, searchQuery, searchExpanded, searchBranches) : items, [items, searchQuery, searchExpanded, searchBranches])
    const visibleIds = useMemo(() => collectNodeIds(visibleItems), [visibleItems])
    const filteredSelections = searchQuery ? selectedIds.filter(id => id !== null && !visibleIds.has(id)
        && !(props.noOption !== undefined && id === noOptionValue)) : []


    function changeAllExpansion(expanded: boolean) {
        if (disabled || isLoading || error) return
        setItems(current => changeExpansion(current, expanded))
        setSearchExpanded(expanded)
        setSearchBranches(new Map())
    }

    useEffect(() => {
        if (!route) return
        const requestRoute = route
        const controller = new AbortController()

        async function loadTree() {
            setIsLoading(true)
            setError(null)

            try {
                const response = await fetch(requestRoute, {signal: controller.signal})
                if (!response.ok) throw new Error('Tree request failed.')
                const data = await response.json() as TreeNode[]
                if (!controller.signal.aborted) setItems(normalizeNodes(data, initialExpanded))
            } catch {
                if (controller.signal.aborted) {
                    return
                }

                setError('Could not load tree content.')
                setItems([])
            } finally {
                if (!controller.signal.aborted) setIsLoading(false)
            }
        }

        void loadTree()

        return () => {
            controller.abort()
        }
    }, [route, initialExpanded])

    return (
        <div role={selectionMode === "single" ? "radiogroup" : selectionMode === "multi" ? "group" : undefined} aria-label={props["aria-label"]} className="tree">
            {props.searchable && <div className="tree-toolbar">
                <input type="search" aria-label="Search tree" placeholder="Search…" value={searchText} disabled={disabled} onChange={event => { setSearchText(event.target.value); setSearchExpanded(true); setSearchBranches(new Map()) }} className="tree-search" />
                <button type="button" className="tree-global-toggle" aria-label="Expand all" title="Expand all" disabled={disabled || isLoading || !!error || !items.some(item => item.hasChildren)} onClick={() => changeAllExpansion(true)}>
                    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="tree-chevron-expand">
                        <path d="m7 8 5-5 5 5M7 16l5 5 5-5" />
                    </svg>
                </button>
                <button type="button" className="tree-global-toggle" aria-label="Collapse all" title="Collapse all" disabled={disabled || isLoading || !!error || !items.some(item => item.hasChildren)} onClick={() => changeAllExpansion(false)}>
                    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="tree-chevron-collapse">
                        <path d="m7 3 5 5 5-5M7 21l5-5 5 5" />
                    </svg>
                </button>
            </div>}
            {selectionMode && filteredSelections.map((id, index) => <input key={index} type="hidden" name={inputName} value={String(id)} disabled={disabled} />)}
            {props.noOption !== undefined && (selectionMode ? <label className="tree-choice tree-no-option">
                <input type={selectionMode === 'single' ? 'radio' : 'checkbox'} name={inputName} value={String(noOptionValue)} checked={selectedIds.includes(noOptionValue)} disabled={disabled} onChange={event => selectNode(noOptionValue, event.target.checked)} className="tree-selection" />
                <span>{props.noOption}</span>
            </label> : <div className="tree-no-option">{props.noOption}</div>)}
            {isLoading && <span className="tree-muted">Loading...</span>}
            {error && <div className="tree-error">{error}</div>}
            {!isLoading && !error && visibleItems.length > 0 && (
                <TreeList
                    items={visibleItems}
                    onToggle={async (entryId) => {
                        if (searchQuery) {
                            const node = findNodeById(visibleItems, entryId)
                            if (node) setSearchBranches(current => new Map(current).set(entryId, !node.collapsed))
                            return
                        }
                        await toggleNode({
                            entryId,
                            items,
                            setItems,
                            subTreeRouteBase,
                            defaultExpanded: initialExpanded,
                        })
                    }}
                    level={0}
                    disabled={disabled}
                    hideExpandControls={props.hideExpandControls}
                    forceExpanded={!!props.hideExpandControls && !props.searchable}
                    selection={selectionMode ? {mode: selectionMode, selectedIds, name: inputName, disabled, onSelect: selectNode} : undefined}
                />
            )}
            {!isLoading && !error && searchQuery && visibleItems.length === 0 && <p role="status" className="tree-muted">No matching nodes.</p>}
        </div>
    )
}

type ToggleNodeArgs = {
    entryId: TreeNodeId
    items: TreeNode[]
    setItems: Dispatch<SetStateAction<TreeNode[]>>
    subTreeRouteBase?: string
    defaultExpanded: boolean
}

async function toggleNode({entryId, items, setItems, subTreeRouteBase, defaultExpanded}: ToggleNodeArgs) {
    const node = findNodeById(items, entryId)
    if (!node || !node.hasChildren) {
        return
    }

    const isOpening = node.collapsed ?? true
    const hasLoadedChildren = (node.children?.length ?? 0) > 0

    setItems((previous) =>
        updateNodeById(previous, entryId, (target) => ({
            ...target,
            collapsed: !isOpening,
            isLoadingChildren: isOpening && !hasLoadedChildren && !!subTreeRouteBase,
        })),
    )

    if (!isOpening || hasLoadedChildren || !subTreeRouteBase) {
        return
    }

    try {
        const response = await fetch(`${subTreeRouteBase}/${entryId}`)
        if (!response.ok) throw new Error('Subtree request failed.')
        const loadedChildren = normalizeNodes(await response.json() as TreeNode[], defaultExpanded)

        setItems((previous) =>
            updateNodeById(previous, entryId, (target) => ({
                ...target,
                children: loadedChildren,
                collapsed: false,
                isLoadingChildren: false,
            })),
        )
    } catch {
        setItems((previous) =>
            updateNodeById(previous, entryId, (target) => ({
                ...target,
                isLoadingChildren: false,
            })),
        )
    }
}

function normalizeNodes(nodes: TreeNode[], defaultExpanded = false): TreeNode[] {
    return nodes.map((node) => {
        const children = normalizeNodes(node.children ?? [], defaultExpanded)
        const hasChildren = node.hasChildren ?? children.length > 0

        return {
            ...node,
            hasChildren,
            children,
            collapsed: hasChildren ? (defaultExpanded ? false : node.collapsed ?? true) : false,
            isLoadingChildren: false,
        }
    })
}

function filterNodes(nodes: TreeNode[], query: string, expanded = true, branches: ReadonlyMap<TreeNodeId, boolean> = new Map()): TreeNode[] {
    const matches: TreeNode[] = []
    for (const node of nodes) {
        const children = filterNodes(node.children, query, expanded, branches)
        if (node.name.toLowerCase().includes(query) || children.length > 0) {
            matches.push({...node, children, hasChildren: children.length > 0, collapsed: branches.get(node.entry_id) ?? !expanded})
        }
    }
    return matches
}

function changeExpansion(nodes: TreeNode[], expanded: boolean): TreeNode[] {
    return nodes.map(node => ({...node, collapsed: node.hasChildren && !expanded, children: changeExpansion(node.children, expanded)}))
}

function collectNodeIds(nodes: TreeNode[]): Set<unknown> {
    const ids = new Set<unknown>()
    function visit(items: TreeNode[]) {
        for (const item of items) {
            ids.add(item.entry_id)
            visit(item.children)
        }
    }
    visit(nodes)
    return ids
}

function findNodeById(nodes: TreeNode[], entryId: TreeNodeId): TreeNode | null {
    for (const node of nodes) {
        if (node.entry_id === entryId) {
            return node
        }

        if ((node.children?.length ?? 0) === 0) {
            continue
        }

        const found = findNodeById(node.children ?? [], entryId)
        if (found) {
            return found
        }
    }

    return null
}

function updateNodeById(
    nodes: TreeNode[],
    entryId: TreeNodeId,
    updater: (node: TreeNode) => TreeNode,
): TreeNode[] {
    return nodes.map((node) => {
        if (node.entry_id === entryId) {
            return updater(node)
        }

        if ((node.children?.length ?? 0) === 0) {
            return node
        }

        return {
            ...node,
            children: updateNodeById(node.children ?? [], entryId, updater),
        }
    })
}

function getSubTreeRouteBase(route: string): string {
    try {
        const parsed = new URL(route)
        return `${parsed.origin}/sub_tree`
    } catch {
        return '/sub_tree'
    }
}

export default Tree
