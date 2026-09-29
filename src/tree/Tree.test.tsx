import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import Tree from "./Tree";
import type { TreeNode } from "./Tree.types";

const nodes: TreeNode[] = [
  { entry_id: "parent", parent_entry_id: null, name: "Parent", hasChildren: true, collapsed: false, children: [
    { entry_id: 2, parent_entry_id: "parent", name: "Child", hasChildren: false, collapsed: false, children: [] },
  ] },
  { entry_id: "other", parent_entry_id: null, name: "Other", hasChildren: false, collapsed: false, children: [] },
];
afterEach(cleanup);

it("retains browse-only rendering without a selection mode", () => {
  render(<Tree nodes={nodes} />);
  expect(screen.queryByRole("radio")).not.toBeInTheDocument();
  expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  fireEvent.click(screen.getByText("Parent"));
  expect(screen.getByRole("button", { name: "Expand Parent" })).toHaveAttribute("aria-expanded", "false");
});

it("selects one node through its label without collapsing and submits a named radio value", () => {
  const onChange = vi.fn();
  const { container } = render(<form><Tree nodes={nodes} selectionMode="single" name="category" defaultValue="parent" onChange={onChange} /></form>);
  expect(screen.getByRole("radio", { name: "Parent" })).toBeChecked();
  fireEvent.click(screen.getByText("Child"));
  expect(screen.getByRole("radio", { name: "Child" })).toBeChecked();
  expect(screen.getByRole("radio", { name: "Parent" })).not.toBeChecked();
  expect(onChange).toHaveBeenLastCalledWith(2);
  expect(screen.getByRole("button", { name: "Collapse Parent" })).toHaveAttribute("aria-expanded", "true");
  expect(new FormData(container.querySelector("form")!).get("category")).toBe("2");
});

it("supports independent multi selections and retains selections in collapsed branches", () => {
  const onChange = vi.fn();
  const { container } = render(<form><Tree nodes={nodes} selectionMode="multi" name="categories" defaultValue={[2]} onChange={onChange} /></form>);
  fireEvent.click(screen.getByRole("checkbox", { name: "Parent" }));
  expect(onChange).toHaveBeenLastCalledWith([2, "parent"]);
  expect(screen.getByRole("checkbox", { name: "Child" })).toBeChecked();
  fireEvent.click(screen.getByRole("button", { name: "Collapse Parent" }));
  expect(new FormData(container.querySelector("form")!).getAll("categories")).toEqual(["parent", "2"]);
  fireEvent.click(screen.getByRole("checkbox", { name: "Parent" }));
  expect(onChange).toHaveBeenLastCalledWith([2]);
});

it("uses the supplied controlled value and supports clearing it", () => {
  const onChange = vi.fn();
  const { rerender } = render(<Tree nodes={nodes} selectionMode="single" value="parent" onChange={onChange} />);
  fireEvent.click(screen.getByRole("radio", { name: "Other" }));
  expect(onChange).toHaveBeenLastCalledWith("other");
  expect(screen.getByRole("radio", { name: "Parent" })).toBeChecked();
  rerender(<Tree nodes={nodes} selectionMode="single" value="other" onChange={onChange} />);
  expect(screen.getByRole("radio", { name: "Other" })).toBeChecked();
  rerender(<Tree nodes={nodes} selectionMode="single" value={null} onChange={onChange} />);
  expect(screen.getAllByRole("radio").every(input => !(input as HTMLInputElement).checked)).toBe(true);
});

it("keeps default radio names independent across Tree instances", () => {
  render(<><Tree nodes={nodes} selectionMode="single" aria-label="First" /><Tree nodes={nodes} selectionMode="single" aria-label="Second" /></>);
  const first = within(screen.getByRole("radiogroup", { name: "First" })).getByRole("radio", { name: "Parent" });
  const second = within(screen.getByRole("radiogroup", { name: "Second" })).getByRole("radio", { name: "Other" });
  fireEvent.click(first); fireEvent.click(second);
  expect(first).toBeChecked(); expect(second).toBeChecked();
  expect(first.getAttribute("name")).not.toBe(second.getAttribute("name"));
});

it("disables selection and expansion without submitting disabled values", () => {
  const onChange = vi.fn();
  const { container } = render(<form><Tree nodes={nodes} selectionMode="multi" name="categories" defaultValue={[2]} disabled onChange={onChange} /></form>);
  expect(screen.getByRole("checkbox", { name: "Child" })).toBeDisabled();
  expect(screen.getByRole("button", { name: "Collapse Parent" })).toBeDisabled();
  fireEvent.click(screen.getByText("Parent"));
  expect(onChange).not.toHaveBeenCalled();
  expect(new FormData(container.querySelector("form")!).getAll("categories")).toEqual([]);
});

it("defaults the first no-option radio to numeric zero and preserves it in changes and form submission", () => {
  const onChange = vi.fn();
  const { container } = render(<form><Tree nodes={nodes} selectionMode="single" name="category" noOption="No parent category" defaultValue="parent" onChange={onChange} /></form>);
  const noOption = screen.getByRole("radio", { name: "No parent category" });
  expect(screen.getAllByRole("radio")[0]).toBe(noOption);
  expect(noOption).toHaveAttribute("value", "0");
  fireEvent.click(noOption);
  expect(noOption).toBeChecked();
  expect(screen.getByRole("radio", { name: "Parent" })).not.toBeChecked();
  expect(onChange).toHaveBeenLastCalledWith(0);
  expect(new FormData(container.querySelector("form")!).get("category")).toBe("0");
});

it.each([false, { empty: true }, null])("supports arbitrary no-option values, including %j", noOptionValue => {
  const onChange = vi.fn();
  render(<Tree nodes={[]} selectionMode="single" noOption="None" noOptionValue={noOptionValue} onChange={onChange} />);
  fireEvent.click(screen.getByRole("radio", { name: "None" }));
  expect(onChange).toHaveBeenLastCalledWith(noOptionValue);
  expect(screen.getByRole("radio", { name: "None" })).toBeChecked();
});

it("starts all nested branches expanded while retaining subsequent user collapses", () => {
  const nested: TreeNode[] = [{
    entry_id: "root", parent_entry_id: null, name: "Root", hasChildren: true, collapsed: true, children: [{
      entry_id: "branch", parent_entry_id: "root", name: "Branch", hasChildren: true, collapsed: true, children: [{
        entry_id: "leaf", parent_entry_id: "branch", name: "Leaf", hasChildren: false, collapsed: false, children: [],
      }],
    }],
  }];
  const { rerender } = render(<Tree nodes={nested} defaultExpanded selectionMode="single" value={null} />);
  expect(screen.getByRole("button", { name: "Collapse Root" })).toHaveAttribute("aria-expanded", "true");
  expect(screen.getByRole("button", { name: "Collapse Branch" })).toHaveAttribute("aria-expanded", "true");
  expect(screen.getByRole("radio", { name: "Leaf", hidden: true }).closest("ul")).not.toHaveAttribute("hidden");
  fireEvent.click(screen.getByRole("button", { name: "Collapse Branch" }));
  fireEvent.click(screen.getByRole("button", { name: "Collapse Root" }));
  rerender(<Tree nodes={nested} defaultExpanded selectionMode="single" value="root" />);
  expect(screen.getByRole("button", { name: "Expand Root" })).toHaveAttribute("aria-expanded", "false");
  fireEvent.click(screen.getByRole("button", { name: "Expand Root" }));
  expect(screen.getByRole("button", { name: "Expand Branch" })).toHaveAttribute("aria-expanded", "false");
  expect(screen.getByRole("radio", { name: "Leaf", hidden: true }).closest("ul")).toHaveAttribute("hidden");
});

it.each([undefined, false])("hiding controls expands every branch even with defaultExpanded=%s", defaultExpanded => {
  const nested: TreeNode[] = [{ ...nodes[0], collapsed: true, children: [{ ...nodes[0], collapsed: true, entry_id: "nested", parent_entry_id: "parent", name: "Nested" }] }];
  const onChange = vi.fn();
  render(<Tree nodes={nested} defaultExpanded={defaultExpanded} hideExpandControls selectionMode="single" onChange={onChange} />);
  expect(screen.queryByRole("button", { name: /^(Expand|Collapse) / })).not.toBeInTheDocument();
  expect(screen.getByRole("radio", { name: "Nested", hidden: true }).closest("ul")).not.toHaveAttribute("hidden");
  fireEvent.click(screen.getByRole("radio", { name: "Child" }));
  expect(onChange).toHaveBeenLastCalledWith(2);
  expect(screen.getByRole("radio", { name: "Child" })).toBeChecked();
  expect(screen.getByRole("radio", { name: "Child", hidden: true }).closest("ul")).not.toHaveAttribute("hidden");
});


it("opens collapsed branches when controls are hidden after mounting", () => {
  const { rerender } = render(<Tree nodes={nodes} />);
  fireEvent.click(screen.getByRole("button", { name: "Collapse Parent" }));
  expect(screen.getByText("Child").closest("ul")).toHaveAttribute("hidden");
  rerender(<Tree nodes={nodes} hideExpandControls />);
  expect(screen.getByText("Child").closest("ul")).not.toHaveAttribute("hidden");
  fireEvent.click(screen.getByText("Parent"));
  expect(screen.getByText("Child").closest("ul")).not.toHaveAttribute("hidden");
});

it("offers search only when enabled and keeps all ancestors of case-insensitive matches", () => {
  const nested: TreeNode[] = [{
    ...nodes[0], collapsed: true, name: "Grandparent", children: [{
      ...nodes[0], entry_id: "branch", parent_entry_id: "parent", name: "Branch", collapsed: true, children: [
        { ...nodes[1], entry_id: "apple", name: "Red Apple" },
        { ...nodes[1], entry_id: "apple-2", name: "Green APPLE" },
        { ...nodes[1], entry_id: "banana", name: "Banana" },
      ],
    }],
  }, nodes[1]];
  const { rerender } = render(<Tree nodes={nested} />);
  expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
  rerender(<Tree nodes={nested} searchable />);
  fireEvent.change(screen.getByRole("searchbox", { name: "Search tree" }), { target: { value: " aPpLe " } });
  expect(screen.getByText("Grandparent")).toBeInTheDocument();
  expect(screen.getByText("Branch")).toBeInTheDocument();
  expect(screen.getByText("Red Apple")).toBeInTheDocument();
  expect(screen.getByText("Green APPLE")).toBeInTheDocument();
  expect(screen.getByText("Red Apple").closest("ul")).not.toHaveAttribute("hidden");
  expect(screen.queryByText("Banana")).not.toBeInTheDocument();
  expect(screen.queryByText("Other")).not.toBeInTheDocument();
  fireEvent.change(screen.getByRole("searchbox"), { target: { value: "" } });
  expect(screen.getByText("Banana")).toBeInTheDocument();
  expect(screen.getByText("Other")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Expand all" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Expand Grandparent" })).toHaveAttribute("aria-expanded", "false");
  expect(screen.getByText("Branch").closest("ul")).toHaveAttribute("hidden");
});

it("preserves multi selections filtered out by search, including native form submission", () => {
  const onChange = vi.fn();
  const { container } = render(<form><Tree nodes={nodes} searchable selectionMode="multi" name="categories" defaultValue={[2]} onChange={onChange} /></form>);
  fireEvent.change(screen.getByRole("searchbox"), { target: { value: "OTHER" } });
  expect(screen.queryByRole("checkbox", { name: "Child" })).not.toBeInTheDocument();
  expect(new FormData(container.querySelector("form")!).getAll("categories")).toEqual(["2"]);
  fireEvent.click(screen.getByRole("checkbox", { name: "Other" }));
  expect(onChange).toHaveBeenLastCalledWith([2, "other"]);
  expect(new FormData(container.querySelector("form")!).getAll("categories")).toEqual(["2", "other"]);
  fireEvent.change(screen.getByRole("searchbox"), { target: { value: "" } });
  expect(screen.getByRole("checkbox", { name: "Child" })).toBeChecked();
  expect(screen.getByRole("checkbox", { name: "Other" })).toBeChecked();
  expect(new FormData(container.querySelector("form")!).getAll("categories")).toEqual(["2", "other"]);
});

it("keeps the no-option choice visible when there are no search matches", () => {
  render(<Tree nodes={nodes} searchable selectionMode="single" noOption="None" defaultValue={0} />);
  fireEvent.change(screen.getByRole("searchbox"), { target: { value: "missing" } });
  expect(screen.getByRole("status")).toHaveTextContent("No matching nodes.");
  expect(screen.getByRole("radio", { name: "None" })).toBeChecked();
  expect(screen.getAllByRole("radio")).toHaveLength(1);
});

it("does not submit an empty controlled selection as a hidden search value", () => {
  const { container } = render(<form><Tree nodes={nodes} searchable selectionMode="single" name="category" value={null} /></form>);
  fireEvent.change(screen.getByRole("searchbox"), { target: { value: "other" } });
  expect(new FormData(container.querySelector("form")!).getAll("category")).toEqual([]);
});

it("disables an individual selection while keeping its descendants available", () => {
  const onChange = vi.fn();
  render(<Tree nodes={[{ ...nodes[0], disabled: true }]} defaultExpanded selectionMode="single" onChange={onChange} />);
  expect(screen.getByRole("radio", { name: "Parent" })).toBeDisabled();
  expect(screen.getByRole("radio", { name: "Child" })).toBeEnabled();
  fireEvent.click(screen.getByRole("radio", { name: "Parent" })); expect(onChange).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("radio", { name: "Child" })); expect(onChange).toHaveBeenCalledWith(2);
});

it("keeps both global buttons visible and preserves selections during expansion and search", () => {
 const onSubmit = vi.fn((event: { preventDefault: () => void }) => event.preventDefault()), onChange = vi.fn();
 const nested: TreeNode[] = [{ ...nodes[0], children: [{ ...nodes[0], entry_id: "branch", parent_entry_id: "parent", name: "Branch" }] }];
 render(<form onSubmit={onSubmit}><Tree nodes={nested} searchable defaultExpanded selectionMode="single" defaultValue={2} onChange={onChange} /></form>);
 const search = screen.getByRole("searchbox", { name: "Search tree" });
 const expand = screen.getByRole("button", { name: "Expand all" });
 const collapse = screen.getByRole("button", { name: "Collapse all" });
 expect(within(search.parentElement!).getAllByRole("button")).toHaveLength(2);
 expect(search.parentElement).toContainElement(expand); expect(search.parentElement).toContainElement(collapse);
 expect(screen.getByRole("button", { name: "Collapse Parent" })).toBeInTheDocument();
 expect(collapse.querySelector(".tree-chevron-collapse")).toBeInTheDocument();
 fireEvent.click(collapse);
 expect(expand).toBeVisible(); expect(collapse).toBeVisible();
 expect(expand.querySelector(".tree-chevron-expand")).toBeInTheDocument();
 expect(screen.getByRole("radio", { name: "Child", hidden: true }).closest("ul")).toHaveAttribute("hidden");
 fireEvent.click(expand); expect(screen.getByRole("radio", { name: "Child", hidden: true }).closest("ul")).not.toHaveAttribute("hidden"); expect(screen.getByRole("radio", { name: "Child" })).toBeChecked();
 fireEvent.change(search, { target: { value: "Child" } });
 fireEvent.click(collapse); expect(screen.getByRole("radio", { name: "Child", hidden: true }).closest("ul")).toHaveAttribute("hidden");
 fireEvent.click(expand); expect(screen.getByRole("radio", { name: "Child", hidden: true }).closest("ul")).not.toHaveAttribute("hidden"); expect(screen.getByRole("radio", { name: "Child" })).toBeChecked();
 expect(onChange).not.toHaveBeenCalled(); expect(onSubmit).not.toHaveBeenCalled();
});

it("disables both global expansion buttons while the tree is disabled", () => {
 render(<Tree nodes={nodes} searchable disabled />);
 expect(screen.getByRole("button", { name: "Expand all" })).toBeDisabled();
 expect(screen.getByRole("button", { name: "Collapse all" })).toBeDisabled();
 expect(screen.getByRole("button", { name: "Collapse Parent" })).toBeDisabled();
});

it("toggles individual branches while searching without changing the selected category", () => {
 const onChange = vi.fn();
 render(<Tree nodes={nodes} searchable defaultExpanded selectionMode="single" defaultValue={2} onChange={onChange} />);
 fireEvent.change(screen.getByRole("searchbox"), { target: { value: "Child" } });
 fireEvent.click(screen.getByRole("button", { name: "Collapse Parent" }));
 expect(screen.getByRole("radio", { name: "Child", hidden: true }).closest("ul")).toHaveAttribute("hidden");
 fireEvent.click(screen.getByRole("button", { name: "Expand Parent" }));
 expect(screen.getByRole("radio", { name: "Child", hidden: true }).closest("ul")).not.toHaveAttribute("hidden");
 expect(screen.getByRole("radio", { name: "Child" })).toBeChecked(); expect(onChange).not.toHaveBeenCalled();
});
