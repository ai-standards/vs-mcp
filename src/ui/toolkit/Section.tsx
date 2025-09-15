import * as React from "react";

export function Section({ children, line = false, style, ...props }: {
  children: React.ReactNode;
  line?: boolean;
  style?: React.CSSProperties;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      style={{
        ...(line ? { borderBottom: "1px solid var(--vscode-editorWidget-border)" } : {}),
        ...style,
        marginLeft: "-16px",
        marginRight: "-16px",
      }}
    >
      {children}
    </div>
  );
}
