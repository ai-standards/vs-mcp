import * as React from "react";

export function ProgressBar({ value, max = 100 }: { value: number; max?: number }) {
  return (
    <div style={{
      width: "100%",
      background: "var(--vscode-editorWidget-background)",
      borderRadius: "var(--radius-1)",
      border: "1px solid var(--vscode-editorWidget-border)",
      height: 8,
      overflow: "hidden",
    }}>
      <div style={{
        width: `${(value / max) * 100}%`,
        background: "var(--vscode-progressBar-background, var(--vscode-statusBarItem-background))",
        height: "100%",
        transition: "width 0.2s",
      }} />
    </div>
  );
}
