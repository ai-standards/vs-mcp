import * as React from "react";

export function Checkbox(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="checkbox"
      {...props}
      style={{
        accentColor: "var(--vscode-checkbox-background, var(--vscode-editorWidget-background))",
        ...props.style,
      }}
    />
  );
}
