import * as React from "react";

export function Divider({ style }: { style?: React.CSSProperties }) {
  return (
    <hr style={{
      border: "none",
      borderTop: "1px solid var(--vscode-editorWidget-border)",
      margin: "var(--space-2) 0",
      ...style,
    }} />
  );
}
