import * as React from "react";

export interface TypographyProps {
  size?: "small" | "medium" | "large" | "xlarge";
  bold?: boolean;
  color?: "default" | "secondary" | "error" | "warning" | "info";
  style?: React.CSSProperties;
  children: React.ReactNode;
  as?: React.ElementType;
}

const sizeMap: Record<string, string> = {
  small: "var(--font-size-small, 12px)",
  medium: "var(--font-size-medium, 14px)",
  large: "var(--font-size-large, 18px)",
  xlarge: "var(--font-size-xlarge, 24px)",
};

const colorMap: Record<string, string> = {
  default: "var(--vscode-foreground)",
  secondary: "var(--vscode-descriptionForeground)",
  error: "var(--vscode-errorForeground)",
  warning: "var(--vscode-editorWarning-foreground, orange)",
  info: "var(--vscode-editorInfo-foreground, blue)",
};

export function Typography({
  size = "medium",
  bold = false,
  color = "default",
  style,
  children,
  as = "span",
}: TypographyProps) {
  const Tag: React.ElementType = as || "span";
  return React.createElement(
    Tag,
    {
      style: {
        fontSize: sizeMap[size],
        fontWeight: bold ? "bold" : "normal",
        color: colorMap[color],
        ...style,
      },
    },
    children
  );
}
