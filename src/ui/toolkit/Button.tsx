import * as React from "react";

export function Button(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>
) {
  return (
    <button
      {...props}
      className={`btn ${props.className ?? ""}`}
      style={{
        background: "var(--vscode-button-background)",
        color: "var(--vscode-button-foreground)",
        border: "none",
        padding: "4px 12px",
        borderRadius: 4,
        cursor: "pointer",
        ...props.style,
      }}
    />
  );
}

export function IconButton({
  icon,
  style,
  className,
  ...props
}: {
  icon: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`icon-btn${className ? ` ${className}` : ""}`}
      style={{
        background: "none",
        border: "none",
        padding: 4,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 18,
        minWidth: 32,
        minHeight: 32,
        cursor: "pointer",
        verticalAlign: "middle",
        color: "var(--vscode-icon-foreground)",
        transition: "color 0.15s ease",
        ...style,
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.color =
          "var(--vscode-editorLink-activeForeground)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.color = "var(--vscode-icon-foreground)")
      }
      onFocus={(e) =>
        (e.currentTarget.style.color =
          "var(--vscode-editorLink-activeForeground)")
      }
      onBlur={(e) =>
        (e.currentTarget.style.color = "var(--vscode-icon-foreground)")
      }
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
        }}
      >
        {icon}
      </span>
    </button>
  );
}
