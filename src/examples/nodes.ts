import type { TreeNode } from '../tree'

export const nodes: TreeNode[] = [
  { entry_id: 1, parent_entry_id: null, name: 'Design', hasChildren: true, collapsed: true, children: [
    { entry_id: 2, parent_entry_id: 1, name: 'Research', hasChildren: false, collapsed: false, children: [] },
    { entry_id: 3, parent_entry_id: 1, name: 'Design systems', hasChildren: true, collapsed: true, children: [
      { entry_id: 4, parent_entry_id: 3, name: 'Tokens', hasChildren: false, collapsed: false, children: [] },
      { entry_id: 5, parent_entry_id: 3, name: 'Components', hasChildren: false, collapsed: false, children: [] },
    ] },
  ] },
  { entry_id: 6, parent_entry_id: null, name: 'Engineering', hasChildren: true, collapsed: false, children: [
    { entry_id: 7, parent_entry_id: 6, name: 'Frontend', hasChildren: false, collapsed: false, children: [] },
    { entry_id: 8, parent_entry_id: 6, name: 'Backend', hasChildren: false, collapsed: false, children: [] },
  ] },
  { entry_id: 9, parent_entry_id: null, name: 'Archive (unavailable)', hasChildren: false, collapsed: false, disabled: true, children: [] },
]
