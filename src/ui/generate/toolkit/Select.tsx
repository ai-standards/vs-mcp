import * as React from "react";

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      style={{
        background: "var(--vscode-editorWidget-background)",
        color: "var(--vscode-editorWidget-foreground)",
        border: "1px solid var(--vscode-editorWidget-border)",
        borderRadius: "var(--radius-1)",
        padding: "var(--space-1)",
        ...props.style,
      }}
    >
      {props.children}
    </select>
  );
}
