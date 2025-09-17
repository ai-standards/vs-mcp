import * as React from "react";

export interface TabProps {
  value: string;
  selected?: boolean;
  onSelect?: () => void;
  children: React.ReactNode;
}

export function Tabs({ value, onChange, children }: { value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", borderBottom: "1px solid var(--vscode-editorWidget-border)" }}>
      {React.Children.map(children, child => {
        if (React.isValidElement<TabProps>(child)) {
          const tabValue = child.props.value;
          return React.cloneElement(child, {
            selected: tabValue === value,
            onSelect: () => onChange(tabValue),
          });
        }
        return child;
      })}
    </div>
  );
}

export function Tab({ value, selected, onSelect, children }: TabProps) {
  return (
    <button
      onClick={onSelect}
      style={{
        background: selected ? "var(--vscode-editorWidget-background)" : "none",
        color: "var(--vscode-foreground)",
        border: "none",
        borderBottom: selected ? "2px solid var(--vscode-editorWidget-border)" : "2px solid transparent",
        padding: "var(--space-2) var(--space-3)",
        cursor: "pointer",
        fontWeight: selected ? "bold" : "normal",
      }}
    >
      {children}
    </button>
  );
}
