import * as React from "react";

export function Tooltip({ label, children }: { label: string; children: React.ReactNode }) {
  const [visible, setVisible] = React.useState(false);
  return (
    <span style={{ position: "relative", display: "inline-block" }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <span style={{
          position: "absolute",
          bottom: "100%",
          left: "50%",
          transform: "translateX(-50%)",
          background: "var(--vscode-editorWidget-background)",
          color: "var(--vscode-editorWidget-foreground)",
          border: "1px solid var(--vscode-editorWidget-border)",
          borderRadius: "var(--radius-1)",
          padding: "2px 8px",
          whiteSpace: "nowrap",
          zIndex: 100,
        }}>{label}</span>
      )}
    </span>
  );
}
