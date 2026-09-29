export type TreeNodeId = string | number

export type TreeNode = {
    entry_id: TreeNodeId
    parent_entry_id: TreeNodeId | null
    name: string
    children: TreeNode[]
    hasChildren: boolean
    collapsed: boolean
    isLoadingChildren?: boolean
    disabled?: boolean
}

export type TreeSelectionValue<TNoOptionValue = never> = TreeNodeId | TNoOptionValue | null

export type TreeSelectionProps<TNoOptionValue = never> =
    | {selectionMode?: undefined; value?: never; defaultValue?: never; onChange?: never}
    | {selectionMode: 'single'; value?: TreeSelectionValue<TNoOptionValue>; defaultValue?: TreeSelectionValue<TNoOptionValue>; onChange?: (value: TreeSelectionValue<TNoOptionValue>) => void}
    | {selectionMode: 'multi'; value?: readonly TreeSelectionValue<TNoOptionValue>[]; defaultValue?: readonly TreeSelectionValue<TNoOptionValue>[]; onChange?: (value: TreeSelectionValue<TNoOptionValue>[]) => void}

export type TreeSelection = {
    mode: 'single' | 'multi'
    selectedIds: readonly unknown[]
    name: string
    disabled: boolean
    onSelect: (entryId: TreeNodeId, checked: boolean) => void
}
