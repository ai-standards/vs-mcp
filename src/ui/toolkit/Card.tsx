import * as React from "react";

export function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: "var(--vscode-editorWidget-background)",
      color: "var(--vscode-editorWidget-foreground)",
      border: "1px solid var(--vscode-editorWidget-border)",
      borderRadius: "var(--radius-1)",
      boxShadow: "var(--shadow-1)",
      padding: "var(--space-2)",
      ...style,
    }}>
      {children}
    </div>
  );
}
