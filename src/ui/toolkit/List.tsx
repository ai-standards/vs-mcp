import * as React from "react";


export interface ListProps extends React.HTMLAttributes<HTMLUListElement> {
  border?: boolean;
}

export function List({ children, border = true, ...props }: ListProps) {
  return (
    <ul
      {...props}
      style={{
        background: "var(--vscode-editorWidget-background)",
        color: "var(--vscode-editorWidget-foreground)",
        borderRadius: "var(--radius-1)",
        padding: 0,
        margin: 0,
        listStyle: "none",
        ...(border ? { border: "1px solid var(--vscode-editorWidget-border)" } : {}),
        ...props.style,
      }}
    >
      {children}
    </ul>
  );
}


export interface ListItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  border?: boolean;
  toolbar?: React.ReactNode;
}

export function ListItem({ children, border = true, toolbar, ...props }: ListItemProps) {
  return (
    <li
      {...props}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        padding: "8px",
        ...(border ? { borderBottom: "1px solid var(--vscode-editorWidget-border)" } : {}),
        ...props.style,
      }}
    >
      <span style={{flex: 1}}>
        {children}
      </span>
      {toolbar && toolbar}
    </li>
  );
}
