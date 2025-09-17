import * as React from "react";

export function Section({
  children,
  line = false,
  fullHeight = false,
  padding = false,
  style,
  ...props
}: {
  children: React.ReactNode;
  line?: boolean;
  fullHeight?: boolean;
  padding?: boolean;
  style?: React.CSSProperties;
} & React.HTMLAttributes<HTMLDivElement>) {
  const styles: React.CSSProperties = {
    ...style
  };

  if (line) styles.borderBottom = "1px solid var(--vscode-editorWidget-border)";
  if (fullHeight) {
    styles.flex = 1;
    styles.display = "flex";
    styles.flexDirection = "column";
    styles.minHeight = 0; // prevents overflow cutoff
  }
  if (padding) styles.padding = "16px";

  return (
    <div {...props} style={styles}>
      {children}
    </div>
  );
}