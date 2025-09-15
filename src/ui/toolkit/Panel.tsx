import * as React from "react";

export function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section
      style={{
        background: "var(--vscode-editorWidget-background)",
        color: "var(--vscode-editorWidget-foreground)",
        border: "1px solid var(--vscode-editorWidget-border)",
        borderRadius: "var(--radius-1)",
        boxShadow: "var(--shadow-1)",
        padding: "var(--space-2)",
      }}
    >
      <h2 style={{ margin: 0, marginBottom: "var(--space-2)", color: "var(--vscode-foreground)" }}>
        {title}
      </h2>
      {children}
    </section>
  );
}
