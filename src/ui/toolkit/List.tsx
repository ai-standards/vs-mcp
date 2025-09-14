import * as React from "react";

export function List({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul
      {...props}
      style={{
        background: "var(--vscode-editorWidget-background)",
        color: "var(--vscode-editorWidget-foreground)",
        borderRadius: "var(--radius-1)",
        padding: "var(--space-2)",
        margin: 0,
        listStyle: "none",
        ...props.style,
      }}
    >
      {children}
    </ul>
  );
}

export function ListItem({ children, ...props }: React.LiHTMLAttributes<HTMLLIElement>) {
  return (
    <li
      {...props}
      style={{
        padding: "var(--space-1)",
        borderBottom: "1px solid var(--vscode-editorWidget-border)",
        ...props.style,
      }}
    >
      {children}
    </li>
  );
}
