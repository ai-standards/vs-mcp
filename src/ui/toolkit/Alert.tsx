import * as React from "react";

export function Alert({ type = "info", children }: { type?: "info" | "warning" | "error"; children: React.ReactNode }) {
  const colors: Record<string, string> = {
    info: "var(--vscode-notificationsInfoIcon-foreground, var(--vscode-editorWidget-background))",
    warning: "var(--vscode-notificationsWarningIcon-foreground, var(--vscode-editorWidget-background))",
    error: "var(--vscode-notificationsErrorIcon-foreground, var(--vscode-editorWidget-background))",
  };
  return (
    <div style={{
      background: colors[type],
      color: "var(--vscode-editorWidget-foreground)",
      border: `1px solid var(--vscode-editorWidget-border)`,
      borderRadius: "var(--radius-1)",
      padding: "var(--space-2)",
      margin: "var(--space-2) 0",
    }}>
      {children}
    </div>
  );
}
