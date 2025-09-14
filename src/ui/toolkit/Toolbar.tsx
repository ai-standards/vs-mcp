
import * as React from "react";

export function Toolbar({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <nav
      {...props}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--space-2)",
        background: "var(--vscode-editorWidget-background)",
        borderBottom: "1px solid var(--vscode-editorWidget-border)",
        padding: "var(--space-1) var(--space-2)",
        ...props.style,
      }}
    >
      {children}
    </nav>
  );
}

export function ToolbarButton({ icon, onClick, children, ...props }: {
  icon: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children?: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--space-1)",
        background: "none",
        border: "none",
        color: "var(--vscode-foreground)",
        padding: "var(--space-1) var(--space-2)",
        borderRadius: "var(--radius-1)",
        cursor: "pointer",
        font: "inherit",
        ...props.style,
      }}
    >
      {icon}
      {children}
    </button>
  );
}
