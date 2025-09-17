import * as React from "react";

export function Avatar({ src, alt, size = 32 }: { src: string; alt?: string; size?: number }) {
  return (
    <img
      src={src}
      alt={alt}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        objectFit: "cover",
        border: "1px solid var(--vscode-editorWidget-border)",
        background: "var(--vscode-editorWidget-background)",
      }}
    />
  );
}
