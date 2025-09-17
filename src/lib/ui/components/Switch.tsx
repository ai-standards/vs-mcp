import * as React from "react";

export function Switch({ checked, onChange, ...props }: { checked: boolean; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-1)" }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        {...props}
        style={{ accentColor: "var(--vscode-editorWidget-background)", width: 32, height: 18 }}
      />
      <span style={{ color: "var(--vscode-foreground)" }}>{checked ? "On" : "Off"}</span>
    </label>
  );
}
