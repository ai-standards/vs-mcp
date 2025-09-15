import * as React from "react";

export function Loading({ label = "Loading...", size = 24, style, align = "default" }: { label?: string; size?: number; style?: React.CSSProperties; align?: "default" | "center" }) {
  const containerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    ...(align === "center" ? { justifyContent: "center", width: "100%" } : {}),
    ...style,
  };
  return (
    <div style={containerStyle}>
      <span
        style={{
          width: size,
          height: size,
          display: "inline-block",
          border: `${size/8}px solid var(--vscode-editorWidget-border, #ccc)`,
          borderTop: `${size/8}px solid #0078d4`,
          borderRadius: "50%",
          animation: "spin 1s linear infinite"
        }}
      />
      <span>{label}</span>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
